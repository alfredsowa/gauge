import { ActionIcon, Divider, Table, Text } from "@mantine/core"
import PaperCard from "../../../components/PaperCard"
import PaperCardHeader from "../../../components/PaperCardHeader"
import PaperCardBody from "../../../components/PaperCardBody"
import OverheadCostForm from "./OverheadCostForm"
import AverageGoodsMonthly from "./AverageGoodsMonthly"
import { useAuth } from "../../../auth/core/Auth"
import { useEffect, useMemo, useState } from "react"
import { Overhead } from "../../../requests/models/_business"
import { getOverheads, removeOverhead } from "../../../requests/_businessRequests"
import { IconTrash } from "@tabler/icons-react"
import { MoneyFigure } from "../../../requests/general/_numberHelper"
import { notify } from "../../../requests/general/toast"
import { AxiosError } from "axios"

const OverheadCost = () => {
  const [overheadCosts, setOverheadCosts] = useState<Overhead[]|undefined>([])
  // const [loading, setLoading] = useState(false)
  const {currentBusiness, setCurrentBusiness} = useAuth()

  // let overhead_per_month = 0;
  // let overhead_per_product = 0;

  useEffect(() => {
    const fetchOverheadCosts = async () => {
      // setLoading(true)
        const response = await getOverheads()
      if(response.data) {
        setOverheadCosts(response.data)
      } 
      // setLoading(false)
    }
    fetchOverheadCosts()
  },[])

  const overhead_per_month = useMemo(()=>{
    let sum = 0;

    if(overheadCosts) {
      if(overheadCosts?.length > 0) {
        overheadCosts.forEach((overhead) => {
          sum += Number(overhead.cost)
        });
      }
    }
  
    return sum
  },[overheadCosts])

  const overhead_per_product = useMemo(()=>{
    let sum = 0;
    if(overheadCosts) {
      if(overheadCosts?.length > 0) {
        overheadCosts.forEach((overhead) => {
          sum += Number(overhead.cost)
        });
      }
    }

    if(currentBusiness?.average_goods_monthly) {
      if(currentBusiness.average_goods_monthly > 0) {
        return sum/currentBusiness.average_goods_monthly
      }
    }

    return 0
    
  },[overheadCosts,currentBusiness?.average_goods_monthly])

  const removeOverheadCost = async (id: number) => {
    try {
      const response = await removeOverhead({id})
      if(response.data.saved) {
        const data = overheadCosts?.filter((overhead)=>{
          return overhead.id!== id
        })
        setOverheadCosts(data)
        notify({
          type:'success',
          message: response.data.message, // Use optional chaining to access data property
          title: 'Successful'
        })
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
    }
  }

  return (
    <PaperCard>
      <PaperCardHeader>
        <Text>
          Overhead Costs
        </Text>
        <OverheadCostForm setOverheadCosts={setOverheadCosts} />
      </PaperCardHeader>
      <PaperCardBody>
        <Text mb={15}>
          Average monthly goods produced
          {/* average_goods_monthly */}
        </Text>
        <AverageGoodsMonthly  currentBusiness={currentBusiness} setCurrentBusiness={setCurrentBusiness} />

        <Divider my={15} />
        {/* Overhead Costs Forms */}
        <Text fw={600} mb={20}>List of Overhead Costs</Text>
        <Table striped withTableBorder>
          <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Cost</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {overheadCosts && overheadCosts?.length > 0 ? overheadCosts?.map((overhead) => (
              <Table.Tr key={overhead.id}>
                <Table.Td>{overhead.title}</Table.Td>
                <Table.Td><MoneyFigure figure={overhead.cost} /></Table.Td>
                <Table.Td ta={'right'}>
                  <ActionIcon color="red" variant="light">
                    <IconTrash onClick={()=>removeOverheadCost(overhead.id)} style={{width:'75%', height:'75%'}} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            )):null}
          </Table.Tbody>
          <Table.Tfoot>
            <Table.Tr>
              <Table.Th>Overhead per Month</Table.Th>
              <Table.Th colSpan={2}><MoneyFigure figure={overhead_per_month} /></Table.Th>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Overhead per Product</Table.Th>
              <Table.Th colSpan={2}><MoneyFigure figure={overhead_per_product} /></Table.Th>
            </Table.Tr>
          </Table.Tfoot>
        </Table>
        {/* {overheadCosts?.map((overhead, index) => (
          <Group wrap="nowrap" justify="space-between" key={index} mt={10}>
            <Text>
              {overhead.title} - {overhead.cost}
            </Text>
            <ActionIcon><IconTrash style={{width:'75%', height:'75%'}} /></ActionIcon>
          </Group>
          
        ))} */}
      </PaperCardBody>
    </PaperCard>
  )
}

export default OverheadCost
