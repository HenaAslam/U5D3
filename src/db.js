import { Sequelize } from "sequelize";

const { PG_DB, PG_USER, PG_PW, PG_HOST, PG_PORT } = process.env;

const sequelize = new Sequelize(PG_DB, PG_USER, PG_PW, {
  host: PG_HOST,
  port: PG_PORT,
  dialect: "postgres",
});

export const pgConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connected to Postgres!`);
    await sequelize.sync({ alter: true });
    console.log(`All models are syncronized!`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default sequelize;
