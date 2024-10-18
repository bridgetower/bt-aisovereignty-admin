import { useNavigate } from 'react-router-dom';

import { TSecondaryNavList } from '@/utils/data/nav';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

const NavListAccordion = ({ data }: { data: TSecondaryNavList }) => {
  const navigate = useNavigate();
  return (
    <AccordionItem className="border-none py-2" value={data.label}>
      <AccordionTrigger className="hover:no-underline text-sm py-0">
        {data?.label}
      </AccordionTrigger>
      <AccordionContent>
        {data?.subItems?.map((subItem, i) => (
          <div
            role="button"
            onClick={() => navigate(subItem.path)}
            tabIndex={0}
            className={`pl-5 p-2 rounded-lg cursor-pointer gap-1 animate-fadeIn transition-opacity duration-500 `}
            key={i}
          >
            <p className="text-sm text-white  transition-all duration-300">
              {subItem.label}
            </p>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export default NavListAccordion;
