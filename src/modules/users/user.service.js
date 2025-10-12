require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../../shared/logger/logger');
let clients = require('../../data/clients');
let administrators = require('../../data/administrators');
let jobs = require('../../data/jobs');
let users = require('../../data/users');

let allUsers = [...clients, ...users, ...administrators];

let lastId = allUsers.length;
const JWT_KEY = process.env.JWTKEY;
const JWT_KEY_CLIENT = process.env.JWTKEYCLIENTS;
const JWT_KEY_ADM = process.env.JWTKEYADM;

if (!JWT_KEY){
    logger.error("Chave JWT não encontrada nas variáveis de ambiente.");
    throw new Error("Chave JWT é obrigatória.");
}

exports.cadastrarUsuario = async ( nomeUsuario, email, senha, permissao ) => {
    try {
        if ( !nomeUsuario || !email || !senha ) {
            throw new Error("Campos de nome, e-mail e senha são obrigatórios.");
        }

        if ( senha.length < 6 ) {
            throw new Error("A senha necessita de no mínimo 6(seis) caracteres.");
            
        }

        const existeCadastro = allUsers.findIndex(users => users.email === email);
        if ( existeCadastro !== -1 ) {
            throw new Error("Usuário já cadastrado na nossa base de dados.");
        }

        const encryptPassword = await bcrypt.hash( senha, 10 );

        const newUser = {
            id: ++lastId,
            nomeUsuario,
            email,
            senha: encryptPassword,
            permissao,
            vagasId: []
        }

        allUsers.push(newUser);

        switch (newUser.permissao) {
            case "candidato":
                var keyToUse = JWT_KEY;
                break;
            case "cliente":
                var keyToUse = JWT_KEY_CLIENT;
                break;
            case "adm":
                var keyToUse = JWT_KEY_ADM;
                break;
            default:
                throw new Error("Este tipo de permissão é inválida");
        }

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, senha: newUser.senha, permissao: newUser.permissao },
            keyToUse,
            { expiresIn: "20min" }
        );

        logger.info("Usuário cadastrado com sucesso.", { userId: newUser.id, email: newUser.email });

        const { senha:_, ...userData } = newUser;
        return { userData, token };

    } catch(error){
        logger.error("Erro ao cadastrar usuário.", { error: error.message, email });
        throw error;
    }
};

exports.loginUser = async ( email, senha ) => {
    try {
        if ( !email, !senha ) {
            throw new Error("Dados de email e senha são obrigatórios.");
        }

        const userToLogin = allUsers.find(users => users.email === email);
        if ( !userToLogin ) {
            throw new Error("E-mail incorreto.");
        }

        const senhaValidada = await bcrypt.compare(senha, userToLogin.senha);
        if(!senhaValidada) {
            throw new Error("Senha inválida.");
        }

        
        switch (userToLogin.permissao) {
            case "candidato":
                var keyToUse = JWT_KEY;
                break;
            case "cliente":
                var keyToUse = JWT_KEY_CLIENT;
                break;
            case "adm":
                var keyToUse = JWT_KEY_ADM;
                break;
            default:
                throw new Error("Este tipo de permissão é inválida");
        }

        const token = jwt.sign(
            { id: userToLogin.id, email: userToLogin.email, nome: userToLogin.nome, permissao: userToLogin.permissao},
            keyToUse,
            { expiresIn: "24h" }
        );

        logger.info("Login de usuário realizado com sucesso.", { userId: userToLogin.id, email: userToLogin.email });

        const { senha:_, ...userData } = userToLogin;
        return { client: userData, token };
    } catch (error) {
        logger.error("Erro ao fazer o login do usuário.", { email, error: error.message});
        throw error;
    }

};

exports.getAllUsers = async () => {
    try{
        const usersNoPassword = allUsers.map(({senha, ...clientData}) => clientData);
        logger.info("Usuários listados com sucesso." , { qtdUsuarios: usersNoPassword.length});
        return usersNoPassword;
    } catch(error){
        logger.error("Erro ao listar todos os usuários.", { error: error.message });
        throw error;
    }
};


exports.getUserById = async (id) => {
    try{
        const findUser = allUsers.find(users => users.id === parseInt(id));
        if(!findUser) {
            throw new Error("Usuário com esse id não encontrado na nossa base de dados.");
        }
        
        const { senha, ...userData } = findUser;
        logger.info("Usuário listado com sucesso.");
        return userData;
    } catch(error){
        logger.error("Erro ao listar todos os usuários.", { error: error.message });
        throw error;
    }
};

exports.changeUserPermission = async ( id, permissao ) => {
    try {
        const updatedUser = allUsers.find( users => users.id === Number(id) );
        if (!updatedUser || updatedUser.permissao === "adm") {
            throw new Error("Usuário com o id informado não existe.");
        }

        updatedUser.permissao = permissao;

        logger.info('Permissão do usuário atualizada com sucesso.', { userId: id });
        return updatedUser;

    } catch (error) {
        logger.error('Erro ao mudar permissões desse usuário.', { error: error.message });
        throw error;
    }

};

exports.deleteUserById = async (id) => {
    try {
        const findUserIndex = allUsers.findIndex( users => users.id === Number(id) );
        if ( findUserIndex === -1 ) {
            throw new Error("Usuário não encontrado");
        }
        allUsers.splice(findUserIndex, 1);

        logger.info('Usuário deletado com sucesso.', {
            userId: id,
        });

        return true;
    } catch (error) {
        logger.error('Erro ao deletar esse usuário.', { error: error.message });
        throw error;
    }
};