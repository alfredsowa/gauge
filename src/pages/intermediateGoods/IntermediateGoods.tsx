import useDocumentTitle from '../../hooks/use-document-title'
import IntermediateGoodsList from './components/IntermediateGoodsList.tsx'
import PageTitle from '../../components/PageTitle'
import PopUpSetupGuide from "../../components/PopUpSetupGuide.tsx";
// import {useQuery} from "@tanstack/react-query";
// import {intermediateGoodsLoader} from "../../requests/_intermediateGoodsRequests.ts";
import AddIntermediateGoodsModal from "./components/AddIntermediateGoodsModal.tsx";

const IntermediateGoods = () => {
    // const {data,isLoading} = useQuery({
    //     queryKey: ['intermediateGoods'],
    //     queryFn: intermediateGoodsLoader
    // })

  useDocumentTitle("Intermediate Goods")

  return (
    <>
        <PageTitle back={false} title='Intermediate Goods' button={<AddIntermediateGoodsModal />} />
        <IntermediateGoodsList />
        <PopUpSetupGuide />
    </>
  )
}

export default IntermediateGoods
