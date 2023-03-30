import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import reviewsModel from "../reviews/model.js";

const usersModel = sequelize.define("user", {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

export default usersModel;
