import jwt from 'jsonwebtoken';

export const signToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('No hay semilla de JWT - revisar variables de entorno');
  }

  //generador de tokens

  return jwt.sign(
    //payload
    { _id, email },

    //Seed
    process.env.JWT_SECRET_SEED,

    //opciones
    { expiresIn: '30d' }
  );
};

export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('No hay semilla de JWT - revisar variables de entorno');
  }

  if (token.length <= 10) {
    return Promise.reject('JWT no es valido');
  }

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
        //callback para recuperar el payload ( reconstruccion del que se creo anteriormente -> signToken)

        // -> si hay un error..
        if (err) return reject('JWT no valido');

        // -> tomar el id del payload
        const { _id } = payload as { _id: string };

        // -> resolver el id
        resolve(_id);
      });
    } catch (error) {
      reject('JWT no valido');
    }
  });
};
