import { Router } from "express";
const router = Router()
import userController from "../controllers/userController";

router.post('/registration', userController.registration)

export default router;