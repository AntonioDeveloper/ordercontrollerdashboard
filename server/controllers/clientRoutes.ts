import express from 'express';
import { getAllOrders, updateOrder } from './clientController';

const route = express.Router();

route.get('/orders', getAllOrders);
route.put('/orders/update/:id', updateOrder);

export default route;
