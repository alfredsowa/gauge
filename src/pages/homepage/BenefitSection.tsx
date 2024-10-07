import classes from '../../assets/css/Sections.module.css';
import {Box, Container, rem, Title} from "@mantine/core";
import BenefitSectionMaterials from './BenefitSectionMaterials.tsx';
import BenefitSectionProduction from './BenefitSectionProduction.tsx';
import BenefitSectionManagement from './BenefitSectionManagement.tsx';
import BenefitSectionFuture from './BenefitSectionFuture.tsx';

const BenefitSection = () => {
    return (
        <>
        <Box py={rem(80)} bg={'gauge-primary.1'}>
            <Container size="lg">
                <Title className={classes.title} c="gauge-primary" mb={40}>See What You Can Do</Title>
                <BenefitSectionMaterials  />
            </Container>
        </Box>
        <Box py={rem(80)}>
            <Container size="lg">
                <BenefitSectionProduction  />
            </Container>
        </Box>
        <Box py={rem(80)} bg={'gauge-primary.1'}>
            <Container size="lg">
                <BenefitSectionManagement  />
            </Container>
        </Box>
        <Box py={rem(80)}>
            <Container size="lg">
                <Title className={classes.title} c="gauge-primary" mb={40}>Future Features</Title>
                <BenefitSectionFuture  />
            </Container>
        </Box>
        </>
        
    )
}
export default BenefitSection
