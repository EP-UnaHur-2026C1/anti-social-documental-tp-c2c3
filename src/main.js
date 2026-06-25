console.log("UnaHur - Anti-Social net");
// Bueno aca se descarga express, dejo el comando:
// npm i express dotenv
import cors from 'cors';
import express from 'express';
import connectDB from './config/database.js'; // Importamos la conexion MongoDB
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import tagRoutes from './routes/tagRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const swaggerDocument = YAML.load('./swagger.yaml');
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/tags', tagRoutes);

app.get('/', (req, res) => {
    res.send('API Anti-Social funcionando'); // Lo hice para saber si funciona todo lo mas bien.
});

connectDB(); 

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`); 
    // Aca estoy medio confundido con Express, no se si es https o http
    // Por ahora nos conviene dejar HTTP, lo estamos levantando solo local.
});

