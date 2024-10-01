import useDocumentTitle from '../../hooks/use-document-title'
import IntermediateGoodsList from './components/IntermediateGoodsList.tsx'
import PageTitle from '../../components/PageTitle'
import PopUpSetupGuide from "../../components/PopUpSetupGuide.tsx";
import {useQuery} from "@tanstack/react-query";
import {intermediateGoodsLoader} from "../../requests/_intermediateGoodsRequests.ts";
import TableLoadingSingle from "../../components/TableLoadingSingle.tsx";

const IntermediateGoods = () => {
    const {data,isLoading} = useQuery({
        queryKey: ['intermediateGoods'],
        queryFn: intermediateGoodsLoader
    })
    
  useDocumentTitle("Intermediate Goods")

  return (
    <>
      <PageTitle back={false} title='Intermediate Goods' />

        {
            isLoading?(
                <>
                    <TableLoadingSingle withImage={true} columns={6} rows={4} />
                </>
                )
                :(
                <IntermediateGoodsList intermediateGoods={data} />
            )
        }


        <PopUpSetupGuide />
    </>
  )
}

export default IntermediateGoods
