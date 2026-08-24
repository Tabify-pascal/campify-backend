export interface AuthAdmin {
    userId: string;
    email: string;
    role: "admin";
}


export interface AuthCustomer {
    userId: string;
    email: string;
    role: "customer";
}

export type AuthUser = AuthAdmin | AuthCustomer;