console.log("UnaHur - Anti-Social net");
// Bueno aca se descarga express, dejo el comando:
// npm i express dotenv

import express from 'express';
import connectDB from './config/database.js'; // Importamos la conexion MongoDB

import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
    res.send('API Anti-Social funcionando'); // Lo hice para saber si funciona todo lo mas bien.
});

connectDB(); 

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`); // Aca estoy medio confundido con Express, no se si es https o http
});

