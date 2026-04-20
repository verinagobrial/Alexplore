// lib/email/config.ts
export const emailConfig = {
  // Gmail settings
  fromEmail: process.env.GMAIL_USER || 'verinagobrial7@gmail.com',  
  fromName: 'Alexplore',
  
  // Support contact
  supportEmail: 'support@alexplore.com',
  supportPhone: '+20 123 456 7890',
  
  // Company info
  siteName: 'Alexplore',
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Social media
  social: {
    instagram: 'https://instagram.com/alexplore',
    facebook: 'https://facebook.com/alexplore',
    twitter: 'https://twitter.com/alexplore',
  },
  
  // Address
  address: {
    street: '123 Corniche Road',
    city: 'Alexandria',
    country: 'Egypt',
    postalCode: '21500',
  },
}