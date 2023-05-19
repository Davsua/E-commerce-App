import { User } from '<@davsua>/models';
import { db } from '.';
import bcrypt from 'bcryptjs';
import { disconnect } from './db';

export const checkUserEmailPassword = async (email: string, password: string) => {
  await db.connect();

  const user = await User.findOne({ email });

  await db.disconnect();

  if (!user) {
    //se regresa null pq inidica credenciales incorrectas y error
    return null;
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    // comparacion sincrona
    // si la contraseña puesta y la guardada en BD no coinciden
    return null;
  }

  const { role, name, _id } = user;

  return {
    id: _id,
    email: email.toLocaleLowerCase(),
    role,
    name,
  };
};

// crear o verificar user de OAuth (redes sociales)

export const oAuthDbUser = async (oAuthEmail: string, oAuthName: string) => {
  await db.connect();
  const user = await User.findOne({ email: oAuthEmail });

  if (user) {
    await db.disconnect();
    const { _id, name, email, role } = user;
    return { _id, name, email, role };
  }

  const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'client' });
  await newUser.save();

  const { _id, name, email, role } = newUser;
  return { _id, name, email, role };
};
