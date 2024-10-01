import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import './index.css'
import { AuthProvider } from './auth/core/Auth.tsx';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { baseTheme } from './base/script.ts';
import { appPaths } from './base/router.tsx';
// import { DateInput } from '@mantine/dates';

const queryClient = new QueryClient()

const router = createBrowserRouter(appPaths);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={baseTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
         <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
      <Notifications position = 'top-right'/>
    </MantineProvider>
  </React.StrictMode>,
)
