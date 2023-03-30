import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import CategoriesModel from "../categories/model.js";
import productsCategoriesModel from "./productsCategoriesModel.js";

const productsModel = sequelize.define("product", {
  name: { type: DataTypes.STRING(50), allowNull: false },
  // category: { type: DataTypes.STRING(50), allowNull: false },
  description: { type: DataTypes.STRING(500), allowNull: false },
  imageURL: { type: DataTypes.STRING(500) },
  price: { type: DataTypes.INTEGER, allowNull: false },
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
});

productsModel.belongsToMany(CategoriesModel, {
  through: productsCategoriesModel,
  foreignKey: { name: "productId", allowNull: false },
});
CategoriesModel.belongsToMany(productsModel, {
  through: productsCategoriesModel,
  foreignKey: { name: "categoryId", allowNull: false },
});

export default productsModel;
