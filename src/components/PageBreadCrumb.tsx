import { Anchor, Breadcrumbs, rem } from '@mantine/core';
import { LinkItem } from '../requests/models/_general';
import { Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons-react';

const PageBreadCrumb = ({pageBreadCrumbs}:{pageBreadCrumbs: Array<LinkItem>}) => {
  const menus = pageBreadCrumbs.map((item: LinkItem, index: number) => (
    <Anchor component={Link} size='14px' c={'dimmed'} fw={500} to={item.href} key={index}>
      {item.title === "Dashboard"? (<IconHome style={{ width: rem(20), height: rem(20) }} stroke={1.5}  />):item.title}
    </Anchor>
  ))
  return (
    <>
      <Breadcrumbs separator="-" px={3} py={3} separatorMargin={7}>
          {menus}
      </Breadcrumbs>
    </>
  )
}

export default PageBreadCrumb
