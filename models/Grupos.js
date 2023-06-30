const Sequelize = require("sequelize")
const db = require("../config/db.js")
const Categorias = require("./Categorias")
const Usuarios = require("./Usuarios.js")


const Grupos = db.define("grupos",{
    id:{
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
    },
    nombre:{
        type: Sequelize.TEXT,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:"El grupo debe tener un nombre"
            }
        }
    },
    descripcion:{
        type: Sequelize.TEXT,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"Añade una descripcion"
            }
        }
    },
    url: Sequelize.TEXT,
    imagen: Sequelize.TEXT
})

Grupos.belongsTo(Categorias)
Grupos.belongsTo(Usuarios)

module.exports = Grupos