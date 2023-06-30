const Grupos = require("../models/Grupos")
const Meetis = require("../models/Meetis")





//muestra formulario para nuevos meeti
exports.formNuevoMeeti = async (req,res)=>{
    const grupos = await Grupos.findAll({where:{usuarioId: req.user.id}})
    
    res.render("nuevoMeeti",{
        pagina:"Nuevo Meeti",
        grupos
    })
}


//inserta nuevos meeti
exports.crearMeeti = async (req,res)=>{
    //obtener los datos
    const meeti = req.body
    //asignar usuario
    meeti.usuarioId = req.user.id

    //almacena la ubicaion con un point
    const point = { type: "Point", coordinates:[parseFloat(req.body.lat), parseFloat(req.body.lng)]}
    meeti.ubicacion = point

    if(req.body.cupo === ""){
        meeti.cupo = 0
    }


    //almcenar meeti
    try {
        
        await Meetis.create(meeti)
        req.flash("exito", "Se ha creado el Meeti correctamente ")
        res.redirect("/administracion")
        
    } catch (error) {
        console.log(error)
         // extraer el message de los errores
         const erroresSequelize = error.errors.map(err => err.message);
        req.flash("error", erroresSequelize)
        res.redirect("/nuevoMeeti")
    }


}

exports.sanitizarMeeti = (req,res,next)=>{
    req.sanitizeBody("titulo")
    req.sanitizeBody("invitado")
    req.sanitizeBody("cupo")
    req.sanitizeBody("fecha")
    req.sanitizeBody("hora")
    req.sanitizeBody("direccion")
    req.sanitizeBody("cuidad")
    req.sanitizeBody("estado")
    req.sanitizeBody("pais")
    req.sanitizeBody("lat")
    req.sanitizeBody("lng")
    req.sanitizeBody("grupoId")
    next()
}


exports.formEditarMeeti = async(req,res,next)=>{

    const consultas = []
    consultas.push(Grupos.findAll({where:{usuarioId: req.user.id}}))
    consultas.push(Meetis.findByPk(req.params.id))

    const [grupos,meeti] = await Promise.all(consultas)

    if(!grupos || !meeti){
        req.flash("error", "Operacion no valida")
        res.redirect("/administracion")
        return next()

    }


    res.render("editarMeeti",{
        pagina:`Editar: ${meeti.titulo}`,
        grupos,
        meeti
    })

}
//almacena el meeti en la bd
exports.editarMeeti= async (req,res,next)=>{
    const meeti = await Meetis.findOne({where:{id: req.params.id, usuarioId: req.user.id }})

    if(!meeti){
        req.flash("error", "Operacion no valida")
        res.redirect("/administracion")
        return next()
    }

    const {grupoId,titulo,invitado,fecha,hora,cupo,descripcion,direccion,ciudad,estado,pais,lat,lng} = req.body
    
    meeti.grupoId = grupoId
    meeti.titulo = titulo
    meeti.invitado = invitado
    meeti.fecha = fecha
    meeti.hora = hora
    meeti.cupo = cupo    
    meeti.descripcion = descripcion
    meeti.direccion = direccion
    meeti.ciudad = ciudad
    meeti.estado = estado
    meeti.pais = pais
    const point = { type: "Point", coordinates:[parseFloat(lat), parseFloat(lng)]}
    meeti.ubicacion = point

    try {
        await meeti.save()
        req.flash("exito","Meeti modificado correctamente")
        res.redirect("/administracion")
    } catch (error) {
        console.log(error)
        req.flash("error", "Operacion no valida")
        res.redirect("/administracion")
        return next()
    }

}


//form para eliminar meeti
exports.formEliminarMeeti = async (req,res)=>{
    const meeti = await Meetis.findOne({where:{id: req.params.id, usuarioId: req.user.id }})
    
    if(!meeti){
        req.flash("error", "Operacion no valida")
        res.redirect("/administracion")
        return next()
    }

    res.render("eliminarMeeti",{
        pagina:`Eliminar: ${meeti.titulo}`,
    })
}

exports.eliminarMeeti = async (req,res,next)=>{
    
    try {
        await Meetis.destroy({where:{id: req.params.id}})
        req.flash("exito", "Meeti eliminado correctamente")
        res.redirect('/administracion')
    } catch (error) {
        console.log(error)
        req.flash("error", "Operacion no valida")
        res.redirect("/administracion")
        return next()
    }

}


