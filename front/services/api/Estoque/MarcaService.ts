import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface AddMarca {
  nome: string;
  categoria_id: number;
}

export interface ViewMarca {
  id: number;
  nome: string;
  categoria_id: number;
}

export interface IApiResponse {
  rows: ViewMarca[]; 
  total: number;
}

const createMarca = async (dados: AddMarca): Promise<void | Error> => {
  try {
    await Api.post<AddMarca>('marca/create', dados);

  } catch (error) {
    throw error;
  }
};

const consultaMarca = async (page = 1, filter = ''): Promise<ViewMarca[] | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/marca/all`;

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
    const urlRelativa = `${Environment.URL_BASE}/marca/allList?page=${page}&id=${filter}`;

    const { data } = await Api.post<IApiResponse>(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const consultaMarcaCategoria = async ( id: number): Promise<[ViewMarca] | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/marca/getCategoria/${id}`;

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

const deleteMarcaById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`marca/delete/${id}`); 
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Erro ao apagar o registro.';
    return new Error(errorMessage);
  }
};

export const MarcaService = {
  createMarca,
  consultaMarca,
  deleteMarcaById,
  consultaMarcaCategoria,
  getAllList
};
