/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de rotas de produto na API
 * Autor: Vitor Miguel
 * Data: 31/05/2026
 * Versão: 1.0
 ************************************************/

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = express.Router();

const bodyParserJSON = bodyParser.json();

const controller = require("../../controller/produto/controller_produto.js");

router.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );

  router.use(cors());
  next();
});

router.get("/produtos", cors(), async function (request, response) {
  let result = await controller.listarProdutos();
  response.json(result);
});

router.get("/produto/:id", cors(), async function (request, response) {
  let id = request.params.id;
  let result = await controller.buscarProdutoId(id);
  response.json(result);
});

router.post("/produto", cors(), async function (request, response) {
  let dadosBody = request.body;

  let contentType = request.headers["content-type"];

  let produto = await controller.inserirProduto(dadosBody, contentType);

  response.status(produto.STATUS_CODE);
  response.json(produto);
});

router.put("/produto/:id", cors(), async function (request, response) {
  let dadosBody = request.body;

  let idproduto = request.params.id;

  let contentType = request.headers["content-type"];

  let produto = await controller.atualizarProduto(
    dadosBody,
    idproduto,
    contentType,
  );

  response.status(produto.STATUS_CODE);
  response.json(produto);
});

router.delete("/produto/:id", cors(), async function (request, response) {
  let id = request.params.id;
  let produto = await controller.excluirProduto(id);

  response.status(produto.STATUS_CODE);
  response.json(produto);
});

module.exports = router;
