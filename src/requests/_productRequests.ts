import axios from "axios";
import { getAuth } from "../auth/core/AuthHelpers";
// import { Params } from "react-router-dom";
import { DuplicateProductModel, ProductBasicCollectionModel, ProductBasicModel, ProductCost, ProductMaterialFormModel, ProductModel, ProductSave } from "./models/_product";
import { Params } from "react-router-dom";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_PRODUCTS = `${API_URL}/products`;
export const GET_PRODUCT_BY_ID = `${API_URL}/product`;
export const GET_PRODUCT_FULL_BY_ID = `${API_URL}/product-full`;
export const GET_PRODUCT_COST = `${API_URL}/product-cost`;
export const VIEW_PRODUCT_BY_SLUG = `${API_URL}/product`;
export const SAVE_PRODUCT = `${API_URL}/products/save`;
export const DUPLICATE_PRODUCT = `${API_URL}/products/duplicate`;
export const DELETE_BY_ID = `${API_URL}/products/delete`;
export const SAVE_PRODUCT_MATERIAL = `${API_URL}/products/product/material/save`;
export const DELETE_PRODUCT_MATERIAL = `${API_URL}/products/product/material/delete`;
export const DELETE_PRODUCT_INTERMEDIATE_GOOD = `${API_URL}/products/product/intermediate-good/delete`;
export const REMOVE_LOGO = `${API_URL}/products/remove-image`;

const getAuthData = getAuth()

export const api_token = getAuthData?.api_token

const config = {
  headers: { Authorization: `Bearer ${api_token}` }
};

// Server should return Product object
export function getBasicProduct(id: number) {
  return axios.get<ProductBasicModel>(GET_PRODUCT_BY_ID+'/'+id,config);
}

// Server should return MaterialModel object by Id
export function getFullProduct(id: number) {
  return axios.get<ProductModel>(GET_PRODUCT_FULL_BY_ID+'/'+id,config);
}

// Server should return MaterialModel object
export function getProduct(slug: string) {
  return axios.get<ProductModel>(GET_PRODUCT_BY_ID+'/'+slug+'/view',config);
}

// Server should return MaterialModel object
export function getProductCost(id: number) {
  return axios.get<ProductCost>(GET_PRODUCT_COST+'/'+id,config);
}

// Server should return MaterialModel object
export function getProducts() {
  return axios.get<ProductBasicCollectionModel>(GET_PRODUCTS,config);
}

// Server should creates new Product
/**
 * Creates a new product by sending a POST request to the server.
 *
 * @remarks
 * This function sends a POST request to the SAVE_PRODUCT endpoint with the provided product data.
 * The request includes the authorization token and the "Content-Type" header set to "multipart/form-data".
 *
 * @param data - The product data to be saved. This should be an object conforming to the {@link ProductSave} interface.
 *
 * @returns A Promise that resolves to the response from the server.
 *
 * @throws Will throw an error if the request fails or if the server returns an error response.
 *
 * @example
 * ```typescript
 * const productData: ProductSave = {
 *   name: "Example Product",
 *   description: "This is an example product.",
 *   // ... other product properties
 * };
 * try {
 *   const response = await createProduct(productData);
 *   console.log("Product created successfully");
 * } catch (error) {
 *   console.error("Failed to create product:", error.message);
 * }
 * ```
 */
export function createProduct(data: ProductSave) {
  return axios.post(SAVE_PRODUCT, data, {
    headers: {
      Authorization: `Bearer ${api_token}`,
      "Content-Type": "multipart/form-data",
    },
  });
}

// Server should creates new Product
/**
 * Duplicates a product by its ID.
 *
 * @remarks
 * This function sends a POST request to the DUPLICATE_PRODUCT endpoint with the provided product ID.
 * The request includes the authorization token in the headers.
 *
 * @param id - The ID of the product to be duplicated.
 * @returns A Promise that resolves to a {@link DuplicateProductModel} object.
 *
 * @throws Will throw an error if the request fails or if the server returns an error response.
 *
 * @example
 * ```typescript
 * const productId = 123;
 * try {
 *   const duplicatedProduct = await duplicateProduct(productId);
 *   console.log("Product duplicated successfully:", duplicatedProduct);
 * } catch (error) {
 *   console.error("Failed to duplicate product:", error.message);
 * }
 * ```
 */
