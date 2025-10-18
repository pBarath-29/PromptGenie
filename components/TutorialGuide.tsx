import React, { useState, useLayoutEffect, useRef, useCallback } from 'react';
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
    const tooltipRef = useRef<HTMLDivElement>(null);

    const step = steps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;

    const updatePosition = useCallback(() => {
        if (step.selector) {
            const element = document.querySelector(step.selector) as HTMLElement;
            if (element) {
                setTargetRect(element.getBoundingClientRect());
            } else {
                setTargetRect(null);
            }
        } else {
            setTargetRect(null); // For modal-like steps
        }
    }, [step.selector]);

    useLayoutEffect(() => {
        updatePosition();
        
        if (step.selector) {
            const element = document.querySelector(step.selector) as HTMLElement;
            if (element) {
                element.style.zIndex = '10001';
                element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
        }

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true); // Use capture to get scroll events early
        
        return () => {
            if (step.selector) {
                const element = document.querySelector(step.selector) as HTMLElement;
                if (element) element.style.zIndex = '';
            }
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [currentStep, step.selector, updatePosition]);

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

        const tooltipHeight = tooltipRef.current?.offsetHeight || 200; // Use ref height or fallback
        const tooltipWidth = 320; // from max-w-sm
        const margin = 15;
        let top: number;
        let left = targetRect.left + targetRect.width / 2;
        let transform = 'translateX(-50%)';

        // Vertical placement
        if (targetRect.bottom + tooltipHeight + margin > window.innerHeight && targetRect.top > tooltipHeight + margin) {
            // Not enough space below, place above
            top = targetRect.top - margin;
            transform += ' translateY(-100%)';
        } else {
            // Place below
            top = targetRect.bottom + margin;
        }

        // Correct for horizontal overflow
        if (left - (tooltipWidth / 2) < margin) {
            left = margin;
            transform = transform.replace('translateX(-50%)', 'translateX(0)');
        }
        if (left + (tooltipWidth / 2) > window.innerWidth - margin) {
            left = window.innerWidth - margin;
            transform = transform.replace('translateX(-50%)', 'translateX(-100%)');
        }

        return {
            top: `${top}px`,
            left: `${left}px`,
            position: 'fixed',
            transform,
        };
    };

    return (
        <div className="fixed inset-0 z-[10000]">
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-all duration-300"
                style={{
                    clipPath: targetRect 
                        ? `path(evenodd, 'M0 0 H ${window.innerWidth} V ${window.innerHeight} H 0 Z M ${targetRect.left - 5} ${targetRect.top - 5} H ${targetRect.right + 5} V ${targetRect.bottom + 5} H ${targetRect.left - 5} Z')`
                        : 'none'
                }}
            ></div>

            {/* Tooltip */}
            <div
                ref={tooltipRef}
                style={getTooltipStyle()}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-sm animate-fade-in transition-all duration-300"
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
                        <Button 
                            onClick={handleNext} 
                            icon={!isLastStep ? <ArrowRight size={16}/> : undefined}
                            className={!isLastStep ? '!flex-row-reverse' : ''}
                        >
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
