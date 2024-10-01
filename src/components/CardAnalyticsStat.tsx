import { Group, Paper, Text, ThemeIcon } from '@mantine/core'
import React from 'react'
import { MoneyFigure, PrettyPercentage } from '../requests/general/_numberHelper'
import classes from '../assets/css/Dashboard.module.css';
import { Icon, IconProps } from '@tabler/icons-react';

const CardAnalyticsStat = ({stat,DiffIcon}:{
    stat: {title: string, value: number, diff: number},
    DiffIcon: React.ForwardRefExoticComponent<Omit<IconProps, "ref"> & React.RefAttributes<Icon>>
}) => {
  return (
    // <Skeleton visible={cardAnalyticsLoading}>
        <Paper withBorder={false} shadow='xs' key={stat.title} p="md" radius={14}>
          <Group justify="apart">
            <div>
              <Text c="dimmed" tt="uppercase" fw={600} fz="sm" className={classes.label}>
                {stat.title}
              </Text>
              <Text fw={700} fz="xl">
                <MoneyFigure figure={stat.value}  />
              </Text>
            </div>
            <ThemeIcon
              color="gray"
              variant="light"
              style={{
                color: stat.diff > 0 ? 'var(--mantine-color-teal-6)' : 'var(--mantine-color-red-6)',
              }}
              size={25}
              radius="md"
            >
              <DiffIcon size="1.9rem" stroke={1.9} />
            </ThemeIcon>
          </Group>
          <Text c="dimmed" fz="sm" mt="md">
            <Text component="span" c={stat.diff > 0 ? 'teal' : 'red'} fw={700}>
              <PrettyPercentage figure={stat.diff} />
            </Text>
            {/* <br /> */}
            {' '}
            {stat.diff > 0 ? 'increase' : 'decrease'} from previous month
          </Text>
        </Paper>
      // </Skeleton>
  )
}

export default CardAnalyticsStat
