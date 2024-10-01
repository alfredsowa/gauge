import { useWindowScroll } from '@mantine/hooks';
import {Affix, Transition, ActionIcon} from '@mantine/core';
import {IconChevronsUp} from "@tabler/icons-react";

function ScrollToTop() {
    const [scroll, scrollTo] = useWindowScroll();

    return (
        <Affix position={{ bottom: 20, right: 20 }}>
            <Transition transition="slide-up" mounted={scroll.y > 0}>
                {(transitionStyles) => (
                    <ActionIcon variant="filled" aria-label="Settings" size={'xl'}
                        // leftSection={<IconArrowUp style={{ width: rem(16), height: rem(16) }} />}
                        style={transitionStyles}
                        onClick={() => scrollTo({ y: 0 })}
                    >
                        <IconChevronsUp />
                    </ActionIcon>
                )}
            </Transition>
        </Affix>
    );
}

export default ScrollToTop