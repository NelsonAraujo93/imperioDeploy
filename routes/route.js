'use strict'

var express = require('express');
var usersController = require('../controllers/users');
var router = express.Router();
var multipart = require('connect-multiparty');
var md_uploadImage = multipart({uploadDir:'./images'});
var md_uploadRule = multipart({uploadDir:'./reglas'});


//metodos get recibir

router.get('/profile', usersController.profile);
router.get('/logout', usersController.logout);
router.get('/load-games', usersController.loadGames);
router.get('/load-users-non-admin', usersController.loadUsersNonAdmin);
router.get('/load-game/:id', usersController.loadGamesById);
router.get('/load-categories/:id', usersController.loadCategories);
router.get('/load-categorie/:id', usersController.loadCategorieById);
router.get('/load-tournaments/:id', usersController.loadTournamentsCategorie);
router.get('/load-tournaments-users/:id', usersController.loadTournamentUser);
router.get('/load-tournaments-users-cat/:id', usersController.loadTournamentUserCat);
router.get('/load-tournaments', usersController.loadTournaments);
router.get('/load-tournament/:id', usersController.loadTournamentsById);
router.get('/load-tickets', usersController.loadTickets);
router.get('/load-products', usersController.loadProducts);
router.get('/load-transactions/:id', usersController.loadTransactionsUsers);
router.get('/load-transactions', usersController.loadTransactions);
router.get('/load-images/:image', usersController.loadImages);
router.get('/load-user-points/:id', usersController.loadPoints);
router.get('/load-transactions-products', usersController.loadTransactionsProducts);
router.get('/load-transactions-user-products/:id', usersController.loadTransactionsUsersProducts);
router.get('/load-transactions-user-products-pendant/:id', usersController.loadTransactionsUsersProductsPendant);
//router.get('/get-user/:id', usersController.getAdminInfo);

//metodos post enviar
router.post('/new-user', usersController.saveUser);
router.post('/new-admin', usersController.saveAdmin);
router.post('/create-game', usersController.createGame);
router.post('/edit-game', usersController.editGame);
router.post('/create-categorie', usersController.createCategorie);
router.post('/edit-categorie', usersController.editCategorie);
router.post('/create-tournament', usersController.createTournament);
router.post('/edit-tournament', usersController.editTournament);
router.post('/create-ticket', usersController.createTicket);
router.post('/edit-ticket', usersController.editTicket);
router.post('/create-product', usersController.createProduct);
router.post('/edit-product', usersController.editProduct);
router.post('/edit-transaction', usersController.editTransaction);
router.post('/add-points', usersController.addPoints);
router.post('/create-transaction', usersController.createTransaction);
router.post('/ticket-transaction', usersController.createTicketTransaction);
router.post('/tournament-subscription', usersController.tournamentSubscription);
router.post('/login', usersController.login);
router.post('/user-id', usersController.getUserById);
router.post('/formulario', usersController.formularioCorreo);
router.post('/mail-product', usersController.correoProducts);
router.post('/mail-tournament', usersController.correoTournaments);
router.post('/mail-ticket', usersController.correoTickets);
router.post('/mail-transaction-accept', usersController.correoAcceptTransaction);
router.post('/mail-transaction-denied', usersController.correoRechazarTransaction);
router.post('/upload-image/:id?/:class?/:type?',md_uploadImage,usersController.uploadImage);
router.post('/upload-rule/:id?',md_uploadRule,usersController.uploadRule);
router.post('/download-pdf', usersController.downloadPDF);
router.post('/load-products-id', usersController.loadProductById);
//router.post('/formulario', usersController.formularioCorreo);


//metodos put actualizar
//router.put('/login', usersController.saveAdmin);

//metodos delete borrar
router.post('/delete-game', usersController.deleteGame);
router.post('/delete-categorie', usersController.deleteCategorie);
router.post('/delete-tournament', usersController.deleteTournament);
router.post('/delete-product', usersController.deleteProduct);
router.post('/delete-ticket', usersController.deleteTicket);


module.exports = router;