const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('admin/products.html', 
        { message : 'hello nodejs'}
    );
});

module.exports = router;