"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const appRoutes_1 = __importDefault(require("./controllers/appRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const connectionString = process.env.ATLAS_URL;
if (!connectionString) {
    console.error('ATLAS_URL is not defined in your .env file');
    process.exit(1);
}
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api', appRoutes_1.default);
mongoose_1.default
    .connect(connectionString)
    .then(() => {
    console.log('MONGO DB Success');
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
})
    .catch((err) => console.error('MONGO DB FAIL', err));
