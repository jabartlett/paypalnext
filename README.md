# Next.js PayPal Integration

A complete example of integrating PayPal checkout functionality into a Next.js 15 application using TypeScript and Tailwind CSS.

## Features

- Complete PayPal Smart Payment Buttons integration
- Server-side payment capture with Next.js API routes
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive cart UI with order summary
- Loading states and error handling
- Sandbox testing support

## Demo

This application demonstrates a simple farm market checkout process with:

- Shopping cart with product display
- Order summary with subtotal, shipping, and total
- PayPal checkout button integration
- Complete payment processing flow

## Prerequisites

To use this application, you'll need:

- Node.js 18+ and npm
- A PayPal Developer account
- PayPal API credentials (Client ID and Secret)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/paypal-nextjs-integration.git
cd paypal-nextjs-integration
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory with your PayPal credentials:

```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
```

For production, change the API URL to the live PayPal endpoint.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## PayPal Integration Flow

The integration follows this flow:

1. User views products in cart and clicks PayPal checkout button
2. Frontend creates PayPal order via the PayPal JavaScript SDK
3. User authenticates and approves payment on PayPal's site
4. PayPal returns to our app with an order ID
5. Our app sends the order details to our API endpoint
6. API endpoint authenticates with PayPal and captures the payment
7. Success/failure handling in the UI

## Project Structure

```
├── app
│   ├── api
│   │   └── payment
│   │       └── route.ts         # Payment API endpoint
│   └── page.tsx                 # Main checkout page
├── public
│   └── paypal-flow-diagram.png  # Flow diagram for documentation
├── .env.local                   # Environment variables (create this file)
├── package.json
├── tsconfig.json
└── README.md
```

## Key Components

### API Endpoint (app/api/payment/route.ts)

Provides server-side functionality for:

- Getting PayPal access token
- Capturing PayPal payments
- Validating payment data
- Returning success/error responses

### Checkout Page (app/page.tsx)

Implements:

- Shopping cart display
- Order summary calculation
- PayPal button integration
- Payment processing UI states
- Error handling

## PayPal Configuration

Before using this application, you need to:

1. Create a PayPal Developer account
2. Create a new app in the PayPal Developer Dashboard
3. Get your client ID and secret
4. Add these credentials to your environment variables

## Testing

Use PayPal Sandbox accounts to test the integration:

1. Log in to the PayPal Developer Dashboard
2. Navigate to Sandbox > Accounts
3. Use the provided sandbox accounts for testing

## Customization

You can customize this integration by:

- Modifying the `cartItems` array to include your products
- Adjusting the UI styling using Tailwind classes
- Adding additional payment details or shipping options
- Implementing a database to store orders and payments

## Production Considerations

Before deploying to production:

- Switch to PayPal's live environment URLs
- Implement proper error logging
- Add more comprehensive validation
- Create a database for order tracking
- Consider adding webhooks for asynchronous payment events
- Implement proper inventory management

## License

MIT

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [PayPal Developer Documentation](https://developer.paypal.com/docs/checkout/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@paypal/react-paypal-js](https://www.npmjs.com/package/@paypal/react-paypal-js)