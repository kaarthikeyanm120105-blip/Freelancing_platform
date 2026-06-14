import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    CardElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Loader2, CreditCard, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import paymentService from '../../services/paymentService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ jobId, amount, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);

        try {
            // 1. Create Payment Intent on our backend
            const { clientSecret, paymentIntentId } = await paymentService.createPaymentIntent(jobId, amount);

            // 2. Confirm payment with Stripe
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                toast.error(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    // 3. Confirm with our backend to save record
                    await paymentService.confirmPayment({
                        jobId,
                        amount,
                        stripePaymentIntentId: paymentIntentId,
                    });

                    toast.success('Payment successful!');
                    onSuccess();
                }
            }
        } catch (error) {
            toast.error(error.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border-2 rounded-xl bg-gray-50/50">
                <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Card Details</label>
                <div className="p-3 bg-white border rounded-lg shadow-sm">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Secure SSL Encrypted Payment
            </div>

            <div className="flex flex-col gap-3">
                <Button
                    type="submit"
                    disabled={!stripe || loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 h-12 text-lg font-bold"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                        `Pay ₹${amount}`
                    )}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={loading}
                    className="w-full text-gray-500"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default function StripePaymentModal({ jobId, amount, isOpen, onClose, onSuccess }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <Card className="w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-purple-600" />

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Secure Payment</h3>
                        <p className="text-sm text-gray-500">Completing transaction for job</p>
                    </div>
                </div>

                <Elements stripe={stripePromise}>
                    <CheckoutForm
                        jobId={jobId}
                        amount={amount}
                        onSuccess={() => {
                            onSuccess();
                            onClose();
                        }}
                        onCancel={onClose}
                    />
                </Elements>
            </Card>
        </div>
    );
}
