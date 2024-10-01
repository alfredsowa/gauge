export interface ProductionBasicModel {
    id: number;
    business_id: number;
    title: string;
    category: string;
    description: string;
    priority: string;
    status: string;
    quantity: number;
    labour_cost: number;
    insufficient_materials: boolean;
    type: string;
    product_id: number;
    intermediate_good_id: number;
    is_material: boolean;
    product: {
        id: number;
        name: string;
        slug: string;
        stock_quantity: number;
        image: string;
        production_cost: number;
        price: number;
    };
    intermediate_good: {
        id: number;
        name: string;
        slug: string;
        stock_quantity: number;
        image: string;
        labour_cost: number;
    };
    deadline_date: string|undefined;
    start_date: string|undefined;
    end_date: string|undefined;
    estimated_hours: number|undefined;
    actual_hours: number|undefined;
    assignee: {
        id: number;
        first_name: string;
        last_name: string;
        image: string;
        title: string;
    };
    materials: ProductionMaterial[];
    intermediate_goods: ProductionIntermediateGoods[];
}

export interface ProductionBasicCollectionModel {
    data: ProductionBasicModel[]
}

export interface ProductionDuplicateModel {
    saved: boolean;
    message: string;
    data: ProductionBasicModel
}

export interface ProductionFormModel {
    id?: number;
    title: string;
    category?: string;
    description: string;
    priority: string;
    status?: string;
    type: string;
    quantity?: number;
    labour_cost?: number;
    deadline_date?: string|Date;
    start_date?: string|Date;
    end_date?: string|Date;
    estimated_hours?: number;
    actual_hours?: number;
    product?: number|null;
    intermediate_good?: number|null;
    assignee?: number;
    is_material?: boolean;
}

export interface ProductionFullModel extends ProductionBasicModel {
    history: History[];
    user: {
        id: number;
        firstname: string;
        name: string;
        avatar_url: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
}

export interface ProductionMaterialFormModel {
    production_id: number;
    material_id: number;
    quantity: number;
    cost: number;
}

export interface ProductionMaterial {
    id: number;
    name: string;
    quantity: number;
    cost: string;
    current_stock_level: number;
    image: string;
    unit_of_measurement: string;
}

export interface ProductionIntermediateGoods {
    id: number;
    intermediate_good_id: number;
    name: string;
    quantity: number;
    cost: string;
    stock_quantity: number;
    image: string;
    labour_cost: number;
    unit_of_measurement: string;
}

export interface History {
    id: number;
    user: {
        id: number;
        firstname: string;
        name: string;
        avatar_url: string;
        email: string;
    };
    status: string;
    note: string;
    created_at: string;

}
