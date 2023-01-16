"use strict";


const config =require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const DAORespuestas = require('../DAORespuestas');
const respuestas = new DAORespuestas(pool);
const moment = require('moment');
const fecha = moment();

//Validar
const { check, validationResult } = require("express-validator");

class controllerR{
   
    anadirRespuesta(req, res, next){
        respuestas.addRespuesta(req.params.id, req.body.delResp, cb_addRespuesta);
        function cb_addRespuesta(err){
            if(err) res.status(500);
            else{
                next();
            }
        }
    }

    asignarTecnico(req, res, next){
        respuestas.assignTecnico(req.params.id, req.body.selectTec, cb_assingTec);
        function cb_assingTec(err){
            if(err){
                res.status(500);
            }else{
                next();
            }
        }
    }
  
}

module.exports = controllerR;