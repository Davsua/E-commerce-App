import { db } from '<@davsua>/database';
import { IUser } from '<@davsua>/interfaces';
import { User } from '<@davsua>/models';
import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = { message: string } | IUser[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getUser(req, res);

    case 'PUT':
      return updateUser(req, res);

    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
}

const getUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();

  // menos la password
  const users = await User.find().select('-password').lean();

  await db.disconnect();

  res.status(200).json(users);
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId = '', role = '' } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Bad Request, no existe usuario por ese id' });
  }

  const validRoles = ['admin', 'super-user', 'SEO', 'client'];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Bad Request - Rol no permitido ' + validRoles.join(', ') });
  }

  await db.connect();

  const user = await User.findById(userId);

  if (!user) {
    await db.disconnect();
    return res.status(400).json({ message: 'Usuario NO existe ' + userId });
  }

  user.role = role;

  await user.save();
  await db.disconnect();

  res.status(200).json({ message: 'Usuario actualizado' });
};
