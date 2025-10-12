const jobServices = require('./jobs.service');
const logger = require('../../shared/logger/logger');

exports.getAllJobsController = async ( req, res ) => {
    try {

        const jobs = await jobServices.getAllJobs();

        logger.info('Vagas listadas com sucesso.', {
            count: jobs.length,
            userId: req.user?.id
        });

        res.status(200).json({
            jobs,
            count: jobs.length
        });
        
        
    } catch (error) {
        logger.error('Erro ao listar vagas.', {
            userId: req.user?.id,
            error: error.message,
            stack: error.stack
        });

        res.status(500).json({ 
            error: 'Erro interno do servidor.' 
        });
    }
};