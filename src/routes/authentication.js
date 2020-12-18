const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');


router.get('/signup', isNotLoggedIn, (req, res) => { //hara que si el usuario ya esta logeado no le permitira ingresar a signup
    res.render('auth/signup');
});


router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',        //Esto lo redirecciona al perfil o al signup si falla
    failureRedirect: '/signup',
    failureFlash: true  //permite a passport poder recibir estos mensjaes flash
}))//toma el nombre de la autenticacion que hemos creado.

//Creamos una ruta de logeo
router.get('/signin', isNotLoggedIn,(req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});


router.get('/profile', isLoggedIn, (req, res) => {  //ejecuta la logica de isloggedin antes de acceder al perfil
    res.render('profile');
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.redirect('/signin');
});

module.exports = router;