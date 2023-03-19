
const jwt = require('jsonwebtoken');


const generarJWT = (uid) => {

    return new Promise((resolve, reject) => {
        const payload = {uid};
        // secretOrPrivateKey => ENV
        jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: '24h'
        }, ( err,token ) => {
            if( err ){
                // ERROR AL CREAR EL TOKEN
                reject('ERROR AL CREAR EL JSON WEB TOKEN');
            }
            else{
                // EL TOKEN SE CREO CORRECTAMENTE
                resolve(token);
            }
        })
    });

}

const checkJWT = (token = '') =>{
    try {
        const {uid} = jwt.verify(token,process.env.JWT_KEY);
        return [true,uid];
    } catch (error) {
        return [false,null];
    }
}

module.exports = {
    generarJWT,
    checkJWT
}