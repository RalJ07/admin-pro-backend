/*
medicos
ruta '/api/medicos'
*/


const { Router } = require('express');

const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const router = Router();



router.get( '/', getMedicos );

router.post( '/', 

        [
            validarJWT,
            check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
            check('hospital', 'El nombre del hospital es necesario').isMongoId(),
            validarCampos 
        ], 
        crearMedico
    );

router.put( '/:id',

        [],
        actualizarMedico
    );



router.delete('/:id', borrarMedico);






module.exports = router;