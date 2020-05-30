const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/products', (req, res) => {
    models.Products.findAll({

    }).then((products) => {
        res.render('admin/products.html', {products:products});
    });
});

router.get('/products/write', (req, res) => {
    res.render('admin/form.html');
});

router.post('/products/write', (req, res) => {
    models.Products.create({
       name: req.body.name,
       price: req.body.price,
       description: req.body.description 
    }).then(() => {
        res.redirect('/admin');
    });
});

router.get('/products/detail/:id', (req, res) => {
    models.Products.findByPk(req.params.id).then((product) => {
        res.render('admin/detail.html', {product:product});
    });
});

router.get('/products/edit/:id', (req, res) => {
    models.Products.findByPk(req.params.id).then((product) => {
        res.render('admin/form.html', {product:product});
    });
});

router.post('/products/edit/:id', (req, res) => {
    models.Products.update({
       name: req.body.name,
       price: req.body.price,
       description: req.body.description 
    },
    {
        where : { id: req.params.id }
    }
    ).then(() => {
        res.redirect('/admin/products/detail/' + req.params.id);
    });
});


module.exports = router;