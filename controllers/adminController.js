const  Sequelize = require("sequelize")
const Grupos = require("../models/Grupos")
const Meetis = require("../models/Meetis")
const moment = require("moment")
const Op = Sequelize.Op;



exports.panelAdministracion = async (req,res)=>{

    const consultas = []
    consultas.push(Grupos.findAll({where:{usuarioId: req.user.id}}))
    consultas.push(Meetis.findAll({where:{usuarioId: req.user.id,
                                          fecha:{[Op.gte]: moment(new Date()).format("YYYY-MM-DD")}  
                                         },
                                   order:[["fecha","ASC"]],
    }))
    consultas.push(Meetis.findAll({where: {usuarioId: req.user.id,
                                          fecha:{[Op.lt]: moment(new Date()).format("YYYY-MM-DD")}  
    }}))


    //array distructuring
    const [grupos,meetis,meetisAnt] = await Promise.all(consultas)
    
    res.render("administracion",{
        pagina: "Panel de administracion",
        grupos,
        meetis,
        moment,
        meetisAnt
    })
}

