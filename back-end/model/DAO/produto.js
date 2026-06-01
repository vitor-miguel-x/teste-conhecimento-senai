/***********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de produto no Banco de Dados MySQL
 * Data: 31/05/2026
 * Autor: Vitor Miguel
 * Versão: 1.0
 ***********************************************************************************************/

const knex = require("knex");
const knexConfig = require("../database_config/knexfile");

const knexDatabase = knex(knexConfig.development);

const getSelectAllProducts = async function () {
  try {
    let sql = `select 
        id_produto, 
        nome, 
        peso, 
        porcao, 
        unidade_medida, 
        DATE_FORMAT(validade, '%d/%m/%Y') as validade,
        is_valid from tbl_produto order by id_produto desc`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result[0])) return result;
    else return false;
  } catch (error) {
    return false;
  }
};

const getSelectByIdProduct = async function (id) {
  try {
    let sql = `select 
        id_produto, 
        nome, 
        peso, 
        porcao, 
        unidade_medida, 
        DATE_FORMAT(validade, '%d/%m/%Y') as validade,
        is_valid from tbl_produto where id_produto=${id}`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result[0])) return result;
    else return false;
  } catch (error) {
    return false;
  }
};

const getSelectLastIdProduct = async function () {
  try {
    let sql = `select id_produto from tbl_produto order by id_produto desc limit 1`;

    let result = await knexDatabase.raw(sql);
    if (Array.isArray(result)) return Number(result[0][0].id_produto);
    else return false;
  } catch (error) {
    return false;
  }
};

const setInsertProduct = async function (produto) {
  try {
    let sql = `insert into tbl_produto (nome, peso, porcao, unidade_medida, validade) 
        values ('${produto.nome}',
                '${produto.peso}',
                '${produto.porcao}',
                '${produto.unidade_medida}',
                '${produto.validade}')`;

    let result = await knexDatabase.raw(sql);

    if (result) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

const setUpdateProduct = async function (produto) {
  try {
    let sql = `update tbl_produto set
                    nome                = '${produto.nome}',
                    peso                = '${produto.peso}',
                    porcao              = '${produto.porcao}',
                    unidade_medida      = '${produto.unidade_medida}',
                    validade            = '${produto.validade}'
                    where id_produto = ${produto.id_produto}`;

    console.log(sql);
    let result = await knexDatabase.raw(sql);
    console.log(sql);

    if (result) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

const setDeleteProduct = async function (id) {
  try {
    let sql = `delete from tbl_produto where id_produto=${id}`;

    let result = await knexDatabase.raw(sql);

    if (Array.isArray(result)) return result;
    else return false;
  } catch (error) {
    return false;
  }
};

module.exports = {
  getSelectAllProducts,
  getSelectByIdProduct,
  getSelectLastIdProduct,
  setInsertProduct,
  setUpdateProduct,
  setDeleteProduct,
};
