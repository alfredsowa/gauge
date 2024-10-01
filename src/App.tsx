import { AuthInit } from './auth/core/Auth';
import PrimaryLayout from './layouts/PrimaryLayout';
import { ModalsProvider } from '@mantine/modals';

function App() {
  
  return (
    <ModalsProvider>
    <AuthInit>
      <PrimaryLayout  />
    </AuthInit>
    </ModalsProvider>
  )
}

export default App
