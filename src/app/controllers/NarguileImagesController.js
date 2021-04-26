import * as Yup from 'yup';
import Image from '../models/Image';

const NarguileImagesController = {
  async index(req, res) {
    const schema = Yup.object().shape({
      images: Yup.array().required(),
    });

    console.log(req.body, 'params', req.params);

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    try {
      const imagesUrl = req.body.images.map((i) => {
        async function fetchUrl() {
          const { url } = await Image.findByPk(i);
          return url;
        }

        return fetchUrl();
      });

      return Promise.all(imagesUrl)
        .then((data) => res.json(data))
        .then(() => res.json([]));
    } catch (err) {
      return res.status(500).json({ error: 'Ocorreu um erro no servidor' });
    }
  },
};

export default NarguileImagesController;
