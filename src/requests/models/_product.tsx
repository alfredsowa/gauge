import { SupplierBasic } from "./_business";
import { IntermediateGoodVitalModel } from "./_intermediateGood";

export interface ProductModel extends ProductBasicModel{
    error?: string
    user_id: number;
    added_by: AddedBy;
    supplier?: SupplierBasic;
    materials?: ProductMaterialsModel[];
    intermediate_goods?: ProductIntermediateGoodsModel[];
    used_intermediate_goods?: IntermediateGoodVitalModel[];
    created_at: string;
}
export interface ProductBasicModel {
    id: number;
    business_id: number;
    supplier_id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    wholesale_price: number;
    wholesale_markup?: number;
    retail_markup?: number;
    use_manual_pricing?: boolean;
    labour_cost: number;
    production_cost: number;
    discount_price: number;
    stock_quantity: number;
    product_costs: ProductCost;
    min_stock_quantity: number;
    materials_used: number;
    product_category_id: number;
    sku: string;
    barcode: string;
    image: string;
    is_produced: boolean;
    is_active: boolean;
    is_featured: boolean;
    updated_at: string;
}
export interface DuplicateProductModel {
    saved: boolean;
    message: string;
    data: ProductBasicModel
}
export interface ProductSave {
    id?: number;
    name: string;
    description?: string|null;
    price?: number;
    wholesale_price?: number;
    wholesale_markup?: number;
    retail_markup?: number;
    use_manual_pricing?: boolean;
    labour_cost?: number;
    discount_price?: number;
    stock_quantity?: number;
    min_stock_quantity?: number;
    sku?: string;
    is_produced?: boolean;
    is_active?: boolean;
    file?:File|null;
}
export interface ProductBasicCollectionModel {
    data: ProductBasicModel[];
}

export interface AddedBy {
    name: string;
    firstname: string;
}

export interface ProductCost {
    materials_cost: number;
    materials_cost_with_product_labour: number;
    overheaad: number;
    total_cost_of_goods: number;
}
export interface ProductMaterialFormModel {
    product_id: number;
    material_id: number;
    material_type: string;
    quantity: number;
    // cost: number;
}
export interface ProductMaterialsModel {
    id: number;
    name: string;
    quantity: number;
    cost_per_unit: number;
    cost: string;
    current_stock_level: number;
    image: string;
    unit_of_measurement: string;
}
export interface ProductIntermediateGoodsModel {
    id: number;
    name: string;
    quantity: number;
    cost_per_unit: number;
    labour_cost: number;
    stock_quantity: number;
    image: string;
    unit_of_measurement: string;
}