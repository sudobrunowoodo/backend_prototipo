const express = require('express');
require('dotenv').config();
const logger = require('./shared/logger/logger');
const loggerHTTP = require('./shared/middlewares/middlewareLogger');
const userRoutes = require('./modules/users/users.routes');
const jobsRouter = require('./modules/jobs/jobs.routes');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

app.use(loggerHTTP);
app.use(express.json());

app.get('/', ( req, res ) => {
    res.status(200).json({
        message: 'Bem-vindo ao servidor.'
    });
});

app.use('/api/auth', userRoutes);
app.use('/api', jobsRouter);

logger.info("Start Server Application", {
    enviroment: 'development',
    port: PORT
});


app.listen(PORT, () => {
    console.log(`O servidor está rodando em: http://${HOST}:${PORT}`); 
});