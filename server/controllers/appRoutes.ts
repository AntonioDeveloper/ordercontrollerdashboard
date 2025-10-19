import express from 'express';
import { getAllOrders, updateOrder } from './orderController';
import { getAllClients } from './clientController';

const route = express.Router();

route.get('/orders', getAllOrders);
route.get('/clients', getAllClients);

route.put('/orders/update/:id', updateOrder);

export default route;
