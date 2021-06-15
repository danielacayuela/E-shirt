const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {Shirt, User, Detail, Category, Order} = require('../db.js');


function setTotalPrice (body) {
    let total_price = 0;
    for (const detail of body) {
        total_price += (parseInt(detail.price) * parseInt(detail.amount));
    }
    console.log('resultado del setTotalPrice', total_price)
    return total_price;
}

function validateOrder (body) {
    if (!Array.isArray(body)) {throw {status: 400, message: 'Body is not an Array'}}

    body.forEach((detail, ix) => {
        if (!detail.shirtId) {throw {status: 400, message: "Shirt id is missing in order at index " + ix}}
        if (!detail.size) {throw {status: 400, message: "Size is missing in order at index " + ix}}
        if (!detail.amount) {throw {status: 400, message: "Amount is missing in order at index " + ix}}
        if (!detail.price) {throw {status: 400, message: "Price is missing in order at index " + ix}}
    })
}

function setOrderItems(cart, item, operation) {
    if (operation === 'clear') {
        return []
    }

    if (cart.length === 0) {
        return (operation === 'add' && [...cart, item]) || cart
    }
    
    const foundItem = cart.find(i => (i.shirtId === item.shirtId && i.size === item.size));
    if (!foundItem) { 
        return (operation === 'add' && [...cart, item]) || cart
    } else {
        operation === 'add' ? foundItem.amount += item.amount : foundItem.amount -= item.amount;
        return cart.filter(i => i.amount > 0)
    }
}


async function postOrder (req, res, next) {
    const userId = req.params.userId.toString()
    const body = req.body
    try {
        // if (userId !== 'unlogged') {
        //     const user = await User.findOne({where: {id: userId}})
        //     if (!user) { throw {status: 404, message: 'User not found'}}
        // }
        
        //validateOrder(body)

        let total_price = setTotalPrice(body)
        total_price = (total_price > 0 && total_price) || 0 

        const postedOrder = await Order.create({status: 'CART', total_price, userId})
        
        if (body.length > 0) {
            try {
                for (const detail of body) {
                    if (detail.id) {
                        detail.shirtId = detail.id
                        delete detail.id
                    }
                    detail.orderId = postedOrder.id
                    
                    await Detail.create(detail)
                }    
            } catch (err){
                throw {status: 400, message: 'Error posting detail table. Make sure that shirtId exists'}
            }
        }
        return res.status(200).json(postedOrder)
        
    } catch (err) {
        next(err)
    }
}

async function getOrders(req, res, next) {
    try {
        const orders = await Order.findAll({include: [Detail]})
        return res.status(200).json(orders)
    } catch (err) {
        console.log(err)
        return next({status: 500, message: 'Request could not be solved'})
    }
}

async function getOrder (req, res, next) {
    const id = req.params.id
    try { 
        const order = await Order.findOne({where: {id: id}, include: [Detail]})
        if (order) {
            return res.status(200).json(order)
        } else {
            return next({status: 404, message: 'Order not found'})
        }
        
    } catch (error) {
        next({status: 400, message: 'Bad Id format'});
    }
}

async function getOrdersByUserId (req, res, next) {
    const userId = req.params.userId.toString();
    try {
        const user = await User.findOne({where: {id: userId}, include:[Order]});
        
        const orders = await Order.findAll({where: {userId: userId}, include: [Detail]})
        console.log(user);
        if (!user) {throw {status: 404, message: 'User not found'}}
      // Si rompe, chequea la linea de abajo
        // const orders = await Order.findAll({where: {userId: userId}, include: [Detail]})
        return res.status(200).json(orders)
    } catch (err) {
        return next(err)
    }
}


async function putOrder (req, res, next) {
    const orderId = req.params.id
    const newOrder = req.body
    const item = newOrder.splice(newOrder.length - 1, 1)
    const operation = req.query.operation
    try {
        console.log(newOrder, orderId, operation)
        const oldOrder = await Order.findOne({where: {id: orderId}})
        if (!oldOrder) {throw {status: 404, message: 'Order not found'}}
        const modifiedOrder = setOrderItems(newOrder, item[0], operation)
        
        if (oldOrder.status === 'CANCELED' || oldOrder.status === 'DONE') {
            throw {status: 400, message: 'This order status is ' + oldOrder.status + '. It can not be modified'}
        }
        
        const details = await Detail.findAll({where: {orderId: orderId}})

        oldOrder.total_price = 0
        if (modifiedOrder.length > 0) {
            for (const detail of modifiedOrder) {

                oldOrder.total_price = oldOrder.total_price + (parseInt(detail.price) * parseInt(detail.amount)) 
                detail.orderId = orderId

                await Detail.create(detail)
            }
        }

        for (const detail of details) {
            await detail.destroy()
        }
        await oldOrder.save()

        const updatedOrder = await Order.findOne({where: {id: orderId}, include: [Detail]})
        return res.status(200).json(updatedOrder)

    } catch (err) {
        console.log(err)
        return next(err)
    }
}


async function modifyStatus (req, res, next) {
    const orderId = req.params.id;
    try {
        const order = await Order.findOne({where: {id: orderId}})
        if (!order) {throw {status: 404, message: 'Order not found'}}

        order.status = req.body.status.toUpperCase()
        
        await order.save()
        
        const updatedOrder = await Order.findOne({where: {id: orderId}})
        return res.status(200).json(updatedOrder)

    } catch (err) {
        return next(err)
    }
}

async function getOrdersByStatus (req, res, next) {
    const userId = req.params.userId.toString()
    try {
        const orders = await Order.findAll({
            where: {
                userId: userId, // Esto es el orderID
            }
        })

        const mappedOrders = orders.filter(o => o.dataValues.status === 'CART')
        x = mappedOrders
        let max = x[0].dataValues.id;
        for (let i=0; i< x.length ; i++) {
            for (let j=i+1; j < x.length; j++) {
                if(max < x[j].dataValues.id) {
                    max = x[j].dataValues.id
                }
            }
        }
    
        const order = await Order.findOne({where: {id: max}})
        res.status(200).json(order.id)

    } catch (err) {
        next({status: 500, message: err})
    }
}

async function checkStock(req, res, next) {
    const orderId = req.params.orderId;
    try {
        let orderFound = await Order.findOne({
            where: {
                    id: orderId
                },
            include: [{model: Detail, include: [Shirt]}]
            })

        let availableStock = orderFound.details.filter(detail => {
                return detail.shirt.stock >= detail.amount;
            }); 
        
            if(availableStock.length !== orderFound.details.length) {
                return res.status(410).send('UNAVAILABLE STOCK');
            } else {
                orderFound.details.forEach(detail => {
                    console.log(detail.shirt.stock); 
                    detail.shirt.stock -= detail.amount;
                    detail.shirt.save();
                    console.log(detail.shirt.stock);
                    
                })

                return res.status(200).send('STOCK OK');

            }

    } catch (err) {
        next({
            message: err,
            error: 404,
        })
        console.log(err);
    }
}


module.exports = {
    postOrder,
    getOrders,
    getOrder,
    putOrder,
    modifyStatus,
    getOrdersByUserId,
    getOrdersByStatus,
    checkStock,
}