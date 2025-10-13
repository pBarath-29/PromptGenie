import React, { useState, useEffect, useLayoutEffect } from 'react';
import Button from './Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface TutorialStep {
    selector?: string;
    title: string;
    content: string;
}

interface TutorialGuideProps {
    steps: TutorialStep[];
    onComplete: () => void;
}

const TutorialGuide: React.FC<TutorialGuideProps> = ({ steps, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const step = steps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;

    useLayoutEffect(() => {
        if (step.selector) {
            const element = document.querySelector(step.selector) as HTMLElement;
            if (element) {
                element.style.zIndex = '10001';
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const rect = element.getBoundingClientRect();
                setTargetRect(rect);
            }
        } else {
            setTargetRect(null); // For modal-like steps
        }
        
        return () => {
            if (step.selector) {
                const element = document.querySelector(step.selector) as HTMLElement;
                if (element) element.style.zIndex = '';
            }
        };
    }, [currentStep, step.selector]);

    const handleNext = () => {
        if (!isLastStep) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (!isFirstStep) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const getTooltipStyle = (): React.CSSProperties => {
        if (!targetRect) {
            // Centered modal style
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                position: 'fixed',
            };
        }

        const top = targetRect.bottom + 10;
        const left = targetRect.left + targetRect.width / 2;
        
        // Adjust if it goes off-screen
        const tooltipWidth = 320; // approx width of tooltip
        const adjustedLeft = Math.max(10, Math.min(left - (tooltipWidth / 2), window.innerWidth - tooltipWidth - 10));

        return {
            top: `${top}px`,
            left: `${adjustedLeft}px`,
            position: 'fixed',
        };
    };

    return (
        <div className="fixed inset-0 z-[10000]">
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                style={{
                    clipPath: targetRect 
                        ? `path(evenodd, 'M0 0 H ${window.innerWidth} V ${window.innerHeight} H 0 Z M ${targetRect.left - 5} ${targetRect.top - 5} H ${targetRect.right + 5} V ${targetRect.bottom + 5} H ${targetRect.left - 5} Z')`
                        : 'none'
                }}
            ></div>

            {/* Tooltip */}
            <div
                style={getTooltipStyle()}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-sm animate-fade-in"
            >
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{step.content}</p>

                <div className="flex justify-between items-center">
                    <button onClick={onComplete} className="text-sm text-gray-500 hover:underline">
                        Skip Tutorial
                    </button>
                    <div className="flex items-center space-x-2">
                        {!isFirstStep && (
                             <Button variant="secondary" onClick={handlePrev} icon={<ArrowLeft size={16}/>}>
                                Prev
                            </Button>
                        )}
                        <Button onClick={handleNext} icon={!isLastStep && <ArrowRight size={16}/>}>
                            {isLastStep ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </div>
                <div className="flex justify-center mt-4">
                    <div className="flex space-x-2">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors ${currentStep === index ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialGuide;