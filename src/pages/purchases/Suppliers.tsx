
import { useEffect, useState } from 'react';
import useDocumentTitle from '../../hooks/use-document-title'
import { SupplierBasic } from '../../requests/models/_business';
import { getSuppliers } from '../../requests/_purchaseRequests';
import { LinkItem } from '../../requests/models/_general';
import PageBreadCrumb from '../../components/PageBreadCrumb';
import SuppliersList from './components/SuppliersList';
import PageTitle from '../../components/PageTitle';

const Suppliers = () => {
    const [supplierList, setSupplierList] = useState<SupplierBasic[]|undefined>([]);
    useDocumentTitle("Suppliers")

    useEffect(() => {
        const suppliersResponse = async() => {
            const response = await getSuppliers()
            setSupplierList(response.data.data)
        }

        suppliersResponse()
    },[])

    const items: Array<LinkItem> = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Purchases', href: '/purchases' },
        { title: 'Suppliers', href: '#' },
      ]
    return (
        <>
            <PageTitle title='Suppliers'>
                <PageBreadCrumb pageBreadCrumbs={items} />
            </PageTitle>

            <SuppliersList setSupplierList={setSupplierList} supplierList={supplierList}  />
        </>
    )
}

export default Suppliers
