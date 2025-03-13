import { Anchor, Breadcrumbs, rem } from '@mantine/core';
import { LinkItem } from '../requests/models/_general';
import { Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons-react';

const PageBreadCrumb = ({pageBreadCrumbs}:{pageBreadCrumbs: Array<LinkItem>}) => {

    const menus = pageBreadCrumbs.map((item: LinkItem, index: number) => (

    <Anchor component={Link} size={'sm'} c={'dimmed'} fw={400} to={item.href} key={index}>
      {
          item.title === "Dashboard"?
              (<IconHome style={{ width: rem(18), height: rem(18) }} stroke={1}  />)
              :item.title
      }
    </Anchor>
  ))
  return (
    <>
      <Breadcrumbs separator="/" fz={'sm'} px={3} py={3} separatorMargin={4}>
          {menus}
      </Breadcrumbs>
    </>
  )
}

export default PageBreadCrumb
