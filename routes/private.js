import express from "express";
import getPrivateData from "../controllers/privateController.js";
import {protect} from '../middleware/authProtect.js'

const router = express.Router();

router.route('/').get(protect, getPrivateData);

export default router; 