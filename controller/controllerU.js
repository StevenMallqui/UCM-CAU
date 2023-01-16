"use strict";

const path = require("path");
const fs = require("fs");
const config =require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const DAOUsuarios = require('../DAOUsuarios');
const users =new DAOUsuarios(pool);
const moment = require('moment');
const fecha = moment();

//Validar
const { check, validationResult } = require("express-validator");

class controllerU{

    usuarioLogged(req, res, next) {
        if (req.session.mailID !== undefined && req.session.userName !== undefined ) {
            res.locals.userEmail = req.session.currentUser;
            res.locals.userName = req.session.currentName;
            
            next();
        } else {
            res.redirect("/login");
        }
    }

    login(req, res){
        users.readUsuario(req.body.email, req.body.password, cb_isUser);
        
        function cb_isUser(err, rows){
            if (err) {
               
                res.status(500);
                res.render("login", {  
                        msgRegistro: "Credenciales no válidos", 
                        tipoAlert: "alert-danger"});
            } 
            else {         
                if(!rows[0].NombreMostrar){
                    res.status(200);
                    res.render("login", {       msgRegistro: "Error en usuario o contraseña", 
                                                tipoAlert: "alert-danger"});
                }
                else{

                    req.session.mailID = req.body.email;
                    req.session.userName = rows[0].NombreMostrar;
                    req.session.rol = rows[0].Rol;
                    req.session.perfil = rows[0].Perfil;
                    req.session.userId = rows[0].Id;

                    res.locals.mailID = req.session.mailID;
                    res.locals.userName = req.session.userName;
                    res.locals.rol = req.session.rol;
                    res.locals.userId = req.session.userId;
                    res.locals.perfil = req.session.perfil;
                    
                    res.render("main", {
                        nameUser: req.session.userName,
                        imageUser: req.session.mailID, 
                        Rol: req.session.rol,
                        perfil: req.session.perfil,
                        listaAvisos: null,
                    });
                }
            }
        }
    }

    logout(req, res){
        res.status(200);
        req.session.destroy();
        res.redirect("/login");
    }

    getImage(req, res) {
        console.log("AQUIIII")
        users.getUserImage(req.params.id, function(err, imagen) {
            if(err){
                res.status(500);
            }
            else{
                if (imagen) { 
                    res.end(imagen);
                } else {
                    //ASIGNAR UNA POR DEFECTO!!
                    res.status(404);
                    res.end("Not found");
                }
            }
        });
    }

    createUsuario(req, res)  {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
    
                let usuario = {
                    nombre: req.body.nombre,
                    apellido1: req.body.apellido1,
                    apellido2: req.body.apellido2,
                    correo: req.body.correo,
                    contrasena: req.body.password,
                    nombreMostrar: req.body.nombreMostrar,
                    perfil: req.body.perfil,
                    rol: req.body.tecnico ? "Técnico" : "Usuario",
                    img: null,
                    Fecha: fecha.format('YYYY-MM-DD'),
                    numeroE: req.body.numeroE === "" ? null : req.body.numeroE,
                };

                if (req.file) usuario.img= req.file.buffer;
                else{
                    const buffer = fs.readFileSync("./public/img/NoPerfil.png");
                    usuario.img = buffer;
                } 

                users.createUsuario(usuario, cb_insert);
                function cb_insert(err){
                    if (err) {
                        res.status(500);
                        res.render("register", {   errores: errors.mapped(), 
                                                        msgRegistro: true});
                    } 
                    else {
                        res.render("login", {  msgRegistro: "¡Registro completado! Puede Logearse "+usuario.nombreMostrar, 
                                                    tipoAlert: "alert-success"});
                    }
                }
            
        } 
        else {
            console.log(errors);
            res.render("register", {
                errores: errors.mapped(), 
                msgRegistro: false});
        }
    }

    getAllTecnicos(req, res, next){
        users.readAllTecnicos(cb_allTecnicos);
        function cb_allTecnicos(err, rows){
            if(err){
                res.status(500);
                res.end("Not found");
            }else{
                req.tecnicos = rows;
                next();
            }

        }
    }

    getUsuariosByName(req, res){
        if(req.body.byText===""){
            res.render("usuarios", {
                consult: "CONTENIDO A BUSCAR VACIO",
                nameUser: req.session.userName,
                imageUser: req.session.mailID, 
                tipoUsuario: req.session.tipoUsuario,
                perfil: req.session.perfil,
                usuarios: null,
            });
        } 
        else{
            users.readUsuarioByName(req.body.byText, cb_usersByName);

            function cb_usersByName(err, rows){
                if(err){
                    res.status(500);
                    res.end("Not found");
                }
                else{
                    if(rows){
                        res.render("usuarios", {
                            consult: "USUARIOS ENCONTRADOS PARA: " + req.body.byText,
                            nameUser: req.session.userName,
                            imageUser: req.session.mailID, 
                            tipoUsuario: req.session.tipoUsuario,
                            perfil: req.session.perfil,
                            usuarios: rows,
                        });
                    }
                }
            }
        }
    }
}

module.exports = controllerU;