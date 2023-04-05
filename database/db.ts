import mongoose from 'mongoose';

/**
 * 0: disconnected
 * 1: connected
 * 2: connecting
 * 3: disconnecting
 */

const mongoConnection = {
  isConnected: 0,
};

export const connect = async () => {
  if (mongoConnection.isConnected) {
    console.log('ya estabamos conectados');
    return;
  }

  // si hay mas de una conexion
  if (mongoose.connections.length > 0) {
    // igualo a la primera conexion y la aplico
    mongoConnection.isConnected = mongoose.connections[0].readyState;

    if (mongoConnection.isConnected === 1) {
      console.log('Usando conexion anterior');
      return;
    }

    // si tengo otro estado diferente a 1, me desconecto
    await mongoose.disconnect();
  }

  await mongoose.connect(process.env.MONGO_URL || ''); //connect to db
  mongoConnection.isConnected = 1;
  console.log('conectado a mongodb ' + process.env.MONGO_URL + ' db');
};

export const disconnect = async () => {
  // confirmar si estamos en desarrollo, si lo estamos, NO ME DESCONECTO
  if (process.env.NODE_ENV === 'development') return;

  // si es 0 significa que ya estoy desconectado, no tendria que ejecutar nada
  if (mongoConnection.isConnected === 0) return;

  await mongoose.disconnect();
  mongoConnection.isConnected = 0;
  console.log('desconectando de mongoDb');
};
