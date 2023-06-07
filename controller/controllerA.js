"use strict";


const config =require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const DAOAvisos = require('../DAOAvisos');
const avisos = new DAOAvisos(pool);
const moment = require('moment');
const fecha = moment();

//Validar
const { check, validationResult } = require("express-validator");

class controllerA{
   
    avisosEntrantes(req, res){
        avisos.readAllIncomingAvisos(cb_allAvisos);
        function cb_allAvisos(err, rows){
            if(err){
                res.status(500);
                res.end("Not found");
            }else{
                if(rows){
                    console.log(rows);
                    res.render("avisosEntrantes", {
                        consult: "AVISOS ENTRANTES",
                        nameUser: req.session.userName,
                        imageUser: req.session.mailID, 
                        tipoUsuario: req.session.tipoUsuario,
                        perfil: req.session.perfil,
                        listaAvisos: rows,
                        tecnicos: req.tecnicos,
                    });
                }
            }
        }
    }

    misAvisos(req, res){

        if(req.session.rol === "Usuario"){
            avisos.readAllNotSolvedYetAvisos(req.session.userId, cb_avisosById);
            function cb_avisosById(err, rows){
                if(err){
                    res.status(500);
                    res.end("Not found");
                }else{
                    if(rows){
                        res.render("misAvisos", {
                            consult : "MIS AVISOS",
                            nameUser: req.session.userName,
                            imageUser: req.session.mailID, 
                            rol: req.session.rol,
                            perfil: req.session.perfil,
                            listaAvisos: rows,
                        });
                    }
                }
            }
        }else{
            avisos.readAllAssignedNotSolvedAvisos(req.session.userId,cb_rAANSAvisos);
            function cb_rAANSAvisos(err, rows){
                if(err){
                    res.status(500);
                    res.end("Not found");
                }else{
                    if(rows){
                        res.render("misAvisos", {
                            consult : "MIS AVISOS ASIGNADOS",
                            nameUser: req.session.userName,
                            imageUser: req.session.mailID, 
                            rol: req.session.rol,
                            perfil: req.session.perfil,
                            listaAvisos: rows,
                        });
                    }
                }
            }
        }
    }

    resolverAviso(req, res, next){
        avisos.solveAviso(req.params.id, cb_solveAviso);
        function cb_solveAviso(err){
            if(err) res.status(500);
            else{
                next();
            }
        }
    }

    miHistorico(req, res){

        if(req.session.rol === "Usuario"){
            avisos.readAllPostedSolvedAvisosByUsuario(req.session.userId, cb_avisosByResuelto);
            function cb_avisosByResuelto(err, rows){
                if(err){
                    res.status(500);
                    res.end("Not found");
                }else{
                    if(rows){
                        console.log(rows);
                        res.render("miHistorico", {
                            consult : "HISTÓRICO",
                            nameUser: req.session.userName,
                            imageUser: req.session.mailID, 
                            rol: req.session.rol,
                            perfil: req.session.perfil,
                            listaAvisos: rows,
                        });
                    }
                }
            }
        }else{
            avisos.readAllAssignedSolvedAvisosByTecnico(req.session.userId, cb_avisosByResuelto);
            function cb_avisosByResuelto(err, rows){
                if(err){
                    res.status(500);
                    res.end("Not found");
                }else{
                    if(rows){
                        console.log(rows);
                        res.render("miHistorico", {
                            consult : "HISTORICO",
                            nameUser: req.session.userName,
                            imageUser: req.session.mailID, 
                            rol: req.session.rol,
                            perfil: req.session.perfil,
                            listaAvisos: rows,
                        });
                    }
                }
            }
        }
    }

    getAvisosByObservacion(req, res){
        if(req.body.byText===""){
            res.render("misAvisos", {
                consult: "CONTENIDO A BUSCAR VACIO",
                nameUser: req.session.userName,
                imageUser: req.session.mailID, 
                tipoUsuario: req.session.tipoUsuario,
                perfil: req.session.perfil,
                listaAvisos: null,
            });
        } 
        else{
            avisos.readAllAvisosUsuarioByObservacion(req.session.idU,"%"+req.body.byText+"%", cb_avisosPorObservacion);

            function cb_avisosPorObservacion(err, rows){
                if(err){
                    res.status(500);
                    res.end("Not found");
                }
                else{
                    if(rows){
                        //console.log("USUARIO SESSION "+ request.session.mailID);
                        res.render("misAvisos", {
                            consult: "AVISOS ENCONTRADOS PARA: " + req.body.byText,
                            nameUser: req.session.userName,
                            imageUser: req.session.mailID, 
                            tipoUsuario: req.session.tipoUsuario,
                            perfil: req.session.perfil,
                            listaAvisos: rows,
                        });
                    }
                }
            }
        }
    }


    getAvisosTecnicoByObservacion(req, res, next){

        if(Boolean(req.body.userCheck)){
            next();
        }else{
            if(req.body.byText===""){
                res.render("misAvisos", {
                    consult: "CONTENIDO A BUSCAR VACIO",
                    nameUser: req.session.userName,
                    imageUser: req.session.mailID, 
                    tipoUsuario: req.session.tipoUsuario,
                    perfil: req.session.perfil,
                    listaAvisos: null,
                });
            } 
            else{
                avisos.readAllAvisosTecnicoByObservacion(req.session.idU,"%"+req.body.byText+"%", cb_avisosPorObservacion);
    
                function cb_avisosPorObservacion(err, rows){
                    if(err){
                        res.status(500);
                        res.end("Not found");
                    }
                    else{
                        if(rows){
                            //console.log("USUARIO SESSION "+ request.session.mailID);
                            res.render("misAvisos", {
                                consult: "AVISOS ENCONTRADOS PARA: " + req.body.byText,
                                nameUser: req.session.userName,
                                imageUser: req.session.mailID, 
                                tipoUsuario: req.session.tipoUsuario,
                                perfil: req.session.perfil,
                                listaAvisos: rows,
                            });
                        }
                    }
                }
            }
        }

    }

    createAviso(req, res){
        let aviso = {
            Tipo: req.body.Tipo,
            TipoOp: req.body.Opcion,
            TipoOpE: req.body.OpcionE,
            Observaciones: req.body.byText,
            Fecha: fecha.format('YYYY-MM-DD'),
            usu_id: req.session.idU,
            Resuelto: 0
        };

        avisos.createAviso(aviso, cb_newaviso);
        function cb_newaviso(err){
            if(err){
                res.status(500);
            }else{
                res.redirect("/avisos/misAvisos");
            }

        }
    }

    deleteAviso(req, res, next){
        avisos.deleteAviso(req.params.id, cb_borrarAviso);
        function cb_borrarAviso(err){
            if(err){
                res.status(500);
            }else{
                next();
            }
        }
    }
}

module.exports = controllerA;