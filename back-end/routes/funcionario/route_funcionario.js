/****************************************************************
 * Objetivo: Arquivo responsável pela manipulação de rotas de funcionário na API
 * Autor: Vitor Miguel
 * Data: 01/06/2026
 * Versão: 1.1 (Corrigido)
 ****************************************************************/

const express = require("express");
const cors = require("cors");
const router = express.Router();

const jwtService = require("../../jwt/jwt_service.js");

const controllerFuncionario = require("../../controller/funcionario/controller_funcionario.js");
const controller_venda = require("../../controller/venda/controller_venda.js");
const controller_descarte = require("../../controller/descarte/controller_descarte.js");
const controllerLogin = require("../../controller/login/controller_login.js");

router.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  next();
});

router.post("/funcionario", cors(), async (request, response) => {
  let dadosBody = request.body;
  let contentType = request.headers["content-type"];
  let result = await controllerFuncionario.inserirFuncionario(
    dadosBody,
    contentType,
  );
  response.status(result.STATUS_CODE).json(result);
});

router.post("/login", async (request, response) => {
  let dadosBody = request.body;
  let contentType = request.headers["content-type"];
  let result = await controllerLogin.validarLogin(dadosBody, contentType);
  response.status(result.STATUS_CODE).json(result);
});

router.get(
  "/funcionarios",
  jwtService.verificarToken,
  async function (request, response) {
    let result = await controllerFuncionario.listarFuncionarios();
    response.json(result);
  },
);

router.get(
  "/funcionario/:id",
  jwtService.verificarToken,
  async function (request, response) {
    let id = request.params.id;
    let result = await controllerFuncionario.buscarFuncionarioId(id);
    response.json(result);
  },
);

router.get(
  "/funcionario/vendas/:id",
  jwtService.verificarToken,
  async function (request, response) {
    let id = request.params.id;
    let result = await controller_venda.buscarVendaIdFuncionario(id);
    response.json(result);
  },
);

router.get(
  "/funcionario/descartes/:id",
  jwtService.verificarToken,
  async function (request, response) {
    let id = request.params.id;
    let result = await controller_descarte.buscarDescarteIdFuncionario(id);
    response.json(result);
  },
);

router.put(
  "/funcionario/:id",
  jwtService.verificarToken,
  async function (request, response) {
    let dadosBody = request.body;
    let idFuncionario = request.params.id;
    let contentType = request.headers["content-type"];

    let funcionario = await controllerFuncionario.atualizarFuncionario(
      dadosBody,
      idFuncionario,
      contentType,
    );

    response.status(funcionario.STATUS_CODE).json(funcionario);
  },
);

router.delete(
  "/funcionario/:id",
  jwtService.verificarToken,
  async function (request, response) {
    let id = request.params.id;
    let funcionario = await controllerFuncionario.excluirFuncionario(id);
    response.status(funcionario.STATUS_CODE).json(funcionario);
  },
);

module.exports = router;
