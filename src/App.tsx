import '@fontsource/lexend';
import '@fontsource/lexend/900.css';
import '@fontsource/open-sans';
import '@fontsource/open-sans/600.css';
import { AppProvider } from './providers/app';
import { AppRoutes } from './routes';

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
