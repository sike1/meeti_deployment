const Usuarios = require("../models/Usuarios.js")
const enviarEmail = require("../handlers/email.js")
const express = require("express")
const multer = require("multer")
const shortid = require("shortid")
const fs = require("fs")




exports.formCrearCuenta = (req,res)=>{
    res.render("crearCuenta",{
        pagina: "Crear Cuenta",
    })
}


exports.crearCuenta = async (req, res)=>{
    const usuario = req.body;

    req.checkBody('confirmar', 'El password confirmado no puede ir vacio' ).notEmpty();
    req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);

    // Leer los errores de express
    erroresExpress = req.validationErrors();
   
    try {
        await Usuarios.create(usuario);

        // Url de confirmación
        const url = `http://${req.headers.host}/confirmarCuenta/${usuario.email}`;

        // Enviar email de confirmación
        await enviarEmail.enviarEmail({
            usuario,
            url, 
            subject : 'Confirma tu cuenta de Meeti',
            archivo : 'confirmarCuenta'
        });

        //Flash Message y redireccionar
        req.flash('exito', 'Hemos enviado un E-mail, confirma tu cuenta');
        res.redirect('/iniciarSesion');
    } catch (error) {
        console.log(error)
        // extraer el message de los errores
        const erroresSequelize = error.errors.map(err => err.message);

        // extraer unicamente el msg de los errores
        if(erroresExpress){
            errExp = erroresExpress.map(err => err.msg);
            const listaErrores = [...erroresSequelize, ...errExp];
            req.flash('error', listaErrores);
            res.redirect('/crearCuenta');
        }else{
            
            const listaErrores = [...erroresSequelize] 
            req.flash('error', listaErrores);
            res.redirect('/crearCuenta');
        }
    }
   
}



//Confirmar Cuenta
exports.confirmarCuenta = async (req, res, next)=>{
    //verificar el usuario
    const usuario = await Usuarios.findOne({where:{email: req.params.correo}})

    //verifiar si existe
    if(!usuario){
        req.flash("error","No existe la cuenta")
        res.redirect("/crearCuenta")
        return next()
    }
    //Si existe confirmamos la cuenta
    usuario.activo = 1

    await usuario.save()

    req.flash("exito","Tu cuenta esta confirmada ya puedes iniciar sesión")
    res.redirect("/iniciarSesion")


}
//Formulario inicio de sesion
exports.formIniciarSesion = (req, res)=>{
    res.render("iniciarSesion",{
        pagina: "Iniciar Sesion",
    })
}


//formulario editar perfil
exports.formEditarPerfil = async (req,res)=>{
    const usuario = await Usuarios.findByPk(req.user.id)
    res.render("editarPerfil",{
        pagina: `Editar perfil: ${usuario.nombre}`,
        usuario
    })
}


exports.editarPerfil = async (req,res,next)=>{
    const usuario = await Usuarios.findByPk(req.user.id)

    if(!usuario){
        req.flash("error","No existe la cuenta")
        res.redirect("/administracion")
        return next()
    }

    //sanetizar
    req.sanitizeBody("nombre")
    req.sanitizeBody("descripcion")
    req.sanitizeBody("email")


    const{nombre,descripcion,email} = req.body
    
    usuario.nombre = nombre
    usuario.descripcion = descripcion
    usuario.email = email

    await usuario.save()
    req.flash("exito","Cambios realizados correctamente")
    res.redirect("/editarPerfil")

}


exports.fromCambiarPassword=(req,res)=>{

    res.render("cambiarPassword",{
        pagina:"Cambiar contraseña",
    })


}

//modificar password revisando el pasword anterior
exports.cambiarPassword = async (req,res,next)=>{

    const usuario = await Usuarios.findByPk(req.user.id)

    
   
    //verificar si el password actual sea correcto
    if(!usuario.validarPassword(req.body.anterior)){
        req.flash("error","Contraseña actual no coincide")
        res.redirect("/administracion")
        return next()
    }

    //Si el password es correcto hashear el password
    const hash = usuario.hashPassword(req.body.nueva)
    //asignar password al usuario
    usuario.password = hash
    //guardamos en la base de datos
    await usuario.save()

    //redirecionamos
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("exito","Contraseña cambiada, vuelve a iniciar sesion")
        res.redirect("/iniciarSesion")
      });
        
    
}


exports.fromImagenPerfil= async (req,res)=>{
    const usuario = await Usuarios.findByPk(req.user.id)

    res.render("imagenPerfil",{
        pagina:`Editar Imagen de: ${usuario.nombre}`,
        usuario
    })
}


//Subir imagen perfiles
const configuracionMulter ={
    limits : { fileSize : 300000},
    storage: fileStorage = multer.diskStorage({
        destination:(req,file,next)=>{
            next(null,__dirname+"/../public/uploads/perfiles/")
        },
        filename: (req,file,next)=>{
            const extension = file.mimetype.split("/")[1]
            next(null,`${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
            // el callback se ejecuta como true o false : true cuando la imagen se acepta
            cb(null, true);
        } else {
            cb(new Error('Formato No Válido'),false);
        }
    }
}

const upload = multer(configuracionMulter).single("imagen")

//subir imagen al servidor
exports.subirImagenPerfil = (req, res, next)=>{

    upload(req,res,function(error){
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code == "LIMIT_FILE_SIZE"){
                        req.flash("error", "Archivo muy grande. Max: 300Kb")
                    } else {
                        req.flash("error", error.message)
                    }
            } else if(error.hasOwnProperty("message")) {
                req.flash("error", error.message)
            }
            res.redirect("back")
            return
        }else{
            next()
        }
    })
}

exports.editarImagenperfil = async (req,res,next)=>{
    const usuario = await Usuarios.findByPk(req.user.id)


    //Si exite imgaen previa la eliminamos
    if(req.file && usuario.imagen){
        const imagenAnteriorPath = __dirname +`/../public/uploads/perfiles/${usuario.imagen}`
        //eliminar archivo cn fs
        fs.unlink(imagenAnteriorPath, (error)=> {
            if(error){
                console.log(error)
            }
            return
        })
    }
    //si hay imagen nueva
    if(req.file){
        usuario.imagen = req.file.filename
    }
    

    //Guardar en la base de datos
    await usuario.save()
    req.flash("exito","Imagen guardada correctamente")
    res.redirect("/administracion")
}
