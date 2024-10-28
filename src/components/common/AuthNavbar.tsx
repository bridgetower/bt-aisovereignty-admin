import { useTheme } from '@/context/ThemeProvider';

const AuthNavbar = () => {
  const { theme } = useTheme();
  return (
    <div className="flex items-center justify-between py-4 px-7 pt-0">
      <img
        src={theme === 'dark' ? '/images/logo.svg' : '/images/logo-black.svg'}
        alt="logo"
        className="w-48 text-foreground"
      />
      {/* <Button asChild className="h-8 mt-2">
        <Link to="/sign-in">Sign in</Link>
      </Button> */}
    </div>
  );
};

export default AuthNavbar;
