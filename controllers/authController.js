const passport = require("passport")

exports.autenticarUsuario = passport.authenticate("local",{
    successRedirect: "/administracion",
    failureRedirect: "/iniciarSesion",
    failureFlash: true,
    badRequestMessage: "Ambos campos son obligatorios"
})


//revisa si el usuario esta autenticado
exports.usuarioAutenticado = (req,res,next)=>{

    //si esta autenticado
    if(req.isAuthenticated()){
        return next()
    }

    //si no esta autenticado
    return res.redirect("/iniciarSesion")
   
}
//cerrar Sesion
exports.cerrarSesion = (req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("exito","Cerraste sesion correctamente")
        res.redirect("/iniciarSesion")
         return next()
      });
    

}
