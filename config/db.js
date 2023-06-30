const Sequalize = require("sequelize")
require("dotenv").config({path:"variables.env"})



module.exports = new Sequalize(process.env.BD_NOMBRE, process.env.DB_USER, process.env.DB_PASS,{
    host : process.env.BD_HOST,
    port: process.env.BD_PORT,
    dialect: "postgres",
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    },
    logging:false,
    //define:{
      //  timestamps:false
    //}
})