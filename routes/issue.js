import express from "express";
const router = express.Router();
import * as issue from "../controller/issue.js";

router.get("/getUserIssues", issue.getUserIssues);
router.post("/addIssue", issue.addIssue);
router.post("/updateIssueStatus", issue.updateIssueStatus);
router.post("/deleteIssue", issue.deleteIssue);

export default router;
