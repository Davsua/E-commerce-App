import { db } from '<@davsua>/database';
import { User } from '<@davsua>/models';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { jwt, validations } from '<@davsua>/utils';

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
    case 'POST':
      return registerUser(req, res);

    default:
      res.status(400).json({ message: 'Bad request' });
  }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = '', password = '', name = '' } = req.body;

  if (password.length < 6) {
    return res.status(400).json({ message: 'la contraseña debe tener minimo 6 caracteres' });
  }

  if (name.length < 2) {
    return res.status(400).json({ message: 'el nombre debe tener minimo 2 caracteres' });
  }

  // si el correo no es valido
  if (!validations.isValidEmail(email)) {
    return res.status(400).json({ message: 'el correo no es valido' });
  }

  await db.connect();
  const user = await User.findOne({ email });

  //si ya existe un usuario con ese correo

  if (user) {
    return res.status(400).json({ message: 'Este usuario ya existe, no se puede usar este correo' });
  }

  //crear usuarion nuevo

  const newUser = new User({
    email: email.toLocaleLowerCase(),
    password: bcrypt.hashSync(password),
    role: 'client',
    name,
  });

  // confirmar que todo salga bien o coger el error
  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Revisar logs del servidor' });
  }

  const { _id, role } = newUser;

  // crear el token
  const token = jwt.signToken(_id, email);

  return res.status(200).json({
    token: token,
    user: {
      email,
      role,
      name,
    },
  });
};
