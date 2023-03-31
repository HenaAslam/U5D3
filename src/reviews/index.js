import express from "express";
import reviewsModel from "./model.js";
import createHttpError from "http-errors";

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

reviewsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const [numberOfupdatedRecords, updatedRecords] = await reviewsModel.update(
      req.body,
      {
        where: { reviewId: req.params.reviewId },
        returning: true,
      }
    );
    if (numberOfupdatedRecords === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(
          404,
          `review with id ${req.params.reviewId} does not exist`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      const numberOfdeletedReviews = await reviewsModel.destroy({
        where: { reviewId: req.params.reviewId },
      });
      if (numberOfdeletedReviews === 1) {
        res.status(204).send();
      } else {
        next(
          createHttpError(
            404,
            `review with id ${req.params.reviewId} does not exist`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
export default reviewsRouter;
