const Sequelize = require('sequelize');

const wkx = require('wkx');

Sequelize.GEOMETRY.prototype._stringify = function _stringify(value, options) {
  return `ST_GeomFromText(${options.escape(
    wkx.Geometry.parseGeoJSON(value).toWkt()
  )})`;
};
Sequelize.GEOMETRY.prototype._bindParam = function _bindParam(value, options) {
  return `ST_GeomFromText(${options.bindParam(
    wkx.Geometry.parseGeoJSON(value).toWkt()
  )})`;
};
Sequelize.GEOGRAPHY.prototype._stringify = function _stringify(value, options) {
  return `ST_GeomFromText(${options.escape(
    wkx.Geometry.parseGeoJSON(value).toWkt()
  )})`;
};
Sequelize.GEOGRAPHY.prototype._bindParam = function _bindParam(value, options) {
  return `ST_GeomFromText(${options.bindParam(
    wkx.Geometry.parseGeoJSON(value).toWkt()
  )})`;
};

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: 3306,
    logging: false,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
  }
);
