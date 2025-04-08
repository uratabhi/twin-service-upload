import express from 'express'
import { twinVideoResponse, uploadData } from '../controllers/twinSdk.controller.js'
const router = express.Router()

router.post('/upload', uploadData)
router.post('/twin-video', twinVideoResponse)

export default router
