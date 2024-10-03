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

export interface IApiResponse {
  rows: IEstoque_create[];
  total: number;
}


const getAllList = async (filter = ''): Promise<IApiResponse | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/estoque/all`;

    const { data } = await Api.get<IApiResponse>(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getByID = async (id: number,): Promise<IApiResponse[] | Error> => {
  try {
    const { data } = await Api.get(`/estoque/${id}`);

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
