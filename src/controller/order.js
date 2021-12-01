const { order } = require('../../models')

exports.addOrder = async (req, res) => {
    try {
        const data = req.body
        const add = await order.create(data)
        
        res.status(200).send({
            status: 'success add',
            data: {
                order: {
                    add
                }
            }
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.getOrders = async (req, res) => {
    try {
        const buyerId = req.user.id
        const data = await order.findAll({
            where: { buyerId: buyerId },
            attributes: {
                include: ['id']
            }
        })
        res.status(200).send({
            status: 'success',
            data: {
                order : data
            }
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}
exports.getOrdersAdmin = async (req, res) => {
    try {
        const data = await order.findAll({
            attributes: {
                include: ['id']
            }
        })
        res.status(200).send({
            status: 'success',
            data: {
                order : data
            }
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}
exports.getOrder = async (req, res) => {
    try {
        const { id } = req.params
        const buyerId = req.user.id
        const data = await order.findOne({
            where: { id, buyerId:buyerId },
            attributes: {
                include: ['id']
            }
        })
        if (!data) {
            return res.status(400).send({
                status: 'failed',
                message: 'order details not found'
            })
        }
        res.status(200).send({
            status: 'success',
            data
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.getOrderProduct = async (req, res) => {
    try {
        const { id } = req.params
        const data = await order.findOne({
            where: {
                productId: id,
            }
        })
        res.status(200).send({
            status: 'success',
            data
        })
        
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params
        const buyerId = req.user.id
        const data = await order.findOne({
            where: { id, buyerId:buyerId }
        })
        if (!data) {
            return res.status(400).send({
                status: 'failed',
                message: 'order details not found'
            })
        }
        const newData  = req.body
        await order.update(newData,{where : {id}})
        res.status(200).send({
            status: 'success',
            data
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.deletedOrder = async (req, res) => {
    try {
        const { id } = req.params
        const buyerId = req.user.id
        const orderData = await order.findOne({
            where: {
                id,
                buyerId: buyerId
            }
        })
        if (!orderData) {
            return res.status(400).send({
                status: 'fail',
                message: 'order not found',
                data: { 
                    order: "order details not found"
                }
            })
        }
        await order.destroy({
            where: {id}
        })
        res.send({
            status: 'success',
            message: 'order successfully destroy' 
        })
        
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}