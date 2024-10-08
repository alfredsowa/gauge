import { Container, Title, Button, Group, Text, List, ThemeIcon, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
// import image from '../../assets/images/hero.svg';
import classes from '../../assets/css/HomepageHero.module.css';

const HomepageHero = () => {
  return (
    <div style={{backgroundColor:"#fff"}}>
    <Container size="lg" px={'md'}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            A <span className={classes.highlight}>modern</span> Business <br /> processes manager
          </Title>
          <Text c="black" mt="md">
            Build fully functional accessible web applications faster than ever – Mantine includes
            more than 120 customizable components and hooks to cover you in any situation
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item c={'black'}>
              <b>TypeScript based</b> – build type safe applications, all components and hooks
              export types
            </List.Item>
            <List.Item c={'black'}>
              <b>Free and open source</b> – all packages have MIT license, you can use Mantine in
              any project
            </List.Item>
            <List.Item c={'black'}>
              <b>No annoying focus ring</b> – focus ring will appear only when user navigates with
              keyboard
            </List.Item>
          </List>

          <Group mt={30}>
            <Button radius="xl" size="md" className={classes.control}>
              Get started
            </Button>
            <Button variant="default" radius="xl" size="md" className={classes.control}>
              Source code
            </Button>
          </Group>
        </div>
        {/* <Image src={image.src} className={classes.image} /> */}
      </div>
    </Container>
    </div>
  );
}
export default HomepageHero