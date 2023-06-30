const Categorias = require("../../models/Categorias")
const Grupos = require("../../models/Grupos")
const Meetis = require("../../models/Meetis")
const Usuarios = require("../../models/Usuarios")
const Comentarios = require("../../models/Comentarios")
const moment = require("moment")
const  Sequelize = require("sequelize")

const Op = Sequelize.Op;


exports.mostrarMeeti = async (req,res,next)=>{
    const meeti = await Meetis.findOne({
        where:{
            slug: req.params.slug
        },
        include:[
            {
                model: Grupos,
            },
            {
                model: Usuarios,
                attributes: ["id","nombre","imagen"]
            }
        ]
    })

    


    if(!meeti){
        req.flash("error","Meeti no disponible")
        res.redirect("back")
        return next()
    }

    //consultar meeti's cercanos
    const ubicacion = Sequelize.literal(`ST_GeomFromText( 'POINT( 
        ${meeti.ubicacion.coordinates[0]} ${meeti.ubicacion.coordinates[1]} )' )`);
 
    // ST_DISTANCE_Sphere = Retorna una linea en metros
    const distancia = Sequelize.fn('ST_DistanceSphere', 
        Sequelize.col('ubicacion'), ubicacion);

    // encontrar meeti's cercanos
    const cercanos = await Meetis.findAll({
        order: distancia ,//los ordena de cercano a lejano
        where : Sequelize.where(distancia,{[Op.lte]: 3000}),//2km
        limit: 3,//maximo 3
        offset: 1,
        include:[
            {
                model: Grupos,
            },
            {
                model: Usuarios,
                attributes: ["id","nombre","imagen"]
            }
        ] 
    })

    const comentarios = await Comentarios.findAll({
        where:{
            meetiId: meeti.id
        },
        include:[
            {
                model: Usuarios,
                attributes: ["id","nombre","imagen"]
            }
        ]
})

    res.render("frontend/mostrarMeeti",{
        pagina: meeti.titulo,
        meeti,
        moment,
        comentarios,
        cercanos
    })
}




exports.confirmarAsistancia = async (req,res,next)=>{
    

    const { accion } = req.body

    if(accion === "confirmar"){
        Meetis.update(
            {interesados: Sequelize.fn("array_append",Sequelize.col("interesados"),req.user.id)},
            {where:{slug: req.params.slug}})
             
            //mensaje
            res.send("Has confirmado tu asistencia")
    }else{
        Meetis.update(
            {interesados: Sequelize.fn("array_remove",Sequelize.col("interesados"),req.user.id)},
            {where:{slug: req.params.slug}})
            //mensaje
            res.send("Has cancelado tu asistencia")
    }
}


//muestra listado de asistentes
exports.mostrarAsistentes = async (req, res, next)=>{
    const meeti = await Meetis.findOne({
        where:{
            slug:req.params.slug
            },
            attributes:["interesados","titulo"]
        })
        //extraer interesados

        const {interesados, titulo} = meeti
        const asistentes = await Usuarios.findAll({
            attributes: ["nombre", "imagen"],
            where:{id:interesados}
        })

    res.render("frontend/mostrarAsistentes",{
        pagina: `Asistentes al Meeti: ${titulo}`,
        asistentes
    })
}




exports.motrarCategoria = async (req, res, next)=>{
    const categorias = await Categorias.findOne({
                                                attributes:["id","nombre"],
                                                where:{slug : req.params.slug}})

    const meetis = await Meetis.findAll({
                                        order:[
                                            ["fecha","ASC"],
                                            ["hora","ASC"]
                                        ],
                                        include:[
                                            {
                                                model:Grupos,
                                                where:{categoriaId:categorias.id}
                                            },
                                            {
                                                model: Usuarios
                                            }
                                        ]
    })

    res.render("frontend/categoria",{
        pagina: `Categoria: ${categorias.nombre}`,
        meetis,
        moment
    })
}



