import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { SuspenseFallback } from '@/components/Elements';
import { AuthProvider } from '@/providers/auth';
import { MainLayout } from './MainLayout';

function App() {
  return (
    <MainLayout>
      <Suspense fallback={<SuspenseFallback />}>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </Suspense>
    </MainLayout>
  );
}

export { App };
