import { Group, Title } from '@mantine/core'
import { PropsChildren } from '../requests/models/_general'
import { BackButton } from './BackButton'

const PageTitle = (
    {
      title,
      back=true,
      children
    }:{
      title: string,
      back?: boolean,
      children?: PropsChildren
    }) => {
  return (
      <>
        {back && <BackButton mr={15} mb={3} />}
        <Group wrap="wrap" justify="space-between" mb={20}>
          <>
            <Title fw={500} fz={25} mr={20}>
              {title}
            </Title>
          </>
          {children}
        </Group>
      </>
  )
}

export default PageTitle
