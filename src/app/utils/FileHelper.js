import sharp from 'sharp';
import { resolve } from 'path';
import crypto from 'crypto';

import Essence from '../models/Essence';
import Image from '../models/Image';

const compressImageToIcon = (req, res, next) => {
  if (req.file) {
    const dest = resolve(__dirname, '..', '..', '..', 'tmp', 'uploads');
    const path = `${dest}/ic_${req.file.filename}`;
    sharp(req.file.path)
      .resize(80)
      .toFile(path)
      .then(
        () => {
          req.iconFile = {
            filename: `ic_${req.file.filename}`,
            originalname: req.file.originalname,
          };
          return next();
        },
        () => res.status(501).json({ error: 'Erro ao salvar imagem.' })
      );
  } else {
    return res.status(500).json({ error: 'File not found ' });
  }
};

const createMixImage = async (req, res, next) => {
  const essence1 = await Essence.findByPk(req.body.essence1_id, {
    include: [
      {
        model: Image,
        as: 'image',
        attributes: ['url', 'path'],
      },
    ],
  });

  const essence2 = await Essence.findByPk(req.body.essence2_id, {
    include: [
      {
        model: Image,
        as: 'image',
        attributes: ['url', 'path'],
      },
    ],
  });

  if (!essence1 || !essence2) {
    return res.status(400).json({ error: 'ID da essência está inválido' });
  }

  const dest = resolve(__dirname, '..', '..', '..', 'tmp', 'uploads');
  const path1 = `${dest}\\${essence1.image.path}`;
  const path2 = `${dest}\\${essence2.image.path}`;

  const png1 = await sharp(path1).resize(240).png().toBuffer();
  const png2 = await sharp(path2).resize(240).png().toBuffer();

  const mixFilename = `mix_${crypto.randomBytes(10).toString('hex')}.png`;
  try {
    await sharp({
      create: {
        width: 480,
        height: 440,
        background: { r: 255, g: 255, b: 255 },
        channels: 3,
      },
    })
      .composite([
        {
          input: png1,
          gravity: 'west',
        },
        {
          input: png2,
          gravity: 'east',
        },
      ])
      .toFile(`${dest}/${mixFilename}`);

    req.file = {
      originalname: mixFilename,
      filename: mixFilename,
      path: `${dest}/${mixFilename}`,
    };
    return next();
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

export { compressImageToIcon, createMixImage };
