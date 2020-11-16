'use strict'

var validator = require('validator');
const fs = require('fs');
const dbConnection = require('./dbConecction');
var moment = require('moment');
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const { promisify } = require ('util');
const path = require ('path');
const configMensaje = require('../controllers/configMensajes');
const { stringify } = require('querystring');
const { request } = require('http');
const productMensaje = require('./productMensaje');
const acceptTransactionMensaje = require('./acceptTransactionMensaje');
const deniedTransactionMensaje = require('./deniedTransactionMensaje');
const ticketMensaje = require('./ticketMensaje');

const tournamentMensaje = require('./tournamentMensaje');
const { RSA_PSS_SALTLEN_MAX_SIGN } = require('constants');
const { now } = require('moment');



require('dotenv').config();

/*var adminModel = require('../models/admin');
const configMensaje = require('../controllers/configMensajes');*/

var controller = {
    
    /**
     * Funcion name:  saveUser
     * Funcionalidad: Guarda un usuario en la base de datos
     * 
     */
    saveUser: async (req, res) => {
        var params = req.body;
        console.log('params');
        try {
            var validate_fullName = !validator.isEmpty(params.full_name);
            var validate_email = !validator.isEmpty(params.email);
            var validate_pass = !validator.isEmpty(params.password);
            var validate_userName = !validator.isEmpty(params.user_name);
            var validate_countryCode = !validator.isEmpty(params.country_code);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos' + err
            });
        }

        if (validate_userName && validate_pass && validate_email && validate_countryCode && validate_fullName) {
            //crear objeto
            
            //var sql = "INSERT INTO users (full_name, country_code, user_type, email, created_at) VALUES ('" + params.full_name + "', '" + params.country_code + "','" + params.user_type + "','" + params.email + "','" + created_at + "')";
            var user ={
                fullName: params.full_name,
                country:params.country_code,
                userType: 'user',
                email:params.email,
                username: params.user_name,
                password: params.password,
            };
            console.log('hi');
            user.password = await bcrypt.hash(params.password, 8);
            dbConnection.query("INSERT INTO users (full_name, country_code, user_type, email) VALUES  ( '" +user.fullName + "', '" + user.country + "', '" + user.userType + "', '" + user.email + "')" ,async (err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on create user' + err
                    });
                }else{
                    dbConnection.query("INSERT INTO login (email,user_name,password,user_id) VALUES ('" + user.email + "', '" + user.username+ "','" + user.password + "',LAST_INSERT_ID())",async (err, result) =>{
                        if(err){
                            return res.status(404).send({
                                status: 'error',
                                message: 'on create login' + err
                            });
                        }else{
                            dbConnection.query("INSERT INTO user_points (user_id, points) VALUES (LAST_INSERT_ID() , 0)", async (err, result) =>{
                                if(err){
                                    return res.status(404).send({
                                        status: 'error',
                                        message: 'on create user_points' + err
                                    });
                                    
                                }else{
                                    return res.status(200).send({
                                        status: 'Ok',
                                        message: 'Usuario Creado'
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {

            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }
    },
     /**
     * Funcion name:  saveAdmin
     * Funcionalidad: Guarda un admin en la base de datos
     * 
     */
    saveAdmin: async (req, res) => {
        var params = req.body;
        try {
            var validate_fullName = !validator.isEmpty(params.full_name);
            var validate_email = !validator.isEmpty(params.email);
            var validate_pass = !validator.isEmpty(params.password);
            var validate_userName = !validator.isEmpty(params.user_name);
            var validate_countryCode = !validator.isEmpty(params.country_code);

        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }

        if (validate_userName && validate_pass && validate_email && validate_countryCode && validate_fullName) {

            //crear objeto
            
            //var sql = "INSERT INTO users (full_name, country_code, user_type, email, created_at) VALUES ('" + params.full_name + "', '" + params.country_code + "','" + params.user_type + "','" + params.email + "','" + created_at + "')";
            var user ={
                fullName: params.full_name,
                country:params.country_code,
                userType:'admin',
                email:params.email,
                username: params.user_name,
                password: params.password,
            };
            user.password = await bcrypt.hash(params.password, 8);
            dbConnection.query("INSERT INTO users (full_name, country_code, user_type, email) VALUES  ( '" +user.fullName + "', '" + user.country + "', '" + user.userType + "', '" + user.email + "')" ,(err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on create user' + err
                    });
                }else{
                    /*dbConnection.end((err,res)=>{
                        if(err){

                        }else{
                            
                        }
                    }); */
                }
            });
            dbConnection.query("INSERT INTO login (email,user_name,password,user_id) VALUES ('" + user.email + "', '" + user.username+ "','" + user.password + "',LAST_INSERT_ID())", (err, result) =>{
                if(err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on create login' + err
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Admin Creado'
                    });
                }
            });
            /*dbConnection.end((err,result)=>{
                if(err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on dbCLose' + err
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Admin Creado'
                    });
                }
            });*/
        } else {

            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }

    },

    /**
     * Funcion name:  login
     * Funcionalidad: permite iniciar sesion y crea un token
     * 
     */
    login:  async (req, res) => {
        var params = req.body;
        this.userComplete={};
        try {
            var validate_email = !validator.isEmpty(params.email);
            var validate_pass = !validator.isEmpty(params.pass);

        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }
        if (validate_email && validate_pass) {
            dbConnection.query("SELECT * FROM login WHERE email = ?", params.email,  async (err, result) => {
                console.log(result.length);
                if(!result){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El usuario no ha sido encontrado o la contraseña es incorrecta'
                    });
                }
                if (result.length === 0) {
                    dbConnection.query("SELECT * FROM login  WHERE user_name = ?", params.email,  async (err, result) => {
                        console.log(result);
                        if (!result.length>0 || !(await bcrypt.compare(params.pass, result[0].password))) {
                            return res.status(401).send({
                                status: 'error',
                                message: 'El usuario no ha sido encontrado o la contraseña es incorrecta'
                            });
                        } else {
                           var id = result[0].user_id;
                         
                            this.userComplete=result[0];
                              /* 
                            let token = jwt.sign({id}, process.env.JWT_SECRET,{
                                expiresIn: process.env.JWT_EXPIRES_IN
                            });
        
                            var cookieOptions = {
                                expires: new Date(
                                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                                ),
                                httpOnly:true
                            }
                            res.cookie('jwt', token, cookieOptions);*/
                            dbConnection.query("SELECT user_type FROM users  WHERE id = ?", id,  async (err, result) => {
                                if (err) {
                                    return res.status(404).send({
                                        status: 'error',
                                        message: 'El usuario no ha sido encontrado o la contraseña es incorrecta'
                                    });
                                } else {
                                    console.log('hola')
                                    this.userComplete.user_type=result[0].user_type;
                                    return res.status(200).send({
                                        status: 'Ok',
                                        message: 'Bienvenido' + result[0].user_name,
                                        data: this.userComplete
                                    });
                                }
                            });
                        }
                    });
                } else {
                    if(await bcrypt.compare(params.pass, result[0].password)){
                        var id = result[0].user_id;
                    
                        this.userComplete=result[0];
                        /*
                        let token = jwt.sign({id}, process.env.JWT_SECRET,{
                            expiresIn: process.env.JWT_EXPIRES_IN
                        });
                        var cookieOptions = {
                            expires: new Date(
                                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                            ),
                            httpOnly:true
                        };
                        res.cookie('jwt', token, cookieOptions);*/
                        dbConnection.query("SELECT user_type FROM users  WHERE id = ?", id,  async (err, result) => {
                            if (err) {
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'El usuario no ha sido encontrado o la contraseña es incorrecta'
                                });
                            } else {
                                this.userComplete.user_type=result[0].user_type;
                                return res.status(200).send({
                                    status: 'Ok',
                                    message: 'Bienvenido' + result[0].user_name,
                                    data: this.userComplete
                                });
                            }
                        });
                    }else{
                        return res.status(404).send({
                            status: 'error',
                            message: 'El usuario no ha sido encontrado o la contraseña es incorrecta'
                        });
                    }
                }
            });
        } else {
            return res.status(404).send({
                status: 'error',
                mesage: 'Formulario mal digilenciado'
            });
        };
    },
      /**
     * Funcion name:  geUserById
     * Funcionalidad: devuelve la información de un usuario
     * 
     */
    getUserById:  async (req, res) => {
        var params = req.body;
        try {
            var validate_id = !validator.isEmpty(toString(params.id));
        } catch (err) {
            console.log(err)
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos' + err
            });
        }
        if (validate_id) {
            dbConnection.query("SELECT * FROM login WHERE user_id = ?", params.id,  async (err, result) => {
                if (err) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El usuario no ha sido encontrado o la contraseña es incorrecta' + err
                    });
                } else {
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Bienvenido' + result[0].user_name,
                        data: result[0]
                    });
                }
            });
        }else {
            return res.status(404).send({
                status: 'error',
                mesage: 'Formulario mal digilenciado'
            });
        };
    },
    /**
     * Funcion name:  profile
     * Funcionalidad: verifica el token del usuario y carga su información
     * 
     */
    profile:  async (req, res ) => {
        if ( req.cookies.jwt){
            try {
                //verify token- and see the user
                const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
                //check if the user exist
                dbConnection.query('SELECT * FROM users WHERE id = ?',[decoded.id], (err,result)=>{
                    if(err || !result){
                        return res.status(200).send({
                            status: 'Login',
                            mesage: 'debe logear'
                        });
                        //redireccionar a login
                    }else{
                        //cargar la informacion del usuario
                        return res.status(200).send({
                            status:'Ok',
                            data: result[0]
                        });
                    }
                });
            } catch (error) {
            }
           
        }else{
            return res.status(200).send({
                status: 'Login',
                mesage: 'debe logear'
            });
        }
    },

      /**
     * Funcion name:  logout
     * Funcionalidad: Guarda un admin en la base de datos
     * 
     */
    logout:  async (req, res ) => {
        res.cookie('jwt','logout',{
            expires:new Date(Date.now() + 2 * 1000),
            httpOnly: true
        });
       
        return res.status(200).send({
            status: 'Ok',
            mesage: 'user logout'
        });
    },

     /**
     * Funcion name:  createGame
     * Funcionalidad: Crea un juego en base de datos
     * 
     */
    createGame:  (req, res ) => {
        var params = req.body;
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_image = !validator.isEmpty(params.image);
            var validate_imageFilter = !validator.isEmpty(params.image_filter);
            var validate_imageTorunament = !validator.isEmpty(params.image_tournament);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }

        if (validate_name && validate_image && validate_imageFilter && validate_imageTorunament) {

            //crear objeto
            var game ={
                name: params.name,
                image:params.image,
                image_filter:params.image_filter,
                image_tournament:params.image_tournament
            };
            dbConnection.query("INSERT INTO games SET ?", game ,(err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on create game' + err
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Juego creado',
                        data: result
                    });
                }
            });
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }
    },
  /**
     * Funcion name:  loadGames
     * Funcionalidad:  Carga los juegos en base de datos
     * 
     */
    loadGames:  (req, res ) => {
        console.log('hai');
        dbConnection.query('SELECT * FROM games' ,(err, result) => {
            if (err){
                console.log(dbConnection.state);
                console.log(err);
                return res.status(404).send({
                    status: 'error',
                    message: 'on load games' + err
                });
            }else{
                console.log(dbConnection.state);
                console.log(result);
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Juegos cargados',
                    data: result
                });
            }
        });
    },

    /**
     * Funcion name:  loadUsersNonAdmin
     * Funcionalidad:  Carga los juegos en base de datos
     * 
     */
    loadUsersNonAdmin:  (req, res ) => {
        /**
         * nikname(done),correo(done),puntos(),torneos(),compras()
         */
        dbConnection.query('SELECT user_points.points, users.id, login.user_name, login.email FROM users INNER JOIN `user_points` ON users.id = user_points.user_id INNER JOIN `login` ON users.id = login.user_id WHERE user_type="user"  ORDER BY login.user_name ASC' ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load games' + err
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Juegos cargados',
                    data: result
                });
            }
        });
    },
    /**
     * Funcion name:  loadPoints
     * Funcionalidad:  Carga los puntos del jugador
     * 
     */
    loadPoints:  (req, res ) => {
        var params = req.params;
        dbConnection.query('SELECT * FROM user_points WHERE user_id=?' , params.id ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load games' + err
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Puntos del usuario cargados',
                    data: result[0]
                });
            }
        });
    },
    /**
     * Funcion name:  loadGamesById
     * Funcionalidad:  Carga los juegos en base de datos
     * 
     */
    loadGamesById:  (req, res ) => {
        var params= req.params;
        dbConnection.query('SELECT * FROM games where id = ?', params.id ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load torunament' + err
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Torneo cargado',
                    data: result
                });
            }
        });
    },
    /**
     * Funcion name:  editGame
     * Funcionalidad: Edita un juego en base de datos
     * 
     */
    editGame:  (req, res ) => {
        var params = req.body;
        try {
            var validate_id = !validator.isEmpty(params.id.toString());
            var validate_name = !validator.isEmpty(params.name);
            var validate_image = !validator.isEmpty(params.image);
            var validate_imageFilter = !validator.isEmpty(params.image_filter);
            var validate_imageTorunament = !validator.isEmpty(params.image_tournament);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }
        if (validate_id && validate_name && validate_image && validate_imageFilter && validate_imageTorunament) {
            //crear objeto
            var params =[
                req.body,
                req.body.id
            ]   
            dbConnection.query('UPDATE games SET ? WHERE id =? ', params ,(err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on edit game' + err
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Juego editado',
                        data: result
                    });
                }
            });
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }
    },

     /**
     * Funcion name:  createCategorie
     * Funcionalidad: Crea una categoria
     * 
     */
    createCategorie:  (req, res ) => {
        var params = req.body;
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_image = !validator.isEmpty(params.image);
            var validate_description = !validator.isEmpty(params.description);
            var validate_gameId = !validator.isEmpty(params.game_id.toString());
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }

        if (validate_name && validate_image && validate_description && validate_gameId) {

            //crear objeto
            var categorie ={
                name: params.name,
                image:params.image,
                image_filter:params.image,
                description:params.description,
                game_id:params.game_id
            };
            dbConnection.query("INSERT INTO categories SET ?", categorie ,(err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on create categorie' + err
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Categoria creada',
                        data: result[0]
                    });
                }
            });
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }
    },
  /**
     * Funcion name:  loadCategories
     * Funcionalidad: carga el listado de categorias
     * 
     */
    loadCategories:  (req, res ) => {
        var params= req.params;
        dbConnection.query('SELECT * FROM categories WHERE game_id = ?',params.id ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load categories' + err
                });
            }else{
                var a = result;
                if(a.length > 0){
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Categories cargados',
                        data: result
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: "there's no categorie related"
                    });
                }
              
            }
        });
    },
    /**
     * Funcion name:  loadCategorieById
     * Funcionalidad: carga categoria por id
     * 
     */
    loadCategorieById:  (req, res ) => {
        var params= req.params;
        dbConnection.query('SELECT * FROM categories WHERE id = ?',params.id ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load categorie' + err
                });
            }else{
                var a = result;
                if(a.length > 0){
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Categorie cargados',
                        data: result[0]
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: "there's no categorie related"
                    });
                }
              
            }
        });
    },
    /**
     * Funcion name:  editCategorie
     * Funcionalidad: edita la información de una categoria
     * 
     */
    editCategorie:  (req, res ) => {
        var params = req.body;
        try {
            var validate_id = !validator.isEmpty(params.id.toString());
            var validate_name = !validator.isEmpty(params.name);
            var validate_description = !validator.isEmpty(params.description);
            var validate_image = !validator.isEmpty(params.image);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }

        if (validate_id && validate_name && validate_description && validate_image) {
            //crear objeto
            var params =[
                req.body,
                req.body.id
            ]   
            dbConnection.query('UPDATE categories SET ? WHERE id =? ', params ,(err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on edit categorie' + err
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Categorie edited',
                        data: result
                    });
                }
            });
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }
    },

    
     /**
     * Funcion name:  createTournament
     * Funcionalidad: Crea un torneo
     * 
     */
    createTournament:  async (req, res ) => {
        /*if ( req.cookies.jwt){
            try {
                //verify token- and see the user
                const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
                //check if the user exist
                id=decoded.id;
            } catch (error) {
            }
        }else{
            return res.status(200).send({
                status: 'Login',
                mesage: 'debe logear'
            });
        }*/
        var params = req.body;
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_creatorId = !validator.isEmpty(params.creator_id.toString());
            var validate_gameId = !validator.isEmpty(params.game_id.toString());
            var validate_categorieId = !validator.isEmpty(params.categorie_id.toString());
            var validate_urlGt = !validator.isEmpty(params.url_GT);
            var validate_endAt = !validator.isEmpty(params.end_at);
            var validate_image = !validator.isEmpty(params.image);
            var validate_rules = !validator.isEmpty(params.rules);
            var validate_usersCapacity = !validator.isEmpty(params.users_capacity);
            var validate_firstPlace = !validator.isEmpty(params.first_place);
            var validate_secondPlace = !validator.isEmpty(params.second_place);
            var validate_thirdPlace = !validator.isEmpty(params.third_place);

        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos2'
            });
        }
        //crear objeto
        var tournament ={
            game_id : params.game_id,
            name : params.name,
            categorie_id : params.categorie_id,
            url_GT : params.url_GT,
            end_at : params.end_at,
            image : params.image,
            rules : params.rules,
            creator_id : params.creator_id,
            users_capacity : params.users_capacity,
            first_place : params.first_place,
            second_place : params.second_place,
            third_place : params.third_place
        };
        dbConnection.query("INSERT INTO tournaments SET  ?", tournament ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on create tournament' + err
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Torneo creado'
                });
            }
        });
    },

    /**
     * Funcion name:  editTournament
     * Funcionalidad: Editar un torneo
     * 
     */
    editTournament:  async (req, res ) => {
        var id;
        /*if ( req.cookies.jwt){
            try {
                //verify token- and see the user
                const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
                //check if the user exist
                id=decoded.id;
            } catch (error) {
            }
        }else{
            return res.status(200).send({
                status: 'Login',
                mesage: 'debe logear'
            });
        }*/
        var params = req.body;
        try {
            var validate_name = !validator.isEmpty(toString(params.name));
            var validate_urlGt = !validator.isEmpty(params.url_GT);
            var validate_image = !validator.isEmpty(params.image);
            var validate_rules = !validator.isEmpty(params.rules);
            var validate_usersCapacity = !validator.isEmpty(toString(params.users_capacity));
            var validate_firstPlace = !validator.isEmpty(toString(params.first_place));
            var validate_secondPlace = !validator.isEmpty(toString(params.second_place));
            var validate_thirdPlace = !validator.isEmpty(toString(params.third_place));
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos2'
            });
        }
        if (validate_name && validate_urlGt && validate_image && validate_rules && validate_usersCapacity && validate_firstPlace && validate_secondPlace && validate_thirdPlace) {

            //crear objeto
            var tournament ={
                name : params.name,
                url_GT : params.url_GT,
                image : params.image,
                rules : params.rules,
                users_capacity : params.users_capacity,
                first_place : params.first_place,
                second_place : params.second_place,
                third_place : params.third_place
            };
            var update=[
                tournament,
                params.id
            ]
            dbConnection.query("UPDATE tournaments SET  ? where id = ?", update ,(err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on edit tournament' + err
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Torneo editado'
                    });
                }
            });
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }
    },

     /**
     * Funcion name:  loadTournaments
     * Funcionalidad: carga el listado de torneos
     * 
     */
    loadTournaments:  (req, res ) => {
        const date= Date(now());
        dbConnection.query('SELECT * FROM tournaments WHERE end_at >= ?',date ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load categories' + err
                });
            }else{
                var a = result;
                console.log(a)
                if(a.length > 0){
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Categories cargados',
                        data: result
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: "there's no categorie related"
                    });
                }
              
            }
        });
    },
     /**
     * Funcion name:  loadTournamentsAll
     * Funcionalidad: carga el listado de torneos
     * 
     */
    loadTournamentsAll:  (req, res ) => {
        dbConnection.query('SELECT * FROM tournaments' ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load categories' + err
                });
            }else{
                var a = result;
                if(a.length > 0){
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Categories cargados',
                        data: result
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: "there's no categorie related"
                    });
                }
              
            }
        });
    },
    /**
     * Funcion name:  loadTournamentsById
     * Funcionalidad: carga el listado de torneos
     * 
     */
    loadTournamentsById:  (req, res ) => {
        var params= req.params;
        dbConnection.query('SELECT * FROM tournaments where id = ?', params.id ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load torunament' + err
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Torneo cargado',
                    data: result
                });
            }
        });
    },

      /**
     * Funcion name:  loadTournamentsCategorie
     * Funcionalidad: carga el listado de torneos por categoria
     * 
     */
    loadTournamentsCategorie:  (req, res ) => {
        var params= req.params;
        dbConnection.query('SELECT * FROM tournaments WHERE categorie_id = ? AND end_at >=Date(now())', params.id ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load categories' + err
                });
            }else{
                var a = result;
                if(a.length > 0){
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Categories cargados',
                        data: result
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: "there's no categorie related"
                    });
                }
              
            }
        });
    },

          /**
     * Funcion name:  loadTournamentUser
     * Funcionalidad: carga el listado de torneos por usuario
     * 
     */
    loadTournamentUser:  (req, res ) => {
        var params= req.params;
        var ids = [];
        var tournaments = [];
        dbConnection.query('SELECT * FROM tickets_users where user_id = ?', params.id ,async (err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load categories' + err
                });
            }else{
                var a = await result;
                for( var len = a.length, i = 0 ; i < len; i++){
                    ids.push(a[i].id);
                }
                if(a.length > 0){
                    dbConnection.query('SELECT * FROM tournaments_subscriptions where ticket_users_id IN ('+ ids +')' , async (err, result) => {
                        if (err){
                            return res.status(404).send({
                                status: 'error',
                                message: 'on load products' + err
                            });
                        }else{
                            var a = await result;
                            for( var len = a.length, i = 0 ; i < len; i++){
                                tournaments.push(a[i].tournament_id);
                            }
                            if(a.length > 0){
                                dbConnection.query('SELECT * FROM tournaments where id IN ('+ tournaments +')', (err, result) => {
                                    if (err){
                                        return res.status(404).send({
                                            status: 'error',
                                            message: 'on load tournaments' + err
                                        });
                                    }else{
                                        var a = result;
                                        if(a.length > 0){
                                            return res.status(200).send({
                                                status: 'Ok',
                                                message: 'Tournaments loaded',
                                                data: result
                                            });
                                        }else{
                                            return res.status(200).send({
                                                status: 'Ok',
                                                message: "there's no torunaments related"
                                            });
                                        }
                                      
                                    }
                                });
                            }else{
                                return res.status(200).send({
                                    status: 'Ok',
                                    message: "there's no torunaments with that user related"
                                });
                            }
                          
                        }
                    });

                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: "there's no torunaments suscriptions related"
                    });
                }
              
            }
        });
    },
          /**
     * Funcion name:  loadTournamentUserCat
     * Funcionalidad: carga el listado de torneos por usuario
     * 
     */
    loadTournamentUserCat:  async (req, res ) => {
        var params= req.params;
        dbConnection.query('SELECT tickets_users.user_id,tournaments_subscriptions.created_at,tournaments.name, categories.name as cat_name  FROM `tickets_users`INNER JOIN `tournaments_subscriptions` ON tickets_users.id=tournaments_subscriptions.ticket_users_id INNER JOIN `tournaments` ON tournaments_subscriptions.tournament_id=tournaments.id  INNER JOIN `categories` ON tournaments.categorie_id=categories.id WHERE tickets_users.user_id = ?', params.id ,async (err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load categories' + err
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: "Torneos encontrados",
                    data: await result
                });
            }
        });
    },

    /**
     * Funcion name:  createTicket
     * Funcionalidad: Crea un ticket
     * 
     */
    createTicket:  async (req, res ) => {
        var id;
        if ( req.cookies.jwt){
            try {
                //verify token- and see the user
                const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
                //check if the user exist
                id=decoded.id;
            } catch (error) {
            }
        }else{
            return res.status(200).send({
                status: 'Login',
                mesage: 'debe logear'
            });
        }
        var params = req.body;
        try {
            var validate_price = !validator.isEmpty(params.price);
            var validate_categorie = !validator.isEmpty(params.categorie);
            var validate_image = !validator.isEmpty(params.image);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos2'
            });
        }

        if (validate_price && validate_categorie && validate_image ) {

            //crear objeto
            var ticket ={
                price : params.price,
                categorie : params.categorie,
                image : params.image,
            };
            dbConnection.query("INSERT INTO tickets SET  ?", ticket ,(err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on create ticket' + err
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Ticket creado'
                    });
                }
            });
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }
    },

    /**
     * Funcion name:  editTicket
     * Funcionalidad: Edita los atributos de un ticket
     * 
     */
    editTicket:  async (req, res ) => {
        var id;
        if ( req.cookies.jwt){
            try {
                //verify token- and see the user
                const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
                //check if the user exist
                id=decoded.id;
            } catch (error) {
            }
        }else{
            return res.status(200).send({
                status: 'Login',
                mesage: 'debe logear'
            });
        }
        var params = req.body;
        try {
            var validate_id = !validator.isEmpty(params.id);
            var validate_price = !validator.isEmpty(params.price);
            var validate_categorie = !validator.isEmpty(params.categorie);
            var validate_image = !validator.isEmpty(params.image);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos2'
            });
        }

        if (validate_id && validate_price && validate_categorie && validate_image ) {

            //crear objeto
            var ticket ={
                price : params.price,
                categorie : params.categorie,
                image : params.image,
            };
            var update=[
                ticket,
                params.id
            ]
            dbConnection.query("UPDATE tickets SET  ? where id = ?", update ,(err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on edit ticket' + err
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Ticket editado'
                    });
                }
            });
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }
    },

     /**
     * Funcion name:  createproduct
     * Funcionalidad: Crea un producto
     * 
     */
    createProduct:  async (req, res ) => {
        var id;
        /*if ( req.cookies.jwt){
            try {
                //verify token- and see the user
                const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
                //check if the user exist
                id=decoded.id;
            } catch (error) {
            }
        }else{
            return res.status(200).send({
                status: 'Login',
                mesage: 'debe logear'
            });
        }*/
        var params = req.body;
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_gameId = !validator.isEmpty(toString(params.game_id));
            var validate_image = !validator.isEmpty(params.image);
            var validate_points = !validator.isEmpty(toString(params.points));
            var validate_stock = !validator.isEmpty(toString(params.stock));
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos2'
            });
        }

        if (validate_points && validate_name && validate_image && validate_gameId && validate_stock) {

            //crear objeto
            var product ={
                points : params.points,
                name : params.name,
                image : params.image,
                stock: params.stock,
                game_id:params.game_id
            };
            dbConnection.query("INSERT INTO products SET  ?", product ,(err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on create product' + err
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'product creado'
                    });
                }
            });
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }
    },

    /**
     * Funcion name:  editproduct
     * Funcionalidad: Edita los atributos de un producto
     * 
     */
    editProduct:  async (req, res ) => {
        var id;
        /*if ( req.cookies.jwt){
            try {
                //verify token- and see the user
                const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
                //check if the user exist
                id=decoded.id;
            } catch (error) {
            }
        }else{
            return res.status(200).send({
                status: 'Login',
                mesage: 'debe logear'
            });
        }*/
        var params = req.body;
        try {
            var validate_id = !validator.isEmpty(toString(params.id));
            var validate_name = !validator.isEmpty(params.name);
            var validate_gameId = !validator.isEmpty(toString(params.game_id));
            var validate_image = !validator.isEmpty(params.image);
            var validate_points = !validator.isEmpty(toString(params.points));
            var validate_stock = !validator.isEmpty(toString(params.stock));
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos2'
            });
        }

        if (validate_id && validate_points && validate_name && validate_image && validate_gameId && validate_stock) {

            //crear objeto
            var product ={
                points : params.points,
                name : params.name,
                image : params.image,
                stock: params.stock,
                game_id:params.game_id
            };
            var update=[
                product,
                params.id
            ]
            dbConnection.query("UPDATE products SET  ? WHERE id = ?", update ,(err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on edit product' + err
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Product edited'
                    });
                }
            });
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }
    },
     /**
     * Funcion name:  editTransaction
     * Funcionalidad: Edita los atributos de una transaccion
     * 
     */
    editTransaction:  async (req, res ) => {
        var id;
        /*if ( req.cookies.jwt){
            try {
                //verify token- and see the user
                const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
                //check if the user exist
                id=decoded.id;
            } catch (error) {
            }
        }else{
            return res.status(200).send({
                status: 'Login',
                mesage: 'debe logear'
            });
        }*/
        var params = req.body;
        try {
            var validate_id = !validator.isEmpty(toString(params.id));
            var validate_productId = !validator.isEmpty(toString(params.product_id));
            var validate_state = !validator.isEmpty(params.state);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos2'
            });
        }

        if (validate_id && validate_state && validate_productId) {

            //crear objeto

            var product ={
                state: params.state
            };
            var update=[
                product,
                params.id
            ]
            if(params.state === 'rechazado'){
                dbConnection.query("UPDATE products SET  stock = stock + 1 WHERE id = ?", params.product_id ,async (err, result) => {
                    if (err){
                        return res.status(404).send({
                            status: 'error',
                            message: 'on edit product' + err
                        });
                    }else{
                        dbConnection.query("UPDATE transactions SET  ? WHERE id = ?", update , async (err, result) => {
                            if (err){
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'on edit product' + err
                                });
                            }else{
                                return res.status(200).send({
                                    status: 'Denied',
                                    message: 'Transaction edited'
                                });
                            }
                        });
                    }
                });
            }else{
                dbConnection.query("UPDATE transactions SET  ? WHERE id = ?", update ,(err, result) => {
                    if (err){
                        return res.status(404).send({
                            status: 'error',
                            message: 'on edit product' + err
                        });
                    }else{
                        return res.status(200).send({
                            status: 'Ok',
                            message: 'Transaction edited'
                        });
                    }
                });
            }
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }
    },

      /**
     * Funcion name:  loadTickets
     * Funcionalidad: carga el listado de tickets
     * 
     */
    loadTickets:  (req, res ) => {
        dbConnection.query('SELECT * FROM tickets' ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load tickets' + err
                });
            }else{
                var a = result;
                if(a.length > 0){
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Tickets loaded',
                        data: result
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: "there's no tickets related"
                    });
                }
              
            }
        });
    },
    
      /**
     * Funcion name:  loadProducts
     * Funcionalidad: carga el listado de productos
     * 
     */
    loadProducts:  (req, res ) => {
        console.log(res);
        dbConnection.query('SELECT * FROM products' ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load products' + err
                });
            }else{
                var a = result;
                if(a.length > 0){
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Products loaded',
                        data: result
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: "there's no products related"
                    });
                }
              
            }
        });
    },
      /**
     * Funcion name:  loadProductById
     * Funcionalidad: carga el listado de productos
     * 
     */
    loadProductById:  (req, res ) => {
        const params = req.body;
        dbConnection.query('SELECT * FROM products WHERE id = ?', params.id ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load products' + err
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Products loaded',
                    data: result[0]
                });
            }
        });
    },

    /**
     * Funcion name:  addPoints
     * Funcionalidad: Da puntos a un usuario
     * 
     */
    addPoints:  async (req, res ) => {
        var id, userData;
        /*if ( req.cookies.jwt){
            try {
                //verify token- and see the user
                const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
                //check if the user exist
                id=decoded.id;
            } catch (error) {
            }
        }else{
            return res.status(200).send({
                status: 'Login',
                mesage: 'debe logear'
            });
        }*/
        var params = req.body;
        try {
            var validate_id = !validator.isEmpty(params.user_id);
            var validate_points = !validator.isEmpty(params.points);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos2'
            });
        }

        if (validate_id && validate_points) {

            //crear objeto
            var usersPoints ={
                points : parseInt(params.points),
            };
            var update = [];
            dbConnection.query('SELECT * FROM user_points where user_id = ?', params.user_id , async (err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on load user' + err
                    });
                }else{
                    userData = await result;
                    
                    if(!userData.length > 0){
                        return res.status(200).send({
                            status: 'Ok',
                            message: "Intentalo con una cuenta de usuario"
                        });
                    }else{
                        userData = result[0];
                        update = [
                            { points: usersPoints.points + parseInt(userData.points)},
                            params.user_id
                        ];
                        dbConnection.query("UPDATE user_points SET  ? WHERE user_id = ?", update ,(err, result) => {
                            if (err){
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'on add points' + err
                                });
                            }else{
                                return res.status(200).send({
                                    status: 'Ok',
                                    message: 'Points added'
                                });
                            }
                        });
                    }
                }
            });
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos'
            });
        }
    },

     /**
     * Funcion name:  createTransaction
     * Funcionalidad: Crea una transaccion entre un usuario y un producto
     * 
     */
    createTransaction:  async (req, res ) => {
        var id, productLoaded, userData;
        var params = req.body;
        var id = params.user_id;
        try {
            var validate_productId = !validator.isEmpty(params.product_id);
            var validate_userId = !validator.isEmpty(params.user_id);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos2'
            });
        }
        if ( validate_userId && validate_productId){
           /* try {
                //verify token- and see the user
                const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
                //verify the user type
                id=decoded.id;

            } catch (error) {
                console.log(error);
            }    */
            dbConnection.query('SELECT * FROM user_points where user_id = ?', params.user_id , async (err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on load user' + err
                    });
                }else{
                    userData = await result;
                    
                    if(!userData.length > 0){
                        return res.status(200).send({
                            status: 'Ok',
                            message: "Intentalo con una cuenta de usuario"
                        });
                    }else{
                        userData = result[0];
                    }
                }
            });
         
            //calidar si alcanza los puntos
            dbConnection.query('SELECT * FROM products where id = ?', params.product_id , async (err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on load products' + err
                    });
                }else{
                    productLoaded = await result[0];
                    if( userData.points >= productLoaded.points){
                        //crear objeto
                        var product ={
                            user_id : id,
                            product_id:params.product_id,
                            state: 'pendiente'
                        };
                        var user ={
                            points: userData.points - productLoaded.points,
                        };
                        var stocks ={
                            stock: productLoaded.stock - 1,
                        };
                        var update = [
                            user,
                            userData.user_id
                        ]
                        var update2 = [
                            stocks,
                            params.product_id
                        ]
                        if(productLoaded.stock===0){
                            return res.status(200).send({
                                status: 'Not',
                                message: 'No se puede hacer la transaccion, no hay productos en la tienda'
                            });
                        }
                        dbConnection.query("UPDATE user_points SET  ? where user_id = ?", update ,(err, result) => {
                            if (err){
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'on update user' + err,
                                });
                            }else{
 
                            }
                        });
                        dbConnection.query("UPDATE products SET  ? where id = ?", update2 ,(err, result) => {
                            if (err){
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'on update product' + err + update2
                                });
                            }
                        });
                        dbConnection.query("INSERT INTO transactions SET  ?", product ,(err, result) => {
                            if (err){
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'on create product' + err
                                });
                            }else{
                                return res.status(200).send({
                                    status: 'Ok',
                                    message: 'Transaccion exitosa, enviar correo'
                                });
                            }
                        });
                        
                    }else{
                        return res.status(200).send({
                            status: 'NotP',
                            message: 'puntos insuficientes'
                        });
                    }     
                }
            });
        }else{
            return res.status(200).send({
                status: 'Login',
                mesage: 'debe logear o los datos están incompletos'
            });
        }
    },

     /**
     * Funcion name:  createTicketTransaction
     * Funcionalidad: Crea una transaccion de ticket entre un usuario y un producto
     * 
     */
    createTicketTransaction:  async (req, res ) => {
        var id;
        var params = req.body;
        try {
            var validate_ticketId = !validator.isEmpty(params.ticket_id);
            var validate_userId = !validator.isEmpty(params.user_id);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos2'
            });
        }
        if ( validate_userId && validate_ticketId){
            /*try {
                //verify token- and see the user
                const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
                //verify the user type
                id=decoded.id;

            } catch (error) {
                console.log(error);
            }*/
            var product ={
                user_id : params.user_id,
                ticket_id : params.ticket_id,
                active: true,
                ticket_categorie: params.ticket_id
            };    
            dbConnection.query("INSERT INTO tickets_users SET  ?", product ,(err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on create user_ticket' + err
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Transaccion exitosa'
                    });
                }
            });
        }else{
            return res.status(200).send({
                status: 'Login',
                mesage: 'debe logear o los datos están incompletos'
            });
        }
    },

    /**
     * Funcion name:  loadTransactions
     * Funcionalidad: carga el listado de transferencias
     * 
     */
    loadTransactions:  (req, res ) => {
        dbConnection.query('SELECT * FROM tickets_users' ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load transactions' + err
                });
            }else{
                var a = result;
                if(a.length > 0){
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Transacciones loaded',
                        data: result
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: "there's no transactions related"
                    });
                }
              
            }
        });
    },

     /**
     * Funcion name:  loadTransactionsUsers
     * Funcionalidad: carga el listado de transferencias
     * 
     */
    loadTransactionsUsers:  (req, res ) => {
        var params=req.params;
        dbConnection.query('SELECT * FROM tickets_users where user_id = ?',params.id ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load transactions' + err
                });
            }else{
                var a = result;
                if(a.length > 0){
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Transacciones loaded',
                        data: result
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: "there's no transactions related"
                    });
                }
              
            }
        });
    },
    /**
     * Funcion name:  loadTransactionsUsersProducts
     * Funcionalidad: carga el listado de transferencias de productos por usuario
     * 
     */
    loadTransactionsProducts:  (req, res ) => {
        dbConnection.query('SELECT * FROM transactions' ,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load transactions' + err
                });
            }else{
                var a = result;
                if(a.length > 0){
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'Transacciones loaded',
                        data: result
                    });
                }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: "there's no transactions related"
                    });
                }
              
            }
        });
    },

   /**
     * Funcion name:  loadTransactionsUsersProducts
     * Funcionalidad: carga el listado de transferencias de productos por usuario
     * 
     */
    loadTransactionsUsersProducts: async (req, res ) => {
        var params= req.params;
        dbConnection.query('SELECT transactions.id,transactions.user_id,products.id as product_id,transactions.state,products.name, products.points, transactions.created_at FROM `transactions`INNER JOIN `products` ON transactions.product_id=products.id WHERE user_id = ?', params.id ,async (err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load categories' + err
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Transacciones',
                    data: result
                });
            }    
        });
    },
    /**
     * Funcion name:  loadTransactionsUsersProductsPendant
     * Funcionalidad: carga el listado de transferencias de productos por usuario
     * 
     */
    loadTransactionsUsersProductsPendant: async (req, res ) => {
        var params= req.params;
        dbConnection.query('SELECT transactions.id,transactions.user_id,products.id as product_id,transactions.state,products.name, products.points, transactions.created_at FROM `transactions`INNER JOIN `products` ON transactions.product_id=products.id WHERE user_id = ? And transactions.state="pendiente"', params.id ,async (err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on load categories' + err
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Transacciones',
                    data: result
                });
            }    
        });
    },

    /**
     * Funcion name: tournamentSubscription
     * Funcionalidad: Crea una suscripción a un torneo con un ticket_id y actualiza el estado del ticket
     * 
     */
   tournamentSubscription:  async (req, res ) => {
        var id;
        var params = req.body;
        try {
            var validate_ticketUsersId = !validator.isEmpty(params.ticket_users_id);
            var validate_tournamentId = !validator.isEmpty(params.tournament_id);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'datos imcompletos' + err
            });
        }
        if ( validate_ticketUsersId && validate_tournamentId){
            var product ={
                tournament_id : params.tournament_id,
                ticket_users_id : params.ticket_users_id,
            };
            dbConnection.query("SELECT * FROM tournaments where id = ?", params.tournament_id ,async (err, result) => {
                if (err){
                    return res.status(404).send({
                        status: 'error',
                        message: 'on update user' + err
                    });
                }else{
                    var users_capacity= await result[0].users_capacity;
                    if(result[0].users_capacity-1 === -1 ){
                        return res.status(200).send({
                            status: 'Ok',
                            message: 'Torneo lleno' + err
                        });
                    }else{
                        var ticket ={
                            active: false,
                        };
                        var tournament ={
                            users_capacity: users_capacity - 1,
                        };
            
                        var update = [
                            ticket,
                            params.ticket_users_id
                        ];
                        var update2 = [
                            tournament,
                            params.tournament_id
                        ];
                        dbConnection.query("UPDATE tournaments SET  ? where id = ?", update2 ,(err, result) => {
                            if (err){
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'on update user' + err
                                });
                            }
                        });  
                        dbConnection.query("UPDATE tickets_users SET  ? where id = ?", update ,(err, result) => {
                            if (err){
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'on update user' + err
                                });
                            }
                        });
                        dbConnection.query("INSERT INTO tournaments_subscriptions SET  ?", product ,(err, result) => {
                            if (err){
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'on create user_ticket' + err
                                });
                            }else{
                                return res.status(200).send({
                                    status: 'Ok',
                                    message: 'Subscripción exitosa'
                                });
                            }
                        });
                    }
                }
            });
           
        }else{
            return res.status(200).send({
                status: 'Login',
                mesage: 'los datos están incompletos'
            });
        }
    },

   /**
     * Funcion name:  loadImages
     * Funcionalidad: carga el listado de transferencias
     * 
     */
    loadImages:  (req, res ) => {
        console.log(res);
        var params=req.params.image;
        var path_file= './images/' + params;
        fs.exists(path_file, (exists)=>{
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: "there's no image related"
                });
            }
        })
    },

    /**
     * Funcion name:  formularioCorreo
     * Funcionalidad: carga el listado de transferencias
     * 
     */
    formularioCorreo: (req, res) => {
        configMensaje(req.body);
        return res.status(200).send({
            status: 'Ok',
            mesage: 'buena',
        });
    },

     /**
     * Funcion name:  correoTickets
     * Funcionalidad: carga el listado de transferencias
     * 
     */
    correoTickets: (req, res) => {
        ticketMensaje(req.body);
        return res.status(200).send({
            status: 'Ok',
            mesage: 'buena',
        });
    },
    /**
     * Funcion name:  correoAcceptTransaction
     * Funcionalidad: carga el listado de transferencias
     * 
     */
    correoAcceptTransaction: (req, res) => {
        acceptTransactionMensaje(req.body);
        return res.status(200).send({
            status: 'Ok',
            mesage: 'buena',
        });
    },
    /**
     * Funcion name:  correoRechazarTransaction
     * Funcionalidad: carga el listado de transferencias
     * 
     */
    correoRechazarTransaction: (req, res) => {
        deniedTransactionMensaje(req.body);
        return res.status(200).send({
            status: 'Ok',
            mesage: 'buena',
        });
    },

     /**
     * Funcion name:  correoProducts
     * Funcionalidad: carga el listado de transferencias
     * 
     */
    correoProducts: (req, res) => {
        productMensaje(req.body);
        return res.status(200).send({
            status: 'Ok',
            mesage: 'buena',
        });
    },

     /**
     * Funcion name:  correoTournaments
     * Funcionalidad: carga el listado de transferencias
     * 
     */
    correoTournaments: (req, res) => {
        tournamentMensaje(req.body);
        return res.status(200).send({
            status: 'Ok',
            mesage: 'buena',
        });
    },
     /**
     * Funcion name:  uploadImage
     * Funcionalidad: sube una imagen a la carpeta
     * 
     */
    uploadImage: (req, res) => {
        var file_name='imagen no cargada';
        var params= req.params;
        if(!req.files){
            return res.status(404).send({
                status: 'error',
                mesage: file_name,
            });
        }
        var file_path = params.id ? req.files.image.path : req.files.file0.path;
        //en servidor
        console.log(file_path);
        var file_name = file_path.split('/')[1];
        var file_ext = file_name.split('.')[1];
        //var file_name = file_path.split('\\')[1];
        //var file_ext = file_name.split('\.')[1];
        if(file_ext !='png' && file_ext !='jpg' && file_ext !='jpeg'){
            fs.unlink(file_path,(err)=>{
                return res.status(200).send({
                    status: 'error',
                    mesage: 'la extension de la imagen no es valida',
                });
            });
        }else{
            if(params.id){
                switch(params.class){
                    case 'tournament':
                        var tournament ={
                            image : file_name,
                        };
                        var update=[
                            tournament,
                            params.id
                        ]
                        dbConnection.query("UPDATE tournaments SET  ? where id = ?", update ,(err, result) => {
                            if (err){
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'on edit tournament' + err
                                });
                            }else{
                                return res.status(200).send({
                                    status: 'Ok',
                                    message: 'Torneo editado'
                                });
                            }
                        });
                    break;
                    case 'categorie':
                        var categorie ={
                            image : file_name,
                        };
                        var update=[
                            categorie,
                            params.id
                        ]
                        dbConnection.query("UPDATE categories SET  ? where id = ?", update ,(err, result) => {
                            if (err){
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'on edit categorie' + err
                                });
                            }else{
                                return res.status(200).send({
                                    status: 'Ok',
                                    message: 'Categoria editada'
                                });
                            }
                        });
                    break;
                    case 'game':
                        if(params.type === 'image'){
                            var game ={
                                image : file_name,
                            };
                            var update=[
                                game,
                                params.id
                            ]
                            dbConnection.query("UPDATE games SET  ? where id = ?", update ,(err, result) => {
                                if (err){
                                    return res.status(404).send({
                                        status: 'error',
                                        message: 'on edit game' + err
                                    });
                                }else{
                                    return res.status(200).send({
                                        status: 'Ok',
                                        message: 'Juego editado'
                                    });
                                }
                            });
                        }else  if(params.type === 'image_tournament'){
                            var game ={
                                image_tournament : file_name,
                            };
                            var update=[
                                game,
                                params.id
                            ]
                            dbConnection.query("UPDATE games SET  ? where id = ?", update ,(err, result) => {
                                if (err){
                                    return res.status(404).send({
                                        status: 'error',
                                        message: 'on edit game' + err
                                    });
                                }else{
                                    return res.status(200).send({
                                        status: 'Ok',
                                        message: 'Juego editado'
                                    });
                                }
                            });
                        }else  if(params.type === 'image_filter'){
                            var game ={
                                image_filter : file_name,
                            };
                            var update=[
                                game,
                                params.id
                            ]
                            dbConnection.query("UPDATE games SET  ? where id = ?", update ,(err, result) => {
                                if (err){
                                    return res.status(404).send({
                                        status: 'error',
                                        message: 'on edit game' + err
                                    });
                                }else{
                                    return res.status(200).send({
                                        status: 'Ok',
                                        message: 'Juego editado'
                                    });
                                }
                            });
                        }
                    break;
                    case 'user':
                        var user ={
                            image : file_name,
                        };
                        var update=[
                            user,
                            params.id
                        ]
                        dbConnection.query("UPDATE users SET  ? where id = ?", update ,(err, result) => {
                            if (err){
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'on edit user' + err
                                });
                            }else{
                                return res.status(200).send({
                                    status: 'Ok',
                                    message: 'Usuario editado'
                                });
                            }
                        });
    
                    break;
                    case 'product':
                        var product ={
                            image : file_name,
                        };
                        var update=[
                            product,
                            params.id
                        ]
                        dbConnection.query("UPDATE products SET  ? where id = ?", update ,(err, result) => {
                            if (err){
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'on edit product' + err
                                });
                            }else{
                                return res.status(200).send({
                                    status: 'Ok',
                                    message: 'Producto editado'
                                });
                            }
                        });
    
                    break;
                    case 'ticket':
                        var ticket ={
                            image : file_name,
                        };
                        var update=[
                            ticket,
                            params.id
                        ]
                        dbConnection.query("UPDATE tickets SET  ? where id = ?", update ,(err, result) => {
                            if (err){
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'on edit ticket' + err
                                });
                            }else{
                                return res.status(200).send({
                                    status: 'Ok',
                                    message: 'Ticket editado'
                                });
                            }
                        });
                    break;
                }
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'imagen subida',
                    data: file_name
                });
            }
        }
    },
       /**
     * Funcion name:  uploadRule
     * Funcionalidad: sube una reglaPDF a la carpeta
     * 
     */
    uploadRule: (req, res) => {
        var file_name='pdf no cargada';
        var params= req.params;
       if(!req.files){
        return res.status(404).send({
            status: 'error',
            mesage: file_name,
        });
       }
       var file_path = params.id ? req.files.rules.path : req.files.file0.path;
       //en servidor
       var file_name = file_path.split('/')[1];
       var file_ext = file_name.split('.')[1];
       //var file_name = file_path.split('\\')[1];
       //var file_ext = file_name.split('\.')[1];
       if(file_ext !='pdf'){
        fs.unlink(file_path,(err)=>{
            return res.status(200).send({
                status: 'error',
                mesage: 'la extension de la pdf no es valida',
            });
        });
       }else{
            if(params.id){
                var tournament ={
                    rules : file_name,
                };
                var update=[
                    tournament,
                    params
                ]
                dbConnection.query("UPDATE tournaments SET  ? where id = ?", update ,(err, result) => {
                    if (err){
                        return res.status(404).send({
                            status: 'error',
                            message: 'on edit tournament' + err
                        });
                    }else{
                        return res.status(200).send({
                            status: 'Ok',
                            message: 'Torneo editado'
                        });
                    }
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Regla subida',
                    data: file_name
                });
            }
        }
    },
    /**
     * Funcion name:  downloadPDF
     * Funcionalidad: descarga un PDF desde la carpeta
     * 
     */
    downloadPDF : (req , res) =>{
        var params = req.body;
        var rule = params.rules;
        var path_file= './reglas/' + rule;
        fs.exists(path_file, (exists)=>{
            if(exists){
                return res.download(path_file);
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: "there's no image related"
                });
            }
        })
    },

    /**
     * Funcion name:  deleteProduct
     * Funcionalidad: Elimina un producto
     * 
     */
    deleteProduct:  (req, res ) => {
        var params= req.body;
        dbConnection.query('DELETE FROM products WHERE id = ?' ,params.id,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on delete product' + err
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Producto borrado',
                    data: result.affectedRows
                });
            }
        });
    },
    /**
     * Funcion name:  deleteGame
     * Funcionalidad: Elimina un Juego
     * 
     */
    deleteGame:  (req, res ) => {
        var params= req.body;
        dbConnection.query('DELETE FROM games WHERE id = ?' ,params.id,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on delete Juego' + err
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Juego borrado',
                    data: result.affectedRows
                });
            }
        });
    },
     /**
     * Funcion name:  deleteTicket
     * Funcionalidad: Elimina un Ticket
     * 
     */
    deleteTicket:  (req, res ) => {
        var params= req.body;
        dbConnection.query('DELETE FROM tickets WHERE id = ?' ,params.id,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on delete Ticket' + err
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Ticket borrado',
                    data: result.affectedRows
                });
            }
        });
    },
     /**
     * Funcion name:  deleteTournament
     * Funcionalidad: Elimina un Tournament
     * 
     */
    deleteTournament:  (req, res ) => {
        var params= req.body;
        dbConnection.query('DELETE FROM tournaments WHERE id = ?' ,params.id,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on delete Tournament' + err
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Tournament borrado',
                    data: result.affectedRows
                });
            }
        });
    },
     /**
     * Funcion name:  deleteCategorie
     * Funcionalidad: Elimina un Categorie
     * 
     */
    deleteCategorie:  (req, res ) => {
        var params= req.body;
        dbConnection.query('DELETE FROM categories WHERE id = ?' ,params.id,(err, result) => {
            if (err){
                return res.status(404).send({
                    status: 'error',
                    message: 'on delete Categorie' + err
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Categorie borrado',
                    data: result.affectedRows
                });
            }
        });
    },




//lista de servicios
/**
 * historial de transacciones
 */
 
};
module.exports = controller;