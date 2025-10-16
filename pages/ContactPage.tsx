
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import { Send, CheckCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const response = await fetch('https://formspree.io/f/xvgpgqaj', { // Replace with your actual Formspree ID
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: user?.name || '', email: user?.email || '', message: '' });
            } else {
                throw new Error('Failed to send message. Please try again later.');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage((error as Error).message);
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center p-8 flex flex-col items-center space-y-4 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <CheckCircle size={56} className="text-green-500" />
                <h2 className="text-3xl font-bold">Message Sent!</h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
                <Button onClick={() => setStatus('idle')} className="mt-4">
                    Send Another Message
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <section className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact Us</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                    Have questions or need support? Fill out the form below and we'll be in touch.
                </p>
            </section>
            
            <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows={6}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700"
                            placeholder="How can we help you?"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    {status === 'error' && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

                    <Button 
                        type="submit" 
                        className="w-full !py-3 !text-base" 
                        icon={<Send size={18} />}
                        isLoading={status === 'submitting'}
                        disabled={status === 'submitting'}
                    >
                        {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
