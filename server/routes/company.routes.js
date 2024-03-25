const {Router} = require('express')
const {Register, Login, getCompanies, deleteCompany} = require('../controllers/company.controller')
const router = Router()

router.get('/',getCompanies)

router.post('/register', Register)
router.post('/login',Login)

router.delete('/:companyId',deleteCompany)


module.exports = router

