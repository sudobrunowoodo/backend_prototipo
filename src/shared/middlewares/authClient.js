require('dotenv').config();
const logger = require('../logger/logger');
const jwt = require('jsonwebtoken');

const JWT_KEY = process.env.JWTKEYCLIENTS;

if (!JWT_KEY){
    logger.error("Chave JWT não encontrada nas variáveis de ambiente.");
    throw new Error("Chave JWT é ovrigatória.");
}

const autenticarTokenCLient = ( req, res, next ) => {
    try{
        const autHeader = req.headers['authorization'];
        const token = autHeader && autHeader.split(' ')[1];

        if (!token) {
            logger.warn('Token não fornecido', {
                url: req.url,
                method: req.method,
                ip: req.ip
            });
            return res.status(401).json({
                error: 'Token para autenticação é obrigatório.'
            });
        }

        jwt.verify(token, JWT_KEY, ( error, user ) => {
            if (error) {
                logger.warn('Token inválido ou expirou.', {
                    error: error.message,
                    url: req.url,
                    ip: req.ip
                });
                return res.status(403).json({
                    error: 'Token inválido ou expirou.'
                });
            }

            req.user = user;
            logger.info('Usuário autenticado', {
                userId: user.id,
                email: user.email,
                url: req.url,
                method: req.method
            });
            next();
        });

    } catch(error){
        logger.error('Erro na autenticação', {
            error: error.message,
            stack: error.stack
        });
        return res.status(500).json({
            error: 'Erro interno do servidor.'
        });
    }
};

module.exports = autenticarTokenCLient;