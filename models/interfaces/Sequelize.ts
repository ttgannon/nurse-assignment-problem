import { Sequelize } from "sequelize";

export default interface DBInterface {
  sequelize: Sequelize;
}
