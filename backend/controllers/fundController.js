import mongoose from "mongoose";
import User from "../models/User.js";
import Fund from "../models/Fund.js";
import FundNav from "../models/FundNav.js";
import UserHolding from "../models/UserHolding.js";
import PortfolioSnapshot from "../models/PortfolioSnapshot.js";

const toNum = (v) => (v != null && typeof v === "object" && v.toString ? parseFloat(v.toString()) : parseFloat(v));

export const getPortfolioSummary = async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email, isMutual: true });
        if (!user) {
            return res.status(404).json({ message: "User not found or not a mutual fund user" });
        }

        const holdings = await UserHolding.find({ user: user._id }).populate("fund");
        if (holdings.length === 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return res.status(200).json({
                totalValue: 0,
                investedAmount: 0,
                absoluteGain: 0,
                absoluteGainPercent: 0,
                previousDayValue: 0,
                changeVsYesterdayPercent: 0,
                holdings: [],
                funds: [],
            });
        }

        const fundIds = holdings.map((h) => h.fund._id);
        const latestNavs = await FundNav.aggregate([
            { $match: { fund: { $in: fundIds } } },
            { $sort: { date: -1 } },
            {
                $group: {
                    _id: "$fund",
                    nav: { $first: "$nav" },
                    date: { $first: "$date" },
                },
            },
        ]);
        const navByFund = {};
        latestNavs.forEach((r) => {
            navByFund[r._id.toString()] = toNum(r.nav);
        });

        let totalValue = 0;
        const holdingsWithNav = holdings.map((h) => {
            const nav = navByFund[h.fund._id.toString()] ?? 0;
            const value = h.units * nav;
            totalValue += value;
            return {
                fund: { _id: h.fund._id, code: h.fund.code, name: h.fund.name, category: h.fund.category },
                units: h.units,
                nav,
                currentValue: value,
                investedAmount: toNum(h.investedAmount),
            };
        });

        const investedAmount = holdingsWithNav.reduce((s, h) => s + h.investedAmount, 0);
        const absoluteGain = totalValue - investedAmount;
        const absoluteGainPercent = investedAmount > 0 ? (absoluteGain / investedAmount) * 100 : 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const snapshotToday = await PortfolioSnapshot.findOne({ user: user._id, date: today });
        const snapshotYesterday = await PortfolioSnapshot.findOne({ user: user._id, date: yesterday });

        const previousDayValue = snapshotYesterday ? toNum(snapshotYesterday.totalValue) : totalValue;
        const changeVsYesterdayPercent =
            previousDayValue > 0 ? ((totalValue - previousDayValue) / previousDayValue) * 100 : 0;

        const funds = await Fund.find().lean();

        res.status(200).json({
            totalValue,
            investedAmount,
            absoluteGain,
            absoluteGainPercent,
            previousDayValue,
            changeVsYesterdayPercent,
            holdings: holdingsWithNav,
            funds,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching portfolio summary", error: err.message });
    }
};

export const getHoldings = async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email, isMutual: true });
        if (!user) {
            return res.status(404).json({ message: "User not found or not a mutual fund user" });
        }

        const holdings = await UserHolding.find({ user: user._id }).populate("fund");
        const fundIds = holdings.map((h) => h.fund._id);

        const latestNavs = await FundNav.aggregate([
            { $match: { fund: { $in: fundIds } } },
            { $sort: { date: -1 } },
            { $group: { _id: "$fund", nav: { $first: "$nav" } } },
        ]);
        const navByFund = {};
        latestNavs.forEach((r) => {
            navByFund[r._id.toString()] = toNum(r.nav);
        });

        const result = holdings.map((h) => {
            const nav = navByFund[h.fund._id.toString()] ?? 0;
            return {
                fund: { _id: h.fund._id, code: h.fund.code, name: h.fund.name, category: h.fund.category },
                units: h.units,
                nav,
                investedAmount: toNum(h.investedAmount),
                currentValue: h.units * nav,
            };
        });

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "Error fetching holdings", error: err.message });
    }
};
