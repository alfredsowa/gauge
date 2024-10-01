import { UnstyledButton, Group, Avatar, Text } from '@mantine/core';
// import { IconChevronRight } from '@tabler/icons-react';
import classes from '../assets/css/UserButton.module.css';

export function UserButton({userName,contact, avatarUrl}:{userName: string, contact: string, avatarUrl?: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"}) {
  return (
    <UnstyledButton className={classes.user}>
      <Group>
        <Avatar
          src={avatarUrl}
          radius="xl"
        />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {userName}
          </Text>

          <Text c="dimmed" size="xs">
            {contact}
          </Text>
        </div>

        {/* <IconChevronRight style={{ width: rem(14), height: rem(14) }} stroke={1.5} /> */}
      </Group>
    </UnstyledButton>
  );
}