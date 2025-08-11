import express from 'express';
import { getAllClients, updateOrder } from './clientController';

const route = express.Router();

route.get('/clients', getAllClients);
route.put('/clients/update/:id', updateOrder);

export default route;
