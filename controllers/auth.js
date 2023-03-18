const { response } = require("express");
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/jwt');

const crearUsuario = async (req,res = response) =>{
    const {email , password} = req.body; // EXTRAEMOS EL PASSWORD PARA EL HASHEO Y QUE EL CORREO ES UNICO
    try {
        const existeEmail = await Usuario.findOne({email:email});
        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg: 'El correo ya esta registrado'
            });
        }
        const usuario = new Usuario(req.body);
        // ENCRIPTAR CONTRASENA
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt);
        await usuario.save();
        // GENERAR TOKEN
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }
}



const login = async(req,res = response)=>{

    const {email,password} = req.body
    try {   
        
        const usuarioDB = await Usuario.findOne({email});
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg: 'Email no encontrado'
            });
        }

        // validar el password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'La contrasena no es valida'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuarioDB.id);
        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }
}


const renewToken = async(req,res = response) =>{

    // const uid uid del usuario
    const uid = req.uid;
    // generar un nuevo JWT,
    const token = await generarJWT(uid);
    // Obtener el usuario por el UID, Usuario.findById..
    const usuario = await Usuario.findById(uid);
    
    res.json({
        ok:true,
        usuario,
        token
    });
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}