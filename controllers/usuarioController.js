const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req,res) => {
    //Check for errors
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()})
    }
    //Take email and password from request
    const { email, password} = req.body;

try{
    let usuario = await Usuario.findOne({email});
    if(usuario){
        return res.status(400).json({msg: ' el usuario ya existe'});
    }
    //Create user
    usuario = new Usuario(req.body);
    
    //Hashear the password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password,salt)

    await usuario.save();
    //Create and save the JWT
    const payload = {
        usuario:{
            id:usuario.id
        }
    }
    jwt.sign(payload,process.env.SECRETA,{
        expiresIn:3600
    },(error,token) => {
        if(error)throw error;

        //Success msj
        res.json({token});
    })

    res.status(400).json({msg: 'Usuario creado correctamente'});
} catch(error){
    console.log(error);
    res.status(400).send('Error en el registro')
}


}