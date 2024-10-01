import useDocumentTitle from '../../hooks/use-document-title'
import PageTitle from '../../components/PageTitle'
import PageBreadCrumb from '../../components/PageBreadCrumb'
import { LinkItem } from '../../requests/models/_general'
import PaperCard from '../../components/PaperCard'
import PaperCardHeader from '../../components/PaperCardHeader'
import PaperCardBody from '../../components/PaperCardBody'
import { ReconciliationModel } from '../../requests/models/_audit'
import { useEffect, useState } from 'react'
import { getReconciliation } from '../../requests/_auditRequest'
import { useParams } from 'react-router-dom'
import { Grid, GridCol, Text } from '@mantine/core'
import { toHeadline } from '../../requests/general/_stringHelper'
import { DefaultReadableDate, getMonthYear } from '../../requests/general/_dates'
import ReconcilingForm from './components/ReconcilingForm'
import ReconciledData from './components/ReconciledData'

const ViewReconciliation = () => {
  const [reconciliation, setReconciliation] = useState<ReconciliationModel|undefined>();
  const [loading, setLoading] = useState(true);

  const {id} = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const response = await getReconciliation(Number(id))
      
      setReconciliation(response.data)
    }
    fetchData()
    setLoading(false)
  },[id])

  useDocumentTitle("Audit: Reconciliation")

  const items: Array<LinkItem> = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reconciliations', href: '/reconciliations' },
    { title: 'View Reconciliation', href: '#' },
  ]

  return (
    <>
    <PageTitle title="View Reconciliation">
      <PageBreadCrumb pageBreadCrumbs={items} />
    </PageTitle>

    {
      loading? 
      <Text>Loading...</Text> : (reconciliation)? (
        <>
      <PaperCard>
        <PaperCardHeader>
            <Text fw={'bold'}>
                Basic Information
            </Text>
            {
              reconciliation.closed? 
              (
                <Text fw={600} c={'green'}>CLOSED
                <Text fw={400} ml={5} c={'dimmed'} component='span'>
                  on <DefaultReadableDate dateFormat={reconciliation.closed_on}  />
                </Text>
                </Text>)
              : reconciliation.paused?(
                <Text fw={600} c={'dimmed'}>PAUSED</Text>
              ):(
                <Text fw={600} c={'orange'}>ON-GOING</Text>
              )  // Add your condition here to handle undefined values.
            }
        </PaperCardHeader>
        <PaperCardBody>
          <Grid>
            <GridCol span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
              <Text c={'dimmed'}>Title</Text>
              <Text>{reconciliation.title}</Text>
            </GridCol>
            
            <GridCol span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Text c={'dimmed'}>Type</Text>
                <Text>{toHeadline(reconciliation.type)}</Text>
            </GridCol>
            
            <GridCol span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Text c={'dimmed'}>Period</Text>
                <Text>{getMonthYear(reconciliation.period)}</Text>
            </GridCol>
            
            <GridCol span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Text c={'dimmed'}>Started On</Text>
                <Text><DefaultReadableDate dateFormat={reconciliation.created_at}  /></Text>
            </GridCol>
            
            <GridCol span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Text c={'dimmed'}>Last Modified</Text>
                <Text><DefaultReadableDate dateFormat={reconciliation.updated_at}  /></Text>
            </GridCol>
            
            <GridCol span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
                <Text c={'dimmed'}>Added By</Text>
                <Text>{reconciliation.user.firstname+" " + reconciliation.user.name}</Text>
            </GridCol>
          </Grid>
        </PaperCardBody>
      </PaperCard> 

      <PaperCard>
        <PaperCardHeader>
            <Text fw={'bold'}>
            {
              (reconciliation.type == "materials")?
              (reconciliation.categories.length > 0)?
              'Total Categories: '+reconciliation.categories.length:
              'All Categories':
              'Products'
            }
            </Text>
            
        </PaperCardHeader>
        <PaperCardBody>
          {
            reconciliation.closed?
            <ReconciledData reconciliation={reconciliation}  />:
            <ReconcilingForm reconciliation={reconciliation} setReconciliation={setReconciliation} />
          }
        </PaperCardBody>
        </PaperCard>
      </>
      ):''}   
    </>
  )
}

export default ViewReconciliation
