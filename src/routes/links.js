const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});


router.post('/add', async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id         //Esto hace que el ususario pueda ver solo sus links
    };
    await pool.query('INSERT INTO links set ?', [newLink]); //Cuando se logee el id de su sesion sera almacenado en newLink
    req.flash('success', 'Link saved succesfully');
    res.redirect('/links');
})

router.get('/', isLoggedIn,async (req, res) =>{
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?',[req.user.id]); //Esto consulta los enlaces que le pertenecen unicamente al usuario logeado.
    res.render('links/list', {links});
});

router.get('/delete/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed succefully');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('./links/edit', {link: links[0]});
});

router.post('/edit/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]); //actualiza desde la tabla link tan solo el conjunto de datos en donde
    // coincida con el id y le paso esos datos y le paso el id
    req.flash('success', 'Link Updated Succesfully');
    res.redirect('/links');
})

module.exports = router;