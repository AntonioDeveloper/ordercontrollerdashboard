'use server';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginClient = exports.signUpClient = exports.updateClient = exports.getOneClient = exports.getAllClients = void 0;
const client_1 = __importDefault(require("../models/client"));
const mongoose_1 = __importDefault(require("mongoose"));
const normalizePhone = (value) => value.replace(/\D/g, '');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllClients = async (req, res) => {
    try {
        const allOrdersData = await client_1.default.find().lean().exec();
        return res.status(200).json(allOrdersData ?? []);
    }
    catch (error) {
        return res.status(500).json({ errorMessage: String(error) });
    }
};
exports.getAllClients = getAllClients;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getOneClient = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ errorMessage: 'Missing data query' });
        }
        const name = req.body.query;
        const foundClient = await client_1.default.findOne({
            nome_cliente: name,
        }).exec();
        return res.status(200).json(foundClient ?? []);
    }
    catch (error) {
        console.error('Error data query:', error);
        res.status(500).json({ errorMessage: String(error) });
    }
};
exports.getOneClient = getOneClient;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateClient = async (req, res) => {
    try {
        const id = req.params.id;
        // Valida o formato do ID com o Mongo DB
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ errorMessage: 'Invalid ID format' });
        }
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ errorMessage: 'Update data is required' });
        }
        const clientId = await client_1.default.findById(id);
        if (!clientId) {
            return res.status(404).json({ errorMessage: 'Client not found' });
        }
        const updatedData = await client_1.default.findByIdAndUpdate(id, {
            $set: {
                nome_cliente: req.body.clientData.nome_cliente,
                endereco: req.body.clientData.endereco,
                telefone: req.body.clientData.telefone,
            },
        }, {
            new: true,
            runValidators: true,
            context: 'query',
        });
        res.status(200).json(updatedData);
    }
    catch (error) {
        res.status(500).json({ errorMessage: String(error) });
    }
};
exports.updateClient = updateClient;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const signUpClient = async (req, res) => {
    try {
        const body = req.body?.clientData;
        if (!body || !body.nome_cliente || !body.endereco || !body.telefone) {
            return res.status(400).json({
                errorMessage: 'Campos obrigatórios: nome_cliente, endereco, telefone.',
            });
        }
        const normalizedPhone = normalizePhone(String(body.telefone));
        if (!normalizedPhone) {
            return res.status(400).json({
                errorMessage: 'Telefone inválido.',
            });
        }
        const newClient = new client_1.default({
            nome_cliente: body.nome_cliente,
            endereco: body.endereco,
            telefone: normalizedPhone,
        });
        await newClient.save();
        res.status(201).json(newClient);
    }
    catch (error) {
        const msg = String(error?.message ?? error);
        const code = error?.code;
        if (code === 11000 || msg.includes('duplicate key')) {
            return res.status(409).json({ errorMessage: 'Telefone já cadastrado.' });
        }
        res.status(500).json({ errorMessage: msg });
    }
};
exports.signUpClient = signUpClient;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loginClient = async (req, res) => {
    const { telefone } = req.body;
    if (!telefone) {
        res.status(400).json({ errorMessage: 'Telefone nulo, dado obrigatório.' });
        return;
    }
    try {
        const normalizedPhone = normalizePhone(String(telefone));
        if (!normalizedPhone) {
            return res.status(400).json({
                errorMessage: 'Telefone inválido.',
            });
        }
        const allClients = await client_1.default.find().lean().exec();
        const currentClient = allClients.find((client) => {
            if (!client.telefone)
                return false;
            return normalizePhone(String(client.telefone)) === normalizedPhone;
        });
        if (currentClient === null) {
            res.status(404).json({
                errorMessage: 'Cliente não encontrado. Favor verifique o telefone.',
            });
        }
        else {
            res.status(200).json(currentClient);
        }
    }
    catch (error) {
        console.error('Telefone não fornecido ou não encontrado. Por favor, verifique:', error);
        res.status(500).json({ errorMessage: 'Erro interno do servidor.' });
    }
};
exports.loginClient = loginClient;
