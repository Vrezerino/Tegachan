'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

import { links } from '@/app/lib/utils';
import clsx from 'clsx';
import NextTopLoader from 'nextjs-toploader';

const NavLinks = () => {
  const pathname = usePathname();
  const router = useRouter();

  const onPickBoard = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const board = e.target.value.replace(/[^a-zA-Z &]/g, '');
    const result = links.find((l) => l.name === board);
    router.push(`${result?.href}`);
  }

  /**
   * This will retain the correct select option in dropdown list after page
   * refresh, notice that the initial forward slash is needed
   */
  const currentPage = links.find((link) => ('/' + pathname?.split('/')[1]) === (link.href));
  return (
    <>
      <NextTopLoader color='white' height={9} />
      {/** Vertical button list is shown on larger-than-mobile devices (>767 px) */}
      <nav className='xsm:hidden'>
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              data-testid={`${link.name}-nav-button`}
              className={clsx(
                'flex h-[40px] mb-1 grow items-center justify-center gap-2 rounded-xs border-0 border-neutral-200 dark:border-neutral-800 bg-sky-100/40 dark:bg-neutral-800/80 text-sm font-medium hover:bg-blue-200/60 dark:hover:bg-neutral-200/20 md:flex-none md:justify-start md:p-1 dark:navLinks-darkmode',
                {
                  'bg-blue-200/80': pathname === link.href,
                },
              )}
            >
              <LinkIcon className='w-6 dark:text-neutral-300 xsm:hidden' />
              <p className='linkName dark:linkName-darkmode'>{link.name}</p>
            </Link>
          );
        })}
      </nav>

      {/** On mobile devices, a dropdown list is shown instead */}
      <nav className='xsm:block hidden'>
        <select
          name='boards'
          aria-label='Choose board'
          id='boards'
          onChange={onPickBoard}
          value={currentPage ? currentPage.name : 'Index'}
          className='text-sm p-0.5 text-slate-900 dark:text-slate-200 dark:bg-neutral-800'
        >
          {links.map((link) => {
            return (
              <option key={link.name} value={link.name}>
                {link.name}
              </option>
            );
          })}
        </select>
      </nav>
    </>
  );
};

export default NavLinks;