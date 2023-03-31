import express from "express";
import usersModel from "./model.js";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const { userId } = await usersModel.create(req.body);
    res.status(201).send(userId);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await usersModel.findAll({
      attributes: ["name", "surname"],
    });
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await usersModel.findByPk(req.params.userId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `user with id ${req.params.userId} does not exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const [numberOfupdatedRecords, updatedRecords] = await usersModel.update(
      req.body,
      {
        where: { userId: req.params.userId },
        returning: true,
      }
    );
    if (numberOfupdatedRecords === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(404, `user with id ${req.params.userId} does not exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});
usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const numberOfdeletedUsers = await usersModel.destroy({
      where: { userId: req.params.userId },
    });
    if (numberOfdeletedUsers === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `user with id ${req.params.userId} does not exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
