const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require("body-parser")
const flash = require("connect-flash")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const expressValidator = require("express-validator")
const passport = require("./config/passport.js")

//Configuracion y Modelos BD
const db = require("./config/db")
    require("./models/Meetis")
    require("./models/Usuarios")
    require("./models/Categorias")
    require("./models/Grupos")
    require("./models/Comentarios")
        

    db.sync().then(() => console.log("DB Conectada")).catch((error) => console.log(error))
//Variables de desarrollo
const router = require("./router");
const { pass } = require("./config/email.js");
    require("dotenv").config({path:"variables.env"})




//Aplicacion principal
const app = express();

//Body parser, leer formularios
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//Express validator
app.use(expressValidator())


//Habilitar EJS Como template engine
app.use(expressLayouts)
app.set("view engine", "ejs");

//Ubicaciones de vistas
app.set("views", path.join(__dirname,"./views"))

//Archivos staticos
app.use(express.static("public"));

//Habilitar cookie parser
app.use(cookieParser())

//crear la session
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}))

//inicializar passport
app.use(passport.initialize())
app.use(passport.session())

//Habilitar flash messages
app.use(flash())

//Middleware (usuario logueado, flash messages, fecha actual)
app.use((req,  res, next)=>{
    res.locals.usuario = {...req.user} || null
    res.locals.mensajes = req.flash()
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
})

//Routing
app.use("/",router());

//Leer host y puerto
const host = process.env.HOST || "0.0.0.0"
const port = process.env.PORT || 8000
//Agrega el puerto
app.listen(port,host, ()=>{
    console.log("Servidor funcionando")
})


