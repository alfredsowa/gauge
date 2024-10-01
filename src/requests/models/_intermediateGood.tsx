import { SupplierBasic } from "./_business";
import { MaterialVitalModel } from "./_material";

export interface IntermediateGoodModel extends IntermediateGoodBasicModel{
    error?: string
    user_id: number;
    added_by: AddedBy;
    supplier?: SupplierBasic;
    created_at: string;
}

export interface IntermediateGoodBasicModel {
    id: number;
    business_id: number;
    name: string;
    slug: string;
    description: string;
    labour_cost: number;
    material_cost: number;
    stock_quantity: number;
    min_stock_quantity: number;
    materials_used: number;
    used_materials: IntermediateGoodUsedMaterialModel[];
    productions: IntermediateGoodProductions[];
    materials?: IntermediateGoodMaterialsModel[];
    intermediate_goods_category_id: number;
    image: string;
    status: boolean;
    is_reusable_after_damaged: boolean;
    updated_at: string;
}
export interface DuplicateIntermediateGoodModel {
    saved: boolean;
    message: string;
    data: IntermediateGoodBasicModel
}
export interface IntermediateGoodSave {
    id?: number;
    name: string;
    description?: string|null;
    stock_quantity?: number;
    min_stock_quantity?: number;
    category?: number;
    labour_cost?: number;
    status?: boolean;
    is_reusable_after_damaged?: boolean;
    file?:File|null;
}
export interface IntermediateGoodProductions {
    production_id: number;
    title: string;
    status: string;
    production_quantity: number;
    start_date: string;
    completed_at: string;
    first_name: string;
    last_name: string;
}
export interface IntermediateGoodBasicCollectionModel {
    data: IntermediateGoodBasicModel[];
}

export interface AddedBy {
    name: string;
    firstname: string;
}
export interface IntermediateGoodMaterialFormModel {
    intermediate_good_id: number;
    material_id: number;
    quantity: number;
}
export interface IntermediateGoodUsedMaterialModel {
    id: number;
    intermediate_good_id: number;
    quantity: number;
    material: MaterialVitalModel
}
export interface IntermediateGoodVitalModel {
    id: number;
    name: string;
    slug: string;
    image: string;
    labour_cost: number;
    status: boolean;
    is_reusable_after_damaged: boolean;
    stock_quantity: number;
    quantity: number;
    min_stock_quantity: number;
    used_materials: IntermediateGoodUsedMaterialModel[];
}
export interface IntermediateGoodMaterialsModel {
    id: number;
    name: string;
    quantity: number;
    cost: string;
    current_stock_level: number;
    image: string;
    unit_of_measurement: string;
    cost_per_unit: number;
}