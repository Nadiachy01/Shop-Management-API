const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');
const product = require('../models/product');

router.get('/', (req, res, next) => {
   Product.find()
   .select("name price _id")
   .exec()
   .then(docs => {
    const response = {
        count : docs.length,
        products: docs.map(doc => {
            return{
                name: doc.name,
                price: doc.price,
                _id: doc._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + doc._id
                }
            }
        })
    };
    //if(docs.length >=0){
        res.status(200).json(response);
   // }
    //else{
   //     res.status(404).json({
   //         message: "No entries found"
    //    });
    //}  
   })
   .catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
   });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
    .save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdproduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
   
});

router.get('/:productid', (req, res, next) => {
    const id = req.params.productid;
    Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
        console.log("from database",doc);
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: "GET",
                    description: "Get all products",
                    url: "http://localhost:3000/products/"
                }
            });
        }
        else {
            res.status(404).json({message: "no valid entry found"});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:productid', (req, res, next) => {
    const id = req.params.productid;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id }, {$set : updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "Product updated",
            request: {
                type: "GET",
                description: "Get_all_products",
                url: "http://localhost:3000/products/" + id
            }
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:productid', (req, res, next) => {
    const id = req.params.productid;
    Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product deleted successfully',
        request: {
            type: 'POST',
            url: "http://localhost:3000/products",
            body: {name: "String", price:'Number'}
        }
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;