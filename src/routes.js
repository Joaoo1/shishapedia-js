import express from 'express';

const routes = express.Router();

routes.get('/teste', (req, res) => res.send({ test: 'ok' }));

export default routes;
