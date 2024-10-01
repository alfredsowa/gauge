import { Title } from '@mantine/core'
import useDocumentTitle from '../../hooks/use-document-title'

const Report = () => {
  useDocumentTitle("Reports")

  return (
    <>
    <Title order={3} size="h1" mb={30}>
      Reports
    </Title>
      
    </>
  )
}

export default Report
