import OnBoardingNavbar from '../components/navbars/onboarding-navbar';

interface NavbarOnlyLayoutProps {
  children?: React.ReactNode;
}

export default function NavbarOnlyLayout({ children }: NavbarOnlyLayoutProps) {
  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <OnBoardingNavbar />
      <main className='flex-1 p-4 lg:px-[20vh]'>{children}</main>
    </div>
  );
}
