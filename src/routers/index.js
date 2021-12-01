const express = require('express');
const router = express.Router()
const {uploadImg} = require('../middleware/uploadImg')
const {userCheck ,admin ,owner} = require('../middleware/userCheck')
//auth
const {
    register,
    login
} = require('../controller/auth')

router.post('/register' , register)
router.get('/login' , login)
// user
const {
    addUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserResto,
    getUserRestos
} = require('../controller/user')

router.post('/add/user', uploadImg('image'), addUser)
router.get('/users', getUsers)
router.get('/user/:id', getUser)
router.get('/user/resto/:id', getUserResto)
router.get('/users/resto', getUserRestos)
router.patch('/user/:id', updateUser)
router.delete('/user/:id', deleteUser)

//product
// TODO: delete product, edit product ,get product
const {
    addProduct,
    getProducts,
    getProductsAdmin,
    getProduct,
    editProduct,
    deleteProduct
} = require('../controller/product')

router.post('/add/product/',userCheck, owner, uploadImg('image'), addProduct)
router.get('/products', userCheck, owner,getProducts)
router.get('/products/admin', userCheck, admin,getProductsAdmin)
router.get('/product/:id',  userCheck, owner,getProduct)
router.patch('/product/:id', userCheck, owner,editProduct)
router.delete('/product/:id', userCheck, owner,deleteProduct)

// resto
// TODO: add resto , get resto{ +owner } , edit resto , delete resto
const {
    addResto,
    getRestos,
    getResto,
    editResto,
    deleteResto
} = require('../controller/resto')

router.post('/add/resto', userCheck, owner,addResto)
router.get('/restos/admin',userCheck, admin, getRestos) 
router.get('/resto/', userCheck, owner, getResto)
router.patch('/resto/', userCheck, owner,editResto)
router.delete('/resto/',userCheck, owner, deleteResto)

// transaction
// TODO: add transaction , get transactions, get transactions of id , get transaction , delete transaction.
const {
    addTransaction,
    getTransactions,
    getTransactionsAdmin,
    getTransaction,
    editTransaction,
    deleteTransaction
} =  require('../controller/transactions')

router.post('/add/transaction',userCheck, addTransaction)
router.get('/transactions', userCheck ,getTransactions)
router.get('/transactions/admin', userCheck ,admin,getTransactionsAdmin)
router.get('/transaction/:id', userCheck, getTransaction)
router.patch('/transaction/:id',userCheck, editTransaction)
router.delete('/transaction/:id', userCheck ,deleteTransaction)

//order
const {
    addOrder,
    getOrders,
    getOrdersAdmin,
    getOrder,
    getOrderProduct,
    updateOrder,
    deletedOrder
} = require('../controller/order')

router.post('/add/order' , addOrder)
router.get('/orders', userCheck ,getOrders)
router.get('/orders/admin', userCheck,admin ,getOrdersAdmin)
router.get('/order/:id',userCheck, getOrder)
router.get('/order/product/:id', getOrderProduct)
router.patch('/order/:id', userCheck,updateOrder)
router.delete('/order/:id', userCheck,deletedOrder)

module.exports = router;




// TODO:don't forget to del add on router