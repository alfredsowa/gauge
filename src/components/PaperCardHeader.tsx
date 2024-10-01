import { Divider, Group } from '@mantine/core'
import React from 'react'

const PaperCardHeader = ({ children }: { children: React.ReactNode }) => {
    return (
      
      <>
        <Group px={20} py={15} justify="space-between">
            {children}
        </Group>
        <Divider  />
      </>
    )
  }

export default PaperCardHeader
