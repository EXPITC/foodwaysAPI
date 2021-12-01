const { transactions ,users , products , order} = require('../../models')

exports.addTransaction = async (req, res) => {
    try {
        // const thenTransaction = await transactions.findOne({
        //     where: {
        //         buyerId: req.user.id,
        //         $or: [{ status: 'Waiting Approve'  },{ status: 'On The Way' }]
        //    } 
        // })
        // if (thenTransaction) {
        //     return res.status(409).send({
        //         status: 'fail',
        //         message: `you still have transaction with status ${thenTransaction.status}`,
        //         thenTransaction
        //     })
        // }
        let data = req.body
        let response = await transactions.create({
            sellerId: data.sellerId,
            buyerId: req.user.id,
            status: 'Waiting Approve'
        })
        
        data = JSON.parse(JSON.stringify(data))

        let dataOrder = data.product
        dataOrder = dataOrder.map(x => {
            return {
                ...x,
                transactionId: response.id,
                status: 'pending',
                buyerId: req.user.id,
            }
        })
        await order.bulkCreate(dataOrder)


        response = await transactions.findOne({where: {
            id: response.id,
        },
        include: [
            {
                model: users,
                as: "buyer",
                attributes: {
                    exclude: ['password','createdAt','updatedAt']
                }
            },
            {
                model: products,
                as: 'product',
                through: {
                    model: order
                },
                attributes: {
                    exclude: ['createdAt','updatedAt']
                }
            },
            {
                model: users,
                as: "seller",
                attributes: {
                    exclude: ['password','createdAt','updatedAt']
                }
            }
        ],
        attributes: {
            exclude: ['sellerId', 'buyerId', 'productId', 'price','createdAt', 'updatedAt']
        }
    })
        res.status(200).send({
            status: 'success add',
            data: {
                transactions: {
                    response,
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

exports.getTransactions = async (req, res) => {
    try {
        const id = req.user.id
        const data = await transactions.findAll({
            where: {
                buyerId: id
            },
            include: [
                {
                    model: users,
                    as: "buyer",
                    attributes: {
                        exclude: ['password','createdAt','updatedAt']
                    }
                },
                {
                    model: products,
                    as: 'product',
                    through: {
                        model: order
                    },
                    attributes: {
                        exclude: ['createdAt','updatedAt']
                    }
                },
                {
                    model: users,
                    as: "seller",
                    attributes: {
                        exclude: ['password','createdAt','updatedAt']
                    }
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })
        res.status(200).send({
            message: 'Success',
            data: {
                transactions : data
            }
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.getTransactionsAdmin = async (req, res) => {
    try {
        const data = await transactions.findAll({
            include: [
                {
                    model: users,
                    as: "buyer",
                    attributes: {
                        exclude: ['password','createdAt','updatedAt']
                    }
                },
                {
                    model: products,
                    as: 'product',
                    through: {
                        model: order
                    },
                    attributes: {
                        exclude: ['createdAt','updatedAt']
                    }
                },
                {
                    model: users,
                    as: "seller",
                    attributes: {
                        exclude: ['password','createdAt','updatedAt']
                    }
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })
        res.status(200).send({
            message: 'Success',
            data: {
                transactions: data,
                total
            }
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.getTransaction = async (req, res) => {
    try {
        const { id } = req.params
        const buyerId = req.user.id
        const data = await transactions.findOne({
            where: {
                id: id,
                buyerId: buyerId
            },
            include: [
                {
                    model: users,
                    as: "buyer",
                    attributes: {
                        exclude: ['password','createdAt','updatedAt']
                    }
                },
                {
                    model: products,
                    as: 'product',
                    through: {
                        model: order
                    },
                    attributes: {
                        exclude: ['createdAt','updatedAt']
                    }
                },
                {
                    model: users,
                    as: "seller",
                    attributes: {
                        exclude: ['password','createdAt','updatedAt']
                    }
                }
            ],
            attributes: {
                exclude: ['sellerId', 'buyerId', 'productId', 'price','createdAt', 'updatedAt']
            }
        })
        const total = await order.count({
            where: {
                transactionId: id
            }
        })
        res.status(200).send({
            message: 'Success',
            data: {
                transactions: data,
                total
            }
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.editTransaction = async (req, res) => {
    try {
        const { id } = req.params
        const buyerId = req.user.id
        const transactionData = await transactions.findOne({
            where: {
                id,
                buyerId: buyerId
            },
        })
        if (!transactionData) {
            return res.status(400).send({
                status: 'fail',
                message: 'transaction not found',
                data: { 
                    transaction: "transaction details not found"
                }
            })
        }
        const data = req.body
        await transactions.update(data, {
            where: {id}
        })
        res.send({
            status: 'successfully',
            message: 'transaction successfully edit',
            data
        })
        
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params
        const buyerId = req.user.id
        const transactionData = await transactions.findOne({
            where: {
                id,
                buyerId: buyerId
            },
        })
        if (!transactionData) {
            return res.status(400).send({
                status: 'fail',
                message: 'transaction not found',
                data: { 
                    transaction: "transaction details not found"
                }
            })
        }
        await transactions.destroy({
            where: {id}
        })
        res.send({
            status: 'success',
            message: 'transaction successfully destroy' 
        })
        
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}