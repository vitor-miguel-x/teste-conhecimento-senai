const express = require("express");
const cors = require("cors");
const knex = require("knex");

const app = express();
const PORT = 8080;
const URL_BASE = "/v1/doceria_gourmet_ianes";

const routerFuncionario = require("./routes/funcionario/route_funcionario.js");
const routerProduto = require("./routes/produto/route_produto.js");
const routerVenda = require("./routes/venda/route_venda.js");
const routerDescarte = require("./routes/descarte/route_descarte.js");
const { verificarToken } = require("./jwt/jwt_service.js");

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.send("Servidor Doceria Gourmet Ianes Rodando !!!");
});

app.use(URL_BASE, routerFuncionario);

app.use(URL_BASE, verificarToken, routerProduto);
app.use(URL_BASE, verificarToken, routerVenda);
app.use(URL_BASE, verificarToken, routerDescarte);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
