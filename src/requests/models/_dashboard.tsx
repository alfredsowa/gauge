import { DonutChartCell } from "@mantine/charts";
import { ProductionBasicModel } from "./_production";

export interface CardAnalyticsModel {
    completed_product_productions: ProductionBasicModel[];
    top_moving_products_selected_month: TopMovingProducts[];
    recent_productions: ProductionBasicModel[];
    card_analytics: CardAnalytics[];
    channel_rate: DonutChartCell[];
    most_materials_used_selected_month: MostUsedMaterial[]
}

export interface CardAnalytics {
    title: string, 
    value: number, 
    diff: number 
}

export interface ChannelRate {
    name: string, 
    value: number, 
    color: number 
}

export interface TopMovingProducts {
    name: string,
    quantity: string,
    amount_paid: string,
}

export interface MostUsedMaterial {
    id: number,
    material_name: string,
    current_stock_level: string,
    minimum_stock_level: string,
    quantity_used: string,
    unit: string,
    image: string,
}
