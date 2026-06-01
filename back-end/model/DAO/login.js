/***********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de funcionario no Banco de Dados MySQL
 * Data: 01/06/2026
 * Autor: Vitor Miguel
 * Versão: 1.0
 ***********************************************************************************************/

const knex = require("knex");
const knexConfig = require("../database_config/knexfile");

const knexDatabase = knex(knexConfig.development);

const getAutentication = async function (email) {
  try {
    let sql = `select * from tbl_funcionario 
            where email = "${email}"`;

    let result = await knexDatabase.raw(sql);

    if (result) return result;
    else return false;
  } catch (error) {
    return false;
  }
};

module.exports = { getAutentication };
