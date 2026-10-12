import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler'
import { validate } from '../middleware/validate'
import { loginSchema } from '../validations/auth'
import { login } from '../controllers/authController'

const router = Router()
router.post('/login', validate(loginSchema), asyncHandler(login))
export default router
