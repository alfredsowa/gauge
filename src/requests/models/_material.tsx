import { MaterialCategory } from "./_business";
import { PurchaseBasicModel } from "./_purchase";

export interface MaterialModel extends MaterialCollectionData {
    added_by: number;
    created_at?: Date|null;
}

export interface MaterialViewModel extends MaterialModel {
    purchases?: PurchaseBasicModel[];
}

export interface MaterialUpdate {
    id: number;
    name: string;
    code: string;
    type: string;
    description: string;
    is_reusable_after_damaged: boolean;
    material_category_id: number;
}

export interface MaterialCollectionData extends MaterialBasicModel {
    updated_at?: string;
    category?: MaterialCategory;
}

export interface MaterialCreate {
    name: string;
    code: string;
    type: string;
    description: string;
    image?: File|null;
    material_category_id: number;
    cost_per_unit: number;
    is_reusable_after_damaged: boolean;
    current_stock_level: number;
    minimum_stock_level: number;
    unit_of_measurement?: string;
}

export interface MaterialBasicModel extends MaterialVitalModel {
    code: string;
    type: string;
    description?: string;
    material_category_id: number;
    total_cost: number;
    is_component: number;
    production_id: number;
    is_reusable_after_damaged: boolean;
    total_items?: number;
    deletable: boolean;
}

export interface MaterialVitalModel {
    id: number;
    name: string;
    current_stock_level: number;
    image?: string;
    unit_of_measurement: string;
    cost_per_unit: number;
    minimum_stock_level: number,
    status: string
}

export interface MaterialCollection extends MaterialPagination {
    data: MaterialCollectionData[]|null,
}

export interface MaterialPagination {
    links:{
        first: string|null;
        last: string|null;
        next: string|null;
        prev: string|null;
    },
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: Array<Links>;
        path: string|undefined;
        per_page: number|undefined;
        to: number|undefined;
        total: number|undefined
    }
}

type Links = {
    active: boolean;
    label: string;
    url: string|null;
}