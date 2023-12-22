"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
var sequelize_1 = require("sequelize");
var path_1 = require("path");
var process_1 = require("process");
var basename = path_1.default.basename(__filename);
var env = process_1.default.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
if (config.use_env_variable) {
    exports.sequelize = new sequelize_1.Sequelize(process_1.default.env[config.use_env_variable], config);
}
else {
    exports.sequelize = new sequelize_1.Sequelize(config.database, config);
}
