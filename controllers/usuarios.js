const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generearJWT } = require('../helpers/jwt');

const getUsuarios =  async (req ,res) => {

    const usuarios = await Usuario.find({},'nombre email role google');


    res.json({
        ok: true,
        usuarios,
        
    });

}

const crearUsuarios =  async (req ,res = response) => {

    const { email, password } = req.body;


    try {
        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            });
        }
        
        
        const usuario = new Usuario( req.body );
        

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardar usuario 
        await usuario.save();

        //Generar JWT
        const token = await generearJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado, revisar logs'
        })
    }

    

}

const actualizarUsuario = async (req, res = response) => {

    const uid = req.params.id;
    const {  } = req.body;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if (!usuarioDB) {
            return res.status(404).json({
                ok:false,
                msg: 'No existe usuario por ese id'
            });
        }

        //Actualizar usuario
        const {password, google, email, ...campos} = req.body;
       

        if ( usuarioDB.email !== email ) {

             const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                 });
            
            } 

        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, {new: true} );

        res.json({
            ok:true,
            usuario: usuarioActualizado
        });


        
    } catch (error) {
        console.log( error );
        req.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }


}

const borrarUsuario = async (req, res = response ) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if (!usuarioDB) {
            return res.status(404).json({
                ok:false,
                msg: 'No existe usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })

    } catch (error) {
        console.log (error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        });
    }


}



module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
    
}