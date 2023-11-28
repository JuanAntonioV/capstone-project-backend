const { okResponse} = require('../utils/response');
const { notFoundResponse} = require('../utils/response');
const { serverErrorResponse} = require('../utils/response');

const {Product} = require("../models")
const productController = {}
/*
    This is a sample controller, you can continue to build your own controller
    by following the sample below.
*/

productController.index = async (req, res) => {
    okResponse(res, {
        message: 'Hello World',
    });
};

productController.create = async (req, res) => {
    const { name, status, price } = req.body;
    try {
      const newProduct = await Product.create({
        name,
        status,
        price,
        
      });

      okResponse(res,newProduct);
    } catch (error) {
      console.error(error);
      serverErrorResponse(res)
    }
  }

  productController.getAll = async (req, res, next) => {
    try {
        const activeProduct = await Product.findAll({

        });

        okResponse(res, activeProduct);
    } catch (err) {
        next(err);
    }
};

productController.getById = async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await Product.findByPk(productId,{
     
      });
      if (!product) {
        notFoundResponse(res)
        return
      }

      okResponse(res, product);
    } catch (error) {
      console.error(error);
      serverErrorResponse(res)
    }
  };
  
 productController.update = async (req, res) => {
    const productId = req.params.id;
    const { name, status, price } = req.body;
    try {
      let product = await Product.findByPk(productId,{
  
      });
  
      if (!product) {
        notFoundResponse(res)
        return
      }
      product = await product.update({
        name,
        status,
        price,
      });
      
      okResponse(res,product);
    } catch (error) {
      console.error(error);
      serverErrorResponse(res)
    }
  };
  
 productController.delete = async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await Product.findByPk(productId,{
  
      });
      if (!product) {
        notFoundResponse(res)
        return
      }
      await product.destroy();
      okResponse(res,product)
    } catch (error) {
      console.error(error);
      serverErrorResponse(res)
    }
  };
module.exports = productController

