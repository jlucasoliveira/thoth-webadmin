import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorFallback, SuspenseFallback } from '@/components/Elements';
import { queryClient } from '@/lib/react-query';
import { theme } from '@/theme';
import { Notifications } from './notifications';

type AppProviderProps = {
  children: React.ReactNode;
};

function AppProvider({ children }: AppProviderProps) {
  return (
    <React.Suspense fallback={<SuspenseFallback />}>
      <ChakraProvider theme={theme}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <QueryClientProvider client={queryClient}>
            <Notifications />
            <Router>{children}</Router>
          </QueryClientProvider>
        </ErrorBoundary>
      </ChakraProvider>
    </React.Suspense>
  );
}

export { AppProvider };
