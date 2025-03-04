import { Paper } from '@mantine/core'
import React from 'react'

const PaperCard = ({
  children,
  height,
  mb=20,
   radius=10,
   shadow="xs"
}: {
  children: React.ReactNode,
  height?: string|number
  mb?: number,
  radius?: number,
  shadow?: string
}) => {
  return (
    <Paper withBorder={false} shadow={shadow} mih={height} mb={mb} radius={radius}>
        {children}
    </Paper>
  )
}

export default PaperCard
