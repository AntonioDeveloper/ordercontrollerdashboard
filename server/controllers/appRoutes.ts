import express from 'express';
import { createOrder, getAllOrders, updateOrder } from './orderController';
import { getAllClients, signUpClient, updateClient } from './clientController';
import { getAllMenu } from './menuController';

const route = express.Router();

route.get('/orders', getAllOrders);
route.get('/clients', getAllClients);
route.get('/menu', getAllMenu);

route.put('/clients/update/:id', updateClient);
route.put('/orders/update/:id', updateOrder);

route.post('/signUpClient', signUpClient);
route.post('/createOrder', createOrder);

export default route;
