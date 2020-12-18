const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');


passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(req.body);
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]) //trae todos los usuarios que coinciden con el username
    if (rows.length > 0){
        const user = rows[0]; //Guarda el usuario encontrado.
        const validPassword = await helpers.matchPassword(password, user.password) //compara la contraseña en texto plano con la contraseña cifrada.
        if(validPassword){
            done(null, user, req.flash('succes', 'Welcome' + user.username)); //Si coincide termina el proceso, le pasa el usuario, para que lo serialice y lo deserialice
        } else {
            done(null, false, req.flash('message','Incorrect password')); // null para el error, false para que no envie un usuario.
        } 
    } else {
        return done(null, false, req.flash('message','The Username does not exist'));
    }
}));



//SIGNUP
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password);//desde helpers voy a usar el metodo encrypt password
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);  //dentro de las bases de datos inserta la tabla newUser que contiene todos esos datos.
    newUser.id = result.insertId; //como faltaba el usuario entonces se lo pusimos de acuerdo a lo insertado en la base de datos.
    return done(null, newUser);

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]); //el signo de pregunta toma el valor que se pone luego, en este caso [id]
    done(null,rows[0]);
});