"use strict";

class DAORespuestas {
    constructor(pool) {
        this.pool = pool;
    }

    assignTecnico(idAviso, idTecnico, callback){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }else{
                connection.query("UPDATE UCM_AW_CAU_RES_Respuestas RES SET RES.idTecnico = ? WHERE RES.idAviso = ?",
                [idTecnico, idAviso],
                function(err, rows){
                    connection.release();
                    if(err) callback(new Error("Error de acceso a la base de datos"));
                    else callback(null);
                });
            }
        });
    }
    
    linkAvisoUsuario(idAviso, idUsuario, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }else{
                connection.query("INSERT INTO UCM_AW_CAU_RES_Respuestas (idAviso, idUsuario) VALUES (?,?)",
                [idAviso, idUsuario],
                function(err){
                    connection.release();
                    if(err) callback(new Error("Error de acceso a la base de datos"));
                    else{
                        callback(null);
                    }
                });
            }
        });
    }

    addRespuesta(idAviso, respuesta, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }else{
                connection.query("UPDATE UCM_AW_CAU_RES_Respuestas RES SET RES.Respuesta = ? WHERE RES.idAviso = ?",
                [respuesta, idAviso],
                function(err){
                    connection.release();
                    if(err) callback(new Error("Error de acceso a la base de datos"));
                    else{
                        callback(null);
                    }
                });
            }
        });
    }

    getRespuesta(idAviso, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }else{
                connection.query("SELECT Respuesta FROM UCM_AW_CAU_RES_Respuesta RES WHERE RES.idAviso = ?",
                [idAviso],
                function(err, rows){
                    connection.release();
                    if(err) callback(new Error("Error de acceso a la base de datos"));
                    else callback(null, rows[0].Respuesta);
                });
            }
        });
    }
}

module.exports = DAORespuestas;