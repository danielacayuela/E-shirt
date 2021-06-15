const {Router} = require('express')
const {
    postOrder, 
    getOrder, 
    getOrders, 
    putOrder, 
    modifyStatus, 
    getOrdersByUserId, 
    getOrdersByStatus,
    checkStock}= require('../controllers/order')
const checkJwt = require('../middlewares/authz/checkJwt');
const router = Router()

router.get('/', getOrders)
router.get('/:id', getOrder)
router.post('/:userId', postOrder)
router.put('/:id', putOrder)
router.put('/status/:id', modifyStatus)
router.get('/user/:userId', getOrdersByUserId)
router.get('/user/status/:userId', getOrdersByStatus)
router.get('/_checkStock/:orderId', checkStock)

module.exports = router