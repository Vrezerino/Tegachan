export const dynamic = 'force-dynamic';
import { Toaster } from 'react-hot-toast';
import SideNav from '@/app/ui/dashboard/sideNav';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex h-screen flex-col md:flex-row md:overflow-hidden'>
      <div className='w-full flex-none md:w-64'>
        <SideNav />
      </div>
      <div className='grow md:overflow-y-auto p-3'>{children}</div>
      <Toaster position='top-center' />
    </div>
  );
};

export default Layout;