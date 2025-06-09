'use client';

import NavLinks from '@/app/ui/dashboard/navLinks';
import { useEffect } from 'react';
import SearchForm from './searchForm';


const SideNav = () => {
  // Toggle darkmode on website
  const toggleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.checked) {
      window.localStorage.setItem('theme', 'dark');
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      window.localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
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
    <div className='sideNav flex md:h-full flex-col xsm:flex-row px-3 py-2 md:px-2 dark:sideNav-darkmode md:w-44 justify-between xsm:items-center xsm:w-full xsm:fixed xsm:bg-neutral-50/100 xsm:dark:bg-neutral-900'>
      <div className='flex md:grow flex-row md:flex-col space-x-2  md:space-x-0 md:space-y-2'>
        <NavLinks />
      </div>

      <div>
        <SearchForm />
      </div>

      <label className='flex justify-center xsm:justify-end cursor-pointer md:mt-4 dark:label-darkmode'>
        <input id='toggle' type='checkbox' value='' className='sr-only peer' onChange={toggleTheme} />
        <div className="relative w-11 h-6 bg-neutral-200 peer-focus:outline-hidden rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:rtl:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-neutral-300/40"></div>
      </label>
    </div>
  );
};

export default SideNav;