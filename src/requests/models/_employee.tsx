

export interface EmployeeBasicModel {
    id: number;
    business_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    alt_phone_number: string;
    image: string;
    hire_date: string;
    title: string;
    department: string;
    salary: number;
}

export interface EmployeeBasicCollectionModel {
    data: EmployeeModel[]
}

export interface EmployeeFormModel {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    // image: string;
    phone_number: string;
    alt_phone_number: string;
    file?: File|null;
    hire_date: string|Date;
    title: string;
    department: string;
}

export interface EmployeeModel extends EmployeeBasicModel {
    created_at: number;
    updated_at: number;
}
