import { Router } from "express";
const router = Router()
import messagesController from "../controllers/messagesController";

router.post('/', messagesController.sendMessage)
router.get('/', messagesController.getMessages)

export default router;