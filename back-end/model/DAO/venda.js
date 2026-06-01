/***********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de venda no Banco de Dados MySQL
 * Data: 31/05/2026
 * Autor: Vitor Miguel
 * Versão: 1.0
 ***********************************************************************************************/

const knex = require("knex");
const knexConfig = require("../database_config/knexfile");

const knexDatabase = knex(knexConfig.development);

const getSelectAllSales = async function () {
  try {
    let sql = `CALL getVendas()`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result[0])) return result[0][0];
    else return false;
  } catch (error) {
    return false;
  }
};

const getSelectSaleById = async function (id) {
  try {
    let sql = `CALL getVendasById(${id})`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result[0])) return result[0][0];
    else return false;
  } catch (error) {
    return false;
  }
};

const getSalesByEmployeeId = async function (id) {
  try {
    let sql = `CALL getVendasByIdFuncionario(${id})`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result[0])) return result[0][0];
    else return false;
  } catch (error) {
    return false;
  }
};

const getSelectLastSale = async function () {
  try {
    let sql = `CALL getLastVenda()`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result) && result[0].length > 0) {
      return Number(result[0][0][0].id_venda);
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
const setInsertSale = async function (venda) {
  try {
    let sql = `CALL createVenda(
        "${venda.id_funcionario}", 
        "${venda.nome}", 
        "${venda.peso}", 
        "${venda.porcao}",
        "${venda.unidade_medida}", 
        "${venda.validade}",
        "${venda.quantidade}")`;

    let result = await knexDatabase.raw(sql);

    if (result) return result;
    else return false;
  } catch (error) {
    return false;
  }
};

const setUpdateSale = async function (venda, id) {
  try {
    let sql = `CALL updateVenda(
        "${venda.id_funcionario}", 
        "${venda.id_venda}",
        "${venda.nome}", 
        "${venda.peso}", 
        "${venda.porcao}",
        "${venda.unidade_medida}", 
        "${venda.validade}",
        "${venda.quantidade}")`;

    let result = await knexDatabase.raw(sql);

    if (result) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

const setDeleteSale = async function (id) {
  try {
    let sql = `delete from tbl_venda where id_venda=${id}`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result)) return result;
    else return false;
  } catch (error) {
    return false;
  }
};

const setDeleteSaleByEmployeeName = async function (venda) {
  try {
    let sql = `CALL deleteVendaByNomeFuncionario(${venda.nome_funcionario}, ${venda.id_venda})`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result)) return result;
    else return false;
  } catch (error) {
    return false;
  }
};

module.exports = {
  getSelectAllSales,
  getSelectSaleById,
  getSalesByEmployeeId,
  getSelectLastSale,
  setInsertSale,
  setUpdateSale,
  setDeleteSale,
  setDeleteSaleByEmployeeName,
};
