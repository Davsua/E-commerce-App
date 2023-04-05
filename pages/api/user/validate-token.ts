import { db } from '<@davsua>/database';
import { User } from '<@davsua>/models';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { jwt } from '<@davsua>/utils';

type Data =
  | { message: string }
  | {
      token: string;
      user: {
        email: string;
        name: string;
        role: string;
      };
    };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return checkJWT(req, res);

    default:
      res.status(400).json({ message: 'Bad request' });
  }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // en postman debo crear la nueva cookie con un valor para poder recibirlo
  const { token = '' } = req.cookies;

  let userId = '';

  try {
    //confirmar que sea un jwt valido
    userId = await jwt.isValidToken(token);
  } catch (error) {
    return res.status(401).json({ message: 'token de autorizacion invalido' });
  }

  await db.connect();
  const user = await User.findById(userId).lean();
  await db.disconnect();

  if (!user) {
    return res.status(400).json({ message: 'no existe usuario con ese id' });
  }

  const { _id, email, role, name } = user;

  return res.status(200).json({
    token: jwt.signToken(_id, email),
    user: {
      email,
      role,
      name,
    },
  });
};
