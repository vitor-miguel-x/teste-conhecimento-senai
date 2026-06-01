/***********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model
 * (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 31/05/2026
 * Autor: Vitor Miguel
 * Versão: 1.0 (Refatorada)
 ***********************************************************************************************/

const vendaDAO = require("../../model/DAO/venda.js");
const MESSAGE_DEFAULT = require("../modulo/config_messages.js");

const listarVendas = async function () {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    let result = await vendaDAO.getSelectAllSales();

    if (result) {
      if (result.length > 0) {
        MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_REQUEST.STATUS;
        MESSAGE.HEADER.STATUS_CODE = MESSAGE.SUCCESS_REQUEST.STATUS_CODE;
        MESSAGE.HEADER.RESPONSE.SALES = result;

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

const buscarVendaIdFuncionario = async function (id) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (id != "" && id != null && id != undefined && !isNaN(id) && id > 0) {
      let result = await vendaDAO.getSalesByEmployeeId(id);

      if (result) {
        if (result.length > 0) {
          MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_REQUEST.STATUS;
          MESSAGE.HEADER.STATUS_CODE = MESSAGE.SUCCESS_REQUEST.STATUS_CODE;
          MESSAGE.HEADER.RESPONSE.SALES = result;

          return MESSAGE.HEADER; // 200
        } else {
          return MESSAGE.ERROR_NOT_FOUND; //404
        }
      } else {
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
      }
    } else {
      MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
        "Atributo [ID] inválido !!!";
      return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
  } catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

const buscarVendaId = async function (id) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (id != "" && id != null && id != undefined && !isNaN(id) && id > 0) {
      let result = await vendaDAO.getSelectSaleById(id);

      if (result) {
        if (result.length > 0) {
          MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_REQUEST.STATUS;
          MESSAGE.HEADER.STATUS_CODE = MESSAGE.SUCCESS_REQUEST.STATUS_CODE;
          MESSAGE.HEADER.RESPONSE.SALE = result[0];

          return MESSAGE.HEADER; // 200
        } else {
          return MESSAGE.ERROR_NOT_FOUND; //404
        }
      } else {
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
      }
    } else {
      MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
        "Atributo [ID] inválido !!!";
      return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
  } catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

const inserirVenda = async function (venda, contentType) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      let validarDados = await validarDadosVenda(venda);

      if (!validarDados) {
        let result = await vendaDAO.setInsertSale(venda);

        if (result) {
          let lastIdVenda = await vendaDAO.getSelectLastSale();

          if (lastIdVenda) {
            venda.id_venda = lastIdVenda;

            MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_CREATED_ITEM.STATUS;
            MESSAGE.HEADER.STATUS_CODE =
              MESSAGE.SUCCESS_CREATED_ITEM.STATUS_CODE;
            MESSAGE.HEADER.MESSAGE = MESSAGE.SUCCESS_CREATED_ITEM.MESSAGE;
            MESSAGE.HEADER.RESPONSE = venda;

            return MESSAGE.HEADER; // 201
          } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; // 500
          }
        } else {
          return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
        }
      } else {
        return validarDados;
      }
    } else {
      return MESSAGE.ERROR_CONTENT_TYPE; //415
    }
  } catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

const atualizarVenda = async function (venda, id, contentType) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      let validarDados = await validarDadosVenda(venda);

      if (!validarDados) {
        let validarID = await buscarVendaId(id);

        if (validarID.STATUS_CODE == 200) {
          venda.id_venda = id;
          let result = await vendaDAO.setUpdateSale(venda);

          if (result) {
            MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_UPDATED_ITEM.STATUS;
            MESSAGE.HEADER.STATUS_CODE =
              MESSAGE.SUCCESS_UPDATED_ITEM.STATUS_CODE;
            MESSAGE.HEADER.MESSAGE = MESSAGE.SUCCESS_UPDATED_ITEM.MESSAGE;
            MESSAGE.HEADER.RESPONSE = venda;

            return MESSAGE.HEADER;
          } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
          }
        } else {
          return validarID; //Retorno da função de buscarvendaID (400 ou 404 ou 500)
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

const excluirVenda = async function (id) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (id != "" && id != null && id != undefined && !isNaN(id) && id > 0) {
      let validarID = await buscarVendaId(id);

      if (validarID.STATUS_CODE == 200) {
        let result = await vendaDAO.setDeleteSale(id);

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
        MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
          "[ID incorreto ou não encontrado]";
        return MESSAGE.ERROR_REQUIRED_FIELDS; //400
      }
    } else {
      MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
        "Atributo [ID] inválido !!!";
      return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
  } catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

const validarDadosVenda = async function (venda) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  const emailRegex = /\S+@\S+\.\S+/;

  if (
    venda.nome == "" ||
    venda.nome == null ||
    venda.nome == undefined ||
    venda.nome.length > 100
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [NOME] Inválido !!!";

    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    venda.peso == "" ||
    venda.peso == null ||
    venda.peso == undefined ||
    isNaN(venda.peso)
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [PESO] Inválido !!!";

    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    venda.porcao == "" ||
    venda.porcao == null ||
    venda.porcao == undefined ||
    isNaN(venda.porcao)
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [PORCAO] Inválido !!!";

    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    venda.unidade_medida == "" ||
    venda.unidade_medida == null ||
    venda.unidade_medida == undefined ||
    venda.unidade_medida.length > 4
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [UNIDADE_MEDIDA] Inválido !!!";

    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    venda.validade == "" ||
    venda.validade == null ||
    venda.validade == undefined ||
    venda.validade.length > 10
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [VALIDADE] Inválido !!!";

    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    venda.quantidade == "" ||
    venda.quantidade == null ||
    venda.quantidade == undefined ||
    isNaN(venda.quantidade)
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [QUANTIDADE] Inválido !!!";

    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    venda.id_funcionario == "" ||
    venda.id_funcionario == null ||
    venda.id_funcionario == undefined ||
    isNaN(venda.id_funcionario)
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [ID_FUNCIONARIO] Inválido !!!";

    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else {
    return false;
  }
};

module.exports = {
  listarVendas,
  buscarVendaIdFuncionario,
  buscarVendaId,
  inserirVenda,
  atualizarVenda,
  excluirVenda,
};
