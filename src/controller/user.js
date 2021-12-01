const { and } = require('sequelize/dist/lib/operators');
const {users , resto ,products} =  require('../../models');
// const  = require('../../models/products');

exports.addUser = async (req, res) => {
    try {
        const data = req.body;
        const response = await users.create({
            ...data,
            img: req.file.filename
        })
        
        res.status(200).send({
            status: 'success',
            message: 'user successfully added',
            data: {
                user: {
                    response
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

exports.getUsers = async function (req, res) {
    try {
        const usersData = await users.findAll({
            attributes: {
                exclude: ['password','createdAt','updatedAt']
            }
        });
        const path = 'http://localhost:5000/img/'
        usersData
         = JSON.parse(JSON.stringify(usersData
            ))
        usersData
         = usersData
        .map(x => {
            return {
                ...x,
                image: path + x.img
            }
        })
        res.status(200).send({
            status: 'success',
            massage: 'users successfully retrieved',
            data: {
                users: {
                    usersData
                }
            }
        })
        
    } catch(err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params
        const userData = await users.findOne({
            attributes: {
                exclude:['password','createdAt','updatedAt']
            },
            where: { id }
        })
        userData ? 
        res.status(200).send({
            status: 'success',
            message: 'user successfully retrieved',
            data: {
                user: userData
            }
        }) :
            res.status(400).send({
                status: 'fail',
                message: 'user not found',
                data: {
                    user: "user details not found"
                }
            })
        
        
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        await users.update(data, {
            where: {id}
        })
    
        res.send({
            status: 'success',
            message: 'user successfully update' 
        })
        
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const userData = await users.findOne({
            where: {id}
        })
        if (!userData) {
            return res.status(400).send({
                status: 'fail',
                message: 'user not found',
                data: { 
                    user: "user details not found"
                }
            })
        }
        await users.destroy({
            where: {id}
        })
        res.send({
            status: 'success',
            message: 'user successfully destroy' 
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.getUserResto = async (req, res) => {
    try {
        const { id } = req.params
        const userData = await users.findOne({
            where: { id },
            include: {
                model: resto,
                as: 'resto',
                attributes: {
                    exclude: ['ownerId','createdAt','updatedAt']
                }
            }
        })
        if (!userData) {
            return res.send({
                status: 'failed',
                message: 'acc was not found'
            })
        }
        if (userData.role == 'costumer') {
            return res.send({
                status: 'failed',
                message: 'acc was costumer'
            })
        }

        res.send({
            status: 'success',
            data: {
                userData 
            }
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}
exports.getUserRestos = async (req, res) => {
    try {
        const userData = await users.findAll({
            where: { role: "owner"},
            include: {
                model: resto,
                as: 'resto',
                attributes: {
                    exclude: ['ownerId','createdAt','updatedAt']
                }
            }
        })
        if (!userData) {
            return res.send({
                status: 'failed',
                message: 'acc was not found'
            })
        }

        res.send({
            status: 'success',
            data: {
                userData 
            }
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}