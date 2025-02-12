import { Container, Title, Text, Group, Button } from '@mantine/core';
import { Illustration } from '../../assets/images/Illustration';
import classes from '../../assets/css/PageNotFound.module.css';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../../hooks/use-document-title'
import { IconArrowLeft } from '@tabler/icons-react';

const ProductionErrorBoundary = () => {
  const history = useNavigate()

  const handleClick = () => {
    history(-1)
  }
  useDocumentTitle('Error: Something went wrong')

  return (
    <Container className={classes.root}>
    <div className={classes.inner}>
      <Illustration className={classes.image} />
      <div className={classes.content}>
        <Title className={classes.title}>Something went wrong</Title>
        <Text c="dimmed" size="lg" ta="center" className={classes.description}>
          Sorry! You are not allowed to perform this action.
        </Text>
        <Group justify="center">
          <Button aria-label="Go Back" onClick={handleClick} leftSection={<IconArrowLeft size={14} />}>
            Go Back
          </Button>
        </Group>
      </div>
    </div>
  </Container>
  )
}

export default ProductionErrorBoundary
