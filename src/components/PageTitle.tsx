import { Group, Text } from '@mantine/core'
import { PropsChildren } from '../requests/models/_general'
import { BackButton } from './BackButton'

const PageTitle = ({title,back=true,children}:{title: string, back?: boolean, children?: PropsChildren}) => {
  return (
    <>
    <Group wrap="wrap" justify="space-between" mb={20}>
      <>
        <Text fw={400} fz={25} mr={20}>
          {back && <BackButton mr={15} />}
          {title}
        </Text>
      </>
        {children}
    </Group>
    </>
  )
}

export default PageTitle
