import express from "express";
import { getPortfolioSummary, getHoldings } from "../controllers/fundController.js";

const router = express.Router();

router.get("/portfolio-summary", getPortfolioSummary);
router.get("/holdings", getHoldings);

export default router;
