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
