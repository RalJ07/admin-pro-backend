/* 
    ruta: api/todo/richard

*/
const { Router } = require('express');
const { getTodo, getDocumentosColeccion } = require('../controllers/busquedas');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get( '/:busquedas', [validarJWT,], getTodo );

router.get( '/coleccion/:tabla/:busquedas', [validarJWT,],  getDocumentosColeccion );



module.exports = router;