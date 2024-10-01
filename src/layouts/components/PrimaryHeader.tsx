import cx from 'clsx';
import {
    ActionIcon,
    AppShell,
    Avatar,
    Burger,
    Group,
    Image,
    Menu,
    Text,
    UnstyledButton,
    rem,
    useComputedColorScheme,
    useMantineColorScheme,
    Stack
} from '@mantine/core'
// import { MantineLogo } from '@mantinex/mantine-logo'
import { IconChevronDown, IconLogout, IconMoon, IconSettings, IconSun, IconUser} from '@tabler/icons-react'
import { useState } from 'react'
import classes from '../../assets/css/Header.module.css';
import { useAuth } from '../../auth/core/Auth';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/gauge-primary.png'
import logoWhite from '../../assets/images/gauge-logo-white.png'
import FeedbackModal from "../../pages/dashboard/FeedbackModal.tsx";

const PrimaryHeader = ({opened,toggle}:
    {
        opened: boolean, 
        toggle: () => void
    }) => {
  const {currentUser,logout} = useAuth()
  
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <AppShell.Header withBorder={true}>

        <Stack>
            <FeedbackModal />
            <Group justify="space-between" px="lg">
                <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
                <Image
                  h={35}
                  src={(computedColorScheme === 'light')?logo:logoWhite}
                />
                <Group justify="flex-right">
                    <ActionIcon  visibleFrom='md'
                      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                      variant="default"
                      size="md"
                      aria-label="Toggle Mode">
                        {computedColorScheme === 'light' && (<IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />)}
                        {computedColorScheme === 'dark' && (<IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />)}
                    </ActionIcon>
                    <Menu
                        width={260}
                        position="bottom-end"
                        transitionProps={{ transition: 'pop-top-right' }}
                        onClose={() => setUserMenuOpened(false)}
                        onOpen={() => setUserMenuOpened(true)}
                        withinPortal
                      >
                        <Menu.Target>
                          <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
                            <Group gap={7}>
                              <Avatar src={currentUser?.avatar_url} alt={currentUser?.name} radius="xl" size={25} />
                              <Text fw={500} size="sm" lh={1} mr={3}>
                                Hello
                              </Text>
                              <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                            </Group>
                          </UnstyledButton>
                        </Menu.Target>
                        <Menu.Dropdown>

                          <Menu.Item disabled
                            leftSection={ <IconUser style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}>
                            {currentUser?.email}
                          </Menu.Item>

                          <Menu.Item hiddenFrom="md" onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                            leftSection={
                              (computedColorScheme === 'light')?
                              <IconMoon className={cx(classes.icon, classes.dark)} style={{ width: rem(16), height: rem(16) }} stroke={1.5} />:
                              <IconSun className={cx(classes.icon, classes.dark)} style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}>
                            {(computedColorScheme === 'light')?"Dark Mode":"Light Mode"}
                          </Menu.Item>


                          <Menu.Item component={Link} to="/profile"
                            leftSection={ <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}>
                            Profile Settings
                          </Menu.Item>
                          {/* <Menu.Label>Settings</Menu.Label> */}

                          <Menu.Item component={Link} to="/my-business"
                            leftSection={ <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}>
                            Business Settings
                          </Menu.Item>


                          <Menu.Item onClick={logout}
                            leftSection={
                              <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                            } color='red'>
                            Logout
                          </Menu.Item>

                        </Menu.Dropdown>
                      </Menu>
                </Group>
            </Group>
        </Stack>
    </AppShell.Header>
  )
}

export default PrimaryHeader
