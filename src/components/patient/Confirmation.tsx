import React, { useEffect } from 'react';
import { Header } from '../shared/Header';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useHeader } from '@/contexts/HeaderContext';
import { useParams } from 'react-router-dom';


interface ConfirmationProps {
  
  onViewStatus: (consultId: String) => void;
  onClose: () => void;
}

export const Confirmation: React.FC<ConfirmationProps> = ({ onViewStatus, onClose }) => {
  const expectedTime = new Date();
  expectedTime.setHours(19, 0, 0);

  const { consultId } = useParams<{ consultId: string }>();

  const { setTitle } = useHeader();
  useEffect(() => { setTitle("Submitted"); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Question submitted!</h2>
            <p className="text-gray-600">
              Your question is in review. You'll hear by {expectedTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-sm text-blue-900 mb-2">
              <strong>What happens next:</strong>
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your payment is on hold (not charged yet)</li>
              <li>• Dr. Chen will review your question</li>
              <li>• If accepted, you'll be charged and receive a detailed report</li>
              <li>• If declined, you'll receive an automatic refund</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button fullWidth onClick={()=> onViewStatus(consultId)}>
              View status
            </Button>
            <Button fullWidth variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            We'll send you a secure link to check your status. No symptoms or personal details will be included in the email.
          </p>
        </Card>
      </div>
    </div>
  );
};
