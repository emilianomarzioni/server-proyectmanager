const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req,res) => {
    //Check for errors
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()})
    }
    //Take email and password from request
    const { email, password} = req.body;
    try {
        let usuario = await Usuario.findOne({email});
        //Check for user
        if (!usuario) { 
            return res.status(400).json({msg: "Usuario inexistente"})
        }
        //Check for password
        const passCorrect = await bcryptjs.compare(password,usuario.password);
        if(!passCorrect){
            return res.status(400).send("Password incorrecto");
        }
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
        }catch(error){
        console.log(error)
    }
}
// Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}