export interface Usuario {
    nome: string;
    perfil: number;
}

export interface Toast {
    message: string;
    show: boolean;
    type: 'success' | 'warning' | 'error';
}

export interface Cadastro {
    id?: number;
    nome: string;
    cep: string;
    rua: string;
    numero: number;
}

export interface Morador {
    id?: number;
    nome: string;
    nascimento: Date;
    profissao: string;
    cpf: string;
    rg: string;
    tel: string;
    cel: string;
    email: string;
    civil: string;
    bloco: string;
    unidade: number;
}
