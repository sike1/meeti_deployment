const multer = require("multer")
const Categorias = require("../models/Categorias")
const Grupos = require("../models/Grupos")
const shortid = require("shortid")
const fs = require("fs")


const configuracionMulter ={
    limits : { fileSize : 300000},
    storage: fileStorage = multer.diskStorage({
        destination:(req,file,next)=>{
            next(null,__dirname+"/../public/uploads/grupos/")
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
exports.subirImagen = (req, res, next)=>{

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





exports.fromNuevoGrupo = async (req, res)=>{

    const categorias = await Categorias.findAll()

    res.render("nuevoGrupo",{
        pagina: "Crea nuevo Grupo",
        categorias,
    })

}


exports.crearGrupos = async (req, res)=>{
    //sanitizar
    req.sanitizeBody("nombre")
    req.sanitizeBody("url")

    const grupo = req.body
    //almacenar el creador del grupo
    grupo.usuarioId = req.user.id;

    //leer imagen
    if(req.file){
        grupo.imagen = req.file.filename
    }

    try {
        //almcenar grupo
        await Grupos.create(grupo)
        req.flash("exito", "Se ha creado el grupo correctamente ")
        res.redirect("/administracion")
        
    } catch (error) {
        console.log(error)
         // extraer el message de los errores
         const erroresSequelize = error.errors.map(err => err.message);
        req.flash("error", erroresSequelize)
        res.redirect("/nuevoGrupo")
    }
}


exports.fromEditarGrupo = async (req,res)=>{
    const consultas = []
    consultas.push(Grupos.findByPk(req.params.id))
    consultas.push(Categorias.findAll())

    //promise con await
     const [grupo,categorias] = await Promise.all(consultas)


    if(grupo.usuarioId != req.user.id){
        res.redirect("/administracion")
        return
    }
    
    res.render("editarGrupo",{
        pagina: `Editar Grupo: ${grupo.nombre}`,
        grupo,
        categorias,
        })

}
//guardar cambios
exports.editarGrupo = async(req, res, next)=>{
    const grupo = await Grupos.findOne({where: {id:req.params.id, usuarioId : req.user.id }})
    //Si no existe el grupo o no es el dueño
    if(!grupo){
        req.flash("error","Operacion no valida")
        res.redirect("/administracios")
        return next()
    }

    const {nombre, descripcion, categoriaId,url}= req.body

    grupo.nombre= nombre
    grupo.descripcion = descripcion
    grupo.categoriaId = categoriaId
    grupo.url = url

    //Guardar en bd
    await grupo.save()
    req.flash("exito","Cambios Almacenados correctamente")
    res.redirect("/administracion")

}

exports.formEditarImagen = async (req,res)=>{
    const grupo = await Grupos.findOne({where: {id:req.params.id, usuarioId : req.user.id }})

    res.render("editarImagen",{
        pagina: `Editar Imagen: ${grupo.nombre} `,
        grupo
    })
}

//Modifica la imagen y elimina la enterior
exports.editarImagen = async (req,res,next)=>{
    const grupo = await Grupos.findOne({where: {id:req.params.id, usuarioId : req.user.id }})
    

    if(!grupo){
        req.flash("error","Operacion no valida")
        res.redirect("/iniciarSesion")
        return next()
    }

    //Si exite imgaen previa la eliminamos
    if(req.file && grupo.imagen){
        const imagenAnteriorPath = __dirname +`/../public/uploads/grupos/${grupo.imagen}`
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
        grupo.imagen = req.file.filename
    }

    //Guardar en la base de datos
    await grupo.save()
    req.flash("exito","Imagen guardada correctamente")
    res.redirect("/administracion")
}


exports.formEliminarGrupo = async (req,res)=>{
    const grupo = await Grupos.findOne({where: {id:req.params.id, usuarioId : req.user.id }})

    if(!grupo){
        req.flash("error","Operacion no valida")
        res.redirect("/administracion")
        return next()
    }

    res.render("eliminarGrupo",{
        pagina: `Eliminar Grupo: ${grupo.nombre}`,
    })
    
   
}
//elimina grupo e imagen
exports.eliminarGrupo= async (req,res,next)=>{
    const grupo = await Grupos.findOne({where: {id:req.params.id, usuarioId : req.user.id }})
    
    if(!grupo){
        req.flash("error","Operacion no valida")
        res.redirect("/administracion")
        return next()
    }
    //eliminar archivo cn fs
     if(grupo.imagen){
        const imagenPath = __dirname +`/../public/uploads/grupos/${grupo.imagen}`
        fs.unlink(imagenPath, (error)=> {
            if(error){
                console.log(error)
            }
            return
        })
    }
    
    await grupo.destroy()
    
     //redireccionar
     req.flash("exito", "Grupo eliminado")
     res.redirect('/administracion')
}