const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/products', async(req, res) => {
    // models.Products.findAll().then((products) => {
    //     res.render('admin/products.html', {products:products});
    // });
    try {
        const products = await models.Products.findAll();
        // console.log('products', products);
        res.render('admin/products.html', {products});
    } catch(err) {
        console.log('products page error ::: ', err);
    }
});

router.get('/products/write', (req, res) => {
    res.render('admin/form.html');
});

router.post('/products/write', async(req, res) => {
    // models.Products.create({
    //    name: req.body.name,
    //    price: req.body.price,
    //    description: req.body.description 
    // }).then(() => {
    //     res.redirect('/products');
    // });
    try {
        await models.Products.create(req.body);
        res.redirect('/admin/products');
    } catch(err) {
        console.log('write error ::: ', err);
    }
});

router.get('/products/detail/:id', async(req, res) => {
    // models.Products.findByPk(req.params.id).then((product) => {
    //     res.render('admin/detail.html', {product:product});
    // });
    try {
        const product = await models.Products.findByPk(req.params.id);
        res.render('admin/detail.html', {product});
    } catch(err) {
        console.log('detail error ::: ', err);
    }
});

router.get('/products/edit/:id', async(req, res) => {
    // models.Products.findByPk(req.params.id).then((product) => {
    //     res.render('admin/form.html', {product:product});
    // });

    try {
        const product = await models.Products.findByPk(req.params.id);
        res.render('admin/form.html', {product});
    } catch(err) {
        console.log('edit get error ::: ', err);
    }

});

router.post('/products/edit/:id', async(req, res) => {
    // models.Products.update({
    //    name: req.body.name,
    //    price: req.body.price,
    //    description: req.body.description 
    // },
    // {
    //     where : { id: req.params.id }
    // }
    // ).then(() => {
    //     res.redirect('/admin/products/detail/' + req.params.id);
    // });

    try {
        await models.Products.update(
            req.body,
            {
                where : { id:req.params.id }
            }
        );
        res.redirect('/admin/products/detail/' + req.params.id);
    } catch(err) {
        console.log('edit post error ::: ', err);
    }


});

router.get('/products/delete/:id', async(req, res) => {
    // models.Products.destroy({
    //     where: {
    //         id: req.params.id
    //     }
    // }).then(() => {
    //     res.redirect('/admin/products');
    // });

    try {
        await models.Products.destroy(
            {
                where: { id: req.params.id }
            }
        );
        res.redirect('/admin/products');
    } catch(err) {
        console.log('delete error ::: ', err);
    }
});


module.exports = router;