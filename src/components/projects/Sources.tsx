import { FileText, Globe, Loader } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ActionStatus, IReference, statusColor } from '@/types/ProjectData';

import { ISteperData, Stepper } from '../common/Stepper';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface SourceLinkProps {
  sourceArray: IReference[];
  activeIndex: number;
  onOpen: (refId: string) => void;
  stepperData: ISteperData[];
}

export const Sources: React.FC<SourceLinkProps> = ({
  sourceArray,
  activeIndex,
  onOpen,
  stepperData,
}) => {
  const [openItems, setOpenItems] = useState<string>('');
  // const activeItemRef = useRef<HTMLDivElement>(null);
  // const containerRef = useRef<HTMLDivElement>(null);
  const [resetTrigger, setResetTrigger] = useState(false);
  const memoizedStepperData = useMemo(() => {
    return resetTrigger ? [] : stepperData;
  }, [stepperData, resetTrigger]);

  const handleReset = () => {
    setResetTrigger(true); // Toggle the reset trigger to reset the data
  };

  useEffect(() => {
    if (stepperData && memoizedStepperData.length === 0) {
      setResetTrigger(false);
    }
  }, [stepperData]);

  // Update open items and scroll to active item when activeIndex changes
  useEffect(() => {
    if (activeIndex >= 0 && activeIndex < sourceArray.length) {
      setOpenItems(`source${activeIndex}`);
      const refId = sourceArray[activeIndex].id;

      onOpen(refId);
      // Scroll to active item after a small delay to ensure accordion is open
      // setTimeout(() => {
      //   if (activeItemRef.current && containerRef.current) {
      //     const container = containerRef.current;
      //     const item = activeItemRef.current;

      //     const containerRect = container.getBoundingClientRect();
      //     const itemRect = item.getBoundingClientRect();

      //     if (
      //       itemRect.top < containerRect.top ||
      //       itemRect.bottom > containerRect.bottom
      //     ) {
      //       item.scrollIntoView({
      //         behavior: 'smooth',
      //         block: 'nearest',
      //       });
      //     }
      //   }
      // }, 100);
    }
  }, [activeIndex, sourceArray.length]);

  // Handle empty state
  if (sourceArray.length === 0) {
    return (
      <div className="p-4">
        {/* <h1 className="text-2xl font-bold mb-4">Sources</h1> */}
        <div className="text-center text-muted-foreground py-8 bg-accent/50 rounded-lg">
          Refrences not yet added, drag here to add files.
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* <h1 className="text-xl font-bold mb-4 text-primary">Sources</h1> */}

      <Accordion
        type="single"
        collapsible
        value={openItems}
        onValueChange={setOpenItems}
        className="space-y-2"
      >
        {sourceArray.map((source: IReference, index: number) => (
          <AccordionItem
            // ref={index === activeIndex ? activeItemRef : undefined}
            value={`source${index}`}
            key={index}
            className={`border rounded-lg transition-all duration-300 ${
              index === activeIndex
                ? 'border-gray-300 shadow-md bg-accent/10'
                : 'border-border hover:border-gray-300'
            }`}
          >
            <AccordionTrigger
              onClick={() => {
                handleReset();
                onOpen(source.id);
              }}
              className={`
                text-[#1890FF] hover:no-underline px-4 transition-all duration-300
                ${index === activeIndex ? 'font-medium' : ''}
                hover:bg-accent/50 rounded-t-lg
              `}
            >
              <span className="flex items-center gap-2">
                {source.reftype === 'WEBSITE' ? (
                  <Globe
                    size={16}
                    className={`
                      transition-colors duration-300
                      ${index === activeIndex ? 'text-primary' : 'text-muted-foreground'}
                    `}
                  />
                ) : (
                  <FileText
                    size={16}
                    className={`
                      transition-colors duration-300
                      ${index === activeIndex ? 'text-primary' : 'text-muted-foreground'}
                    `}
                  />
                )}
                <div className="grid grid-cols-3 gap-2 ">
                  <div>{source.name}</div>
                </div>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* <TableHead>Source</TableHead> */}
                    <TableHead>Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{source.name}</TableCell>
                    <TableCell>{source.size}</TableCell>
                    <TableCell>
                      <Badge
                        className={`text-sm ${statusColor[source.status.toUpperCase() as ActionStatus].text + ' ' + statusColor[source.status.toUpperCase() as ActionStatus].bg} hover:${statusColor[source.status.toUpperCase() as ActionStatus].bg}`}
                      >
                        {source.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div>
                {memoizedStepperData.length ? (
                  <Stepper
                    steps={memoizedStepperData}
                    renderContent={() => null}
                    animationDuration={0.5}
                    className="bg-card rounded-2xl"
                    onStepClick={() => null}
                  />
                ) : (
                  <div className="flex justify-center">
                    <Loader size={24} className="animate-spin" />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
