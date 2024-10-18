import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface Step {
  completed: boolean;
  icon: React.ReactNode;
  label: string;
  sectionId: string;
}

interface StepperProps {
  steps: Step[];
  renderContent: (sectionId: string) => React.ReactNode;
  animationDuration?: number; // Optional animation duration prop
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  renderContent,
  animationDuration = 0.5,
  className = '',
}) => {
  const [activeSection, setActiveSection] = useState(steps[0].sectionId);
  const activeStepRef = useRef<HTMLLIElement | null>(null);
  const [prevSection, setPrevSection] = useState<string | null>(null);

  const handleStepClick = (sectionId: string) => {
    setPrevSection(activeSection); // Set the previous section
    setActiveSection(sectionId);
  };

  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
      });
    }
  }, [activeSection]);
  const swipeDirection =
    prevSection &&
    steps.findIndex((step) => step.sectionId === activeSection) >
      steps.findIndex((step) => step.sectionId === prevSection)
      ? 1000 // Right to left
      : -1000; // Left to right
  return (
    <>
      <div className={`w-full  ${className}`}>
        <div className="mx-5 h-28  overflow-x-auto overflow-y-hidden whitespace-nowrap hide-scrollbar">
          <ol className="flex items-center mt-4">
            {steps.map((step, i) => (
              <StepItem
                key={i}
                completed={step.completed}
                icon={step.icon}
                isLast={steps.length === i + 1}
                label={step.label}
                sectionId={step.sectionId}
                onClick={() => {
                  handleStepClick(step.sectionId);
                  step.completed = true;
                }}
                ref={step.sectionId === activeSection ? activeStepRef : null}
              />
            ))}
          </ol>
        </div>
      </div>
      <div className="mt-2">
        <AnimatePresence>
          <motion.div
            key={activeSection}
            initial={{ x: swipeDirection, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -swipeDirection, opacity: 0 }}
            transition={{ duration: animationDuration }}
          >
            {renderContent(activeSection)}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

const StepItem = React.forwardRef<
  HTMLLIElement,
  {
    completed: boolean;
    icon: React.ReactNode;
    isLast: boolean;
    label: string;
    sectionId: string;
    onClick: () => void;
  }
>(({ completed, icon, isLast, label, onClick }, ref) => {
  return (
    <>
      {completed ? (
        <li
          ref={ref}
          className={`flex items-center cursor-pointer min-w-60 ${
            !isLast
              ? `text-teal-600 dark:text-teal-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-teal-100 after:border-4 after:inline-block dark:after:border-teal-800`
              : ''
          }`}
          onClick={onClick}
        >
          <span
            className={`relative flex items-center justify-center w-10 h-10 bg-teal-100 rounded-full lg:h-12 lg:w-12 dark:bg-teal-800 shrink-0`}
            aria-label={label}
          >
            {completed ? <Check className="text-white" /> : icon}
            <div className={`absolute top-14 left-0 text-sm text-teal-600`}>
              {label}
            </div>
          </span>
        </li>
      ) : (
        <li
          ref={ref}
          className={`flex items-center cursor-pointer min-w-60 ${
            !isLast
              ? `text-gray-600 dark:text-gray-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-800`
              : ''
          }`}
          onClick={onClick}
        >
          <span
            className={`relative flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-800 shrink-0`}
            aria-label={label}
          >
            {completed ? <Check className="text-white" /> : icon}
            <div className={`absolute top-14 left-0 text-sm text-white`}>
              {label}
            </div>
          </span>
        </li>
      )}
    </>
  );
});

StepItem.displayName = 'StepItem';
