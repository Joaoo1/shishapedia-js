import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        moderator: Sequelize.BOOLEAN,
        google_id: Sequelize.NUMBER,
        facebook_id: Sequelize.NUMBER,
        reset_password_token: Sequelize.STRING,
        reset_password_expires: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (user) => {
      /* Just execute it if password was informed,
        for example, in the case it's a update and
        password has not changed */
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Image, { foreignKey: 'image_id', as: 'image' });
    this.belongsTo(models.Image, { foreignKey: 'icon_id', as: 'icon' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  generatePasswordReset() {
    this.reset_password_token = crypto.randomBytes(20).toString('hex');
    this.reset_password_expires = Date.now() + 3600000; // expires in an hour
  }
}

export default User;
