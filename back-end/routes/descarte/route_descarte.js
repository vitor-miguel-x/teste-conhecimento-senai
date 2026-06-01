/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de rotas de descarte na API
 * Autor: Vitor Miguel
 * Data: 31/05/2026
 * Versão: 1.0
 ************************************************/

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = express.Router();

const bodyParserJSON = bodyParser.json();

const controller = require("../../controller/descarte/controller_descarte.js");

router.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );

  router.use(cors());
  next();
});

router.get("/descartes", cors(), async function (request, response) {
  let result = await controller.listarDescartes();
  response.json(result);
});

router.get("/descarte/:id", cors(), async function (request, response) {
  let id = request.params.id;
  let result = await controller.buscarDescarteId(id);
  response.json(result);
});

router.post("/descarte", cors(), async function (request, response) {
  let dadosBody = request.body;

  let contentType = request.headers["content-type"];

  let descarte = await controller.inserirDescarte(dadosBody, contentType);

  response.status(descarte.STATUS_CODE);
  response.json(descarte);
});

router.put("/descarte/:id", cors(), async function (request, response) {
  let dadosBody = request.body;

  let iddescarte = request.params.id;

  let contentType = request.headers["content-type"];

  let descarte = await controller.atualizarDescarte(
    dadosBody,
    iddescarte,
    contentType,
  );

  response.status(descarte.STATUS_CODE);
  response.json(descarte);
});

router.delete("/descarte/:id", cors(), async function (request, response) {
  let id = request.params.id;
  let descarte = await controller.excluirDescarte(id);

  response.status(descarte.STATUS_CODE);
  response.json(descarte);
});

module.exports = router;
