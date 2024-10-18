import './App.css';
import './utils/global.css';

import { FormProvider, useForm } from 'react-hook-form';

import { Toaster } from './components/ui/toaster';
import AppRouter from './routes';

const App = () => {
  const form = useForm();
  return (
    <div>
      <FormProvider {...form}>
        <AppRouter />
        <Toaster />
      </FormProvider>
    </div>
  );
};
export default App;
