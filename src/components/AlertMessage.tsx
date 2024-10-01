import { Alert } from '@mantine/core';
import { IconCircleCheck, IconCircleXFilled, IconExclamationCircle, IconInfoCircle } from '@tabler/icons-react';

export function ErrorAlert({ message}:{message:string}) {
  const icon = <IconCircleXFilled />;
  return (
    <Alert variant="light" color="red" maw={400} mt={20} mb={5} title={message} icon={icon} />
  );
}

export function SuccessAlert({ message,title}:{message:string,title:string}) {
  const icon = <IconCircleCheck />;
  return (
    <Alert variant="light" color="green" maw={400} mt={20} mb={5} title={title} icon={icon}>
      {message}
    </Alert>
  );
}

export function InfoAlert({ message,title}:{message:string,title:string}) {
  const icon = <IconInfoCircle />;
  return (
    <Alert variant="light" color="blue" maw={400} mt={20} mb={5} title={title} icon={icon}>
      {message}
    </Alert>
  );
}

export function WarningAlert({ message,title}:{message:string,title:string}) {
  const icon = <IconExclamationCircle />;
  return (
    <Alert variant="light" color="orange" maw={400} mt={20} mb={5} title={title} icon={icon}>
      {message}
    </Alert>
  );
}