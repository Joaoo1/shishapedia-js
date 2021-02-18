import * as Yup from 'yup';
import sgMail from '@sendgrid/mail';
import { Op } from 'sequelize';

import recoverPasswordHtml from '../views/RecoverPassword.js';
import User from '../models/User';
import SuccessfulUpdatePassword from '../views/SuccessfulUpdatePassword.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const RecoverPassword = {
  async recover(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(401).json({
        error: `O endereço de email ${req.body.email} 
        não está associado com nenhuma conta. Verifique seu email e tente novamente.`,
      });
    }

    try {
      user.generatePasswordReset();

      await user.save();

      // send email
      const link = `https://${req.headers.host}/reset_password/${user.reset_password_token}`;
      const mailOptions = {
        to: user.email,
        from: process.env.FROM_EMAIL,
        subject: 'Requisição para alteração de senha - Shishapedia',
        text: `Olá ${user.name} \n 
          Para resetar a sua senha, clique neste link: ${link}  \n\n 
          Se você não solicitou isso, por favor ignore isso e sua senha continuará inalterada.\n`,
      };

      return sgMail.send(mailOptions, (error) => {
        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({
          message: `Um email foi enviado para ${user.email}`,
        });
      });
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'Ocorreu um erro ao enviar email de recuperação.' });
    }
  },

  async resetPassword(req, res) {
    const schema = Yup.object().shape({
      password: Yup.string().min(6).required(),
      confirm_password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    if (req.body.password !== req.body.confirm_password) {
      return res.status(400).json({ error: 'Senhas não conferem.' });
    }

    const user = await User.findOne({
      where: {
        reset_password_token: req.params.token,
        reset_password_expires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(401).json({
        message: `Token inválido.`,
      });
    }

    try {
      // Set the new password
      user.password = req.body.password;
      user.reset_password_token = null;
      user.reset_password_expires = null;

      // Save
      await user.save();

      // send email
      const mailOptions = {
        to: user.email,
        from: process.env.FROM_EMAIL,
        subject: 'Sua senha foi alterada - Shishapedia',
        text: `Olá ${user.name} \n 
               Está é uma confirmação a senha de sua conta Shishapedia foi alterada.\n\n
               Se não foi você que fez isso, entre em contato 
               com nossa equipe através da aba ajuda dentro do App, e informe seu email.`,
      };

      return sgMail.send(mailOptions, (error) => {
        if (error) return res.status(500).json({ message: error.message });

        return res.send(SuccessfulUpdatePassword());
      });
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'Ocorreu um erro ao enviar email de recuperação.' });
    }
  },

  resetView(req, res) {
    res.send(recoverPasswordHtml(req.params.token));
  },
};

export default RecoverPassword;
