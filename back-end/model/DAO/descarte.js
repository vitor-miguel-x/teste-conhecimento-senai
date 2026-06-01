/***********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de descarte no Banco de Dados MySQL
 * Data: 31/05/2026
 * Autor: Vitor Miguel
 * Versão: 1.0
 ***********************************************************************************************/

const knex = require("knex");
const knexConfig = require("../database_config/knexfile");

const knexDatabase = knex(knexConfig.development);

const getSelectAllDiscards = async function () {
  try {
    let sql = `CALL getProdutosDescartados()`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result[0])) return result[0][0];
    else return false;
  } catch (error) {
    return false;
  }
};

const getSelectDiscardById = async function (id) {
  try {
    let sql = `CALL getDescartesById(${id})`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result[0])) return result[0][0];
    else return false;
  } catch (error) {
    return false;
  }
};

const getDiscardsByEmployeeId = async function (id) {
  try {
    let sql = `CALL getDescartesByIdFuncionario(${id})`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result[0])) return result[0][0];
    else return false;
  } catch (error) {
    return false;
  }
};

const getSelectLastDiscard = async function () {
  try {
    let sql = `CALL getLastDescarte()`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result) && result[0].length > 0)
      return Number(result[0][0][0].id_descarte);
    else return false;
  } catch (error) {
    return false;
  }
};

const setInsertDiscard = async function (descarte) {
  try {
    let sql = `CALL createDescarte(
        ${descarte.id_funcionario}, 
       " ${descarte.nome}", 
        ${descarte.peso}, 
        ${descarte.porcao},
        "${descarte.unidade_medida}", 
        "${descarte.validade}",
        ${descarte.quantidade},
        "${descarte.data_descarte}")`;

    let result = await knexDatabase.raw(sql);

    if (result) return result;
    else return false;
  } catch (error) {
    return false;
  }
};

const setUpdateDiscard = async function (descarte) {
  try {
    let sql = `CALL updateDescarte(
        ${descarte.id_funcionario}, 
        ${descarte.id_descarte},
        "${descarte.nome}", 
        ${descarte.peso}, 
        ${descarte.porcao},
        "${descarte.unidade_medida}", 
        "${descarte.validade}",
        ${descarte.quantidade},
        "${descarte.data_descarte}")`;

    let result = await knexDatabase.raw(sql);

    if (result) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

const setDeleteDiscard = async function (id) {
  try {
    let sql = `delete from tbl_descarte where id_descarte=${id}`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result)) return result;
    else return false;
  } catch (error) {
    return false;
  }
};

const setDeleteDiscardByEmployeeName = async function (descarte) {
  try {
    let sql = `CALL deleteDescarteByNomeFuncionario(${descarte.nome_funcionario}, ${descarte.id_descarte})`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result)) return result;
    else return false;
  } catch (error) {
    return false;
  }
};

module.exports = {
  getSelectAllDiscards,
  getSelectDiscardById,
  getDiscardsByEmployeeId,
  getSelectLastDiscard,
  setInsertDiscard,
  setUpdateDiscard,
  setDeleteDiscard,
  setDeleteDiscardByEmployeeName,
};
