import express from "express";
import createHttpError from "http-errors";
import productsModel from "./model.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { Op } from "sequelize";
import productsCategoriesModel from "./productsCategoriesModel.js";
import CategoriesModel from "../categories/model.js";
import reviewsModel from "../reviews/model.js";
import usersModel from "../users/model.js";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await productsModel.create(req.body);
    if (req.body.categories) {
      await productsCategoriesModel.bulkCreate(
        req.body.categories.map((c) => {
          return { productId: id, categoryId: c };
        })
      );
    }
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.name) query.name = { [Op.iLike]: `%${req.query.name}%` };
    if (req.query.description) {
      query.description = { [Op.iLike]: `%${req.query.description}%` };
    }
    if (req.query.minPrice && req.query.maxPrice) {
      query.price = { [Op.between]: [req.query.minPrice, req.query.maxPrice] };
    }
    if (req.query.category)
      query.category = { [Op.iLike]: `%${req.query.category}%` };
    if (req.query.search) {
      query[Op.or] = [
        { name: { [Op.iLike]: `%${req.query.search}%` } },
        { description: { [Op.iLike]: `%${req.query.search}%` } },
      ];
    }

    const { count, rows } = await productsModel.findAndCountAll({
      where: { ...query },
      limit: req.query.limit,
      offset: req.query.offset,

      order: [
        req.query.sort && req.query.direction
          ? [req.query.sort, req.query.direction]
          : ["id", "ASC"],
      ],
      include: [
        {
          model: CategoriesModel,
          attributes: ["categoryName"],
          through: { attributes: [] },
        },
        {
          model: reviewsModel,
          attributes: ["content", "reviewId"],
          include: [
            {
              model: usersModel,
              attributes: ["name", "surname"],
            },
          ],
        },
      ],
    });
    const prevOffset = parseInt(req.query.offset) - parseInt(req.query.limit);
    const nextOffset = parseInt(req.query.offset) + parseInt(req.query.limit);
    res.send({
      total: count,

      pages: Math.ceil(count / req.query.limit),
      links: {
        prevLink:
          prevOffset >= 0
            ? `${process.env.BE_URL}/products?limit=${req.query.limit}&offset=${prevOffset}`
            : null,
        nextLink:
          nextOffset <= count
            ? `${process.env.BE_URL}/products?limit=${req.query.limit}&offset=${nextOffset}`
            : null,
      },
      products: rows,
    });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:id", async (req, res, next) => {
  try {
    const product = await productsModel.findByPk(req.params.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(404, `product with id ${req.params.id} does not exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:id", async (req, res, next) => {
  try {
    const [numberOfupdatedRecords, updatedRecords] = await productsModel.update(
      req.body,
      {
        where: { id: req.params.id },
        returning: true,
      }
    );
    if (numberOfupdatedRecords === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(404, `product with id ${req.params.id} does not exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const numberOfdeletedProducts = await productsModel.destroy({
      where: { id: req.params.id },
    });
    if (numberOfdeletedProducts === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `product with id ${req.params.id} does not exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "products/image",
    },
  }),
}).single("productImg");

productsRouter.post(
  "/:id/uploadImage",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      if (req.file) {
        const product = await productsModel.findByPk(req.params.id);
        if (product) {
          product.imageURL = req.file.path;
          await product.save();
          res.send("uploaded");
        } else {
          next(
            createHttpError(
              404,
              `product with id ${req.params.product} not found`
            )
          );
        }
      } else {
        next(createHttpError(400, "upload an image"));
      }
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.post("/:productId/categories", async (req, res, next) => {
  try {
    const categories = await productsCategoriesModel.bulkCreate(
      req.body.categories.map((c) => {
        return { productId: req.params.productId, categoryId: c };
      })
    );
    res.send(categories.map((c) => c.categoryId));
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
