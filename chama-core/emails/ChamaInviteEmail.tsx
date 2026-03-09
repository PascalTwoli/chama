import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Preview,
  Heading,
  Link,
} from '@react-email/components';

export interface ChamaInviteEmailProps {
  inviterName: string;
  chamaName: string;
  inviteLink: string;
}

export const ChamaInviteEmail: React.FC<ChamaInviteEmailProps> = ({
  inviterName,
  chamaName,
  inviteLink,
}) => {
  return (
    <Html>
      <Head />
      <Preview>You've been invited to join {chamaName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>ChamaPlus</Text>
          </Section>

          <Section style={contentSection}>
            <Heading style={heading}>
              You've Been Invited to Join a Chama
            </Heading>

            <Text style={paragraph}>Hello,</Text>

            <Text style={paragraph}>
              <strong>{inviterName}</strong> has invited you to join their Chama
              group: <strong style={chamaNameStyle}>{chamaName}</strong>.
            </Text>

            <Text style={paragraph}>
              Chama groups are savings and investment circles that help members
              achieve their financial goals together. By joining, you'll be part
              of a trusted community working towards shared success.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={inviteLink}>
                Join Chama
              </Button>
            </Section>

            <Text style={paragraph}>
              If the button doesn't work, you can copy and paste this link into
              your browser:
            </Text>

            <Text style={linkText}>
              <Link href={inviteLink} style={link}>
                {inviteLink}
              </Link>
            </Text>

            <Hr style={hr} />

            <Text style={footerText}>
              This invitation will expire in 7 days. If you don't have an
              account yet, you'll be able to create one when you accept the
              invitation.
            </Text>

            <Text style={footerText}>
              If you did not expect this invitation, you can safely ignore this
              email.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} ChamaPlus. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main: React.CSSProperties = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const logoSection: React.CSSProperties = {
  padding: '32px 20px 0',
};

const logoText: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#4a6ee0',
  margin: '0',
  textAlign: 'center' as const,
};

const contentSection: React.CSSProperties = {
  padding: '0 48px',
};

const heading: React.CSSProperties = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
  textAlign: 'center' as const,
};

const paragraph: React.CSSProperties = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#3c4149',
};

const chamaNameStyle: React.CSSProperties = {
  color: '#4a6ee0',
};

const buttonContainer: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button: React.CSSProperties = {
  backgroundColor: '#4a6ee0',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const linkText: React.CSSProperties = {
  margin: '0 0 15px',
  fontSize: '13px',
  lineHeight: '1.4',
  wordBreak: 'break-all' as const,
};

const link: React.CSSProperties = {
  color: '#4a6ee0',
  textDecoration: 'underline',
};

const hr: React.CSSProperties = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const footerText: React.CSSProperties = {
  margin: '0 0 10px',
  fontSize: '13px',
  lineHeight: '1.4',
  color: '#9ca299',
};

const footer: React.CSSProperties = {
  padding: '0 48px',
};

const footerCopyright: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: '1.4',
  color: '#9ca299',
  textAlign: 'center' as const,
  margin: '24px 0 0',
};

export default ChamaInviteEmail;
