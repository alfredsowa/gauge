import useDocumentTitle from '../../hooks/use-document-title'
// import { useQuery } from '@tanstack/react-query'
// import { employeesLoader } from '../../requests/_employeeRequests'
import EmployeesList from './components/EmployeesList'
import PageTitle from '../../components/PageTitle'
import PopUpSetupGuide from "../../components/PopUpSetupGuide.tsx";

const Employees = () => {

  useDocumentTitle('Employees')
  return (
    <>
        <PageTitle back={false} title="Employees"  />
      
        <EmployeesList />

        <PopUpSetupGuide />
    </>
  )
}

export default Employees
