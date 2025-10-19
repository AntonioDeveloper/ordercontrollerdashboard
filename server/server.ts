import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import route from './controllers/appRoutes';

dotenv.config();

const app = express();
const port = 3001;
const connectionString = process.env.ATLAS_URL;
if (!connectionString) {
  console.error('ATLAS_URL is not defined in your .env file');
  process.exit(1);
}

app.use(express.json());

app.use(cors());

app.use('/api', route);

mongoose
  .connect(connectionString)
  .then(() => {
    console.log('MONGO DB Success');
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((err) => console.error('MONGO DB FAIL', err));
