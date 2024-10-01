import { Paper } from '@mantine/core'
import React from 'react'

const PaperCard = ({ children,height }: { children: React.ReactNode, height?: string|number }) => {
  return (
    <Paper withBorder={false} shadow='xs' mih={height} mb={20} radius={14}>
        {children}
    </Paper>
  )
}

export default PaperCard
