
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');
exports.crearProyecto = async ( req,res) => {
    //Check for errors
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()})
    }
    try{
        const proyecto = new Proyecto(req.body);
        proyecto.creador = req.usuario.id;
        proyecto.save();
        res.json(proyecto);
    }catch (error){
        console.log(error);
        res.status(500).send("Hubo un error");
    }
}

exports.obtenerProyectos = async (req,res) =>{
    try{
        const proyectos = await Proyecto.find({creador:req.usuario.id});
        res.json({proyectos});
    }catch(error){
        console.log(error);
        res.status(500).send("Hubo un error");
    }
}
exports.actualizarProyecto = async ( req,res) => {
    //Check for errors
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()})
    }
    
    //Extract info from proyect
    const { nombre } = req.body
    const nuevoProyecto = {};

    if(nombre){
        nuevoProyecto.nombre = nombre
    }
    try{
//check the ID
let proyecto = await Proyecto.findById(req.params.id);

if(!proyecto){
    return res.status(404).send("Proyecto no encontrado")
}
//If proyect exist
if(proyecto.creador.toString() !== req.usuario.id){
    return res.status(401).json({msg:"No autorizado"});
}
//If is creator true
proyecto = await Proyecto.findByIdAndUpdate({_id:req.params.id},{$set:nuevoProyecto},{new: true});

res.json({proyecto});
    }catch(error){
        console.log(error);
        res.status(500).send("Hubo un error");
    }
}
exports.eliminarProyecto = async (req, res ) => {
    try {
        // check the ID 
        let proyecto = await Proyecto.findById(req.params.id);

        // valid proyect?
        if(!proyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        // valid creator?
        if(proyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        // delete
        await Proyecto.findOneAndRemove({ _id : req.params.id });
        res.json({ msg: 'Proyecto eliminado '})

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor')
    }
}
