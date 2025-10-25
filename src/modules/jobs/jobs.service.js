const logger = require('../../shared/logger/logger');
let clients = require('../../data/clients');
let jobs = require('../../data/jobs');

exports.getAllJobs = async () => {
    try {
        const jobData = jobs.map(({usersId, clientId, ...jobData}) => jobData);
        const jobsWithClient = jobData.map( jobs => {
            const clientMatch = clients.find( clients => clients.id === jobs.clientId );
            if (clientMatch) {
                return {
                    ...jobs,
                    empresaOfertando: clientMatch.empresa
                };
            }
            return jobs;
        });

        logger.info('Vagas listados com sucesso', { count: jobsWithClient.length });

        return jobsWithClient;

    } catch (error) {
        logger.error('Erro ao listar todas as vagas.', { error: error.message });
        throw error;
    }
};