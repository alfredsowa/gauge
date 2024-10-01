import axios from "axios";
import {getAuth} from "../auth/core/AuthHelpers";
import {
  DuplicateIntermediateGoodModel,
  IntermediateGoodBasicCollectionModel,
  IntermediateGoodBasicModel,
  IntermediateGoodMaterialFormModel,
  IntermediateGoodModel,
  IntermediateGoodSave
} from "./models/_intermediateGood";
import {Params} from "react-router-dom";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_INTERMEDIATE_GOODS = `${API_URL}/intermediate-goods`;
export const GET_INTERMEDIATE_GOOD_BY_ID = `${API_URL}/intermediate-good`;
export const GET_INTERMEDIATE_GOOD_BY_SLUG = `${API_URL}/intermediate-good`;
export const SAVE_INTERMEDIATE_GOOD = `${API_URL}/intermediate-goods/save`;
export const DUPLICATE_INTERMEDIATE_GOOD = `${API_URL}/intermediate-goods/duplicate`;
export const DELETE_BY_ID = `${API_URL}/intermediate-goods/delete`;
export const SAVE_INTERMEDIATE_GOOD_MATERIAL = `${API_URL}/intermediate-goods/intermediate-good/material/save`;
export const DELETE_INTERMEDIATE_GOOD_MATERIAL = `${API_URL}/intermediate-goods/intermediate-good/material/delete`;
export const REMOVE_LOGO = `${API_URL}/intermediate-goods/remove-image`;

const getAuthData = getAuth()

export const api_token = getAuthData?.api_token

const config = {
  headers: { Authorization: `Bearer ${api_token}` }
};

// // Server should return IntermediateGood object
export function getBasicIntermediateGood(id: number) {
  return axios.get<IntermediateGoodBasicModel>(GET_INTERMEDIATE_GOOD_BY_ID+'/'+id,config);
}

// Server should return MaterialModel object
export function getIntermediateGood(slug: string) {
  return axios.get<IntermediateGoodModel>(GET_INTERMEDIATE_GOOD_BY_SLUG+'/'+slug+'/view',config);
}

// Server should return MaterialModel object
export function getIntermediateGoods() {
  return axios.get<IntermediateGoodBasicCollectionModel>(GET_INTERMEDIATE_GOODS,config);
}

// Server should creates new IntermediateGood
/**
 * Creates a new intermediate-good by sending a POST request to the server.
 *
 * @remarks
 * This function sends a POST request to the SAVE_INTERMEDIATE_GOOD endpoint with the provided intermediate-good data.
 * The request includes the authorization token and the "Content-Type" header set to "multipart/form-data".
 *
 * @param data - The intermediate-good data to be saved. This should be an object conforming to the {@link IntermediateGoodSave} interface.
 *
 * @returns A Promise that resolves to the response from the server.
 *
 * @throws Will throw an error if the request fails or if the server returns an error response.
 *
 * @example
 * ```typescript
 * const productData: IntermediateGoodSave = {
 *   name: "Example IntermediateGood",
 *   description: "This is an example intermediate-good.",
 *   // ... other intermediate-good properties
 * };
 * try {
 *   const response = await createIntermediateGood(productData);
 *   console.log("IntermediateGood created successfully");
 * } catch (error) {
 *   console.error("Failed to create intermediate-good:", error.message);
 * }
 * ```
 */
export function createIntermediateGood(data: IntermediateGoodSave) {
  return axios.post(SAVE_INTERMEDIATE_GOOD, data, {
    headers: {
      Authorization: `Bearer ${api_token}`,
      "Content-Type": "multipart/form-data",
    },
  });
}

// Server should creates new IntermediateGood
/**
 * Duplicates a intermediate-good by its ID.
 *
 * @remarks
 * This function sends a POST request to the DUPLICATE_INTERMEDIATE_GOOD endpoint with the provided intermediate-good ID.
 * The request includes the authorization token in the headers.
 *
 * @param id - The ID of the intermediate-good to be duplicated.
 * @returns A Promise that resolves to a {@link DuplicateIntermediateGoodModel} object.
 *
 * @throws Will throw an error if the request fails or if the server returns an error response.
 *
 * @example
 * ```typescript
 * const intermediate-goodId = 123;
 * try {
 *   const duplicatedIntermediateGood = await duplicateIntermediateGood(intermediate-goodId);
 *   console.log("IntermediateGood duplicated successfully:", duplicatedIntermediateGood);
 * } catch (error) {
 *   console.error("Failed to duplicate intermediate-good:", error.message);
 * }
 * ```
 */
export function duplicateIntermediateGood( id: number ) {
  return axios.post<DuplicateIntermediateGoodModel>(DUPLICATE_INTERMEDIATE_GOOD,{id},config);
}

export const removeImage = async (id?: number|null) => {
  return axios.post(REMOVE_LOGO,{id},config)
}

