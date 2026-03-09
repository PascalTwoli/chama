"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChamaInviteEmail = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
const ChamaInviteEmail = ({ inviterName, chamaName, inviteLink, }) => {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsx)(components_1.Head, {}), (0, jsx_runtime_1.jsxs)(components_1.Preview, { children: ["You've been invited to join ", chamaName] }), (0, jsx_runtime_1.jsx)(components_1.Body, { style: main, children: (0, jsx_runtime_1.jsxs)(components_1.Container, { style: container, children: [(0, jsx_runtime_1.jsx)(components_1.Section, { style: logoSection, children: (0, jsx_runtime_1.jsx)(components_1.Text, { style: logoText, children: "ChamaPlus" }) }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: contentSection, children: [(0, jsx_runtime_1.jsx)(components_1.Heading, { style: heading, children: "You've Been Invited to Join a Chama" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: paragraph, children: "Hello," }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: paragraph, children: [(0, jsx_runtime_1.jsx)("strong", { children: inviterName }), " has invited you to join their Chama group: ", (0, jsx_runtime_1.jsx)("strong", { style: chamaNameStyle, children: chamaName }), "."] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: paragraph, children: "Chama groups are savings and investment circles that help members achieve their financial goals together. By joining, you'll be part of a trusted community working towards shared success." }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: buttonContainer, children: (0, jsx_runtime_1.jsx)(components_1.Button, { style: button, href: inviteLink, children: "Join Chama" }) }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: paragraph, children: "If the button doesn't work, you can copy and paste this link into your browser:" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: linkText, children: (0, jsx_runtime_1.jsx)(components_1.Link, { href: inviteLink, style: link, children: inviteLink }) }), (0, jsx_runtime_1.jsx)(components_1.Hr, { style: hr }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: footerText, children: "This invitation will expire in 7 days. If you don't have an account yet, you'll be able to create one when you accept the invitation." }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: footerText, children: "If you did not expect this invitation, you can safely ignore this email." })] }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: footer, children: (0, jsx_runtime_1.jsxs)(components_1.Text, { style: footerCopyright, children: ["\u00A9 ", new Date().getFullYear(), " ChamaPlus. All rights reserved."] }) })] }) })] }));
};
exports.ChamaInviteEmail = ChamaInviteEmail;
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};
const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    maxWidth: '600px',
};
const logoSection = {
    padding: '32px 20px 0',
};
const logoText = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4a6ee0',
    margin: '0',
    textAlign: 'center',
};
const contentSection = {
    padding: '0 48px',
};
const heading = {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '400',
    color: '#484848',
    padding: '17px 0 0',
    textAlign: 'center',
};
const paragraph = {
    margin: '0 0 15px',
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#3c4149',
};
const chamaNameStyle = {
    color: '#4a6ee0',
};
const buttonContainer = {
    textAlign: 'center',
    margin: '32px 0',
};
const button = {
    backgroundColor: '#4a6ee0',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '14px 32px',
};
const linkText = {
    margin: '0 0 15px',
    fontSize: '13px',
    lineHeight: '1.4',
    wordBreak: 'break-all',
};
const link = {
    color: '#4a6ee0',
    textDecoration: 'underline',
};
const hr = {
    borderColor: '#e6ebf1',
    margin: '32px 0',
};
const footerText = {
    margin: '0 0 10px',
    fontSize: '13px',
    lineHeight: '1.4',
    color: '#9ca299',
};
const footer = {
    padding: '0 48px',
};
const footerCopyright = {
    fontSize: '12px',
    lineHeight: '1.4',
    color: '#9ca299',
    textAlign: 'center',
    margin: '24px 0 0',
};
exports.default = exports.ChamaInviteEmail;
//# sourceMappingURL=ChamaInviteEmail.js.map