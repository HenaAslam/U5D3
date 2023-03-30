import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const CategoriesModel = sequelize.define("category", {
  categoryId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  categoryName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

export default CategoriesModel;
