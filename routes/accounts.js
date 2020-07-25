const express = require('express');
const router = express.Router();
const models = require('../models');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordHash = require('../helpers/passwordHash');


passport.serializeUser((user, done) => {
    console.log('serializeUser');
    done(null, user);
});

passport.deserializeUser((user, done) => {
    const result = user;
    result.password = "";
    console.log('deserializeUser');
    done(null, result);
});

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    async( req, username, password, done) => {
        // 조회
        const user = await models.User.findOne({
            where: {
                username,
                password: passwordHash(password),
            }
        });
        
        // 유저에서 조회되지 않을 시
        if(!user) {
            return done(null, false, {message: 'no match id and password'});
        } else { // 유저에서 조회 성공 시 세션등록으로 데이터 넘김.
            return done(null, user.dataValues);
        }
    }
));

router.get('/', ( _ , res) => {
    res.send('accounts app');
});

router.get('/join', ( _ , res) => {
    res.render('accounts/join.html');
}); 
 
router.post('/join', async( req , res) => {
    try {
        await models.User.create(req.body);
        res.send('<script>alert("회원가입 성공");location.href=("/accounts/login");</script>');
    } catch(e) {}
});

router.get('/login', ( _ , res) => {
    res.render('accounts/login.html', { flashMessage: _.flash().error});
});

router.post('/login', 
    passport.authenticate('local', {
        failureRedirect: 'accounts/login',
        failureFlash: true
    }),
    ( _ , res) => {
        res.send('<script>alert("login success!");location.href="/accounts/success"</script>')
    }
);

router.get('/success', (req, res) => {
    res.send(req.user);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/accounts/login');
});


module.exports = router;