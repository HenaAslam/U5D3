//  reviews should include user who posted that review

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

export default usersRouter;
