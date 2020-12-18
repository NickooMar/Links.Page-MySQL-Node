const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); //ejecuta un algoritmo de cifrado
    const hash = await bcrypt.hash(password, salt); // Le damos esa contraseña  y ese patron a bcrypt para que cifre la contaseña.
    return hash;
};

//Comparo la contraseña con la contraseña guardada
helpers.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword); 
    } catch(e) {                                          // en caso ocurra un error se ejecuta el catch!
        console.log(e);
    }
};

module.exports = helpers;
