import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  ChevronDownCircle,
  ChevronUpCircle,
  Link,
  Loader,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export interface ISteperData {
  completed: boolean;
  icon: React.ReactNode;
  label: string;
  data: any;
  // sectionId: string;
  isExpanded: boolean;
  onClick?: () => void;
  isLast?: boolean;
  selected?: boolean;
  index?: number;
  dataLoading?: boolean;
}

interface StepperProps {
  steps: ISteperData[];
  renderContent: (sectionId: string) => React.ReactNode;
  animationDuration?: number;
  onStepClick: (index: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  renderContent,
  animationDuration = 0.5,
  className = '',
  onStepClick,
}) => {
  const [activeSection, setActiveSection] = useState(steps[0].label);
  const activeStepRef = useRef<HTMLLIElement | null>(null);
  const [prevSection, setPrevSection] = useState<string | null>(null);

  const handleStepClick = (data: ISteperData, index: number) => {
    setPrevSection(activeSection);
    setActiveSection(data.label);
    onStepClick(index);
  };

  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeSection]);

  const swipeDirection =
    prevSection &&
    steps.findIndex((step) => step.label === activeSection) >
      steps.findIndex((step) => step.label === prevSection)
      ? 1000
      : -1000;

  return (
    <>
      <div className={`w-full ${className}`}>
        <div className="h-auto overflow-y-auto whitespace-nowrap hide-scrollbar">
          <ol className="flex flex-col items-start mt-4">
            {steps.map((step, i) => (
              <StepItem
                key={i}
                isExpanded={step.isExpanded}
                completed={step.completed}
                icon={step.icon}
                isLast={steps.length === i + 1}
                label={step.label}
                data={step.data}
                dataLoading={step.dataLoading}
                // selected={step.label === activeSection}
                onClick={() => {
                  handleStepClick(step, i + 1);
                  if (!step.data) {
                    step.dataLoading = true;
                  }
                  step.isExpanded = !step.isExpanded;
                }}
                ref={step.label === activeSection ? activeStepRef : null}
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

const StepItem = React.forwardRef<HTMLLIElement, ISteperData>(
  (
    { data, dataLoading, isExpanded, completed, icon, isLast, label, onClick },
    ref,
  ) => {
    // const [isExpanded, setIsExpanded] = useState(index === 0);

    // const toggleExpand = () => setIsExpanded(!isExpanded);
    console.log(isExpanded);

    return (
      <li
        ref={ref}
        className="flex flex-col cursor-pointer my-4 relative"
        onClick={onClick}
      >
        <div className="flex items-center">
          <span
            className={`relative flex items-center justify-center w-10 h-10 rounded-full shrink-0 border-4  ${
              completed
                ? 'bg-indigo-600 border-indigo-200'
                : 'bg-gray-300 border-gray-200'
            }`}
            aria-label={label}
          >
            {completed ? <Check className="text-white" /> : icon}
          </span>
          <div
            className={`ml-2 flex items-center text-sm ${completed ? (isExpanded ? 'text-indigo-600' : 'text-indigo-500') : 'text-muted-foreground'}`}
          >
            <div className="font-medium">{label}</div>
            <button className="ml-2 text-gray-500 hover:text-indigo-600">
              {isExpanded ? (
                <ChevronUpCircle size={16} />
              ) : (
                <ChevronDownCircle size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="ml-12  text-gray-600"
            >
              <ul className="bule pl-4 text-muted-foreground font-medium">
                {((data?.steps as any[]) || []).map((step, i) => (
                  <li className="text-xs" key={i}>
                    <div className="text-sm font-medium flex items-center gap-1 mt-2">
                      <Link className="" size={10} /> {step?.name}
                    </div>
                    <ul className="bule pl-6 text-muted-foreground font-normal list-disc ">
                      {(step.stepdetails as any[]).map((detail, j) => (
                        <li key={i + j} className="text-xs">
                          {detail.metadata}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
                {dataLoading && <Loader className="animate-spin" />}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connecting line */}
        {!isLast && (
          <span
            className={`absolute top-10 left-[19px] w-0.5 ${
              completed ? 'bg-indigo-600' : 'border border-dotted'
            }`}
            style={{ height: 'calc(100% + 1rem)' }}
          ></span>
        )}
      </li>
    );
  },
);

StepItem.displayName = 'StepItem';
