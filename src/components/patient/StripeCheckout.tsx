import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// ✅ Initialize Stripe (replace with your publishable key)
const VITE_STRIPE_PUBLISHABLE_KEY = "";
const stripePromise = loadStripe(VITE_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Replace with your success route
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        {loading ? 'Processing...' : 'Pay now'}
      </button>
    </form>
  );
};

export const PaymentSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Select your payment method</h3>
      <p className="text-sm text-gray-500 mb-4">Choose Card, Afterpay, Cash App Pay, or Bank</p>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};
