import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

interface ReauthenticationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  title: string;
  message: string;
  confirmButtonText?: string;
}

const ReauthenticationModal: React.FC<ReauthenticationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
}) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!password) {
        setError('Password is required.');
        return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onConfirm(password);
      // On success, the parent component will handle closing the modal or navigating away.
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
        <div>
            <label htmlFor="reauth-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Password</label>
            <input
                id="reauth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                required
                autoFocus
            />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="flex justify-end pt-2 space-x-2">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirm}
              isLoading={isLoading}
            >
              {confirmButtonText}
            </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReauthenticationModal;