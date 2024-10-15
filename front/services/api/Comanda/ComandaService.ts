import { Environment } from '../../../environment';
import { Api } from '../axios-config';

// Interface para uma parcela de uma venda
export interface IComanda {
    id: number;
    cliente: string;
    produtos: string;
  }

  export interface ComandaCreate {
    cliente: string;
  }

export interface IApiResponse {
  rows: IComanda[]; 
  total: number;
}


const getComandas = async (): Promise<IApiResponse | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/comanda/all`;

    const { data } = await Api.get(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getAllList = async (page = 1, filter = ''): Promise<IApiResponse | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/venda/all?page=${page}&id=${filter}`;

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


const getByID = async (id: number): Promise<IComanda | Error> => {
  try {
    const { data } = await Api.get(`/comanda/id/${id}`); 

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};


const create = async (cliente: ComandaCreate): Promise<void | Error> => {
  try {
    await Api.post<ComandaCreate>('comanda/create', cliente);

  } catch (error) {
    throw error;
  }
};

const updateById = async (id: string, dados: IComanda): Promise<void | Error> => {
  try {
    await Api.put(`user/edit/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteVenda = async (id: number): Promise<void | Error> => {
  try {
    await Api.put(`comanda/delete`, { id }); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao cancelar venda.');
  }
};


const filtro = async (
  page = 1,
  filtro: string,
  dado: string
): Promise<IApiResponse | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/venda/filtro`;
    const body = { page, filtro, dado, }
    const { data } = await Api.post<IApiResponse>(urlRelativa, body);

    return data;
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

export const ComandaService = {

  getComandas,
  getByID,
  create,
  deleteVenda
};
