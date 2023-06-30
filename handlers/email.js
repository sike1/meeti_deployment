const nodemailer = require("nodemailer")
const emailConfig = require("../config/email.js")
const fs = require("fs")
const util = require("util")
const ejs = require("ejs")
const email = require("../config/email.js")


let transport = nodemailer.createTransport({
    host : emailConfig.host,
    port: emailConfig.port,
    auth:{
        user: emailConfig.user,
        pass: emailConfig.pass
    }
})

exports.enviarEmail = async (opciones)=>{
    console.log(opciones)

    //Leer archivo para el email
    const archivo = __dirname + `/../views/emails/${opciones.archivo}.ejs`

    //compilarlo
    const compilado = ejs.compile(fs.readFileSync(archivo, "utf-8"))

    //Crear el html
    const html = compilado({url: opciones.url})

    //configurar las opciones de email
    const opcinesEmail = {
        from: "Meeti <noreply@meeti.com",
        to: opciones.usuario.email,
        subject: opciones.subject,
        html
    }

    //Enviar email
    const sendEmail = util.promisify(transport.sendMail, transport)
    return sendEmail.call(transport, opcinesEmail)
}

