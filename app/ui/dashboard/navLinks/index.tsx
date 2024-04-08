'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation
const links = [
  { 
    name: 'Index', 
    href: '/dashboard', 
    icon: HomeIcon
  },
  {
    name: 'Technology',
    href: '/dashboard/technology',
    icon: ComputerDesktopIcon,
  },
  {
    name: 'Music',
    href: '/dashboard/music',
    icon: ComputerDesktopIcon,
  },
  {
    name: 'Outdoors',
    href: '/dashboard/outdoors',
    icon: DocumentDuplicateIcon,
  },
  { 
    name: 'Random',
    href: '/dashboard/random',
    icon: UserGroupIcon
  }
];

const NavLinks = () => {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 border border-orange-200/70 dark:border-orange-200/20 bg-sky-100/40 dark:bg-neutral-800/80 text-sm font-medium hover:bg-blue-200/60 dark:hover:bg-neutral-200/20 md:flex-none md:justify-start md:p-2 md:px-3 dark:navLinks-darkmode',
              {
                'bg-blue-200/80': pathname === link.href,
              },
            )}
          >
            <LinkIcon className='w-6 dark:text-neutral-300' />
            <p className='linkName dark:linkName-darkmode hidden md:block'>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;