const userServices = require('./user.service');
const logger = require('../../shared/logger/logger');

exports.cadastrarUsuarioController = async ( req, res ) => {
    try {
        const { nomeUsuario, email, senha, permissao } = req.body;

        if ( !nomeUsuario || !email || !senha || !permissao){
            return res.status(400).json({
                error: 'Campos necessários: nome, e-mail, senha e permissao.'
            });
        }

        const user = await userServices.cadastrarUsuario( nomeUsuario, email, senha, permissao );

        res.status(201).json({
            message: 'Usuário cadastrado com sucesso',
            user
        });
    } catch(error) {
        logger.error('Erro ao cadastrar Usuário. ', {
            error: error.message
        });

        res.status(400).json({
            error: error.message
        });
    }
};

exports.loginUserController = async ( req, res ) => {
    try {
        const { email, senha } = req.body;
        if ( !email, !senha ) {
            return res.status(400).json({
                error: 'E-mail e senha são campos obrigatórios e devem ser preenchidos.'
            });
        }

        const result = await userServices.loginUser( email, senha );

        res.json({
            message: 'Login realizado com sucesso',
            user: result.user,
            token: result.token
        });
    } catch (error) {
        res.status(401).json({
            error: error.message
        });
    }
};

exports.getAllUsersController = async ( req, res ) => {
    try {
        logger.info('Listando Usuários');

        const users = await userServices.getAllUsers();

        logger.info('Usuários listados com sucesso.', {
            count: users.length,
        });

        res.status(200).json({
            users,
            count: users.length
        });

    } catch (error){
        logger.error('Erro ao listar Usuários.', {
            error: error.message,
            stack: error.stack
        });

        res.status(500).json({ 
            error: error.message
        });

    }
};

exports.getUserByIdController = async ( req, res ) => {
    try {
        logger.info('Buscando usuário pelo id',{
            userToFindId: req.params.id,
        });

        const { id } = req.params;
        if ( !id || isNaN( Number(id) ) ) {
            logger.warn('Id inválido fornecido.', {
                userId: id,
            });
            return res.status(400).json({
                error: 'Id não fornecido ou não era um número.'
            });
        }

        const userById = await userServices.getUserById(Number(id));
        if (!userById) {
            logger.warn('Usuário não encontrado.',{
                userToFindId: id,
            });
            return res.status(404).json({
                error: 'Usuário não encontrado.'
            });
        }

        logger.info('Usuário encontrado.',{
            userId: userById.id,
            userName: userById.nome,
        });

        res.status(200).json({userById});
        
    } catch (error) {
        logger.error('Erro ao listar Usuário.', {
            error: error.message,
            stack: error.stack
        });

        res.status(500).json({ 
            error: error.message
        });

    }
};

exports.changeUserPermissionController = async ( req, res ) => {
    try {
        const { id } = req.params;
        const permissao = req.body.permissao;

        logger.info('Iniciando atualização de permissão do usuário.', {
            userId: id
        });

        if ( !id || isNaN( Number(id) ) ) {
            logger.warn('Id de usuário inválido.', {
                id
            });

            return res.status(400).json({
                error: 'Id não recebida ou não é um número.'
            });
        }

        if (!permissao) {
            logger.warn('Permissão nova do usuário não recebida.', {
                id
            });

            return res.status(400).json({
                error: 'Permissão nova do usuário não recebida.'
            });
        }

        const updatedUser = await userServices.changeUserPermission( Number(id), permissao );

        if (!updatedUser) {
            logger.warn('Produto não encontrado para atualização', {
                userToUpdateId: id
            });
            return res.status(404).json({
                error: 'Usuároa não encontrado.'
            });
        }

        logger.info('Permissão de usuário atualizada com sucesso.', {
            userToUpdateId: id
        });

        res.status(200).json({
            message: 'Permissão de usuário alterada com sucesso.',
            user: updatedUser
        });
        
    } catch (error) {
        logger.error('Erro ao alterar permissões do Usuário.', {
            error: error.message,
            stack: error.stack
        });

        res.status(500).json({ 
            error: error.message
        });
    }
};

exports.deleteUserByIdController = async ( req, res ) => {
    try {
        const { id } = req.params;
        
        logger.info('Início da deleção do usuário.', {
            userToDeleteId: id
        });

        if ( !id || isNaN( Number(id) ) ) {
            logger.warn('Id não informado ou inválido.',{
                id
            });

            res.status(400).json({
                error: 'A Id não foi informada ou não é um número.'
            });
        }

        const deleting = await userServices.deleteUserById( id );

        if (!deleting) {
            logger.warn('Usuário não encontrado no banco de dados.', {
                userToDeleteId: id
            });

            return res.status(400).json({
                error: 'Usuário não encontrado.'
            });
        }

        logger.info('Produto deletado com sucesso', {
            userToDeleteId: id
        });

        res.status(200).json({
            message: 'Usuário deletado com sucesso.'
        });
        
    } catch (error) {
        logger.error('Erro ao deletar o Usuário.', {
            userToDeleteId: req.params.id,
            error: error.message,
            stack: error.stack
        });

        res.status(500).json({ 
            error: error.message
        });
    }
};