const Grupos = require("../../models/Grupos")
const Meetis = require("../../models/Meetis")
const Usuarios = require("../../models/Usuarios")
const moment = require("moment")
const  Sequelize = require("sequelize")



exports.mostrarGrupo = async (req,res,next)=>{

    consultas =[]
    
    consultas.push(Grupos.findByPk(req.params.id))
    consultas.push(Meetis.findAll({
                                    where:{
                                            grupoId : req.params.id
                                            },
                                    order : [
                                        ["fecha", "ASC"]
                                    ]
                                }))

    const [grupo,meetis] = await Promise.all(consultas)

    if(!grupo){
        req.flash("error","Grupo no disponible")
        res.redirect("back")
        return next()
    }


    res.render("frontend/mostrarGrupo",{
        pagina: `Informacion Grupo: ${grupo.nombre}`,
        grupo,
        meetis,
        moment
    })

    

}