import {Button, ButtonProps} from '@mantine/core';
import { IconChevronLeft} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import React from "react";

export function BackButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  const history = useNavigate()

  const handleClick = () => {
    history(-1)
  }
  return (
      <Button
          variant="transparent"
          size="sm"
          mb={0}
          leftSection={<IconChevronLeft style={{ width: '1.5rem', height: '1.5rem' }} />}
          {...props}
          pl={0}
          pr={0}
          onClick={handleClick}
      >
          {props.title}
      </Button>
  );
}