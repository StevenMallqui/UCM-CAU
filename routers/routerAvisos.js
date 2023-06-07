"use strict";
const express = require("express");
const routerAvisos = express.Router();

const multer = require("multer");
const controllerU = require("../controller/controllerU");
const cU = new controllerU;
const controllerA = require("../controller/controllerA");
const cA = new controllerA();
const controllerR = require("../controller/controllerR");
const cR = new controllerR();
const multerFactory = multer({ storage: multer.memoryStorage() });

//Validar
const { check, validationResult } = require("express-validator"); // https://www.youtube.com/watch?v=hBETsBY3Hlg


routerAvisos.get("/avisosEntrantes",
                cU.usuarioLogged,
                cU.getAllTecnicos,
                cA.avisosEntrantes);

routerAvisos.get("/misAvisos",
                cU.usuarioLogged,
                cA.misAvisos);

routerAvisos.get("/miHistorico",
                cU.usuarioLogged,
                cA.miHistorico);

routerAvisos.post("/eliminarAviso/:id",
                cU.usuarioLogged,
                cA.deleteAviso,
                cA.misAvisos)

routerAvisos.post("/eliminarAvisoEntrante/:id",
                cU.usuarioLogged,
                cR.anadirRespuesta,
                cA.deleteAviso,
                cU.getAllTecnicos,
                cA.avisosEntrantes);

routerAvisos.post("/resolverAviso/:id",
                cU.usuarioLogged,
                cA.resolverAviso,
                cA.misAvisos);

routerAvisos.post("/avisosPorObservacion",
                cU.usuarioLogged,
                cA.getAvisosByObservacion);

routerAvisos.post("/buscar",
                cU.usuarioLogged,
                cA.getAvisosTecnicoByObservacion,
                cU.getUsuariosByName);

routerAvisos.post("/crearAvisos",
                cU.usuarioLogged,
                cA.createAviso);
            
routerAvisos.post("/DeleteAviso/:id",
                cU.usuarioLogged,
                cA.deleteAviso);


routerAvisos.post("/asignarTecnico/:id",
                cU.usuarioLogged,
                cR.asignarTecnico,
                cU.getAllTecnicos,
                cA.avisosEntrantes);

module.exports = routerAvisos;