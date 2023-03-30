import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const productsCategoriesModel = sequelize.define(
  "productCategory",
  {
    productCategoryId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
  },
  { timestamps: false }
);
export default productsCategoriesModel;
