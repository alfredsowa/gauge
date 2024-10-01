import useDocumentTitle from '../../hooks/use-document-title'
import PageTitle from '../../components/PageTitle'
// import { Flex, Group, Paper } from '@mantine/core'
// import BeginReconciliationModal from './components/BeginReconciliationModal'
import ReconciliationList from './components/ReconciliationList'
import PopUpSetupGuide from "../../components/PopUpSetupGuide.tsx";

const Reconciliation = () => {

  useDocumentTitle("Audit: Reconciliation")
  
  return (
    <>
      <PageTitle back={false} title="Reconciliation"  />

      <ReconciliationList  />

      <PopUpSetupGuide />
    </>
  )
}

export default Reconciliation
