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
      return <Sun size={16} />;
    }
    if (theme === 'dark') {
      return <Moon size={16} />;
    }
    return <Monitor size={16} />;
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
