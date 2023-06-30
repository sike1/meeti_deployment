const passport  = require("passport")
const LocalStrategy = require("passport-local").Strategy
const Usuarios = require("../models/Usuarios.js")
const { pass } = require("./email.js")



passport.use(new LocalStrategy({
        usernameField : "email",
        passwordField : "password"
    },async (email,password,next)=>{
        //Codigo que se ejecuata al llenar el formulario
        const usuario = await Usuarios.findOne({
                                                where:{email, activo: 1}})

        //revisar si existe o no
        if(!usuario)return next(null,false,{
            message:"Ese usuario no existe"
        })
        //si existe
        const verifiarPass = usuario.validarPassword(password)
        //si es inconrrecto
        if(!verifiarPass)return next(null,false,{
            message:"La contraseña no es valida"
        })

        //Todo Bien
        return next(null,usuario)
    }
    ))

passport.serializeUser(function(usuario,cb){
    cb(null,usuario)
})  

passport.deserializeUser(function(usuario,cb){
    cb(null,usuario)
})

module.exports = passport