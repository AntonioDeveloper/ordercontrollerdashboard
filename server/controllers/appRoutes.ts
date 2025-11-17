import express from 'express';
import { createOrder, getAllOrders, updateOrder } from './orderController';
import {
  getAllClients,
  signUpClient,
  updateClient,
  loginClient,
} from './clientController';
import { getAllMenu } from './menuController';
import { analyzeNutrition } from './nutritionController';

const route = express.Router();

route.get('/orders', getAllOrders);
route.get('/clients', getAllClients);
route.get('/menu', getAllMenu);

route.put('/clients/update/:id', updateClient);
route.put('/orders/update/:id', updateOrder);

route.post('/signUpClient', signUpClient);
route.post('/createOrder', createOrder);
route.post('/loginClient', loginClient);
route.post('/analyzeNutrition', analyzeNutrition);

export default route;
