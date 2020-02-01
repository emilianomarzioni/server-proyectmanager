const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const {check} =require('express-validator');

//Create proyects api/proyectos
router.post('/',
    auth,
    [check("nombre","Ingrese un nombre de proyecto").not().isEmpty()],
    proyectoController.crearProyecto
);
router.get('/',
    auth,
    proyectoController.obtenerProyectos
);
router.put('/:id',
    auth,
    [check("nombre","Ingrese un nombre de proyecto").not().isEmpty()],

    proyectoController.actualizarProyecto
);
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);
module.exports = router;