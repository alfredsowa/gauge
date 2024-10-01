import { Flex } from '@mantine/core'
import React from 'react'

const PaperCardBody = ({ children, px = 20, py = 20 }: { children: React.ReactNode, px?: number, py?: number }) => {
  return (
    <Flex px={px} direction="column" py={py}>
      { children }
    </Flex>
  )
}

export default PaperCardBody
