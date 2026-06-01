/***********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 01/06/2026
 * Autor: Vitor Miguel
 * Versão: 1.0
 ***********************************************************************************************/

const loginDAO = require("../../model/DAO/login.js");
const MESSAGE_DEFAULT = require("../modulo/config_messages.js");
const bcrypt = require("bcryptjs");
const jwtService = require("../../jwt/jwt_service.js");

const validarLogin = async function (login, contentType) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    let result = await loginDAO.getAutentication(login.email);

    if (result && result[0].length > 0) {
      let senhaComparada = bcrypt.compareSync(login.senha, result[0][0].senha);

      if (senhaComparada) {
        const tokenPayload = {
          id_funcionario: result[0][0].id_funcionario,
          nome: result[0][0].nome,
          email: result[0][0].email,
        };

        const token = jwtService.getToken(tokenPayload);

        MESSAGE.HEADER.STATUS = MESSAGE.SUCCESS_REQUEST.STATUS;
        MESSAGE.HEADER.STATUS_CODE = MESSAGE.SUCCESS_REQUEST.STATUS_CODE;
        MESSAGE.HEADER.MESSAGE = "Login Realizado com Sucesso !!!";

        delete result[0][0].senha;

        MESSAGE.HEADER.RESPONSE = {
          funcionario: result[0][0],
          token: token,
        };

        return MESSAGE.HEADER; // 200
      } else {
        MESSAGE.ERROR_NOT_FOUND.MESSAGE = "Email ou senha incorretos";
        return MESSAGE.ERROR_NOT_FOUND; // 404
      }
    } else {
      MESSAGE.ERROR_NOT_FOUND.MESSAGE = "Email ou senha incorretos";
      return MESSAGE.ERROR_NOT_FOUND; // 404
    }
  } catch (error) {
    console.log(error);
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

module.exports = {
  validarLogin,
};
