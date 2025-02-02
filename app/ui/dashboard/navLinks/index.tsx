'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { links } from '@/app/lib/utils';
import clsx from 'clsx';

const NavLinks = () => {
  const pathname = usePathname();
  const router = useRouter();

  const onPickBoard = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const board = e.target.value.replace(/[^a-zA-Z &]/g, '');
    const result = links.find((l) => l.name === board);
    router.push(`${result?.href}`);
  }
  return (
    <>
      {/** Vertical button list is shown on larger-than-mobile devices (>767 px) */}
      <div className='xsm:hidden'>
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'flex h-[48px] grow items-center justify-center gap-2 rounded-sm p-3 border border-orange-200/70 dark:border-orange-200/20 bg-sky-100/40 dark:bg-neutral-800/80 text-sm font-medium hover:bg-blue-200/60 dark:hover:bg-neutral-200/20 md:flex-none md:justify-start md:p-2 md:px-3 dark:navLinks-darkmode',
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
      </div>

      {/** On mobile devices, a dropdown list is shown instead */}
      <div className='xsm:block hidden'>
        <select name='boards' id='boards' onChange={onPickBoard} className='text-sm text-slate-900 dark:text-slate-200 dark:bg-neutral-800'>
          {links.map((link) => {
            return (
              <option key={link.name} value={link.name}>
                {link.name}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
};

export default NavLinks;