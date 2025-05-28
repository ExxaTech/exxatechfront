export const Environment = {

  /**
  *Define a quantidade de linhas a ser carregas por padrao nas listagens 
  */
  PORT: process.env.PORT || 3000,

  /**
  *Placeholder exibido nos inputs
  */
  LIMIT_ROWS: 10,


  /**
  *Placeholder exibido nos inputs
  */
  LIMIT_ROWS_CHAT: 40,

  /**
  *Texto exibido quando nenhum registro for encontrado na pesquisa
  */
  LIST_EMPTY: process.env.LIST_EMPTY || 'Nenhum registro encontrado',

  /**
  *Texto exibido no input de busca
  */
  SEARCH_INPUT: process.env.SEARCH_INPUT || 'Pesquisar...',

  /**
  *Url base de API
  */
  BASE_URL: process.env.URL_BASE || 'http://localhost:3333',


  /**
  *Url base de API
  */
  URL_VIA_CEP: process.env.URL_VIA_CEP || 'https://viacep.com.br/ws/',


  /**
  *Url base de API
  */
  SIZE_CHAT: 3,
};
