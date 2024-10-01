import { LoadingOverlay, Stack} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useState } from "react";
import { notify } from "../../requests/general/toast";
import { useLoaderData, useNavigate } from "react-router-dom";
import PageBreadCrumb from "../../components/PageBreadCrumb";
import { LinkItem, } from "../../requests/models/_general";
import EmployeeForm from "./components/EmployeeForm";
import { saveEmployee } from "../../requests/_employeeRequests";
import { EmployeeBasicModel } from "../../requests/models/_employee";
import PageTitle from "../../components/PageTitle";
import { AxiosError } from "axios";

const EditEmployee = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [fileM, setFileM] = useState<File | null>(null)
  const getEmployeeData = useLoaderData() as EmployeeBasicModel;

  const navigate  = useNavigate()
  
  const employeeInformation = useForm({
    initialValues: {
      first_name: getEmployeeData.first_name,
      last_name: getEmployeeData.last_name,
      email: getEmployeeData.email,
      phone_number: getEmployeeData.phone_number,
      alt_phone_number: getEmployeeData.alt_phone_number,
      image: getEmployeeData.image,
      hire_date: (getEmployeeData.hire_date)?new Date(getEmployeeData.hire_date):'',
      title: getEmployeeData.title,
      department: getEmployeeData.department,
    },
    validate: {
      first_name: (value) => (value.length < 2 ? 'First name is too small' : null),
      last_name: (value) => (value.length < 2 ? 'Last name is too small' : null),
      email: isEmail('Invalid email address'),
      phone_number: (value) => (value.length < 9 ? 'Phone number is invalid' : null),
      alt_phone_number: (value) => (value.length > 0 && value.length < 9 ? 'Alternative Phone number is invalid' : null),
      hire_date: (value) => (new Date(value) > new Date() ? 'Date must be present or past' : null),
      title: (value) => (value.length > 0 && value.length < 2 ? 'Job title is too small' : null),
      department: (value) => (value.length > 0 && value.length < 2 ? 'Department name is too small' : null),
    },
  });

  const handleSubmit = async(values: typeof employeeInformation.values) => {

    setFormLoading(true);

    if(fileM) {
      const formData = new FormData();
      formData.append('file', fileM);
    }
    else {
      setFileM(null)
    }
    
    const data = {
      id: getEmployeeData.id,
      file: fileM,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone_number: values.phone_number,
      alt_phone_number: values.alt_phone_number,
      hire_date: values.hire_date,
      title: values.title,
      department: values.department,
    }

    try{

      const response = await saveEmployee(data)
      
      if(response.data.saved) {

        notify({
          type:'success',
          message: response.data.message,
          title: 'Great'
        })
        setFormLoading(false);

        return navigate('/employees')

      }

    } catch(error) {
      if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
        notify({
          type:'error',
          message: error.response?.data.error, // Use optional chaining to access data property
          title: 'Something went wrong'
        })
      } else {
        notify({
          type:'error',
          message: 'An unexpected error occurred',
          title: 'Something went wrong'
        })
      }
      setFormLoading(false);
    }
    
    setFormLoading(false);
  }
  
  const items: Array<LinkItem> = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Employees', href: '/employees' },
    { title: 'Edit employee', href: '#' },
  ]

  return (
    <>
    <PageTitle title="Edit Employee">
      <PageBreadCrumb pageBreadCrumbs={items} />
    </PageTitle>

    <Stack mt={40} pos={'relative'}>

      <LoadingOverlay
        visible={formLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
        loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
      />

      <form method='POST' onReset={employeeInformation.onReset} onSubmit={employeeInformation.onSubmit(handleSubmit)}>
        <EmployeeForm employeeInformation={employeeInformation} imageUrl={getEmployeeData.image} setFileM={setFileM} />
      </form>
    </Stack>
    </>
  );
}

export default EditEmployee