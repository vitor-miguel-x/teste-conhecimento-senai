/***********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 31/05/2026
 * Autor: Vitor Miguel
 * Versão: 1.0
 ***********************************************************************************************/

const produtoDAO = require("../../model/DAO/produto.js");

const MESSAGE_DEFAULT = require("../modulo/config_messages.js");

const listarProdutos = async function () {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    let result = await produtoDAO.getSelectAllProducts();
    result.validade = new Date(result[0].validade).toLocaleDateString("pt-BR");
    if (result) {
      if (result.length > 0) {
        MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_REQUEST.STATUS;
        MESSAGE.HEADER.STATUS_CODE = MESSAGE.SUCCESS_REQUEST.STATUS_CODE;
        MESSAGE.HEADER.RESPONSE.PRODUCTS = result[0];

        return MESSAGE.HEADER; // 200
      } else {
        return MESSAGE.ERROR_NOT_FOUND; //404
      }
    } else {
      return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
    }
  } catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

const buscarProdutoId = async function (id) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (id != "" && id != null && id != undefined && !isNaN(id) && id > 0) {
      let result = await produtoDAO.getSelectByIdProduct(id);

      if (result) {
        if (result[0].length > 0) {
          MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_REQUEST.STATUS;
          MESSAGE.HEADER.STATUS_CODE = MESSAGE.SUCCESS_REQUEST.STATUS_CODE;
          MESSAGE.HEADER.RESPONSE.PRODUCT = result[0];

          return MESSAGE.HEADER; // 200
        } else {
          return MESSAGE.ERROR_NOT_FOUND; //404
        }
      } else {
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
      }
    } else {
      MESSAGE.ERROR_REQUIRED_FIELD.INVALID_FIELDS =
        "Atributo [ID] inválido !!!";
      return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
  } catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

const inserirProduto = async function (produto, contentType) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      let validarDados = await validarDadosProduto(produto);

      if (!validarDados) {
        let result = await produtoDAO.setInsertProduct(produto);

        if (result) {
          let lastIdProduto = await produtoDAO.getSelectLastIdProduct();

          if (lastIdProduto) {
            produto.id_produto = lastIdProduto;

            MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_CREATED_ITEM.STATUS;
            MESSAGE.HEADER.STATUS_CODE =
              MESSAGE.SUCCESS_CREATED_ITEM.STATUS_CODE;
            MESSAGE.HEADER.MESSAGE = MESSAGE.SUCCESS_CREATED_ITEM.MESSAGE;

            MESSAGE.HEADER.RESPONSE = produto;

            return MESSAGE.HEADER; // 201
          } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; // 500
          }
        } else {
          return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
        }
      } else {
        return validarDados; //400
      }
    } else {
      return MESSAGE.ERROR_CONTENT_TYPE; //415
    }
  } catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

const atualizarProduto = async function (produto, id, contentType) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      let validarDados = await validarDadosProduto(produto);

      if (!validarDados) {
        let validarID = await buscarProdutoId(id);

        if (validarID.STATUS_CODE == 200) {
          produto.id_produto = id;

          let result = await produtoDAO.setUpdateProduct(produto);

          if (result) {
            MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_UPDATED_ITEM.STATUS;
            MESSAGE.HEADER.STATUS_CODE =
              MESSAGE.SUCCESS_UPDATED_ITEM.STATUS_CODE;
            MESSAGE.HEADER.MESSAGE = MESSAGE.SUCCESS_UPDATED_ITEM.MESSAGE;

            MESSAGE.HEADER.RESPONSE = produto;

            return MESSAGE.HEADER; // 201
          } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
          }
        } else {
          return validarID; //Retorno da função de buscarprodutoID (400 ou 404 ou 500)
        }
      } else {
        return validarDados; //400
      }
    } else {
      return MESSAGE.ERROR_CONTENT_TYPE; //415
    }
  } catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

const excluirProduto = async function (id) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (id != "" && id != null && id != undefined && !isNaN(id) && id > 0) {
      let validarID = await buscarProdutoId(id);

      if (validarID.STATUS_CODE == 200) {
        let result = await produtoDAO.setDeleteProduct(id);

        if (result) {
          MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_DELETED_ITEM.STATUS;
          MESSAGE.HEADER.STATUS_CODE = MESSAGE.SUCCESS_DELETED_ITEM.STATUS_CODE;
          MESSAGE.HEADER.MESSAGE = MESSAGE.SUCCESS_DELETED_ITEM.MESSAGE;
          delete MESSAGE.HEADER.RESPONSE;

          return MESSAGE.HEADER; // 200
        } else {
          return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
        }
      } else {
        MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS = "[ID incorreto]";
        return MESSAGE.ERROR_REQUIRED_FIELDS; //400
      }
    } else {
      MESSAGE.ERROR_REQUIRED_FIELD.INVALID_FIELDS =
        "Atributo [ID] inválido !!!";
      return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
  } catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

const validarDadosProduto = async function (produto) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  const emailRegex = /\S+@\S+\.\S+/;

  if (
    produto.nome == "" ||
    produto.nome == null ||
    produto.nome == undefined ||
    produto.nome.length > 100
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [NOME] Inválido !!!";
    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    produto.peso == "" ||
    produto.peso == null ||
    produto.peso == undefined ||
    isNaN(produto.peso)
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [PESO] Inválido !!!";
    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    produto.porcao == "" ||
    produto.porcao == null ||
    produto.porcao == undefined ||
    isNaN(produto.porcao)
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [PORCAO] Inválido !!!";
    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    produto.unidade_medida == "" ||
    produto.unidade_medida == null ||
    produto.unidade_medida == undefined ||
    produto.unidade_medida.length > 4
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [UNIDADE_MEDIDA] Inválido !!!";
    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    produto.validade == "" ||
    produto.validade == null ||
    produto.validade == undefined ||
    produto.validade.length > 10
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [VALIDADE] Inválido !!!";
    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else {
    return false;
  }
};

module.exports = {
  listarProdutos,
  buscarProdutoId,
  inserirProduto,
  atualizarProduto,
  excluirProduto,
};
