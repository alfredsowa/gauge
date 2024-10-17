import useDocumentTitle from '../../hooks/use-document-title.ts'
import PageTitle from '../../components/PageTitle.tsx'
import PopUpSetupGuide from "../../components/PopUpSetupGuide.tsx";
import PageBreadCrumb from '../../components/PageBreadCrumb.tsx';
import { LinkItem } from '../../requests/models/_general.tsx';
import ProductionHistoryList from './components/ProductionHistoryList.tsx';

const ProductionHistory = () => {

  useDocumentTitle("Productions History")

  const items: Array<LinkItem> = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Productions', href: '/productions' },
    { title: 'Production History', href: '#' },
  ]

  return (
    <>
      <PageTitle title='Production History'>
        <PageBreadCrumb pageBreadCrumbs={items} />
      </PageTitle>
      
      <ProductionHistoryList />

      <PopUpSetupGuide />
    </>
  )
}

export default ProductionHistory
