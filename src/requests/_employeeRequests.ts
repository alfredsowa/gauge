import axios from "axios";
import { getAuth } from "../auth/core/AuthHelpers";
import { EmployeeBasicCollectionModel, EmployeeBasicModel, EmployeeFormModel, EmployeeModel } from "./models/_employee";
import { Params } from "react-router-dom";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_EMPLOYEES = `${API_URL}/employees`;
export const GET_EMPLOYEE_BY_ID = `${API_URL}/employee`;
export const SAVE_EMPLOYEE = `${API_URL}/employees/save`;
export const DELETE_BY_ID = `${API_URL}/employees/delete`;
export const REMOVE_LOGO = `${API_URL}/employees/remove-image`;

const getAuthData = getAuth()

export const api_token = getAuthData?.api_token

const config = {
  headers: { Authorization: `Bearer ${api_token}` }
};

// // Server should return Product object
export function getBasicEmployee(id: number) {
  return axios.get<EmployeeBasicModel>(GET_EMPLOYEE_BY_ID+'/'+id,config);
}

// Server should return MaterialModel object
export function getEmployees() {
  const response = axios.get<EmployeeBasicCollectionModel>(GET_EMPLOYEES,config);
  return response
}

// Server should creates new Employee
export function saveEmployee(data: EmployeeFormModel) {
  return axios.post(SAVE_EMPLOYEE,data,{
    headers: {
      Authorization: `Bearer ${api_token}`,
      "Content-Type": "multipart/form-data",
    },
  });
}

export const removeImage = async (id?: number|null) => {
  return axios.post(REMOVE_LOGO,{id},config)
}

export function deleteEmployee(id: number|undefined) {
  return axios.post(DELETE_BY_ID,{id},config)
}

export async function employeesLoader (): Promise<EmployeeModel[]>{
  const getEmployeesResponse = await getEmployees();
  const getEmployeesData: EmployeeModel[] = getEmployeesResponse.data.data
  // if(getEmployeesData.length === undefined) return []

  return getEmployeesData;
}

export async function employeeLoader ({ params }: { params: Params<"id"> }): Promise<EmployeeBasicModel>{
  const getEmployeeResponse = await getBasicEmployee(Number(params.id));
  const getEmployeeData: EmployeeBasicModel = getEmployeeResponse.data
  return getEmployeeData;
}
