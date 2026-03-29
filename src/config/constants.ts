export const SITE_NAME = 'CourseHub'
export const SITE_DESCRIPTION = 'เรียนรู้การสร้าง Google Apps Script และเว็บไซต์ ง่ายๆ ด้วยตัวเอง'
export const MAX_IPS_PER_USER = 3
export const VIDEO_SIGNED_URL_EXPIRY = 3600 // 1 hour in seconds
export const PROMPTPAY_ID = import.meta.env.VITE_PROMPTPAY_ID as string || ''
export const PROMPTPAY_NAME = import.meta.env.VITE_PROMPTPAY_NAME as string || ''

export const COURSE_CATEGORIES = [
  { value: 'google-apps-script', label: 'Google Apps Script' },
  { value: 'web-dev', label: 'Web Development' },
  { value: 'automation', label: 'Automation' },
] as const

export const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'เริ่มต้น', color: 'text-green-600 bg-green-50' },
  { value: 'intermediate', label: 'ปานกลาง', color: 'text-yellow-600 bg-yellow-50' },
  { value: 'advanced', label: 'ขั้นสูง', color: 'text-red-600 bg-red-50' },
] as const
