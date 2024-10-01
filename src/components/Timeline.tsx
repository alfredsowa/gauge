import { Timeline, Text, Center, Title, ScrollArea, Group } from '@mantine/core';
import { History } from '../requests/models/_production';
import { DefaultReadableDate } from '../requests/general/_dates';
import { toHeadline } from '../requests/general/_stringHelper';
import { IconCalendar } from '@tabler/icons-react';

const TimelineComponent = ({history}:{history: History[]}) => {

    const row = history.map((row: History) => {
        return (
            <Timeline.Item key={row.id} title={
                <>
                <Group justify='space-between'>
                    {toHeadline(row.status)}
                    <Text fz="sm">
                        <IconCalendar style={{height:13,width:13}} /> <DefaultReadableDate dateFormat={row.created_at}  />
                    </Text>
                </Group>
                </>
                
                }>
                {/* <Group>
                    <Avatar src={row.user.avatar_url} size={20} radius={10}></Avatar>
                    <Text c="dimmed" fw={600} fz="sm">{row.user.firstname+' '+row.user.name}</Text>
                </Group> */}
                <Text c="dimmed" size="sm">{row.note}</Text>
                
                
            </Timeline.Item>
        )
    } )

  return (
    <>
        {
            (row.length > 0)? (
                <ScrollArea h={550} offsetScrollbars scrollbarSize={6}>
                <Timeline color="green" active={history.length} lineWidth={3} bulletSize={20}>
                    {row}
                </Timeline>
                </ScrollArea>
            ): (
                <Center>
                    <Title size={'h4'} fw={600}>
                        No history available
                    </Title>
                </Center>
            )
        }
    </>
  )
}

export default TimelineComponent
