import { Group } from '@mantine/core'
import React from 'react'

const GroupList = ({ children, px = 20, py = 15, noBorder = false }: { children: React.ReactNode, px?: number, py?: number, noBorder? :boolean }) => {
  const borderBottom = noBorder? 'none': '1px solid var(--mantine-color-default-hover)'
  return (
    <Group 
    justify='space-between' px={px} py={py} 
    style={{borderBottom:borderBottom}}
    >
      {children}
    </Group>
  )
}

export default GroupList
