import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface ComandaProduto_create{ 
    comanda: number;
    produto: {
        id: number; 
        quantidade: number;
        tipo: string;
    }
}

export interface ComandaProduto_listagem{
    id: number;
    comanda: number;
    produto: {
        id: number; 
        quantidade: number
    }
}

export interface Produto {
    id: number; 
    quantidade?: number
}

export interface Integration{
    rows: ComandaProduto_listagem[];
    total: number;
}

const getByID = async (comanda: number): Promise<Integration | Error> => {
    try {
        const { data } = await Api.post(`/comanda/consultProduto`, {comanda})

        if(data) {
            return data
        }

        return new Error('Erro ao consultar o registro.');
    } catch (error) {
        return new Error((error as { message: string }).message || 'Erro ao consultar registros');
    }
}

export const ComandaProdutoService = {
    getByID
}