/***********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de funcionario no Banco de Dados MySQL
 * Data: 31/05/2026
 * Autor: Vitor Miguel
 * Versão: 1.0
 ***********************************************************************************************/

const knex = require("knex");
const knexConfig = require("../database_config/knexfile");

const knexDatabase = knex(knexConfig.development);

const getSelectAllEmployees = async function () {
  try {
    let sql = `select * from tbl_funcionario order by id_funcionario desc`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result[0])) return result;
    else return false;
  } catch (error) {
    return false;
  }
};

const getSelectByIdEmployee = async function (id) {
  try {
    let sql = `select * from tbl_funcionario where id_funcionario=${id}`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result[0])) return result;
    else return false;
  } catch (error) {
    return false;
  }
};

const getSelectLastIdEmployee = async function () {
  try {
    let sql = `select id_funcionario from tbl_funcionario order by id_funcionario desc limit 1`;

    let result = await knexDatabase.raw(sql);
    if (Array.isArray(result)) return Number(result[0][0].id_funcionario);
    else return false;
  } catch (error) {
    return false;
  }
};

const setInsertEmployee = async function (funcionario) {
  try {
    let sql = `insert into tbl_funcionario (nome, email, senha) 
        values ('${funcionario.nome}',
                '${funcionario.email}',
                '${funcionario.senha}')`;

    let result = await knexDatabase.raw(sql);

    if (result) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

const setUpdateEmployee = async function (funcionario) {
  try {
    let sql = `update tbl_funcionario set
                    nome    = '${funcionario.nome}',
                    email   = '${funcionario.email}',
                    senha   = '${funcionario.senha}'
                    where id_funcionario = ${funcionario.id_funcionario}`;

    let result = await knexDatabase.raw(sql);

    if (result) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

const setDeleteEmployee = async function (id) {
  try {
    let sql = `delete from tbl_funcionario where id_funcionario=${id}`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result)) return result;
    else return false;
  } catch (error) {
    return false;
  }
};

module.exports = {
  getSelectAllEmployees,
  getSelectByIdEmployee,
  getSelectLastIdEmployee,
  setInsertEmployee,
  setUpdateEmployee,
  setDeleteEmployee,
};
