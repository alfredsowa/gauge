import axios from "axios";
import { getAuth } from "../auth/core/AuthHelpers";
import { MaterialBasicModel, MaterialCollection, MaterialCreate, MaterialModel, MaterialUpdate, MaterialViewModel } from "./models/_material";
import { Params } from "react-router-dom";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_MATERIALS = `${API_URL}/materials`;
export const GET_MATERIALS_OPTIONS = `${API_URL}/materials-dropdown`;
export const GET_BASIC_MATERIALS = `${API_URL}/basic-materials`;
export const GET_MATERIAL = `${API_URL}/material`;
export const GET_MATERIAL_CATEGORIES = `${API_URL}/material-categories`;
export const CREATE_MATERIAL = `${API_URL}/materials/create`;
export const UPDATE_MATERIAL = `${API_URL}/materials/update`;
export const CHANGE_LOGO = `${API_URL}/materials/save-image`;
export const REMOVE_LOGO = `${API_URL}/materials/remove-image`;
export const DELETE_BY_ID = `${API_URL}/materials/delete-material`;
export const SAVE_CATEGORY = `${API_URL}/materials/save-category`;

const getAuthData = getAuth()

export const api_token = getAuthData?.api_token

const config = {
  headers: { Authorization: `Bearer ${api_token}` }
};

// Server should return MaterialModel object
export function getMaterial(id: number) {
  return axios.get<MaterialModel>(GET_MATERIAL+'/'+id,config);
}

// Server should return MaterialModel object
export function getMaterialView(id: number) {
  return axios.get<MaterialViewModel>(GET_MATERIALS+'/'+id+'/view',config);
}

// Server should return MaterialModel object
export function getBasicMaterials() {
  return axios.get<MaterialBasicModel[]>(GET_BASIC_MATERIALS,config);
}

// Server should return MaterialModel object
export function getMaterialsOption(withoutComponents: boolean) {
  return axios.get<MaterialBasicModel[]>(GET_MATERIALS_OPTIONS+'?withoutComponents='+withoutComponents,config);
}

// Server should return MaterialModel object
export function getMaterials() {
  return axios.get<MaterialCollection>(GET_MATERIALS,config);
}

// Server should return MaterialModel object
export function getMaterialCategories() {
  return axios.get(GET_MATERIAL_CATEGORIES,config);
}

// Server should creates new Material
export function createMaterial(data: MaterialCreate) {
  return axios.post(CREATE_MATERIAL,data,{
    headers: {
      Authorization: `Bearer ${api_token}`,
      "Content-Type": "multipart/form-data",
    },
  });
}

// Server should update Material
export function updateMaterial(data: MaterialUpdate) {
  return axios.put(UPDATE_MATERIAL,data,config);
}

export function deleteMaterial(id: number|undefined) {
  return axios.post(DELETE_BY_ID,{id},config)
}

export function removeImage(id: number|undefined) {
  return axios.post(REMOVE_LOGO,{id},config)
}

export function saveCategory(data: {title: string|undefined, category?: string|undefined, id?: number|undefined}) {
  return axios.post(SAVE_CATEGORY,data,config)
}

export const changeImage = async (imageFile: unknown) => {
  return axios.post(CHANGE_LOGO,imageFile,{
    headers: {
      Authorization: `Bearer ${api_token}`,
      "Content-Type": "multipart/form-data",
    },
  })
}

export async function viewMaterialLoader ({ params }: { params: Params<"id"> }){
  const getMaterialResponse = await getMaterialView(Number(params.id));
  const materialViewData = getMaterialResponse.data
  return materialViewData;
}

export async function materialLoader ({ params }: { params: Params<"id"> }){
  const getMaterialResponse = await getMaterial(Number(params.id));
  const getMaterialData: MaterialModel = getMaterialResponse.data
  return getMaterialData;
}
export const queryDataResponse = async () => {

  const response = await getMaterials()
  const allMaterials = response.data.data;
  return {allMaterials}
}