import { Title } from '@mantine/core'
import useDocumentTitle from '../../hooks/use-document-title'
// import { useDocumentTitle } from '@mantine/hooks';

const Asset = () => {
  useDocumentTitle("Assets");

  return (
    <>
    <Title order={3} size="h1" mb={30}>
      Assets
    </Title>
      
    </>
  )
}

export default Asset
