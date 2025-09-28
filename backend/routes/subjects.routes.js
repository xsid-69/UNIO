import express from "express";
import { getSubjects } from "../controller/subjects.controller.js";

const router = express.Router();


router.get("/byUser", getSubjects);

export default router;
