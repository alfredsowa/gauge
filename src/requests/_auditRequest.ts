import axios from "axios";
import { getAuth } from "../auth/core/AuthHelpers";
import { ReconciliationCollectionModel, ReconciliationData, ReconciliationModel, ReconciliationModelDataSaved, ReconciliationModelSaved } from "./models/_audit";

const API_URL = import.meta.env.VITE_APP_API_URL;

const getAuthData = getAuth()
export const api_token = getAuthData?.api_token

const config = {
  headers: { Authorization: `Bearer ${api_token}` }
};

export const GET_RECONCILIATIONS = `${API_URL}/reconciliations`;
export const SAVE_RECONCILIATION = `${API_URL}/reconciliations/save`;
export const SAVE_RECONCILIATION_DATA = `${API_URL}/reconciliations/data/save`;
export const REMOVE_RECONCILIATION = `${API_URL}/reconciliations/delete`;

export function getReconciliations() {
    return axios.get<ReconciliationCollectionModel>(GET_RECONCILIATIONS,config);
}

export function getReconciliation(id: number) {
    return axios.get<ReconciliationModel>(`${GET_RECONCILIATIONS}/${id}`,config);
}

export function saveReconciliation(data:{title: string, type: string,period: string, categories?: string[]}) {
    return axios.post<ReconciliationModelSaved>(SAVE_RECONCILIATION,data,config);
}

export function saveReconciliationData(data:{data: ReconciliationData[],id: number, completed: boolean}) {
    return axios.post<ReconciliationModelDataSaved>(SAVE_RECONCILIATION_DATA,data,config);
}

export async function getReconciliationsLoader (): Promise<ReconciliationModel[]>{
    const response = await getReconciliations();
    const getResponseData: ReconciliationModel[] = response.data.data

    return getResponseData
}

export function deleteReconciliation(id: number) {
    return axios.post(REMOVE_RECONCILIATION,{id},config);
}