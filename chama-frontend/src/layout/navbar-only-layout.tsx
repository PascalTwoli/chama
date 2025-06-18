import OnBoardingNavbar from '../components/navbars/onboarding-navbar';

interface NavbarOnlyLayoutProps {
  children?: React.ReactNode;
}

export default function NavbarOnlyLayout({ children }: NavbarOnlyLayoutProps) {
  return (
    <div className='flex flex-col min-h-screen bg-[#19222C]'>
      <OnBoardingNavbar />
      <main className='flex-1 p-4'>
        {/* no Sidebar */}
        {children}
      </main>
    </div>
  );
}
