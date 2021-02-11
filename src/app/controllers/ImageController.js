import Image from '../models/Image';

const ImageController = {
  async store(req, res, next) {
    const { originalname: name, filename: path } = req.file;
    const image = await Image.create({
      name,
      path,
    });

    const icon = await Image.create({
      name: req.iconFile.originalname,
      path: req.iconFile.filename,
    });

    return res.json({ image, icon });
  },
};

export default ImageController;
