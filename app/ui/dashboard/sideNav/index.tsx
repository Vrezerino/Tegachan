'use client';

import NavLinks from '@/app/ui/dashboard/navLinks';
import { useEffect } from 'react';

const SideNav = () => {
  // Toggle darkmode on website
  const toggleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.checked) {
      window.localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      window.localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  }

  /**
   * Check if theme has been set previously and if it has been set to dark,
   * TailwindCSS selectors starting with "dark:" will be used throughout the site
   */
  useEffect(() => {
    const toggleInput = document.getElementById('toggle') as HTMLInputElement | null;
    if (!toggleInput) return;

    const theme = window.localStorage.getItem('theme');

    if (theme) {
      document.documentElement.classList.add(theme);

      // Retain dark mode if set previously
      theme === 'dark' && (toggleInput!.checked = true);
    }
  }, [])

  return (
    <div className='sideNav flex h-full flex-col xsm:flex-row px-3 py-4 md:px-2 dark:sideNav-darkmode'>
      <div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
        <NavLinks />
      </div>

      <label className='flex justify-center xsm:justify-end cursor-pointer md:mt-4 dark:label-darkmode'>
        <input id='toggle' type='checkbox' value='' className='sr-only peer' onChange={toggleTheme} />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-400/40"></div>
      </label>
    </div>
  );
};

export default SideNav;