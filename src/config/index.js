const MODE=import.meta.env.MODE;

export const baseURL=MODE=='development'?'/api':'http://47.108.229.144:7001';