import { ProductBasicModel } from "./_product";

export interface SalesModel extends SalesBasicModel{
    error: string
    customer?: CustomerModel;
    product?: ProductBasicModel;
}
export interface SalesBasicModel extends SalesSave {
    business_id: number;
    user_id: number;
    updated_at: string;
    added_by: string;
    sold_by: string;
    product_image: string;
    product_name: string;
}
export interface SalesBasicCollectionModel {
    data: SalesBasicModel[];
}

export interface SalesSave {
    id?: number|undefined;
    customer_id: number;
    product_id: number;
    employee_id: number;
    sales_channel: string;
    sale_type: string;
    sale_date_time: string|Date;
    quantity: number;
    selling_price?: number;
    total_amount_paid: number;
    payment_status: string;
    payment_method: string;
    order_status: string;
    invoice_number?: string;
    delivery_details?: string;
}

export interface CustomerSave {
    id?: number;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    address?: string;
    city: string;
    country?: string;
    state?: string;
    company_name?: string;
    contact_person?: string;
    additional_info?: string;
    invoice_number?: string;
    delivery_details?: string;
}

export interface CustomerBasicModel extends CustomerSave {
    created_at: string;
    updated_at: string;
    purchases: number;
    last_purchase: string;
    prevent_delete: boolean;
}

export interface CustomerBasicCollectionModel {
    data: CustomerBasicModel[];
}

export interface CustomerModel extends CustomerBasicModel {
    sales: SalesBasicModel[]
}