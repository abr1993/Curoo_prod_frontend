import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '@/hooks/useAuth';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface PaymentSectionProps {
  consultId: string;  
  amount: string; // in cents (e.g., 4999 for $49.99)
  onFail: (errmessage: string) => void;
  onSuccess: () => void;
 
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  consultId,  
  amount,
  onFail,
  onSuccess,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {token, userId} = useAuth();

  // ✅ Get the client secret from your backend
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${VITE_API_BASE_URL}/api/create-payment-intent`,
          {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
             },
            body: JSON.stringify({
              consult_id: consultId,
              created_by: userId,
              amount: Number(amount), // in cents
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create payment intent");
        console.log("CLIENTSECRET:::", data);
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        console.error("create-payment-intent failed", err);
        onFail(err.message || "Unable to initialize payment");
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [consultId, amount, onFail]);

  if (!clientSecret) {
    return <div className="p-4">Loading payment form...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm consultId={consultId} amount={amount} onFail={onFail} onSuccess={onSuccess} />
    </Elements>
  );
};

const PaymentForm: React.FC<PaymentSectionProps> = ({
  consultId,
  amount,  
  onFail,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {token, userId} = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Stripe not initialized");
      return;
    }

    setProcessing(true);
    setErrorMessage(null);

    // Validate form fields
    const { error: validationError } = await elements.submit();
    if (validationError) {
      setErrorMessage(validationError.message || "Invalid payment details");
      setProcessing(false);
      onFail(validationError.message || "Validation failed");
      return;
    }

    // Confirm the payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {},
    });
    console.log("payment intent status:", paymentIntent);
    console.log("payment intent error:", error);
    if (error) {
      const msg = error.message ?? "Payment failed.";
      setErrorMessage(msg);
      setProcessing(false);
      onFail(msg.toString());
      return;
    }

    if (paymentIntent?.status === "requires_capture") {
      
      try {
        // Save payment to backend
        const res = await fetch(
          `${VITE_API_BASE_URL}/api/process-payment`,
          {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
             },
            body: JSON.stringify({
              consult_id: consultId,
              stripe_checkout_session_id: paymentIntent.id,
              payment_intent_id: paymentIntent.id,
              amount: Number(amount),
              captured_at: new Date().toISOString(),
              created_by: userId,
            }),
          }
        );

        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Payment save failed");

        onSuccess();
      } catch (saveErr: any) {
        const msg = saveErr.message || "Could not record payment.";
        setErrorMessage(msg);
        onFail("Failed to record payment details to the database.");
      }
    } else {
      const msg = `Unexpected payment status: ${paymentIntent?.status}`;
      setErrorMessage(msg);
      onFail(msg);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="space-y-4">
        <PaymentElement />
        {errorMessage && (
          <div className="text-red-600 text-sm">{errorMessage}</div>
        )}
        <div className="flex gap-3">
          {/* <Button type="button" variant="secondary" onClick={onBack}>
            Go back
          </Button> */}
          <Button fullWidth type="submit" disabled={processing}>
            {processing ? 'Processing…' : 'Pay now'}
          </Button>
        </div>
      </Card>
    </form>
  );
};
