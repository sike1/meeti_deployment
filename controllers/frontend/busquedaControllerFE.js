const Grupos = require("../../models/Grupos")
const Meetis = require("../../models/Meetis")
const Usuarios = require("../../models/Usuarios")
const  Sequelize = require("sequelize")
const moment = require("moment")

const Op = Sequelize.Op;


exports.resultadosBusqueda = async (req, res)=>{
    const { categoria, titulo, ciudad, pais} = req.query
    
   
    //filtrar meeti 
    let meetis
    if(categoria === " "){
        meetis = await Meetis.findAll({
            where : {
                titulo : { [Op.iLike]: '%'+ titulo +'%'},
                ciudad : { [Op.iLike]: '%'+ ciudad +'%'},
                pais : { [Op.iLike]: '%'+ pais +'%'},
            },
            include:[
                {
                    model: Grupos
                },
                {
                    model: Usuarios,
                    attributes: ["id","nombre","imagen"]
                }
            ] 
        })

    } else {
        meetis = await Meetis.findAll({
            where : {
                titulo : { [Op.iLike]: '%'+ titulo +'%'},
                ciudad : { [Op.iLike]: '%'+ ciudad +'%'},
                pais : { [Op.iLike]: '%'+ pais +'%'},
            },
            include:[
                {
                    model: Grupos,
                    where : {
                        categoriaId : { [Op.eq] : categoria  },
                    }
                },
                {
                    model: Usuarios,
                    attributes: ["id","nombre","imagen"]
                }
            ] 
        })
    }
    


    //pasar resultados a la vista

    
    res.render("frontend/busqueda",{
        pagina: "Resualtado Búsqueda",
        meetis,
        moment
    })

}