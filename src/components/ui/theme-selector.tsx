import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, Monitor, Moon, Sun } from "lucide-react";

interface ThemeOption {
  value: 'light' | 'dark' | 'system';
  label: string;
  icon: React.ReactNode;
  description: string;
  bgClass: string;
  borderClass: string;
}

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const themes: ThemeOption[] = [
    {
      value: 'light',
      label: 'Light',
      icon: <Sun className="h-6 w-6" />,
      description: 'Clean, bright interface for daytime use',
      bgClass: 'bg-white',
      borderClass: 'border-blue-200',
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: <Moon className="h-6 w-6" />,
      description: 'Easy on the eyes in low-light environments',
      bgClass: 'bg-gray-900',
      borderClass: 'border-indigo-500',
    },
    {
      value: 'system',
      label: 'System',
      icon: <Monitor className="h-6 w-6" />,
      description: 'Follows your system preferences automatically',
      bgClass: 'bg-gradient-to-r from-gray-100 to-gray-800',
      borderClass: 'border-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {themes.map((themeOption) => (
        <div
          key={themeOption.value}
          className={`relative rounded-xl overflow-hidden transition-all duration-200 border-2 ${
            theme === themeOption.value 
              ? `ring-2 ring-offset-2 ring-rwanda-green ${themeOption.borderClass}` 
              : 'border-transparent hover:border-gray-200'
          }`}
          onClick={() => setTheme(themeOption.value)}
        >
          <div className={`aspect-video ${themeOption.bgClass} flex items-center justify-center`}>
            <div className={`text-${themeOption.value === 'dark' ? 'white' : themeOption.value === 'system' ? 'gray-100' : 'gray-900'}`}>
              {themeOption.icon}
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{themeOption.label}</h3>
              {theme === themeOption.value && (
                <Check className="h-5 w-5 text-rwanda-green" />
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{themeOption.description}</p>
          </div>
          <Button
            variant={theme === themeOption.value ? "default" : "outline"}
            className={`w-full rounded-none ${
              theme === themeOption.value ? 'bg-rwanda-green hover:bg-rwanda-green/90' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setTheme(themeOption.value);
            }}
          >
            {theme === themeOption.value ? 'Active' : 'Select'}
          </Button>
        </div>
      ))}
    </div>
  );
}
