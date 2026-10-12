import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAdmin } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createEnquirySchema, enquiryQuerySchema, updateEnquirySchema } from '../validations/enquiry'
import { createEnquiry, deleteEnquiry, getEnquiry, listEnquiries, updateEnquiry } from '../controllers/enquiryController'

const router = Router()
router.get('/', requireAdmin, validate(enquiryQuerySchema, 'query'), asyncHandler(listEnquiries))
router.get('/:id', requireAdmin, asyncHandler(getEnquiry))
router.post('/', validate(createEnquirySchema), asyncHandler(createEnquiry))
router.patch('/:id', requireAdmin, validate(updateEnquirySchema), asyncHandler(updateEnquiry))
router.delete('/:id', requireAdmin, asyncHandler(deleteEnquiry))
export default router
