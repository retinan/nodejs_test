const express = require('express');
const router = express.Router();
const models = require('../models');
// csrf setting
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// 이미지 저장되는 위치 설정
const path = require('path');
const uploadDir = path.join( __dirname, '../uploads'); // 루트의 uploads 위치에 저장
const fs = require('fs');

// multer setting
const multer = require('multer');
const storage = multer.diskStorage({
    destination : (req, file, callback) => { // 이미지 저장 목적지
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => { // product-date.jpg(png) 저장
        callback(null, 'products-' + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
});
const upload = multer({ storage:storage });


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

router.get('/products/write', csrfProtection, (req, res) => {
    res.render('admin/form.html', { csrfToken: req.csrfToken() });
});

router.post('/products/write', upload.single('thumbnail'), csrfProtection, async(req, res) => {
    // models.Products.create({
    //    name: req.body.name,
    //    price: req.body.price,
    //    description: req.body.description 
    // }).then(() => {
    //     res.redirect('/products');
    // });
    try {
        req.body.thumbnail = (req.file) ? req.file.filename : "";
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
        // const product = await models.Products.findByPk(req.params.id);
        const product = await models.Products.findOne({
            where: {
                id: req.params.id
            },
            include: [
                'Memo'
            ]   
        });
        
        res.render('admin/detail.html', {product});
    } catch(err) {
        console.log('detail error ::: ', err);
    }
});

router.post('/products/detail/:id', async(req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.id);
        // create + (as 값) - products 모델 associate as 값이 메소드가 됨.
        await product.createMemo(req.body);
        res.redirect('/admin/products/detail/' + req.params.id);
    } catch(err){
        console.log('memo create err ::: ', err);
    }
});

router.get('/products/delete/:product_id/:memo_id', async(req, res) => {
    try {
        await models.ProductsMemo.destroy({
            where: {
                id: req.params.memo_id
            }
        });
        res.redirect('/admin/products/detail/' + req.params.product_id);

    } catch(err) {
        console.log('memo delete err ::: ', err);
    }
});

router.get('/products/edit/:id', csrfProtection, async(req, res) => {
    // models.Products.findByPk(req.params.id).then((product) => {
    //     res.render('admin/form.html', {product:product});
    // });

    try {
        const product = await models.Products.findByPk(req.params.id);
        res.render('admin/form.html', { product, csrfToken: req.csrfToken() });
    } catch(err) {
        console.log('edit get error ::: ', err);
    }

});

router.post('/products/edit/:id', upload.single('thumbnail'), csrfProtection, async(req, res) => {
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
        // 이전 저장 파일명 로딩
        const product = await models.Products.findByPk(req.params.id);
        
        if(req.file && product.thumbnail) { // 요청중에 파일이 존재 할 시 이전이미지 제거
            fs.unlinkSync( uploadDir + '/' + product.thumbnail);
        }

        // 파일요청 시 파일명 담고 아니면 이전 DB에서 가져옴
        req.body.thumbnail = (req.file) ? req.file.filename : product.thumbnail;

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