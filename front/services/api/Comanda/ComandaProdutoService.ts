import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface ComandaProduto_create{ 
    comanda: number;
    produto: [{
        id: number; 
        quantidade: number;
        tipo: string;
    }]
}

export interface create{ 
    produto: [{
        id: number; 
        quantidade: number;
        tipo: string;
    }]
}

export interface ComandaProduto_listagem{
    nome: any;
    id: number;
    comanda: number;
    produto: {
        id: number; 
        quantidade: number
    }
}

export interface Produto {
    nome: string;
    id: number; 
    name?: string;
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

const insert = async (dados: ComandaProduto_create): Promise<ComandaProduto_create | Error> => {
    const comanda = dados.comanda;
    const produto = dados.produto;

    try {
        const { data } = await Api.post(`/comanda/insertProduto`, { comanda, produto });
        if (data) {
            return data;
        }
        return new Error('Erro ao consultar o registro.');
    } catch (error) {
        return new Error((error as { message: string }).message || 'Erro ao inserir registros');
    }
};


export const ComandaProdutoService = {
    getByID,
    insert
}