import * as React from 'react';
import { render } from '@react-email/render';
import { ChamaInviteEmail, ChamaInviteEmailProps } from './ChamaInviteEmail';

/**
 * Render the ChamaInviteEmail template to HTML
 */
export async function renderChamaInviteEmail(
  props: ChamaInviteEmailProps,
): Promise<string> {
  const html = await render(React.createElement(ChamaInviteEmail, props));
  return html;
}

/**
 * Render the ChamaInviteEmail template to plain text
 */
export async function renderChamaInviteEmailText(
  props: ChamaInviteEmailProps,
): Promise<string> {
  const text = await render(React.createElement(ChamaInviteEmail, props), {
    plainText: true,
  });
  return text;
}

export { ChamaInviteEmail, ChamaInviteEmailProps };
