"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const cartItems: CartItem[] = [
  {
    id: 1,
    name: "Artisanal Sourdough Bread",
    price: 8.99,
    quantity: 2,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='Arial' font-size='12'%3EProduct%3C/text%3E%3C/svg%3E"
  },
  {
    id: 2,
    name: "Organic Mixed Greens",
    price: 6.99,
    quantity: 1,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='Arial' font-size='12'%3EProduct%3C/text%3E%3C/svg%3E"
  },
  {
    id: 3,
    name: "Farm Fresh Eggs (Dozen)",
    price: 5.99,
    quantity: 2,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='Arial' font-size='12'%3EProduct%3C/text%3E%3C/svg%3E"
  }
];

export default function Home() {
  const router = useRouter();
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const SHIPPING_COST = 5.00;
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalError, setPaypalError] = useState("");

  // Calculate subtotal and total
  useEffect(() => {
    const calculatedSubtotal = cartItems.reduce((acc, item) =>
      acc + (item.price * item.quantity), 0
    );
    setSubtotal(calculatedSubtotal);
    setTotal(calculatedSubtotal + SHIPPING_COST);
  }, []);

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total.toFixed(2),
            currency_code: 'USD'
          },
          description: `Farm Market Order`,
        },
      ],
    });
  };

  const onApprove = async (data: any, actions: any) => {
    setIsProcessing(true);
    try {
      const order = await actions.order.get();
      console.log('Payment successful', order);
      
      // Extract payer information from PayPal response
      const payerName = order.payer?.name?.given_name || '';
      const payerEmail = order.payer?.email_address || '';
      
      const paymentData = {
        name: payerName,
        email: payerEmail,
        amount: total.toFixed(2),
        orderID: data.orderID
      };
      
      console.log('Sending to API:', paymentData);
      
      // Send payment data to our API
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error('Payment processing failed');
      }

      const result = await response.json();
      console.log('API response:', result);
      alert('Payment processed successfully!');
    } catch (error) {
      console.error('Payment failed:', error);
      setPaypalError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (err: any) => {
    console.error('PayPal error:', err);
    setPaypalError('An error occurred with PayPal. Please try again.');
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <div className="card bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

        {/* Cart Items */}
        <ul className="space-y-4 mb-6">
          {cartItems.map((cartItem) => (
            <li key={cartItem.id} className="flex items-center gap-4 pb-4 border-b">
              <Image
                src={cartItem.image}
                width={80}
                height={80}
                alt={`Image of ${cartItem.name}`}
                className="rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{cartItem.name}</h4>
                <p className="text-gray-700">${cartItem.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Quantity: {cartItem.quantity}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Price Summary */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>${SHIPPING_COST.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="mb-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
            <span>Processing your payment...</span>
          </div>
        )}

        {/* Error Message */}
        {paypalError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {paypalError}
          </div>
        )}

        {/* PayPal Button */}
        <PayPalScriptProvider options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
          currency: 'USD',
          intent: 'capture'
        }}>
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            style={{ layout: "vertical" }}
            disabled={isProcessing}
          />
        </PayPalScriptProvider>

        <p className="text-xs text-gray-500 text-center mt-4">
          By completing this purchase, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
}