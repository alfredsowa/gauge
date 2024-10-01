import { ActionIcon, ActionIconProps} from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export function BackButton(props: ActionIconProps & React.ComponentPropsWithoutRef<'button'>) {
// export function BackButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  const history = useNavigate()

  const handleClick = () => {
    history(-1)
  }
  return (
    // <Button 
    //   mb={10}
    //   leftSection={<IconChevronLeft style={{ width: '1rem', height: '1rem' }} />}
    //   variant="light"
    //   {...props}
    //   pl={0}
    //   onClick={handleClick}
    // >
    //   Back
    // </Button>
    <ActionIcon {...props} variant="light" aria-label="Go Back" onClick={handleClick}>
      <IconChevronLeft style={{ width: '70%', height: '70%' }} stroke={2.5} />
    </ActionIcon>
  );
}