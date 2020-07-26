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
    personal: IPersonal;
    professional?: IProfessional;
    condominium: ICondominium;
    familiar?: IFamiliar;
}

interface IPersonal {
    name: string;
    bornDate: Date;
    cpf: string;
    rg: string;
    tel: string;
    cel: string;
    email: string;
    civilStatus: string;
}

interface IProfessional {
    profession: string;
    salary: number;
}

interface ICondominium {
    block: string;
    unit: number;
}

interface IFamiliar {
    partner?: { name: string; id: number };
    dependents?: [{ name: string; id: number }];
}
