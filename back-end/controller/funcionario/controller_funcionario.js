/***********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 31/05/2026
 * Autor: Vitor Miguel
 * Versão: 1.0
 ***********************************************************************************************/

const funcionarioDAO = require("../../model/DAO/funcionario.js");
const bcrypt = require("bcryptjs");
const MESSAGE_DEFAULT = require("../modulo/config_messages.js");

const listarFuncionarios = async function () {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    let result = await funcionarioDAO.getSelectAllEmployees();

    if (result) {
      if (result.length > 0) {
        MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_REQUEST.STATUS;
        MESSAGE.HEADER.STATUS_CODE = MESSAGE.SUCCESS_REQUEST.STATUS_CODE;
        MESSAGE.HEADER.RESPONSE.EMPLOYEES = result[0];

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

const buscarFuncionarioId = async function (id) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (id != "" && id != null && id != undefined && !isNaN(id) && id > 0) {
      let result = await funcionarioDAO.getSelectByIdEmployee(id);

      if (result) {
        if (result[0].length > 0) {
          MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_REQUEST.STATUS;
          MESSAGE.HEADER.STATUS_CODE = MESSAGE.SUCCESS_REQUEST.STATUS_CODE;
          MESSAGE.HEADER.RESPONSE.EMPLOYEE = result[0];

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

const inserirFuncionario = async function (funcionario, contentType) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      let validarDados = await validarDadosFuncionario(funcionario);

      if (!validarDados) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(funcionario.senha, salt);

        funcionario.senha = hash;

        let result = await funcionarioDAO.setInsertEmployee(funcionario);

        if (result) {
          let lastIdFuncionario =
            await funcionarioDAO.getSelectLastIdEmployee();

          if (lastIdFuncionario) {
            funcionario.id_funcionario = lastIdFuncionario;

            MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_CREATED_ITEM.STATUS;
            MESSAGE.HEADER.STATUS_CODE =
              MESSAGE.SUCCESS_CREATED_ITEM.STATUS_CODE;
            MESSAGE.HEADER.MESSAGE = MESSAGE.SUCCESS_CREATED_ITEM.MESSAGE;

            MESSAGE.HEADER.RESPONSE = funcionario;

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

const atualizarFuncionario = async function (funcionario, id, contentType) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      let validarDados = await validarDadosFuncionario(funcionario);

      if (!validarDados) {
        let validarID = await buscarFuncionarioId(id);

        if (validarID.STATUS_CODE == 200) {
          funcionario.id_funcionario = id;
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(funcionario.senha, salt);

          funcionario.senha = hash;

          let result = await funcionarioDAO.setUpdateEmployee(funcionario);

          if (result) {
            MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_UPDATED_ITEM.STATUS;
            MESSAGE.HEADER.STATUS_CODE =
              MESSAGE.SUCCESS_UPDATED_ITEM.STATUS_CODE;
            MESSAGE.HEADER.MESSAGE = MESSAGE.SUCCESS_UPDATED_ITEM.MESSAGE;

            MESSAGE.HEADER.RESPONSE = funcionario;

            return MESSAGE.HEADER; // 201
          } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
          }
        } else {
          return validarID; //Retorno da função de buscarFuncionarioID (400 ou 404 ou 500)
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

const excluirFuncionario = async function (id) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (id != "" && id != null && id != undefined && !isNaN(id) && id > 0) {
      let validarID = await buscarFuncionarioId(id);

      if (validarID.STATUS_CODE == 200) {
        let result = await funcionarioDAO.setDeleteEmployee(id);

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

const validarDadosFuncionario = async function (funcionario) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  const emailRegex = /\S+@\S+\.\S+/;

  if (
    funcionario.nome == "" ||
    funcionario.nome == null ||
    funcionario.nome == undefined ||
    funcionario.nome.length > 100
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [NOME] Inválido !!!";
    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    funcionario.email == "" ||
    funcionario.email == null ||
    funcionario.email == undefined ||
    funcionario.email.length > 100 ||
    !emailRegex.test(funcionario.email)
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [EMAIL] Inválido !!!";
    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else if (
    funcionario.senha == "" ||
    funcionario.senha == null ||
    funcionario.senha == undefined ||
    funcionario.senha.length > 100
  ) {
    MESSAGE.ERROR_REQUIRED_FIELDS.INVALID_FIELDS =
      "Atributo [SENHA] Inválido !!!";
    return MESSAGE.ERROR_REQUIRED_FIELDS; //400
  } else {
    return false;
  }
};

module.exports = {
  listarFuncionarios,
  buscarFuncionarioId,
  inserirFuncionario,
  atualizarFuncionario,
  excluirFuncionario,
};
