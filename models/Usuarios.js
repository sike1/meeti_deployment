const Sequelize = require("sequelize")
const db = require("../config/db.js")
const bcrypt = require("bcrypt-nodejs")


const Usuarios = db.define("usuarios",{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    nombre: Sequelize.STRING(60),
    imagen: Sequelize.STRING(60),
    descripcion: Sequelize.TEXT,
    email:{
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
        validate:{
            isEmail:{msg:"Introduce un email valido"},
            isUnique: function(value, next){
                var self = this;
                Usuarios.findOne({where: {email: value}}).then(function(usuario){
                    if(usuario && self.id != usuario.id){
                        return next("El Usuario ya existe")
                    }
                    return next()
                })
                .catch(function(err){
                    return next(err)
                })
            }
        },
        
    },
    password:{
        type: Sequelize.STRING(60),
        allowNull:true,
        validate:{
            notEmpty:{
                msg: "La contraseña no puede ir vacia"
            }
        }
    },
    activo:{
        type: Sequelize.INTEGER,
        defaultValue:0
    },
    tokenPassword: Sequelize.STRING,
    expiraToken: Sequelize.DATE
}, {
    hooks:{
        beforeCreate(usuario){
            usuario.password = Usuarios.prototype.hashPassword(usuario.password)
        }
    }
})


//Metodo para comparar los password
Usuarios.prototype.validarPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}


Usuarios.prototype.hashPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null)
}

module.exports = Usuarios