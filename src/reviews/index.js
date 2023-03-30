import express from "express";
import reviewsModel from "./model.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const { reviewId } = await reviewsModel.create({
      productId: req.params.productId,
      ...req.body,
    });
    res.status(201).send(reviewId);
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
