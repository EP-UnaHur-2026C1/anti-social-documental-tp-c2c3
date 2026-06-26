import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Error en Redis Client', err));
redisClient.on('connect', () => console.log('Conexión a Redis establecida con éxito.'));

// Función para inicializar la conexión
export const connectRedis = async () => {
  await redisClient.connect();
};

export default redisClient;