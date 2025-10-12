const express = require('express');
const router = express.Router();
const userControllers = require('./users.controller');
const autenticarToken = require('../../shared/middlewares/auth');
const autenticarTokenClient = require('../../shared/middlewares/authClient');
const autenticarTokenAdm = require('../../shared/middlewares/authAdm');

router.post('/register', userControllers.cadastrarUsuarioController);
router.post('/login', userControllers.loginUserController);
router.get('/clients', autenticarTokenAdm, userControllers.getAllUsersController);
router.get('/client/:id', autenticarTokenAdm, userControllers.getUserByIdController);
router.put('/permit/:id', autenticarTokenAdm, userControllers.changeUserPermissionController);
router.delete('/deleteUser/:id', autenticarTokenAdm, userControllers.deleteUserByIdController);

module.exports = router;