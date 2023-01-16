"use strict";

class DAOAvisos {
    constructor(pool) {
        this.pool = pool;
    }

    // __________ GENERALES __________

    //FIX DAORes linkAvisoUsuario
    createAviso(aviso, idUsuario,callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }else{
                connection.query("INSERT INTO UCM_AW_CAU_AVI_Avisos (Tipo, TipoOp, TipoOpE, Observaciones, Fecha, Resuelto) VALUES (?,?,?,?,?,?)",
                [aviso.Tipo, aviso.TipoOp, aviso.TipoOpE, aviso.Observaciones, aviso.Fecha, aviso.Resuelto],
                function(err, rows){
                    connection.release();
                    if(err){
                        callback(new ErrorEvent("Error de acceso a la base de datos"));
                    }else{
                        callback(rows.insertId);
                    }
                });
            }
        });
    }
   
    deleteAviso(idAviso, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }else{
                connection.query("UPDATE UCM_AW_CAU_AVI_Avisos AVI SET AVI.Eliminado = ? WHERE AVI.Id = ?",
                [1, idAviso],
                function(err){
                    connection.release();
                    if(err) callback(new Error("Error de acceso a la base de datos"));
                    else callback(null);
                });
            }
        });
    }

    solveAviso(idAviso, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }else{
                connection.query("UPDATE UCM_AW_CAU_AVI_Avisos AVI SET AVI.Resuelto = ? WHERE AVI.Id = ?",
                [1, idAviso],
                function(err){
                    connection.release();
                    if(err) callback(new Error("Error de acceso a la base de datos"));
                    else callback(null);
                });
            }
        });
    }
    // FIX
    readAllAvisosUsuarioByObservacion(idUsuario, text, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT * FROM UCM_AW_CAU_AVI_Avisos AVI WHERE AVI.Observaciones LIKE ? AND AVI.usu_id = ? ORDER BY Fecha ASC",
                [text, idUsuario],
                function(err, rows){
                    if(err){
                        callback(new ErrorEvent("Error de acceso a la base de datos"));
                    }else{
                        callback(null, rows);
                    }
                });
            }
        });
    }

    // __________ MIS AVISOS __________

    // - - - - TÉCNICO - - - -

    readAllAssignedNotSolvedAvisos(idTecnico, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"))
            }else{
                connection.query("SELECT * FROM UCM_AW_CAU_AVI_Avisos AVI INNER JOIN UCM_AW_CAU_RES_Respuestas RES ON AVI.id = RES.idAviso WHERE RES.idTecnico = ? AND AVI.Resuelto = ? AND AVI.Eliminado = ? ORDER BY AVI.Fecha ASC",
                [idTecnico, 0, 0],
                function(err, rows){
                    connection.release();
                    if(err) callback(new Error("Error de acceso a la base de datos"));
                    else callback(null,rows);
                });
            }

        });
    }

    // - - - - USUARIO - - - -

    readAllNotSolvedYetAvisos(idUsuario, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }else{
                connection.query("SELECT * FROM UCM_AW_CAU_AVI_Avisos AVI INNER JOIN UCM_AW_CAU_RES_Respuestas RES ON AVI.Id = RES.idAviso LEFT JOIN UCM_AW_CAU_USU_Usuarios USU ON RES.idTecnico = USU.Id WHERE RES.idUsuario = ? AND AVI.Resuelto = ? ORDER BY AVI.Fecha ASC",
                [idUsuario, 0],
                function(err, rows){
                    console.log("HOLAAA STEVEN");
                    console.log(rows);
                    connection.release();
                    if(err) callback(new Error("Error de acceso a la base de datos"));
                    else callback(null, rows);
                });
            }

        });
    }

    // __________ AVISOS ENTRANTES __________

    readAllIncomingAvisos(callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }else{
                connection.query("SELECT * FROM UCM_AW_CAU_AVI_Avisos AVI INNER JOIN UCM_AW_CAU_RES_Respuestas RES ON AVI.Id = RES.idAviso WHERE AVI.Resuelto = ?",
                [0],
                function(err, rows){
                    connection.release();
                    if(err) callback(new Error("Error de acceso a la base de datos"));
                    else callback(null, rows);
                });
            }

        });
    }
    // __________ HISTÓRICO DE AVISOS __________


    // - - - - USUARIO - - - -

    readAllPostedSolvedAvisosByUsuario(idUsuario, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }else{
                connection.query("SELECT * FROM UCM_AW_CAU_AVI_Avisos AVI INNER JOIN UCM_AW_CAU_RES_Respuestas RES ON AVI.id = RES.idAviso WHERE RES.idUsuario = ? AND AVI.Resuelto = ? ORDER BY AVI.Fecha ASC",
                [idUsuario, 1],
                function(err, rows){
                    connection.release();
                    if(err) callback(new Error("Error de acceso a la base de datos"));
                    else callback(null, rows);
                });
            }
        });
    }

    // - - - - TÉCNICO - - - -

    readAllAssignedSolvedAvisosByTecnico(idTecnico, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new ErrorEvent("Error de conexión a la base de datos"));
            }else{
                connection.query("SELECT * FROM UCM_AW_CAU_AVI_Avisos AVI INNER JOIN UCM_AW_CAU_RES_Respuestas RES ON AVI.id = RES.idAviso WHERE RES.idTecnico = ? AND AVI.Resuelto = ? ORDER BY AVI.Fecha ASC",
                [idTecnico, 1],
                function(err, rows){
                    connection.release();
                    if(err) callback(new Error("Error de acceso a la base de datos"));
                    else callback(null, rows);
                });
            }
        }); 
    }
}

module.exports = DAOAvisos;