import * as Yup from 'yup';
import MixIndication from '../models/MixIndication';

const MixIndicationController = {
  async store(req, res) {
    const schema = Yup.object().shape({
      essence1Proportion: Yup.number().required(),
      essence2Proportion: Yup.number().required(),
      essence1Name: Yup.string().required(),
      essence2Name: Yup.string().required(),
      essence1Brand: Yup.string().required(),
      essence2Brand: Yup.string().required(),
      categoryId: Yup.number().required(),
      description: Yup.string(),
      authorId: Yup.number(),
    });

    // TODO: Return data for form
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
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
