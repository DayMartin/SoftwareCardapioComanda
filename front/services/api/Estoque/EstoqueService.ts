import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IEstoque_create {
  nome: string;
  preco: number;
}

export interface IEstoque_view {
  id: number;
  nome: string;
  preco: number;
}

export interface IApiResponseProdutos {
  rows: IEstoque_view[];
  total: number;
}


const getAllList = async (filter = ''): Promise<IApiResponseProdutos | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/estoque/all`;

    const { data } = await Api.get<IApiResponseProdutos>(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getByID = async (id: number): Promise<IApiResponseProdutos[] | Error> => {
  try {
    const { data } = await Api.post(`/estoque/id`, { id });

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: IEstoque_create): Promise<void | Error> => {
  try {
    await Api.post<IEstoque_create>('estoque/create', dados);

  } catch (error) {
    throw error;
  }
};


export const EstoqueService = {
  getByID,
  getAllList,

};
