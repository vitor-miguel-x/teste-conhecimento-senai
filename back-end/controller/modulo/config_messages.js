/***********************************************************************************************
 * Objetivo: Arquivo responsável pela padronização de todas as mensagens da API do projeto de Teste de Conhecimento
 * Data: 31/05/2026
 * Autor: Vitor Miguel
 * Versão: 1.0
 ***********************************************************************************************/

const dataAtual = new Date();

const HEADER = {
  DEVELOPMENT: "Vitor Miguel Rodrigues Cezario",
  VERSION: "1.0",
  REQUEST_DATE: dataAtual.toLocaleDateString(),
  STATUS: Boolean,
  STATUS_CODE: Number,
  RESPONSE: {},
};

const ERROR_NOT_FOUND = {
  STATUS: false,
  STATUS_CODE: 404,
  MESSAGE: "Não foram encontrados dados de retorno!!!",
};
const ERROR_INTERNAL_SERVER_MODEL = {
  STATUS: false,
  STATUS_CODE: 500,
  MESSAGE:
    "Não foi possível processar a requisição, devido a problemas na camada da MODELAGEM de dados !!!",
};
const ERROR_INTERNAL_SERVER_CONTROLLER = {
  STATUS: false,
  STATUS_CODE: 500,
  MESSAGE:
    "Não foi possível processar a requisição, devido a problemas na camada de CONTROLE de dados !!!",
};
const ERROR_REQUIRED_FIELDS = {
  STATUS: false,
  STATUS_CODE: 400,
  MESSAGE:
    "Não foi possível processar a requisição, devido a campos obrigatórios que não foram enviados corretamente, conforme a documentação da API !!!",
};
const ERROR_CONTENT_TYPE = {
  STATUS: false,
  STATUS_CODE: 415,
  MESSAGE:
    "Não foi possível processar a requisição, pois o tipo de conteúdo enviado no body não é permitido. Deve-se utilizar apenas JSON na API !!!",
};
const ERROR_RELATION_TABLE = {
  STATUS: false,
  STATUS_CODE: 200,
  MESSAGE:
    "A requisição foi bem sucedida na criação do item principal, porém houveram problemas na tabela de relacionamento !!!",
};

const SUCCESS_REQUEST = {
  STATUS: true,
  STATUS_CODE: 200,
  MESSAGE: "Requisição bem sucedida!!!",
};
const SUCCESS_CREATED_ITEM = {
  STATUS: true,
  STATUS_CODE: 201,
  MESSAGE: "Requisição bem sucedida, objeto criado com sucesso !!!",
};
const SUCCESS_UPDATED_ITEM = {
  STATUS: true,
  STATUS_CODE: 200,
  MESSAGE: "Requisição bem sucedida, objeto atualizado com sucesso !!!",
};
const SUCCESS_DELETED_ITEM = {
  STATUS: true,
  STATUS_CODE: 200,
  MESSAGE: "Item excluido com sucesso !!!",
};

module.exports = {
  HEADER,
  SUCCESS_REQUEST,
  SUCCESS_CREATED_ITEM,
  SUCCESS_UPDATED_ITEM,
  SUCCESS_DELETED_ITEM,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER_CONTROLLER,
  ERROR_INTERNAL_SERVER_MODEL,
  ERROR_REQUIRED_FIELDS,
  ERROR_CONTENT_TYPE,
  ERROR_RELATION_TABLE,
};
