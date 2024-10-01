import axios from "axios";
import { getAuth } from "../auth/core/AuthHelpers";
import { ProductionBasicCollectionModel, ProductionBasicModel, ProductionDuplicateModel, ProductionFormModel, ProductionFullModel, ProductionMaterialFormModel } from "./models/_production";
import { Params } from "react-router-dom";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_PRODUCTIONS = `${API_URL}/productions`;
export const GET_PRODUCTION_BY_ID = `${API_URL}/production`;
export const NEW_PRODUCTION = `${API_URL}/productions/new`;
export const SAVE_PRODUCTION = `${API_URL}/productions/save`;
export const START_PRODUCTION = `${API_URL}/productions/start-production`;
export const RESET_MATERIALS = `${API_URL}/productions/reset-materials`;
export const DUPLICATE_PRODUCTION = `${API_URL}/productions/duplicate`;
export const SAVE_PRODUCTION_MATERIAL = `${API_URL}/productions/material/save`;
export const DELETE_PRODUCTION_MATERIAL = `${API_URL}/productions/material/delete`;
export const DELETE_BY_ID = `${API_URL}/productions/delete`;
export const REMOVE_LOGO = `${API_URL}/productions/remove-image`;

const getAuthData = getAuth()

export const api_token = getAuthData?.api_token

const config = {
  headers: { Authorization: `Bearer ${api_token}` }
};

// // Server should return Product object
export function getBasicProduction(id: number) {
  return axios.get<ProductionBasicModel>(GET_PRODUCTION_BY_ID+'/'+id,config);
}

// Server should return ProductionBasicModel object
export function getProductions() {
  const response = axios.get<ProductionBasicCollectionModel>(GET_PRODUCTIONS,config);
  return response
}

// Server should return ProductionFullModel object
export function viewProductions(id: number) {
  const response = axios.get<ProductionFullModel>(GET_PRODUCTION_BY_ID+'/'+id+'/view',config);
  return response
}

// Server should creates new Production
export function newProduction(data: {title: string, category: string}) {
  return axios.post(NEW_PRODUCTION,data,config);
}

// Server should creates new Production
export function saveProduction(data: ProductionFormModel) {
  return axios.post(SAVE_PRODUCTION,data,config);
}

// Server should creates new Product
export function duplicateProduction( id: number ) {
  return axios.post<ProductionDuplicateModel>(DUPLICATE_PRODUCTION,{id},config);
}

// Server should creates new Production material
export function saveProductionMaterial(data: ProductionMaterialFormModel) {
  return axios.post(SAVE_PRODUCTION_MATERIAL,data,config);
}

// Server should creates new Production material
export function startThisProduction(data: {production_id: number,note: string|null}) {
  return axios.post(START_PRODUCTION,data,config);
}

// Reset production materials
export function resetMaterials(data: {production_id: number}) {
  return axios.post(RESET_MATERIALS,data,config);
}

// Server should delete Production material
export function deleteProductionMaterial(data: {id: number,production_id: number}) {
  return axios.post(DELETE_PRODUCTION_MATERIAL,data,config);
}

export const removeImage = async (id?: number|null) => {
  return axios.post(REMOVE_LOGO,{id},config)
}

export function deleteProduction(id: number|undefined) {
  return axios.post(DELETE_BY_ID,{id},config)
}

export function changeProductionStatus({id, status, note}:{id: number,status: string|null, note: string}) {
  return axios.post(GET_PRODUCTIONS+'/'+id+'/change-status',{status,note},config)
}

export async function productionsLoader(): Promise<ProductionBasicModel[]>{
  const getProductionsResponse = await getProductions();
  const getProductionsData: ProductionBasicModel[] = getProductionsResponse.data.data
  return getProductionsData;
}

export async function productionLoader ({ params }: { params: Params<"id"> }): Promise<ProductionBasicModel>{
  const getProductionResponse = await getBasicProduction(Number(params.id));
  const getProductionData: ProductionBasicModel = getProductionResponse.data
  return getProductionData;
}

export async function productionViewLoader ({ params }: { params: Params<"id"> }): Promise<ProductionFullModel>{
  const getProductionResponse = await viewProductions(Number(params.id));
  const getProductionViewData: ProductionFullModel = getProductionResponse.data
  return getProductionViewData;
}
