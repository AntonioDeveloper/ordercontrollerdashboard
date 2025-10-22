import express from 'express';
import { getAllOrders, updateOrder } from './orderController';
import { getAllClients, updateClient } from './clientController';

const route = express.Router();

route.get('/orders', getAllOrders);
route.get('/clients', getAllClients);

route.put('/clients/update/:id', updateClient);
// route.put('/clients/update/:id', updateClient);

export default route;
