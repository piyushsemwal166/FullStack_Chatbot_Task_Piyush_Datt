import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler'
import { chat } from '../controllers/chatController'

const router = Router()
router.post('/', asyncHandler(chat))
export default router
