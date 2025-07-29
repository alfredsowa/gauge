import { Anchor, Breadcrumbs, rem } from '@mantine/core';
import { LinkItem } from '../requests/models/_general';
import { Link } from 'react-router-dom';
import { IconHomeFilled } from '@tabler/icons-react';

const PageBreadCrumb = ({pageBreadCrumbs}:{pageBreadCrumbs: Array<LinkItem>}) => {

    const menus = pageBreadCrumbs.map((item: LinkItem, index: number) => (

    <Anchor component={Link} size={'sm'} c={'dimmed'} fw={400} to={item.href} key={index}>
      {
          item.title === "Dashboard"?
              (<IconHomeFilled style={{ width: rem(20), height: rem(20) }} stroke={2}  />)
              :item.title
      }
    </Anchor>
  ))
  return (
    <>
      <Breadcrumbs separator="-" fz={'sm'} px={6} py={3} style={{ borderLeft: '1px solid #cecece' }} separatorMargin={4}>
          {menus}
      </Breadcrumbs>
    </>
  )
}

export default PageBreadCrumb
