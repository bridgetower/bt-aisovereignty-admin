import './App.css';
import './utils/global.css';

import { FormProvider, useForm } from 'react-hook-form';

import { Toaster } from './components/ui/toaster';
import { LoaderProvider } from './context/LoaderProvider';
import AppRouter from './routes';

const App = () => {
  const form = useForm();
  return (
    <div>
      <LoaderProvider>
        <FormProvider {...form}>
          <AppRouter />
          <Toaster />
        </FormProvider>
      </LoaderProvider>
    </div>
  );
};
export default App;
