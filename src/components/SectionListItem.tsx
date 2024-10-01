import {Group, Text, ThemeIcon} from "@mantine/core";
import {IconSettings} from "@tabler/icons-react";

const SectionListItem = ({title}:{title: string}) => {
    return (
        <>
            <Group mb={15} wrap={"nowrap"}>
                <ThemeIcon variant={'light'} radius="xl" size="md" color="gauge-primary.8">
                    <IconSettings style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>
                <Text>{title}</Text>
            </Group>
        </>
    )
}
export default SectionListItem
