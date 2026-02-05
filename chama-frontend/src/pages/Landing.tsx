import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  Shield,
  Bell,
  FileText,
  UserPlus,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

export default function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth/signup');
  };

  const handleSignIn = () => {
    navigate('/auth/signin');
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-secondary-light to-background'>
      {/* Header */}
      <header className='border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-lg bg-primary flex items-center justify-center'>
              <Users className='w-5 h-5 text-primary-foreground' />
            </div>
            <span className='font-bold text-lg'>ChamaPlus</span>
          </div>
          <Button variant='outline' onClick={handleSignIn}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className='container mx-auto px-4 py-12 md:py-20 max-w-6xl'>
        <div className='text-center max-w-3xl mx-auto'>
          <div className='inline-block mb-4 px-4 py-2 bg-accent/10 rounded-full'>
            <span className='text-sm text-accent-foreground font-medium'>
              Trusted by 500+ Chamas across Kenya
            </span>
          </div>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground'>
            Manage Your Chama with{' '}
            <span className='text-primary'>Confidence</span>
          </h1>
          <p className='text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed'>
            ChamaPlus makes it easy to track contributions, manage members, and
            grow your savings together. Built for Kenyan Chamas with M-Pesa
            integration and transparent reporting.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button size='lg' onClick={handleGetStarted}>
              Get Started Free
              <ArrowRight className='ml-2 w-5 h-5' />
            </Button>
            <Button size='lg' variant='outline'>
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className='container mx-auto px-4 py-12 md:py-16 max-w-6xl'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-foreground'>
            Everything Your Chama Needs
          </h2>
          <p className='text-muted-foreground text-lg'>
            Simple, powerful tools designed for Kenyan savings groups
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <FeatureCard
            icon={<TrendingUp className='w-8 h-8 text-primary' />}
            title='M-Pesa Integration'
            description='Track contributions directly from M-Pesa. Automatic reconciliation and transparent records.'
            color='primary'
          />
          <FeatureCard
            icon={<Users className='w-8 h-8 text-secondary' />}
            title='Member Management'
            description='Easy onboarding with invite links. Track attendance, contributions, and member activity.'
            color='secondary'
          />
          <FeatureCard
            icon={<Shield className='w-8 h-8 text-accent' />}
            title='Transparent Reports'
            description='Real-time dashboards and financial reports. Every member sees the same information.'
            color='accent'
          />
          <FeatureCard
            icon={<Bell className='w-8 h-8 text-primary' />}
            title='Smart Notifications'
            description='SMS and app reminders for meetings, contributions, and important updates.'
            color='primary'
          />
          <FeatureCard
            icon={<FileText className='w-8 h-8 text-secondary' />}
            title='Editable Rules'
            description='Set and update Chama rules, contribution amounts, and meeting schedules easily.'
            color='secondary'
          />
          <FeatureCard
            icon={<UserPlus className='w-8 h-8 text-accent' />}
            title='Role-Based Access'
            description='Admin and Member roles with appropriate permissions for secure management.'
            color='accent'
          />
        </div>
      </section>

      {/* How It Works */}
      <section className='bg-muted/30 py-12 md:py-16'>
        <div className='container mx-auto px-4 max-w-6xl'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4 text-foreground'>
              Getting Started is Easy
            </h2>
            <p className='text-muted-foreground text-lg'>
              Three simple steps to modern Chama management
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <StepCard
              number='1'
              title='Create Your Chama'
              description='Set up your group details, contribution schedule, and rules in minutes.'
            />
            <StepCard
              number='2'
              title='Invite Members'
              description='Share a unique invite link via WhatsApp or SMS. Members join instantly.'
            />
            <StepCard
              number='3'
              title='Start Contributing'
              description='Track M-Pesa payments, view dashboards, and manage finances together.'
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className='container mx-auto px-4 py-12 md:py-16 max-w-6xl'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div>
            <h2 className='text-3xl md:text-4xl font-bold mb-6 text-foreground'>
              Why Chamas Choose ChamaPlus
            </h2>
            <div className='space-y-4'>
              <BenefitItem text='No more lost contribution records or confusion' />
              <BenefitItem text='Automated M-Pesa tracking saves hours of manual work' />
              <BenefitItem text='Every member has real-time access to financial reports' />
              <BenefitItem text='Built specifically for Kenyan savings culture' />
              <BenefitItem text='Mobile-first design works on any phone' />
              <BenefitItem text='Secure, trustworthy, and transparent' />
            </div>
            <Button size='lg' className='mt-8' onClick={handleGetStarted}>
              Start Your Free Trial
            </Button>
          </div>
          <div className='bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 lg:p-12'>
            <Card className='bg-card shadow-lg'>
              <CardHeader>
                <CardTitle>Trusted by Leaders</CardTitle>
                <CardDescription>What Chama admins say</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='italic text-muted-foreground mb-4'>
                  &quot;ChamaPlus has transformed how we manage our savings. No
                  more Excel sheets or confusion. Everything is clear and
                  members trust the system completely.&quot;
                </p>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center'>
                    <span className='font-bold text-primary'>MW</span>
                  </div>
                  <div>
                    <p className='font-medium'>Mary Wanjiku</p>
                    <p className='text-sm text-muted-foreground'>
                      Admin, Tumaini Chama
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-primary text-primary-foreground py-12 md:py-16'>
        <div className='container mx-auto px-4 text-center max-w-4xl'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Ready to Transform Your Chama?
          </h2>
          <p className='text-lg mb-8 opacity-90'>
            Join hundreds of Kenyan Chamas already using ChamaPlus. Start your
            free trial today.
          </p>
          <Button
            size='lg'
            variant='secondary'
            className='bg-white text-primary hover:bg-white/90'
            onClick={handleGetStarted}
          >
            Get Started - It&apos;s Free
            <ArrowRight className='ml-2 w-5 h-5' />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-muted py-8'>
        <div className='container mx-auto px-4 text-center max-w-6xl'>
          <div className='flex items-center justify-center gap-2 mb-4'>
            <div className='w-8 h-8 rounded-lg bg-primary flex items-center justify-center'>
              <Users className='w-5 h-5 text-primary-foreground' />
            </div>
            <span className='font-bold text-foreground'>ChamaPlus</span>
          </div>
          <p className='text-sm text-muted-foreground'>
            Empowering Kenyan Chamas with modern financial management tools
          </p>
          <p className='text-xs text-muted-foreground mt-4'>
            © 2026 ChamaPlus. Built for Kenyan savings groups.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
}) {
  const bgColors = {
    primary: 'bg-primary/10',
    secondary: 'bg-secondary/10',
    accent: 'bg-accent/10',
  };

  return (
    <Card className='border-border hover:shadow-lg transition-shadow'>
      <CardHeader>
        <div
          className={`w-14 h-14 rounded-lg ${bgColors[color]} flex items-center justify-center mb-3`}
        >
          {icon}
        </div>
        <CardTitle className='text-xl'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className='text-center'>
      <div className='w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4'>
        {number}
      </div>
      <h3 className='text-xl font-bold mb-2'>{title}</h3>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className='flex items-start gap-3'>
      <CheckCircle2 className='w-6 h-6 text-primary flex-shrink-0 mt-0.5' />
      <p className='text-muted-foreground'>{text}</p>
    </div>
  );
}
