const Comentarios = require("../../models/Comentarios")
const Usuarios = require("../../models/Usuarios")
const Meetis = require("../../models/Meetis")


exports.mandarComentario = async (req, res,next)=>{

    //sanitizar
    req.sanitizeBody("comentario")
    
    const {comentario} = req.body

    //crear comentarios en la bd
    await Comentarios.create({
        mensaje: comentario,
        usuarioId: req.user.id,
        meetiId: req.params.id
    })

    //redireccionar 
    res.redirect("back")
    next()
   
}


exports.eliminarComentario = async (req,res,next)=>{
    //tomar el id
    const { idComentario } = req.body
    
    //comsultar el comentario
    const comentario = await Comentarios.findByPk(idComentario)

    //verificamos que el comentario exista
    if(!comentario){
        res.status(404).send("Accion no valida")
        return next()
    }

    //cosultamos el meeti del comentario 
    const meeti = await Meetis.findByPk(comentario.meetiId)

    //verificamos que quien lo borra sea el autor
    if(comentario.usuarioId === req.user.id || meeti.usuarioId === req.user.id){
        await Comentarios.destroy({where:{
            id: comentario.id
        }})
        res.status(200).send("Eliminado correctamente")
        return next()

    }else{
        res.status(403).send("Accion no valida")
        return next()

    }
}