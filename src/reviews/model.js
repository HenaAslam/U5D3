import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import productsModel from "../products/model.js";
import usersModel from "../users/model.js";

const reviewsModel = sequelize.define("review", {
  reviewId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  content: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

productsModel.hasMany(reviewsModel, {
  foreignKey: { name: "productId", allowNull: false },
});
reviewsModel.belongsTo(productsModel, {
  foreignKey: { name: "productId", allowNull: false },
});

usersModel.hasMany(reviewsModel, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});

reviewsModel.belongsTo(usersModel, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});

export default reviewsModel;
