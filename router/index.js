const express = require("express");
const router = express.Router();
const homeContoller = require("../controllers/homeController.js")
const usuarioContoller = require("../controllers/usuariosController.js")
const authController = require("../controllers/authController.js")
const adminController = require("../controllers/adminController.js")
const gruposController = require("../controllers/gruposController.js")
const meetiController = require("../controllers/meetiController.js")
const meetiControllerFE = require("../controllers/frontend/meetiControllerFE.js")
const usuariosControllerFE = require("../controllers/frontend/usuariosControllerFE.js")
const grupoControllerFE = require("../controllers/frontend/grupoControllerFE.js")
const comentariosControllerFE = require("../controllers/frontend/comentariosControllerFE.js")
const busquedaControllerFE = require("../controllers/frontend/busquedaControllerFE.js")





module.exports = function(){
    /**AREA PUBLICA*/
    router.get("/", homeContoller.home)

    //mostrar meeti
    router.get("/meeti/:slug",
    meetiControllerFE.mostrarMeeti    
    )
    //confirmar asistencia
    router.post("/confirmarAsistancia/:slug",
        meetiControllerFE.confirmarAsistancia)

    //mostrar asistentes
    router.get("/asistentes/:slug",
    meetiControllerFE.mostrarAsistentes)

    //mostrar el perfil en el frontend
    router.get("/usuario/:id",
    usuariosControllerFE.mostrarPerfilUsuario)

    //mostrar grupos en el frontend
    router.get("/grupo/:id",
    grupoControllerFE.mostrarGrupo)

    //motrar meetis por categorias
    router.get("/categoria/:slug",
        meetiControllerFE.motrarCategoria    
    )

    //añade la busqueda
    router.get("/busqueda",
        busquedaControllerFE.resultadosBusqueda    
    )

    //Mandar comentarios
    router.post("/meeti/:id",
        comentariosControllerFE.mandarComentario
    )

    //elimina comentarios
    router.post("/eliminarComentario",
        comentariosControllerFE.eliminarComentario
    )



    /**Crear y confirmar cuenta */
    router.get("/crearCuenta", usuarioContoller.formCrearCuenta)
    router.post("/crearCuenta", usuarioContoller.crearCuenta)
    router.get("/confirmarCuenta/:correo", usuarioContoller.confirmarCuenta)

    //Iniciar Sesion
    router.get("/iniciarSesion", usuarioContoller.formIniciarSesion)
    router.post("/iniciarSesion", authController.autenticarUsuario)
    //Cerrar sesion
    router.get("/cerrarSesion", 
    authController.usuarioAutenticado,
    authController.cerrarSesion    
    )


    /**AREA PRIVADA*/

    /**Panel de  administracions*/
    router.get("/administracion",
        authController.usuarioAutenticado,
        adminController.panelAdministracion)


    /**Nuevos Grupos */

    router.get("/nuevoGrupo",
        authController.usuarioAutenticado,
        gruposController.fromNuevoGrupo,
        
    )
    router.post("/nuevoGrupo", 
        authController.usuarioAutenticado,
        gruposController.subirImagen,
        gruposController.crearGrupos)


    //editar Grupo
    router.get("/editarGrupo/:id", 
        authController.usuarioAutenticado,
        gruposController.fromEditarGrupo )
    
    router.post("/editarGrupo/:id",
        authController.usuarioAutenticado,
        gruposController.editarGrupo)

    //editar imagen Grupo

    router.get("/imagenGrupo/:id",
        authController.usuarioAutenticado,
        gruposController.formEditarImagen

    )
    
    router.post("/imagenGrupo/:id",
        authController.usuarioAutenticado,
        gruposController.subirImagen,
        gruposController.editarImagen

    )

    router.get("/eliminarGrupo/:id",
        authController.usuarioAutenticado,
        gruposController.formEliminarGrupo)


    router.post("/eliminarGrupo/:id",
        authController.usuarioAutenticado,
        gruposController.eliminarGrupo
    )

    //Nuevos Meeti
    router.get("/nuevoMeeti",
        authController.usuarioAutenticado,
        meetiController.formNuevoMeeti)

    router.post("/nuevoMeeti", 
        authController.usuarioAutenticado,
        meetiController.sanitizarMeeti,
        meetiController.crearMeeti)

    //editar meeti
    router.get("/editarMeeti/:id",
        authController.usuarioAutenticado,
        meetiController.formEditarMeeti)
    
    router.post("/editarMeeti/:id",
        authController.usuarioAutenticado,
        meetiController.sanitizarMeeti,
        meetiController.editarMeeti)

    //eliminar meeti
    router.get("/eliminarMeeti/:id",
        authController.usuarioAutenticado,
        meetiController.formEliminarMeeti
    )
    router.post("/eliminarMeeti/:id",
        authController.usuarioAutenticado,
        meetiController.eliminarMeeti
    )

    //editar perfil
    router.get("/editarPerfil",
        authController.usuarioAutenticado,
        usuarioContoller.formEditarPerfil)

    router.post("/editarPerfil",
        authController.usuarioAutenticado,
        usuarioContoller.editarPerfil)

    //cambiar password form
    router.get("/cambiarPassword",
        authController.usuarioAutenticado,
        usuarioContoller.fromCambiarPassword)
    
    //moficar password
    router.post("/cambiarPassword",
        authController.usuarioAutenticado,
        usuarioContoller.cambiarPassword)

    //form imagen perfil
    router.get("/imagenPerfil",
        authController.usuarioAutenticado,
        usuarioContoller.fromImagenPerfil)

    router.post("/imagenPerfil",
        authController.usuarioAutenticado,
        usuarioContoller.subirImagenPerfil,
        usuarioContoller.editarImagenperfil
    )


    







    return router
}