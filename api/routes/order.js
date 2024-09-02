const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Orders = require('../models/orders');

router.get('/', (req, res, next) => {
    Orders
    .find()
    
    .exec()
    .then(docs =>{
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    const order = new Orders({
      _id: new mongoose.Types.ObjectId(),
      quantity:  Number(req.body.quantity),
      product: req.body.productId // Ensure this matches the request body field name
    });
  
    order
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  

router.get('/:orderid', (req, res, next) => {
    Orders.findById(req.params.orderid)
    .exec()
    .then(order => {
      if(!order){
        return res.status(404).json({
          message: "Order not found"
        })
      }
      res.status(200).json({
        order: order,
        requset: {
          type: "GET",
          url: 'http://localhost:3000/order'
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:orderidid', (req, res, next) => {
  Orders.deleteOne(req.params.orderid)
  .exec()
  .then(order => {
    res.status(200).json({
      message: "Order deleted",
      requset: {
        type: "POST",
        url: 'http://localhost:3000/order',
        body: { productId: "ID", quantity: "Number"}
      }
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});

module.exports = router;