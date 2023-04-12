export const Environtment = {

  /**
  *Define a quantidade de linhas a ser carregas por padrao nas listagens 
  */
  PORT: process.env.PORT || 3000,

  /**
  *Placeholder exibido nos inputs
  */
  LIMITE_DE_LINHAS: 5,


  /**
  *Placeholder exibido nos inputs
  */
  LIMITE_DE_LINHAS_CHAT: 20,

  /**
  *Texto exibido quando nenhum registro for encontrado na pesquisa
  */
  LISTAGEM_VAZIA: process.env.LISTAGEM_VAZIA || 'Nenhum registro encontrado',

  /**
  *Texto exibido no input de busca
  */
  INPUT_DE_BUSCA: process.env.INPUT_DE_BUSCA || 'Pesquisar...',

  /**
  *Url base de API
  */
  URL_BASE: process.env.URL_BASE || 'http://localhost:3333',


  /**
  *Url base de API
  */
  URL_VIA_CEP: process.env.URL_VIA_CEP || 'https://viacep.com.br/ws/',
};
