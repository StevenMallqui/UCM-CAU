"use strict";

const config = require("./config");
const express = require("express");
const app = express();
app.use(express.json());//Devuelve middleware que solo analiza json y solo mira las solicitudes donde el encabezado Content-Type coincide con la opción de tipo.
app.use(express.urlencoded({extended: true}));//Devuelve middleware que solo analiza cuerpos codificados en URL y solo mira las solicitudes donde el encabezado Content-Type coincide con la opción de tipo

const { check, validationResult } = require("express-validator"); 

//- - - - - - - - - - - SESIÓN  - - - - - - - - - - -

const session = require("express-session");
const sessionMySql = require("express-mysql-session");
const MySQLStore = sessionMySql(session);
const sessionStore = new MySQLStore(config.mysqlConfig);

const middlewareSession = session({
    saveUninitialized: false,
    secret: "avisos22",
    resave: false,
    store: sessionStore 
});

app.use(middlewareSession);

const morgan = require("morgan");
app.use(morgan("dev"));

//- - - - - - - - - - - VISTAS Y USO DEL MOTOR DE PLANTILLAS - - - - - - - - - - -

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


//- - - - - - - - - - - ROUTERS - - - - - - - - - - -

const routerUsuarios = require("./routers/routerUsuarios");
const routerAvisos = require("./routers/routerAvisos");

app.use("/usuarios", routerUsuarios);
app.use("/avisos", routerAvisos);

//- - - - - - - - - - - Archivos estáticos - - - - - - - - - - -

app.use(express.static(path.join(__dirname, "public")));

//- - - - - - - - - - - PAGINA PRINCIPAL - - - - - - - - - - -

app.get("/", (req, res) =>{
    if(req.session.mailID === undefined){
        res.status(200);
        res.render("login", {
            msgRegistro: false,
        });
    }
    else{
        res.render("main", {
            nameUser: req.session.userName,
            imageUser: req.session.image,
            tipoUsuario: req.session.tipoUsuario,
            perfil: req.session.perfil,
            listaAvisos: null,
        });
    }
})

//- - - - - - - - - - - Login --> Registro - - - - - - - - - - -

app.get("/registro", (req, res) => {
    if(req.session.mailID === undefined){
        res.status(200);
        const errors = validationResult(req);
        res.render("register", {
            errores: errors.mapped(),
            msgRegistro: false  
        });
    }
    else{
        res.render("main",{
            nameUser: req.session.userName,
            imageUser: req.session.image,
        });
    }
});

//- - - - - - - - - - - Registro --> Login - - - - - - - - - - -

app.get("/login", (req , res) => {
    if(req.session.mailID === undefined){
        res.status(200);
        res.render("login", {
            msgRegistro: false,
        })
    }
    else{
        res.render("main", {
            nameUser: req.session.userName,
            imageUser: req.session.image,
        });
    }
});

//- - - - - - - - - - - CONEXIÓN CON EL SERVIDOR - - - - - - - - - - -

app.listen(config.port, function(err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});