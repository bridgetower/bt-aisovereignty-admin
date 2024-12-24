import {
  DatabaseBackup,
  DatabaseZap,
  Factory,
  Rocket,
  TrendingUpDown,
  UploadCloud,
} from 'lucide-react';
import { useState } from 'react';

import OrgChart from '@/components/common/orgChart';
import { Stepper } from '@/components/common/Stepper';
import { D3Graph } from '@/components/rnd/d3Graph';
import { Flow } from '@/components/rnd/reactFlowChart';
import { VisJsChart } from '@/components/rnd/visjsChart';
import { ProjectStageLabel } from '@/types/ProjectData';

import { ProjectList } from '../Projects/Projects';

const stepData = [
  {
    completed: true,
    icon: <UploadCloud className="text-white" />,
    label: ProjectStageLabel.DATA_SOURCE,
    sectionId: ProjectStageLabel.DATA_SOURCE,
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
    label: ProjectStageLabel.RAG_INGESTION,
    sectionId: ProjectStageLabel.RAG_INGESTION,
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
  const [selectedSection, setSelectedSection] = useState('visjs');

  const renderContent = (sectionId: any) => {
    switch (sectionId) {
      case 'd3':
        return (
          <div>
            <D3Graph />
          </div>
        );
      case 'visjs':
        return <VisJsChart />;
      case 'blocks':
        return (
          <div className="p-4">
            <OrgChart />
          </div>
        );
      case 'open':
        return <ProjectList />;
      case 'idea':
        return (
          <Stepper
            steps={stepData}
            renderContent={() => null}
            animationDuration={0.5}
            className="bg-card rounded-2xl"
            onStepClick={() => null}
          />
        );
      case 'flow':
        return (
          <div>
            <Flow />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-4">
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="visjs">VisJs</option>
          <option value="flow">Flow</option>
          <option value="blocks">D3 Chart</option>
          <option value="d3">D3 Graph</option>
          <option value="idea">stepper</option>
        </select>
      </div>
      {renderContent(selectedSection)}
    </div>
  );
};

export default Dashboard;
