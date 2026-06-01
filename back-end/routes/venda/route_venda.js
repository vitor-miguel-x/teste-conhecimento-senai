/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de rotas de venda na API
 * Autor: Vitor Miguel
 * Data: 31/05/2026
 * Versão: 1.0
 ************************************************/

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = express.Router();

const bodyParserJSON = bodyParser.json();

const controller = require("../../controller/venda/controller_venda.js");

router.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );

  router.use(cors());
  next();
});

router.get("/vendas", cors(), async function (request, response) {
  let result = await controller.listarVendas();
  response.json(result);
});

router.get("/venda/:id", cors(), async function (request, response) {
  let id = request.params.id;
  let result = await controller.buscarVendaId(id);
  response.json(result);
});

router.post("/venda", cors(), async function (request, response) {
  let dadosBody = request.body;

  let contentType = request.headers["content-type"];

  let venda = await controller.inserirVenda(dadosBody, contentType);

  response.status(venda.STATUS_CODE);
  response.json(venda);
});

router.put("/venda/:id", cors(), async function (request, response) {
  let dadosBody = request.body;

  let idvenda = request.params.id;

  let contentType = request.headers["content-type"];

  let venda = await controller.atualizarVenda(dadosBody, idvenda, contentType);

  response.status(venda.STATUS_CODE);
  response.json(venda);
});

router.delete("/venda/:id", cors(), async function (request, response) {
  let id = request.params.id;
  let venda = await controller.excluirVenda(id);

  response.status(venda.STATUS_CODE);
  response.json(venda);
});

module.exports = router;
