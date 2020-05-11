export interface Toast {
    message: string;
    show: boolean;
    type: 'success' | 'warning' | 'error';
}
