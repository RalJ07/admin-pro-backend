const { response } = require("express");

const bcrypt = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req, res = response) => {
    
    const { email, password } = req.body;


    try {
        

        //Verificar Email
        const usuarioDB = await Usuario.findOne({ email });

        if ( !usuarioDB ) {
            return res.status(400).json({
                ok: false,
                msg: 'Email no valido'
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        //Generar el TOKEN - JWT
        const token = await generarJWT( usuarioDB.id );


        res.json({
            ok: true,
            token
        }); 

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const googleSignIn = async( req, res = response ) => {

    try {
        const { email, name, picture } = await googleVerify( req.body.token );

        const usuarioDB = await Usuario.findOne({ email });
        let Usuario;

        if ( !usuarioDB ) {
            Usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            Usuario = usuarioDB;
            Usuario.google = true;
            // usuario.password = '@@';
        }

        // Guardar Usuario
        await Usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT( Usuario.id );


        res.json({
            ok: true,
            email, name, picture,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Token de Google no es correcto'
        });
    }
    


}


const renewToken = async (req, res= response) => {
    const uid = req.uid;

    // Generar el TOKEN - JWT
    const token = await generarJWT( Usuario.id );
    
    res.json({
        ok: true,
        token

    })


}
module.exports= {
    login,
    googleSignIn,
    renewToken
}