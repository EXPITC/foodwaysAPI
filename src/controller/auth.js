const { users } = require('../../models')
require("dotenv").config();

const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const schema = joi.object({
        fullname: joi.string().min(3).required(),
        email: joi.string().email().required(),
        password: joi.string().min(4).required(),
        role: joi.string().required(),
        phone: joi.string().optional(),
        location: joi.string().optional(),
        img: joi.string().optional(),
    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({
            err : error.details[0].message
        })
    }
    try {
        const { email } = req.body
        let valid = await users.findOne({
            where: {email}
        })

        if (valid) {
            return res.status(400).send({
                status: 'failed',
                message: 'acc already exists'
            })
        }
        
        const salt = await bcrypt.genSalt(8)
        const hashPass = await bcrypt.hash(req.body.password, salt)
        // let data = req.body
        // data = JSON.parse(JSON.stringify(data))
        // data = [data].map(x => {
        //     return {
        //         ...x,
        //         password:  hashPass
        //     }
        // })
        const response = await users.create({
            fullname: req.body.fullname ,
            email:  email,
            password:  hashPass,
            role:  req.body.role,
            phone:  req.body.phone,
            location:  req.body.location,
            img:  req.body.img,
        })

        valid = await users.findOne({
            where: {email}
        })
        const userData = {
            id: valid.id,
            status: valid.role
        }
        
        const token = jwt.sign(userData,process.env.JWT_TOKEN)
        
        res.status(200).send({
            status: 'success',
            message: 'successfully register',
            data: {
                user: {
                    name: response.fullname,
                    email: email,
                    token
                }
            },
            
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.login = async (req, res) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).required(),
    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({
            err : error.details[0].message
        })
    }

    try {
        
        const { email, password } = req.body
        const userAcc = await users.findOne({
            where: {email}
        })
        
        if (!userAcc) {
            return res.status(400).send({
                status: 'failed',
                message: 'email or password wrong'
            })
        }
        const valid = await bcrypt.compare(password, userAcc.password)
        if (!valid) {
            return res.status(400).send({
                status: 'failed',
                message: 'email or password wrong'
            })
        }
        const { id, fullname } = userAcc
        const userData = {
            id,
            status: userAcc.role
        }
        
        const token = jwt.sign(userData,process.env.JWT_TOKEN)

        res.status(200).send({
            status: 'login',
            fullname,
            email,
            token,
        })

    }catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}