export interface ReconciliationModel {
    id: number;
    business_id: number;
    user_id: number;
    title: string;
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    period: string;
    closed: boolean;
    closed_on?: string;
    paused: boolean;
    created_at?: string;
    updated_at?: string;
    categories: string[];
    user: {
        id: number;
        name: string;
        firstname: string;
        email: string;
        avatar_url: string;
    };
}

export interface ReconciliationCollectionModel {
    data: ReconciliationModel[];
}

export interface ReconciliationModelSaved {
    saved: boolean;
    message: string;
    id: number;
}

export interface ReconciliationModelDataSaved {
    saved: boolean;
    data: ReconciliationModel;
}

export interface ReconciliationData {
    id: string,
    name: string,
    category: string|undefined,
    unit: string,
    current_stock: number,
    actual_stock: number|null,
    key: string|number,
    note: string|undefined,
}