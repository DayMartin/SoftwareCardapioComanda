import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface AddCategoria {
  nome: string;
}
export interface ViewCategoria {
  id: number;
  nome: string;
}

export interface IApiResponse {
  rows: ViewCategoria[]; 
  total: number;
}

const createCategoria = async (dados: AddCategoria): Promise<void | Error> => {
  try {
    await Api.post<AddCategoria>('categoria/create', dados);

  } catch (error) {
    throw error;
  }
};

const consultaCategoria = async (page = 1, filter = ''): Promise<[ViewCategoria] | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/categoria/all`;

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
    const urlRelativa = `${Environment.URL_BASE}/categoria/allList?page=${page}&id=${filter}`;

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

const deleteCategoriaById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`categoria/delete/${id}`); 
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Erro ao apagar o registro.';
    return new Error(errorMessage);
  }
};


export const CategoriaService = {
  createCategoria,
  consultaCategoria,
  deleteCategoriaById,
  getAllList
};
