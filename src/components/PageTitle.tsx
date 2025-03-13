import {em, Group, Stack, Title} from '@mantine/core'
import { BackButton } from './BackButton'
import React from "react";
import {useMediaQuery} from "@mantine/hooks";
import {MOBILE_SCREEN_SIZE} from "../base/constants.ts";

const PageTitle = (
    {
        title,
        back=true,
        breadcrumb,
        button
    }:{
        title: string,
        back?: boolean,
        breadcrumb?: React.ReactNode,
        button?: React.ReactNode
      // children?: PropsChildren
    }) => {

    const isMobile = useMediaQuery(`(max-width: ${em(MOBILE_SCREEN_SIZE)}`);

  return (
      <>
        {isMobile ?
            <Group wrap="nowrap" justify="left" mb={20}>
                {back && <BackButton mr={1} mb={3}/>}
                <Title fw={500} fz={20}>
                    {title}
                </Title>
            </Group>:
            <Group wrap="nowrap" justify="space-between" mb={20}>
                <Group justify="left">
                    {back && <BackButton mr={5} mb={3}/>}
                    <Stack>
                        <Title fw={500} fz={{ base: 20, sm: 20, md: 25}} mr={20}>
                            {title}
                            {breadcrumb}
                        </Title>
                    </Stack>
                </Group>
                <>
                    {button}
                </>
            </Group>
          }
      </>
  )
}

export default PageTitle
