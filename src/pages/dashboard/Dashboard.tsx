import {
  DatabaseBackup,
  DatabaseZap,
  Factory,
  Rocket,
  TrendingUpDown,
  UploadCloud,
} from 'lucide-react';

import OrgChart from '@/components/common/orgChart';
import { Stepper } from '@/components/common/Stepper';
import { ProjectStageLabel } from '@/types/ProjectData';

import { ProjectList } from '../Projects/Projects';

const stepData = [
  {
    completed: true,
    icon: <UploadCloud className="text-white" />,
    label: ProjectStageLabel.DATA_SELECTION,
    sectionId: ProjectStageLabel.DATA_SELECTION,
    isExpanded: false,
    data: [], //'Contact Section Content',
  },
  {
    completed: false,
    icon: <DatabaseZap className="text-white" />,
    label: ProjectStageLabel.DATA_INGESTION,
    sectionId: ProjectStageLabel.DATA_INGESTION,
    isExpanded: false,
    data: [], //'Sprout Section Content',
  },
  {
    completed: false,
    icon: <DatabaseBackup className="text-white" />,
    label: ProjectStageLabel.DATA_STORAGE,
    sectionId: ProjectStageLabel.DATA_STORAGE,
    isExpanded: false,
    data: [], //'Blocks Section Content',
  },
  {
    completed: false,
    icon: <TrendingUpDown className="text-white" />,
    label: ProjectStageLabel.DATA_PREPARATION,
    sectionId: ProjectStageLabel.DATA_PREPARATION,
    isExpanded: false,
    data: [], //'Open Section Content',
  },
  {
    completed: false,
    icon: <Factory className="text-white" />,
    label: ProjectStageLabel.LLM_FINE_TUNING,
    sectionId: ProjectStageLabel.LLM_FINE_TUNING,
    isExpanded: false,
    data: [], //'Idea Section Content',
  },
  {
    completed: false,
    icon: <Rocket className="text-white" />,
    label: ProjectStageLabel.PUBLISHED,
    sectionId: ProjectStageLabel.PUBLISHED,
    isExpanded: false,
    data: [], //'Complete Section Content',
  },
];

const Dashboard = () => {
  const renderContent = (sectionId: string) => {
    switch (sectionId) {
      case 'contact':
        // return <KnowledgeBaseContainer />;
        return <h1>Contact</h1>;
      case 'sprout':
        // return <KnowledgeBaseWebsitesContainer />;
        return <h1>sprout</h1>;

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
      renderContent={() => null}
      animationDuration={0.5}
      className="bg-card rounded-2xl"
      onStepClick={() => null}
    />
  );
};

export default Dashboard;
