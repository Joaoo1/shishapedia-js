import * as Yup from 'yup';
import MixIndication from '../models/MixIndication';

const MixIndicationController = {
  async store(req, res) {
    const schema = Yup.object().shape({
      essence1Proportion: Yup.number().required(
        'Insira a proporção em (%) da essência 1'
      ),
      essence2Proportion: Yup.number().required(
        'Insira a proporção em (%) da essência 2'
      ),
      essence1Name: Yup.string().required('Insira o nome da essência 1'),
      essence2Name: Yup.string().required('Insira o nome da essência 2'),
      essence1Brand: Yup.string().required('Insira a marca da essência 1'),
      essence2Brand: Yup.string().required('Insira a marca da essência 2'),
      categoryId: Yup.number(),
      description: Yup.string(),
      authorId: Yup.number(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });

        return res.status(500).json({ errors: validationErrors });
      }

      return res
        .status(500)
        .json({ error: 'Ocorreu um erro na validação dos dados' });
    }

    const { essence1Proportion, essence2Proportion } = req.body;

    const totalProportion =
      parseInt(essence1Proportion, 10) + parseInt(essence2Proportion, 10);

    if (totalProportion !== 100) {
      return res.status(400).json({ error: 'Proporção precisa ter 100%.' });
    }

    const { id } = await MixIndication.create(req.body);

    return res.status(201).json({ id });
  },
};

export default MixIndicationController;
