import { Container, Title, Text, Group, Anchor } from '@mantine/core';
import { Illustration } from '../assets/images/Illustration';
import classes from '../assets/css/PageNotFound.module.css';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/use-document-title'

const PageNotFound = () => {
  useDocumentTitle('404: Page Not Found')

  return (
    <Container className={classes.root}>
    <div className={classes.inner}>
      <Illustration className={classes.image} />
      <div className={classes.content}>
        <Title className={classes.title}>Nothing to see here</Title>
        <Text c="dimmed" size="lg" ta="center" className={classes.description}>
          Page you are trying to open does not exist. You may have mistyped the address, or the
          page has been moved to another URL. If you think this is an error contact support.
        </Text>
        <Group justify="center">
          <Anchor component={Link} to="/dashboard">
          Take me back to home page
          </Anchor>
        </Group>
      </div>
    </div>
  </Container>
  )
}

export default PageNotFound
