import {
  Blocks,
  Check,
  Contact2,
  DoorOpen,
  Lightbulb,
  SproutIcon,
} from 'lucide-react';

import { Stepper } from '@/components/common/HorizontalStepper';
import OrgChart from '@/components/common/orgChart';
import { KnowledgeBaseContainer } from '@/pages/knowledgeBase/KnowledgeBase';
import { KnowledgeBaseWebsitesContainer } from '@/pages/knowledgeBase/KnowledgeBaseWebsites';

import { ProjectList } from '../Projects/Projects';

const stepData = [
  {
    completed: true,
    icon: <Contact2 className="text-white" />,
    label: 'Contact',
    sectionId: 'contact',
  },
  {
    completed: true,
    icon: <SproutIcon className="text-white" />,
    label: 'Sprout',
    sectionId: 'sprout',
  },
  {
    completed: false,
    icon: <Blocks className="text-white" />,
    label: 'Blocks',
    sectionId: 'blocks',
  },
  {
    completed: false,
    icon: <DoorOpen className="text-white" />,
    label: 'Open',
    sectionId: 'open',
  },
  {
    completed: false,
    icon: <Lightbulb className="text-white" />,
    label: 'Idea',
    sectionId: 'idea',
  },
  {
    completed: false,
    icon: <Check className="text-white" />,
    label: 'Complete',
    sectionId: 'complete',
  },
];

const Dashboard = () => {
  const renderContent = (sectionId: string) => {
    switch (sectionId) {
      case 'contact':
        return <KnowledgeBaseContainer />;
      case 'sprout':
        return <KnowledgeBaseWebsitesContainer />;
      case 'blocks':
        return (
          <div className="p-4">
            <OrgChart />
          </div>
        );
      case 'open':
        return <ProjectList />;
      case 'idea':
        return <div>Idea Section Content</div>;
      case 'complete':
        return <div>Complete Section Content</div>;
      default:
        return null;
    }
  };

  return (
    <Stepper
      steps={stepData}
      renderContent={renderContent}
      animationDuration={0.5}
      className="bg-card rounded-2xl"
    />
  );
};

export default Dashboard;
