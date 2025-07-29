import {em, Flex, Group, Title} from '@mantine/core'
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
            <Group wrap="nowrap" justify="left" mb={10}>
                {back && <BackButton mr={1} mb={3}/>}
                <Title fw={500} fz={18}>
                    {title}
                </Title>
            </Group>
            :
            <Group wrap="nowrap" justify="space-between" mb={10}>
                <Flex
                      gap="sm"
                      justify="flex-start"
                      align="center"
                      direction="row"
                      wrap="wrap">
                    {back && <BackButton mr={5} mb={3}/>}
                    <Group>
                        <Title fw={500} fz={{ base: 18, sm: 18, md: 22}} mr={10}>
                            {title}
                        </Title>
                        {breadcrumb}
                    </Group>
                </Flex>
                <>
                    {button}
                </>
            </Group>
          }
      </>
  )
}

export default PageTitle
