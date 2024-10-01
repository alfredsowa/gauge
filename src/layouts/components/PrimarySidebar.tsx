import {
  IconUsers,
  IconCash, IconTools,
  IconLayoutDashboard,
  IconBuildingStore,
  IconWallet,
  IconBuildingFactory,
  IconActivity, IconTransformPointTopLeft
} from '@tabler/icons-react';
import { AppShell, Box, NavLink, ScrollArea, Text } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';

const data = [
  { icon: IconLayoutDashboard, label: 'Dashboard', link: '/dashboard', pathname: 'dashboard' },
  { icon: IconTools, label: 'Materials', link: '/materials', pathname: 'materials' },
  { icon: IconTransformPointTopLeft, label: 'Intermediate Goods', link: '/intermediate-goods', pathname: 'intermediate-goods' },
  { icon: IconBuildingStore, label: 'Products', link: '/products', pathname: 'products' },
  { icon: IconWallet, label: 'Purchases', link: '/purchases', pathname: 'purchases' },
  { icon: IconBuildingFactory, label: 'Productions', link: '/productions', pathname: 'productions' },
  { icon: IconCash, label: 'Sales', link: '/sales', pathname: 'sales' },
  { icon: IconUsers, label: 'Employees', link: '/employees', pathname: 'employees' },
  { icon: IconActivity, label: 'Reconciliations', link: '/reconciliations', pathname: 'reconciliations' },
  // { icon: IconSettings, label: 'Settings', link: '/settings', pathname: 'settings' },
];

const PrimarySidebar = ({toggle}:
  {
      toggle: () => void
  }) => {
    const currentLocation = useLocation();
    const locationPath = currentLocation.pathname
    const locationPathArray = locationPath.split('/');

    const items = data.map((item) => (
    <NavLink
      // ta={'center'}
      style={{borderRadius: '10px'}}
      py={12}
      mb={3}
      noWrap={true}
      component={Link} 
      to={item.link}
      key={item.label}
      fw={500}
      onClick={toggle}
      active={locationPathArray[1] === item.pathname}
      leftSection={<item.icon size="1.5rem" stroke={1.4} />}
      label={<><Text fw={400}>{item.label}</Text></>}
      color="gauge-primary"
      variant="filled"
    />
  ));

    return (
        <AppShell.Navbar bg={'var(--mantine-color-body)'}>
            <ScrollArea>
              <Box p="sm">
                {items}
              </Box>
            </ScrollArea>
        </AppShell.Navbar>
    );
  
}

export default PrimarySidebar