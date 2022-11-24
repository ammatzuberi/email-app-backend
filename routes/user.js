import express from "express";
const router = express.Router();
import * as users from "../controller/user.js";

router.post("/login", users.login);
router.post("/register", users.register);

export default router;