/**
 * Deletes a intermediate-good by its ID.
 *
 * @remarks
 * This function sends a POST request to the DELETE_BY_ID endpoint with the provided intermediate-good ID.
 * The request includes the authorization token in the headers.
 *
 * @param id - The ID of the intermediate-good to be deleted.
 * @returns A Promise that resolves to the response from the server.
 *
 * @throws Will throw an error if the request fails or if the server returns an error response.
 *
 * @example
 * ```typescript
 * const intermediate-goodId = 123;
 * try {
 *   const response = await deleteIntermediateGood(intermediate-goodId);
 *   console.log("IntermediateGood deleted successfully");
 * } catch (error) {
 *   console.error("Failed to delete intermediate-good:", error.message);
 * }
 * ```
 */
export function deleteIntermediateGood(id: number|undefined) {
  return axios.post(DELETE_BY_ID, { id }, config);
}


// Server should creates new Production material
export function saveIntermediateGoodMaterial(data: IntermediateGoodMaterialFormModel) {
  return axios.post(SAVE_INTERMEDIATE_GOOD_MATERIAL,data,config);
}

export function deleteIntermediateGoodMaterial(data: {id: number,intermediate_good_id: number}) {
  return axios.post(DELETE_INTERMEDIATE_GOOD_MATERIAL,data,config);
}

/**
 * Fetches a collection of intermediate-goods from the server.
 *
 * @remarks
 * This function sends a GET request to the GET_INTERMEDIATE_GOODS endpoint.
 * The request includes the authorization token in the headers.
 *
 * @returns A Promise that resolves to an array of {@link IntermediateGoodBasicModel} objects.
 *
 * @throws Will throw an error if the request fails or if the server returns an error response.
 *
 * @example
 * ```typescript
 * try {
 *   const intermediateGoods = await intermediateGoodsLoader();
 *   console.log("IntermediateGoods fetched successfully:", intermediateGoods);
 * } catch (error) {
 *   console.error("Failed to fetch intermediate-goods:", error.message);
 * }
 * ```
 */
export async function intermediateGoodsLoader() {
  const getIntermediateGoodResponse = await getIntermediateGoods();
  const getIntermediateGoodsCollection: IntermediateGoodBasicModel[] = getIntermediateGoodResponse.data.data;
  return getIntermediateGoodsCollection;
}

/**
 * Fetches a single intermediate-good by its ID from the server.
 *
 * @remarks
 * This function sends a GET request to the GET_INTERMEDIATE_GOOD_BY_ID endpoint with the provided intermediate-good ID.
 * The request includes the authorization token in the headers.
 *
 * @param params - An object containing the route parameters.
 * @param params.id - The ID of the intermediate-good to be fetched.
 *
 * @returns A Promise that resolves to a {@link IntermediateGoodBasicModel} object.
 *
 * @throws Will throw an error if the request fails or if the server returns an error response.
 *
 * @example
 * ```typescript
 * const intermediateGoodId = 123;
 * try {
 *   const intermediateGood = await intermediateGoodLoader({ params: { id: intermediateGoodId } });
 *   console.log("IntermediateGood fetched successfully:", intermediateGood);
 * } catch (error) {
 *   console.error("Failed to fetch intermediateGood:", error.message);
 * }
 * ```
 */
export async function intermediateGoodLoader ({ params }: { params: Params<"id"> }): Promise<IntermediateGoodBasicModel>{
  const getIntermediateGoodResponse = await getBasicIntermediateGood(Number(params.id));
  return getIntermediateGoodResponse.data;
}

/**
 * Fetches a single intermediateGood by its slug from the server.
 *
 * @remarks
 * This function sends a GET request to the GET_INTERMEDIATE_GOOD_BY_SLUG endpoint with the provided intermediateGood slug.
 * The request includes the authorization token in the headers.
 *
 * @param params - An object containing the route parameters.
 * @param params.slug - The slug of the intermediateGood to be fetched.
 *
 * @returns A Promise that resolves to a {@link IntermediateGoodModel} object.
 *
 * @throws Will throw an error if the request fails or if the server returns an error response.
 *
 * @example
 * ```typescript
 * const intermediateGoodSlug = "example-intermediateGood";
 * try {
 *   const intermediateGood = await intermediateGoodViewLoader({ params: { slug: intermediateGoodSlug } });
 *   console.log("IntermediateGood fetched successfully:", intermediateGood);
 * } catch (error) {
 *   console.error("Failed to fetch intermediateGood:", error.message);
 * }
 * ```
 */
export async function intermediateGoodViewLoader ({ params }: { params: Params<"slug"> }): Promise<IntermediateGoodModel>{
  const getIntermediateGoodResponse = await getIntermediateGood(String(params.slug));
  return getIntermediateGoodResponse.data;
}
