import useDocumentTitle from '../../hooks/use-document-title'
import PageTitle from '../../components/PageTitle'
import CustomersList from './components/CustomersList'
import { useLoaderData } from 'react-router-dom'
import { CustomerBasicModel } from '../../requests/models/_sales'
import { LinkItem } from '../../requests/models/_general'
import PageBreadCrumb from '../../components/PageBreadCrumb'

const Customer = () => {
  useDocumentTitle("Customer")
  const customers = useLoaderData() as CustomerBasicModel[]

  const items: Array<LinkItem> = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Sales', href: '/sales' },
    { title: 'Customers', href: '#' },
  ]
  return (
    <>
      <PageTitle title='Customers'>
      <PageBreadCrumb pageBreadCrumbs={items} />
    </PageTitle>
      
      <CustomersList customers={customers} />
      
    </>
  )
}

export default Customer
