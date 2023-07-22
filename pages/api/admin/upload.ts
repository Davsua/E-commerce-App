import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

import { v2 as cloudinary } from 'cloudinary';
// autenticacion de clodinary con la llave sexreta y publica proporcionada por cloudinary
cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = {
  message: string;
};

export const config = {
  api: {
    bodyParser: false, // No parsear el body, dejarlo como viene
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return uploadFile(req, res);

    default:
      res.status(400).json({ message: 'Bad request' });
  }
}

/* ----------------
    Inicio de subir archivos en file system - NO RECOMENDADO
--------------------*/

/*const saveFile = async (file: File) => {
  // leer el archivo
  const data = fs.readFileSync(file.filepath);
  // guardar archivo en la carpeta que yo quiero copn el nombre que quiero, enviar la data
  fs.writeFileSync(`./public/${file.originalFilename}`, data);
  // eliminar archivo que esta en el fs temporal (evita que se llene de basura)
  fs.unlinkSync(file.filepath);
  return;
};

const parseFiles = async (req: NextApiRequest) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      const filePath = await saveFile(files.file as File);
      resolve(filePath);
    });
  });
};

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await parseFiles(req);

  return res.status(200).json({ message: 'Subida correctamente' });
};
*/

/* ----------------
    Fin de subir archivos en file system - NO RECOMENDADO
--------------------*/

const saveFile = async (file: formidable.File): Promise<string> => {
  const { secure_url } = await cloudinary.uploader.upload(file.filepath);
  return secure_url;
};

const parseFiles = async (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      // console.log({ err, fields, files });

      if (err) {
        return reject(err);
      }

      // tomar el string de saveFiles (url) y guardarlo como una file de formidable
      const filePath = await saveFile(files.file as formidable.File);
      resolve(filePath as any);
    });
  });
};

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const imageUrl = await parseFiles(req);

  //devolver la url publica de la imagen
  return res.status(200).json({ message: imageUrl });
};
