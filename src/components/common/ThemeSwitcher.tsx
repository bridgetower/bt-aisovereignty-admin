import { Monitor, Moon, Sun } from 'lucide-react';

import { useTheme } from '@/context/ThemeProvider';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('light');
    }
  };

  const renderIcon = () => {
    if (theme === 'light') {
      return <Sun size={20} />;
    }
    if (theme === 'dark') {
      return <Moon size={20} />;
    }
    return <Monitor size={20} />;
  };

  return (
    <div
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="cursor-pointer"
    >
      {renderIcon()}
    </div>
  );
};

export default ThemeSwitcher;
