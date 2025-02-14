import { Router } from "express";
const router = Router()
import userRouter from './userRouter';
import messagesRouter from './messagesRouter';

router.use('/user', userRouter)
router.use('/message', messagesRouter)

export default router;