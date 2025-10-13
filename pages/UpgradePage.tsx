import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { CheckCircle, Zap, Tag, ShieldCheck, TrendingUp, XCircle } from 'lucide-react';
import { FREE_TIER_POST_LIMIT, PRO_TIER_POST_LIMIT, FREE_TIER_LIMIT } from '../config';

const benefits = [
    {
        icon: <Zap size={24} className="text-primary-500" />,
        title: `Unlimited Generations`,
        description: `Go beyond the free limit of ${FREE_TIER_LIMIT} prompts per month and generate as much as you need.`
    },
    {
        icon: <TrendingUp size={24} className="text-primary-500" />,
        title: `More Community Submissions`,
        description: `Share more of your creations with the community, with a limit of ${PRO_TIER_POST_LIMIT} per day instead of just ${FREE_TIER_POST_LIMIT}.`
    },
    {
        icon: <ShieldCheck size={24} className="text-primary-500" />,
        title: `Ad-Free Experience`,
        description: `Enjoy a seamless and uninterrupted workflow without any advertisements.`
    },
    {
        icon: <CheckCircle size={24} className="text-primary-500" />,
        title: `Priority Access & Support`,
        description: `Get early access to new features and receive premium customer support.`
    }
];

const UpgradePage: React.FC = () => {
    const { upgradeToPro } = useAuth();
    const navigate = useNavigate();
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoError, setPromoError] = useState('');
    const [promoSuccess, setPromoSuccess] = useState('');

    const basePrice = 9.90;
    const finalPrice = basePrice * (1 - discount);

    const handleApplyPromo = () => {
        setPromoError('');
        setPromoSuccess('');
        if (promoCode.toUpperCase() === 'PRO50') {
            setDiscount(0.5);
            setPromoSuccess('Success! 50% discount applied.');
        } else {
            setDiscount(0);
            setPromoError('Invalid promotional code.');
        }
    };
    
    const handleUpgrade = () => {
        upgradeToPro();
        navigate('/profile');
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Unlock Your Full Potential with <span className="text-primary-500">Prompter Pro</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                    Supercharge your creativity and productivity. Join Pro today.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">What you get with Pro:</h2>
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-4">
                            <div className="flex-shrink-0 mt-1">{benefit.icon}</div>
                            <div>
                                <h3 className="font-semibold text-lg">{benefit.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col space-y-6">
                    <h2 className="text-2xl font-bold text-center">Your Pro Subscription</h2>
                    
                    <div className="space-y-4">
                        <label htmlFor="promo-code" className="font-semibold">Promotional Code</label>
                        <div className="flex items-center space-x-2">
                           <div className="relative flex-grow">
                                <Tag size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="promo-code"
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder="e.g., PRO50"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                                />
                           </div>
                           <Button variant="secondary" onClick={handleApplyPromo}>Apply</Button>
                        </div>
                        {promoError && <p className="text-sm text-red-500 flex items-center"><XCircle size={14} className="mr-1.5" />{promoError}</p>}
                        {promoSuccess && <p className="text-sm text-green-500 flex items-center"><CheckCircle size={14} className="mr-1.5" />{promoSuccess}</p>}
                    </div>

                    <div className="flex-grow"></div>
                    
                    <div className="text-center pt-6 border-t dark:border-gray-700">
                        {discount > 0 && (
                            <p className="text-xl text-gray-500 dark:text-gray-400 line-through">
                                ${basePrice.toFixed(2)}
                            </p>
                        )}
                        <p className="text-5xl font-extrabold text-gray-900 dark:text-white">
                            ${finalPrice.toFixed(2)}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">per month</p>
                    </div>

                    <Button onClick={handleUpgrade} className="w-full !py-3 !text-base" icon={<Zap size={20}/>}>
                        Upgrade and Get Pro Access
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UpgradePage;