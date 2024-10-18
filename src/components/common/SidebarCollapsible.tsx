import { useLocation, useNavigate } from 'react-router-dom';

import { TNavItem } from '../../utils/data/nav';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import Icon from './Icon';

type TCollapsibleProps = {
  data: TNavItem;
};

export default function SidebarCollapsible({ data }: TCollapsibleProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const onHeadClick = () => {
    if (data?.subItems.length) return;
    navigate(data?.path);
  };

  return (
    <div>
      {!data.subItems.length ? (
        <div
          role="button"
          tabIndex={0}
          className={`relative flex -ml-3 p-2 rounded-lg cursor-pointer transition-all duration-300 !pl-6  ${
            location.pathname === data.path ? 'bg-white/10' : ''
          } ${location.pathname === data.path ? 'bg-white/10' : ''}`}
          onClick={onHeadClick}
        >
          {location.pathname === data.path && (
            <span className="w-1 h-4 bg-white rounded-md absolute top-1/2 left-0 transform -translate-y-1/2 " />
          )}

          <div className="flex items-center gap-x-2">
            <Icon size={15} name={data.icon} type="solid" />
            <p className="text-sm transition-all duration-300">{data?.label}</p>
          </div>
        </div>
      ) : (
        <AccordionItem className="border-none" value={data.path}>
          <AccordionTrigger
            onClick={onHeadClick}
            className={`hover:no-underline p-2 -ml-3 justify-start gap-2 relative pl-6 text-sm rounded-md [&>svg:first-child]:!rotate-0 [&>svg:last-child]:absolute [&>svg:last-child]:-rotate-90 [&[data-state=open]>svg:last-child]:rotate-0 [&>svg:last-child]:left-1 [&>svg:last-child]:text-white/20 ${location.pathname === data.path ? 'bg-white/10' : ''} `}
          >
            <Icon size={15} name={data.icon} type="solid" />
            {location.pathname === data.path && (
              <span className="w-1 h-4 bg-white rounded-md absolute top-1/2 -left-0.5 transform -translate-y-1/2 " />
            )}

            {data?.label}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-0">
            {data?.subItems?.map((subItem, i) => (
              <div
                role="button"
                onClick={() => navigate(subItem.path)}
                tabIndex={0}
                className={`pl-7 p-1.5 rounded-lg cursor-pointer ${location.pathname === subItem.path && 'bg-white/10'} `}
                key={i}
              >
                <p className="text-sm text-white/90">{subItem.label}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      )}
    </div>
  );
}
