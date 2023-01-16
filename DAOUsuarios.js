"use strict";

class DAOUsuarios {
    constructor(pool) {
        this.pool = pool;
    }

    createUsuario(usuario, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"))
            }
            else{
                connection.query("INSERT INTO UCM_AW_CAU_USU_Usuarios(Nombre, Apellido1, Apellido2, Correo, Contrasena, NombreMostrar, Perfil, Rol, Img, Fecha , Activo, NumeroE) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
                [usuario.nombre, usuario.apellido1, usuario.apellido2, usuario.correo, usuario.contrasena, usuario.nombreMostrar, usuario.perfil, usuario.rol, usuario.img, usuario.Fecha, 1, usuario.numeroE],
                function(err, rows){
                    if(err) callback(new Error("Error de acceso a la base de datos"))
                    else callback(null);
                });
            }
        });
    }

    readUsuario(email, password, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT * FROM UCM_AW_CAU_USU_Usuarios USU WHERE USU.Correo = ? AND USU.Contrasena = ?",
                [email, password],
                function(err, rows){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        if(rows.length === 0){
                            callback(new Error("Error el usuario o contraseña no existe"));
                        }
                        else{
                            console.log(rows);
                            callback(null, rows);
                        }
                    }
                })
            }
        });
    }

    getUserImage(email, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT USU.Img FROM UCM_AW_CAU_USU_Usuarios USU WHERE USU.Correo = ?",
                [email],
                function(err, rows){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        if(rows.length === 0){
                            callback(new Error("No existe el usuario"));
                        }
                        else{
                            callback(null, rows[0].Img);
                        }
                    }
                })
            }
        })
    }

    deleteUsuario(email, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("UDATE UCM_AW_CAU_USU_Usuarios SET Activo = ? WHERE email = ?",
                [0, email],
                function(err, rows){
                    connection.release();
                    if(err) callback(new Error("Error de acceso a la base de datos"));
                    else callback(null);
                });
            }
        })
    }

    readUsuarioByName(text, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT * FROM UCM_AW_CAU_USU_Usuarios USU WHERE USU.Nombre = ? OR USU.Apellido1 = ? OR USU.Apellido2 = ?",
                [text, text, text],
                function(err, rows){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        if(rows.length === 0){
                            callback(new Error("No hay usuarios"));
                        }
                        else{
                            callback(null, rows);
                        }
                    }
                })
            }
        });
    }

    readAllTecnicos(callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT * FROM UCM_AW_CAU_USU_Usuarios USU WHERE USU.Rol = ?",
                ["Técnico"],
                function(err, rows){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        if(rows.length === 0){
                            callback(new Error("No hay usuarios"), rows);
                        }
                        else{
                            callback(null, rows);
                        }
                    }
                })
            }
        });
    }
}

module.exports = DAOUsuarios;