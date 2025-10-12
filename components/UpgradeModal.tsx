import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { Zap, CheckCircle } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade to Prompter Pro">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
          <Zap className="h-12 w-12 text-primary-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Go Unlimited!</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          You've reached your monthly limit for free prompt generations. Upgrade to Pro to unlock your full potential.
        </p>

        <div className="mt-6 text-left bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg space-y-3">
            <h4 className="font-semibold text-lg">Pro Plan Features:</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2" /> Unlimited prompt generations</li>
                <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2" /> Priority access to new features</li>
                <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2" /> Premium support</li>
            </ul>
        </div>
        
        <div className="mt-6">
            <p className="text-4xl font-extrabold">$9.90 <span className="text-lg font-normal text-gray-500 dark:text-gray-400">/ month</span></p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
          <Button onClick={onUpgrade} className="w-full">
            Upgrade to Pro
          </Button>
          <Button onClick={onClose} variant="secondary" className="w-full">
            Maybe Later
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeModal;
