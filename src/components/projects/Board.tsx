import React, { useEffect, useState } from 'react';

import { useProject } from '@/context/ProjectProvider';

import {
  getProjectStageEnumValue,
  IProjectAttributes,
  ProjectStageEnum,
  ProjectStageLabel,
} from '../../types/ProjectData';
import { SkeletonCard } from '../common/SkeletonCard';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { ProjectCard } from './Card';
import { ProjectListView } from './ProjectListView';

type GroupedCardsType = {
  DATA_SELECTION: IProjectAttributes[];
  DATA_INGESTION: IProjectAttributes[];
  DATA_STORAGE: IProjectAttributes[];
  DATA_PREPARATION: IProjectAttributes[];
  LLM_FINE_TUNING: IProjectAttributes[];
  // VERSIONING: IProjectAttributes[];
  // RAG: IProjectAttributes[];
  PUBLISHED: IProjectAttributes[];
};

const Board: React.FC = () => {
  // const [filters, setFilters] = useState({ sort: '', name: '', status: '' });
  const [groupedCards, setGroupedCards] = useState<GroupedCardsType>();

  const [selectedProject, setSelectedProject] = useState<{
    data: IProjectAttributes[];
    index: number | null;
  }>({ data: [], index: null });
  const { projects, loadingProject } = useProject();

  useEffect(() => {
    if (!loadingProject && !selectedProject.data.length) {
      const groupedData = getGroupedData(projects);
      setGroupedCards(groupedData);
      setSelectedProject({
        data: getInitialSelection(groupedData).data,
        index: getInitialSelection(groupedData).index,
      });
    }
  }, [projects, loadingProject, selectedProject]);

  const getInitialSelection = (gropedData: GroupedCardsType) => {
    if (gropedData.DATA_SELECTION.length > 0) {
      return { data: gropedData.DATA_SELECTION, index: 0 };
    } else if (gropedData.DATA_INGESTION.length > 0) {
      return { data: gropedData.DATA_INGESTION, index: 1 };
    } else if (gropedData.DATA_STORAGE.length > 0) {
      return { data: gropedData.DATA_STORAGE, index: 2 };
    } else if (gropedData.DATA_PREPARATION.length > 0) {
      return { data: gropedData.DATA_PREPARATION, index: 3 };
    } else if (gropedData.LLM_FINE_TUNING.length > 0) {
      return { data: gropedData.LLM_FINE_TUNING, index: 4 };
      // } else if (gropedData.VERSIONING.length > 0) {
      //   return gropedData.VERSIONING;
      // } else if (gropedData.RAG.length > 0) {
      //   return gropedData.RAG;
    } else if (gropedData.PUBLISHED.length > 0) {
      return { data: gropedData.PUBLISHED, index: 5 };
    } else {
      return { data: [], index: 0 };
    }
  };
  const getGroupedData = (
    projects: IProjectAttributes[],
    // { sort, name, status }: { sort: string; name: string; status: string },
  ) => {
    // Apply filters and sorting together to avoid redundant operations
    // const filteredSortedProjects = projects
    //   .filter((card) => {
    //     const matchesName =
    //       name !== 'All'
    //         ? card.name.toLowerCase().includes(name.toLowerCase())
    //         : true;
    //     const matchesStatus = status ? card.projectstatus === status : true;
    //     return matchesName && matchesStatus;
    //   })
    //   .sort((a, b) => {
    //     if (sort === 'name') return a.name.localeCompare(b.name);
    //     if (sort === 'status')
    //       return a.projectstatus.localeCompare(b.projectstatus);
    //     return 0;
    //   });

    return {
      [ProjectStageEnum.DATA_SELECTION]: projects.filter(
        (card) =>
          card.projectstage ===
          getProjectStageEnumValue(ProjectStageEnum.DATA_SELECTION),
      ),
      [ProjectStageEnum.DATA_INGESTION]: projects.filter(
        (card) =>
          card.projectstage ===
          getProjectStageEnumValue(ProjectStageEnum.DATA_INGESTION),
      ),
      [ProjectStageEnum.DATA_STORAGE]: projects.filter(
        (card) =>
          card.projectstage ===
          getProjectStageEnumValue(ProjectStageEnum.DATA_STORAGE),
      ),
      [ProjectStageEnum.DATA_PREPARATION]: projects.filter(
        (card) =>
          card.projectstage ===
          getProjectStageEnumValue(ProjectStageEnum.DATA_PREPARATION),
      ),
      [ProjectStageEnum.LLM_FINE_TUNING]: projects.filter(
        (card) =>
          card.projectstage ===
          getProjectStageEnumValue(ProjectStageEnum.LLM_FINE_TUNING),
      ),
      // [ProjectStageEnum.VERSIONING]: projects.filter(
      //   (card) =>
      //     card.projectstage ===
      //     getProjectStageEnumValue(ProjectStageEnum.VERSIONING),
      // ),
      // [ProjectStageEnum.RAG]: projects.filter(
      //   (card) =>
      //     card.projectstage === getProjectStageEnumValue(ProjectStageEnum.RAG),
      // ),
      [ProjectStageEnum.PUBLISHED]: projects.filter(
        (card) =>
          card.projectstage ===
          getProjectStageEnumValue(ProjectStageEnum.PUBLISHED),
      ),
    };
  };
  return (
    <>
      <div>
        <div className="uppercase text-md text-[#486581] py-4">
          Projects states
        </div>
        <ScrollArea className=" w-full rounded-md">
          {groupedCards ? (
            <div className="flex pb-4  gap-4">
              {/* Render Columns here using groupedCards */}
              {Object.entries(groupedCards).map(([stage, cardData], i) => (
                <ProjectCard
                  key={i}
                  data={cardData}
                  title={ProjectStageLabel[stage as ProjectStageEnum]}
                  isSelectd={selectedProject.index === i}
                  onClick={() =>
                    setSelectedProject({ data: cardData, index: i })
                  }
                />
              ))}
            </div>
          ) : (
            <SkeletonBoard />
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {/*  Project details table starts */}
        <div className="uppercase text-md text-[#486581] py-4">
          Projects states
        </div>
        <div className="bg-card p-4 rounded-md">
          <ProjectListView
            projects={selectedProject.data}
            isLoading={!groupedCards}
          />
        </div>
      </div>
    </>
  );
};

const SkeletonBoard: React.FC = () => (
  <div className="flex gap-4">
    {[...Array(6)].map((_, idx) => (
      <div className="" key={idx}>
        <div className="mt-4 ">
          <SkeletonCard />
        </div>
      </div>
    ))}
  </div>
);

export default Board;
