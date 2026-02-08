import express from "express";
import {
    getFunds,
    getFundsWithNav,
    createFund,
    uploadNavs,
    getMutualUsers,
    getMutualUsersWithHoldings,
    getUserHoldings,
    setUserHolding,
    getFundNavs,
} from "../controllers/adminFundController.js";

const router = express.Router();

router.get("/funds", getFunds);
router.get("/funds/with-nav", getFundsWithNav);
router.post("/funds", createFund);
router.post("/funds/navs", uploadNavs);
router.get("/funds/mutual-users", getMutualUsers);
router.get("/funds/mutual-users-holdings", getMutualUsersWithHoldings);
router.get("/funds/holdings/:email", getUserHoldings);
router.put("/funds/holdings/:email", setUserHolding);
router.get("/funds/navs/:fundCode", getFundNavs);

export default router;
