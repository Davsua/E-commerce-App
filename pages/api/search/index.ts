import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
};

// aparecera cuando no se le envie el query a search
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(400).json({ message: 'Debe de especificar el query de busqueda' });
}
