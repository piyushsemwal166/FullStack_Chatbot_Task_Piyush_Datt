import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAdmin } from '../middleware/auth'
import { getStats } from '../controllers/statsController'

const router = Router()
router.get('/', requireAdmin, asyncHandler(getStats))
export default router
