const Grupos = require("../../models/Grupos")
const Usuarios = require("../../models/Usuarios")



exports.mostrarPerfilUsuario = async (req,res,next)=>{
    const consultas = []
    consultas.push(Usuarios.findByPk(req.params.id, {attributes: ["nombre", "imagen","descripcion"]}))
    consultas.push(Grupos.findAll({where:{usuarioId: req.params.id}}))

    const [perfil,grupos] = await Promise.all(consultas)
    
    if(!perfil){
        req.flash("error", "Usuario no existe")
        res.redirect("/administracion")
        return next()
    }

    res.render("frontend/mostrarPerfil",{
        pagina: `Perfil Usuario: ${perfil.nombre}`,
        perfil,
        grupos
    })
    
}