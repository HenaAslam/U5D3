import express from "express";
import cors from "cors";
import { pgConnect } from "./db.js";
import productsRouter from "./products/index.js";
import {
  badRequestErrorHandler,
  genericErrorHandler,
  notFoundErrorHandler,
} from "./errorHandlers.js";

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());

server.use("/products", productsRouter);
server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);
await pgConnect();

server.listen(port, () => {
  console.log(`Sever is running on port ${port}`);
});