export function duplicateProduct( id: number ) {
  return axios.post<DuplicateProductModel>(DUPLICATE_PRODUCT,{id},config);
}

export const removeImage = async (id?: number|null) => {
  return axios.post(REMOVE_LOGO,{id},config)
}

/**
 * Deletes a product by its ID.
 *
 * @remarks
 * This function sends a POST request to the DELETE_BY_ID endpoint with the provided product ID.
 * The request includes the authorization token in the headers.
 *
 * @param id - The ID of the product to be deleted.
 * @returns A Promise that resolves to the response from the server.
 *
 * @throws Will throw an error if the request fails or if the server returns an error response.
 *
 * @example
 * ```typescript
 * const productId = 123;
 * try {
 *   const response = await deleteProduct(productId);
 *   console.log("Product deleted successfully");
 * } catch (error) {
 *   console.error("Failed to delete product:", error.message);
 * }
 * ```
 */
export function deleteProduct(id: number|undefined) {
  return axios.post(DELETE_BY_ID, { id }, config);
}


// Server should creates new Production material
export function saveProductMaterial(data: ProductMaterialFormModel) {
  return axios.post(SAVE_PRODUCT_MATERIAL,data,config);
}

export function deleteProductMaterial(data: {id: number,product_id: number}) {
  return axios.post(DELETE_PRODUCT_MATERIAL,data,config);
}

export function deleteProductIntermediateGood(data: {id: number,product_id: number}) {
  return axios.post(DELETE_PRODUCT_INTERMEDIATE_GOOD,data,config);
}

/**
 * Fetches a collection of products from the server.
 *
 * @remarks
 * This function sends a GET request to the GET_PRODUCTS endpoint.
 * The request includes the authorization token in the headers.
 *
 * @returns A Promise that resolves to an array of {@link ProductBasicModel} objects.
 *
 * @throws Will throw an error if the request fails or if the server returns an error response.
 *
 * @example
 * ```typescript
 * try {
 *   const products = await productsLoader();
 *   console.log("Products fetched successfully:", products);
 * } catch (error) {
 *   console.error("Failed to fetch products:", error.message);
 * }
 * ```
 */
export async function productsLoader() {
  const getProductResponse = await getProducts();
  const getProductsCollection: ProductBasicModel[] = getProductResponse.data.data;
  return getProductsCollection;
}

/**
 * Fetches a single product by its ID from the server.
 *
 * @remarks
 * This function sends a GET request to the GET_PRODUCT_BY_ID endpoint with the provided product ID.
 * The request includes the authorization token in the headers.
 *
 * @param params - An object containing the route parameters.
 * @param params.id - The ID of the product to be fetched.
 *
 * @returns A Promise that resolves to a {@link ProductBasicModel} object.
 *
 * @throws Will throw an error if the request fails or if the server returns an error response.
 *
 * @example
 * ```typescript
 * const productId = 123;
 * try {
 *   const product = await productLoader({ params: { id: productId } });
 *   console.log("Product fetched successfully:", product);
 * } catch (error) {
 *   console.error("Failed to fetch product:", error.message);
 * }
 * ```
 */
export async function productLoader ({ params }: { params: Params<"id"> }): Promise<ProductBasicModel>{
  const getProductResponse = await getBasicProduct(Number(params.id));
  const getProductData: ProductBasicModel = getProductResponse.data
  return getProductData;
}

/**
 * Fetches a single product by its slug from the server.
 *
 * @remarks
 * This function sends a GET request to the VIEW_PRODUCT_BY_SLUG endpoint with the provided product slug.
 * The request includes the authorization token in the headers.
 *
 * @param params - An object containing the route parameters.
 * @param params.slug - The slug of the product to be fetched.
 *
 * @returns A Promise that resolves to a {@link ProductModel} object.
 *
 * @throws Will throw an error if the request fails or if the server returns an error response.
 *
 * @example
 * ```typescript
 * const productSlug = "example-product";
 * try {
 *   const product = await productViewLoader({ params: { slug: productSlug } });
 *   console.log("Product fetched successfully:", product);
 * } catch (error) {
 *   console.error("Failed to fetch product:", error.message);
 * }
 * ```
 */
export async function productViewLoader ({ params }: { params: Params<"slug"> }): Promise<ProductModel>{
  const getProductResponse = await getProduct(String(params.slug));
  const getProductData: ProductModel = getProductResponse.data
  return getProductData;
}
