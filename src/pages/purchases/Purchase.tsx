import useDocumentTitle from '../../hooks/use-document-title'
import PurchaseList from './components/PurchaseList';
import PageTitle from '../../components/PageTitle';
import PopUpSetupGuide from "../../components/PopUpSetupGuide.tsx";


const Purchase = () => {
  useDocumentTitle("Purchases")

  return (
    <>
      <PageTitle back={false} title='Purchase'  />
      <PurchaseList />
      <PopUpSetupGuide />
    </>
  )
}

export default Purchase
