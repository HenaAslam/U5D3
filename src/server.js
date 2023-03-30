import express from "express";
import cors from "cors";
import { pgConnect } from "./db.js";
import productsRouter from "./products/index.js";
import categoriesRouter from "./categories/index.js";
import {
  badRequestErrorHandler,
  genericErrorHandler,
  notFoundErrorHandler,
} from "./errorHandlers.js";
import reviewsRouter from "./reviews/index.js";
import usersRouter from "./users/index.js";

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());

server.use("/products", productsRouter);
server.use("/categories", categoriesRouter);
server.use("/products", reviewsRouter);
server.use("/users", usersRouter);
server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);
await pgConnect();

server.listen(port, () => {
  console.log(`Sever is running on port ${port}`);
});
