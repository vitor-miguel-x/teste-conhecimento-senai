/***********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model
 * (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 01/06/2026
 * Autor: Vitor Miguel
 * Versão: 1.0 (Refatorada)
 ***********************************************************************************************/

const descarteDAO = require("../../model/DAO/descarte.js");
const MESSAGE_DEFAULT = require("../modulo/config_messages.js");

const listarDescartes = async function () {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    let result = await descarteDAO.getSelectAllDiscards();

    if (result) {
      if (result.length > 0) {
        MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_REQUEST.STATUS;
        MESSAGE.HEADER.STATUS_CODE = MESSAGE.SUCCESS_REQUEST.STATUS_CODE;
        MESSAGE.HEADER.RESPONSE.DISCARDS = result;

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

const buscarDescarteIdFuncionario = async function (id) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (id != "" && id != null && id != undefined && !isNaN(id) && id > 0) {
      let result = await descarteDAO.getDiscardsByEmployeeId(id);

      if (result) {
        if (result.length > 0) {
          MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_REQUEST.STATUS;
          MESSAGE.HEADER.STATUS_CODE = MESSAGE.SUCCESS_REQUEST.STATUS_CODE;
          MESSAGE.HEADER.RESPONSE.DISCARDS = result;

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

const buscarDescarteId = async function (id) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (id != "" && id != null && id != undefined && !isNaN(id) && id > 0) {
      let result = await descarteDAO.getSelectDiscardById(id);

      if (result) {
        if (result.length > 0) {
          MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_REQUEST.STATUS;
          MESSAGE.HEADER.STATUS_CODE = MESSAGE.SUCCESS_REQUEST.STATUS_CODE;
          MESSAGE.HEADER.RESPONSE.DISCARD = result[0];

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

const inserirDescarte = async function (descarte, contentType) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      let validarDados = await validarDadosDescarte(descarte);

      if (!validarDados) {
        let result = await descarteDAO.setInsertDiscard(descarte);

        if (result) {
          let lastIdDescarte = await descarteDAO.getSelectLastDiscard();

          if (lastIdDescarte) {
            descarte.id_descarte = lastIdDescarte;

            MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_CREATED_ITEM.STATUS;
            MESSAGE.HEADER.STATUS_CODE =
              MESSAGE.SUCCESS_CREATED_ITEM.STATUS_CODE;
            MESSAGE.HEADER.MESSAGE = MESSAGE.SUCCESS_CREATED_ITEM.MESSAGE;
            MESSAGE.HEADER.RESPONSE = descarte;

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

const atualizarDescarte = async function (descarte, id, contentType) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      let validarDados = await validarDadosDescarte(descarte);

      if (!validarDados) {
        let validarID = await buscarDescarteId(id);

        if (validarID.STATUS_CODE == 200) {
          descarte.id_descarte = id;
          let result = await descarteDAO.setUpdateDiscard(descarte);

          if (result) {
            MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_UPDATED_ITEM.STATUS;
            MESSAGE.HEADER.STATUS_CODE =
              MESSAGE.SUCCESS_UPDATED_ITEM.STATUS_CODE;
            MESSAGE.HEADER.MESSAGE = MESSAGE.SUCCESS_UPDATED_ITEM.MESSAGE;
            MESSAGE.HEADER.RESPONSE = descarte;

            return MESSAGE.HEADER;
          } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
          }
        } else {
          return validarID; //Retorno da função de buscardescarteID (400 ou 404 ou 500)
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

const excluirDescarte = async function (id) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (id != "" && id != null && id != undefined && !isNaN(id) && id > 0) {
      let validarID = await buscarDescarteId(id);

      if (validarID.STATUS_CODE == 200) {
        let result = await descarteDAO.setDeleteDiscard(id);

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

const validarDadosDescarte = async function (descarte) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  const emailRegex = /\S+@\S+\.\S+/;

  if (
    descarte.nome == "" ||
    descarte.nome == null ||
    descarte.nome == undefined ||
    descarte.nome.length > 100
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [NOME] Inválido !!!";

    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    descarte.peso == "" ||
    descarte.peso == null ||
    descarte.peso == undefined ||
    isNaN(descarte.peso)
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [PESO] Inválido !!!";

    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    descarte.porcao == "" ||
    descarte.porcao == null ||
    descarte.porcao == undefined ||
    isNaN(descarte.porcao)
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [PORCAO] Inválido !!!";

    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    descarte.unidade_medida == "" ||
    descarte.unidade_medida == null ||
    descarte.unidade_medida == undefined ||
    descarte.unidade_medida.length > 4
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [UNIDADE_MEDIDA] Inválido !!!";

    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    descarte.validade == "" ||
    descarte.validade == null ||
    descarte.validade == undefined ||
    descarte.validade.length > 10
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [VALIDADE] Inválido !!!";

    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    descarte.quantidade == "" ||
    descarte.quantidade == null ||
    descarte.quantidade == undefined ||
    isNaN(descarte.quantidade)
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [QUANTIDADE] Inválido !!!";

    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    descarte.id_funcionario == "" ||
    descarte.id_funcionario == null ||
    descarte.id_funcionario == undefined ||
    isNaN(descarte.id_funcionario)
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [ID_FUNCIONARIO] Inválido !!!";

    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    descarte.data_descarte == "" ||
    descarte.data_descarte == null ||
    descarte.data_descarte == undefined ||
    descarte.data_descarte.length > 10
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [DATA_DESCARTE] Inválido !!!";

    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else {
    return false;
  }
};

module.exports = {
  listarDescartes,
  buscarDescarteIdFuncionario,
  buscarDescarteId,
  inserirDescarte,
  atualizarDescarte,
  excluirDescarte,
};
