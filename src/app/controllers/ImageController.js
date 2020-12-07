import Image from '../models/Image';

const ImageController = {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const image = await Image.create({
      name,
      path,
    });

    return res.json(image);
  },
};

export default ImageController;
