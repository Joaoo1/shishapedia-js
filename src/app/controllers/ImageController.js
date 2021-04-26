import Image from '../models/Image';

const ImageController = {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const image = await Image.create({
      name,
      path,
    });

    if (req.iconFile) {
      const icon = await Image.create({
        name: req.iconFile.originalname,
        path: req.iconFile.filename,
      });

      return res.json({ image, icon });
    }

    return res.json({ image });
  },
};

export default ImageController;
