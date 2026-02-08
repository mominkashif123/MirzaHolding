import mongoose from "mongoose";
import User from "../models/User.js";
import Fund from "../models/Fund.js";
import FundNav from "../models/FundNav.js";
import UserHolding from "../models/UserHolding.js";
import PortfolioSnapshot from "../models/PortfolioSnapshot.js";

const toNum = (v) => (v != null && typeof v === "object" && v.toString ? parseFloat(v.toString()) : parseFloat(v));

export const getFunds = async (req, res) => {
    try {
        const funds = await Fund.find().lean();
        res.status(200).json(funds);
    } catch (err) {
        res.status(500).json({ message: "Error fetching funds", error: err.message });
    }
};

export const getFundsWithNav = async (req, res) => {
    try {
        const funds = await Fund.find().lean();
        const fundIds = funds.map((f) => f._id);
        const latestNavs = await FundNav.aggregate([
            { $match: { fund: { $in: fundIds } } },
            { $sort: { date: -1 } },
            { $group: { _id: "$fund", nav: { $first: "$nav" }, date: { $first: "$date" } } },
        ]);
        const navByFund = {};
        latestNavs.forEach((r) => {
            navByFund[r._id.toString()] = { nav: toNum(r.nav), date: r.date };
        });
        const withNav = funds.map((f) => ({
            ...f,
            latestNav: navByFund[f._id.toString()]?.nav ?? null,
            latestNavDate: navByFund[f._id.toString()]?.date ?? null,
        }));
        res.status(200).json(withNav);
    } catch (err) {
        res.status(500).json({ message: "Error fetching funds", error: err.message });
    }
};

export const createFund = async (req, res) => {
    try {
        const { code, name, category } = req.body;
        if (!code || !name) {
            return res.status(400).json({ message: "code and name are required" });
        }
        const fund = await Fund.create({ code, name: name || code, category: category || "Equity" });
        res.status(201).json(fund);
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: "Fund code already exists" });
        res.status(500).json({ message: "Error creating fund", error: err.message });
    }
};

export const uploadNavs = async (req, res) => {
    try {
        const { date, navs } = req.body;
        if (!date || !Array.isArray(navs) || navs.length === 0) {
            return res.status(400).json({ message: "date and navs array are required" });
        }

        const d = new Date(date);
        d.setHours(0, 0, 0, 0);

        for (const { fundCode, nav } of navs) {
            if (fundCode == null || nav == null) continue;
            const fund = await Fund.findOne({ code: fundCode });
            if (!fund) continue;
            await FundNav.findOneAndUpdate(
                { fund: fund._id, date: d },
                { nav },
                { upsert: true, new: true }
            );
        }

        const allFunds = await Fund.find().lean();
        const fundIds = allFunds.map((f) => f._id);
        const navsForDate = await FundNav.find({ date: d, fund: { $in: fundIds } }).lean();
        const navByFundId = {};
        navsForDate.forEach((n) => {
            navByFundId[n.fund.toString()] = toNum(n.nav);
        });

        const usersWithHoldings = await UserHolding.find().populate("user").distinct("user");
        for (const userId of usersWithHoldings) {
            const holdings = await UserHolding.find({ user: userId });
            let totalValue = 0;
            for (const h of holdings) {
                const nav = navByFundId[h.fund.toString()];
                if (nav != null) totalValue += h.units * nav;
            }
            await PortfolioSnapshot.findOneAndUpdate(
                { user: userId, date: d },
                { totalValue },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({ message: "NAVs uploaded and portfolio snapshots updated", date: d });
    } catch (err) {
        res.status(500).json({ message: "Error uploading NAVs", error: err.message });
    }
};

export const getMutualUsers = async (req, res) => {
    try {
        const users = await User.find({ isMutual: true }).select("email").lean();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching mutual users", error: err.message });
    }
};

export const getMutualUsersWithHoldings = async (req, res) => {
    try {
        const users = await User.find({ isMutual: true }).select("email").lean();
        const result = await Promise.all(
            users.map(async (u) => {
                const holdings = await UserHolding.find({ user: u._id }).populate("fund").lean();
                return {
                    email: u.email,
                    holdings: holdings.map((h) => ({
                        fundCode: h.fund?.code,
                        fundName: h.fund?.name,
                        units: h.units,
                        investedAmount: toNum(h.investedAmount),
                    })),
                };
            })
        );
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users with holdings", error: err.message });
    }
};

export const getUserHoldings = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email, isMutual: true });
        if (!user) {
            return res.status(404).json({ message: "User not found or not a mutual fund user" });
        }
        const holdings = await UserHolding.find({ user: user._id }).populate("fund").lean();
        const out = holdings.map((h) => ({
            fund: h.fund,
            units: h.units,
            investedAmount: toNum(h.investedAmount),
        }));
        res.status(200).json(out);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user holdings", error: err.message });
    }
};

export const setUserHolding = async (req, res) => {
    try {
        const { email } = req.params;
        const { fundCode, units, investedAmount } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const fund = await Fund.findOne({ code: fundCode });
        if (!fund) {
            return res.status(404).json({ message: "Fund not found" });
        }

        const u = Number(units) || 0;
        const inv = Number(investedAmount) || 0;

        const holding = await UserHolding.findOneAndUpdate(
            { user: user._id, fund: fund._id },
            { units: u, investedAmount: inv },
            { upsert: true, new: true }
        ).populate("fund");

        res.status(200).json(holding);
    } catch (err) {
        res.status(500).json({ message: "Error setting user holding", error: err.message });
    }
};

export const getFundNavs = async (req, res) => {
    try {
        const { fundCode } = req.params;
        const { from, to } = req.query;
        const fund = await Fund.findOne({ code: fundCode });
        if (!fund) {
            return res.status(404).json({ message: "Fund not found" });
        }
        const filter = { fund: fund._id };
        if (from && to) filter.date = { $gte: new Date(from), $lte: new Date(to) };
        else if (from) filter.date = { $gte: new Date(from) };
        else if (to) filter.date = { $lte: new Date(to) };
        const navs = await FundNav.find(filter).sort({ date: 1 }).lean();
        const out = navs.map((n) => ({ date: n.date, nav: toNum(n.nav) }));
        res.status(200).json(out);
    } catch (err) {
        res.status(500).json({ message: "Error fetching fund NAVs", error: err.message });
    }
};
