import {Button, ButtonProps} from '@mantine/core';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

// export function BackButton(props: ActionIconProps & React.ComponentPropsWithoutRef<'button'>) {
// export function BackButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
export function BackButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  const history = useNavigate()

  const handleClick = () => {
    history(-1)
  }
  return (
      <Button
          variant="transparent"
          size="xs"
          mb={0}
          leftSection={<IconArrowNarrowLeft style={{ width: '1rem', height: '1rem' }} />}
          {...props}
          pl={0}
          onClick={handleClick}
      >
        Go Back
      </Button>
      // <ActionIcon {...props} variant="light" aria-label="Go Back" onClick={handleClick}>
      //   <IconArrowNarrowLeft style={{ width: '70%', height: '70%' }} stroke={2} />
      // </ActionIcon>
  );
}