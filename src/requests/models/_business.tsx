export interface BusinessModel {
    error: string
    id: number;
    name: string;
    email: string;
    industry?: string;
    business_type?: string;
    business_size?: string;
    contact?: string;
    website?: string;
    city?: string;
    tax_identification_number?: string;
    logo?: string;
    country?: string;
    currency?: string;
    currency_symbol?: string;
    language?: string;
    timezone?: string;
    address?: string;
    setup?: boolean;
    average_goods_monthly?: number;
    created_at?: string;
    updated_at?: string;
    suppliers?: SupplierModel[];
    product_categories?: ProductCategoryModel[];
    product_types?: ProductType[];
    material_categories?: MaterialCategory[];
}
export interface BusinessModelList {
    id: number;
    name: string;
    industry: string;
    business_type: string;
    business_size: string;
    contact?: string;
    website?: string;
    city: string;
    logo?: string;
    average_goods_monthly: number;
    country: string;
    setup: boolean;
    created_at: string;
    updated_at: string;
    total_suppliers: number;
}

export interface SupplierModel extends SupplierBasic {
    total_spending: string;
    total_orders: string;
    last_order: string;
    created_at: string;
    updated_at: string;
}

export interface SupplierBasic {
    id?: string;
    contact_person: string;
    company_name: string;
    contact_detail: string;
    location: string;
    note: string;
}

export interface SaveOverhead {
    message: string;
    saved: boolean;
    overhead: Overhead[]
}

export interface Overhead {
    cost: number;
    id: number;
    title: string;
}

export interface ProductCategoryModel {
    id: string;
    title: string;
}

export interface ProductType extends ProductCategoryModel {
    // id: string;
    // title: string;
}

export interface MaterialCategory extends ProductCategoryModel {
    description: string;
}
