"use strict";

const path = require("path");
const express = require("express");
const routerUsuarios = express.Router();
const controllerU = require("../controller/controllerU");
const cU = new controllerU();
const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage()});

//Validar
const { check, validationResult } = require("express-validator"); // https://www.youtube.com/watch?v=hBETsBY3Hlg

routerUsuarios.post("/login", 
                multerFactory.none(), 
                cU.login);


//- - - - - - - - - - - CERRAR SESIÓN  - - - - - - - - - - -

routerUsuarios.get('/logout', 
                cU.usuarioLogged, 
                cU.logout);

//- - - - - - - - - - - IMAGEN USUARIO  - - - - - - - - - - -

routerUsuarios.get("/imagen/:id",  
                cU.usuarioLogged, 
                cU.getImage);

//- - - - - - - - - - - CREAR USUARIO  - - - - - - - - - - -

routerUsuarios.post("/registro",
    multerFactory.single("imagen"),
    check("correo","La dirección de correo debe pertenecer a la universidad, p.e. usuario@ucm.es").matches(/^[a-zA-Z0-9._-]+@ucm.es+$/),
    check("password", "La contraseña debe tener entre 8 y 16 caracteres, que tenga al menos: un dígito, una minúscula, una mayúscula y un carácter no alfanumérico").matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,16}$/),
    check("passwordC").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales');
        }
        return true;
    }),
    check("numeroE","El número de empleado deber seguir el formato de 4 dígitos, un guion y 3 letras minúsculas").optional({checkFalsy: true}).matches(/^\d{4}-[a-z]{3}/),
    

    cU.createUsuario
);

routerUsuarios.get("/gestionUsurios",)


module.exports = routerUsuarios;