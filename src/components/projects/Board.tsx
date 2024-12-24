import React, { useEffect, useState } from 'react';

import { useProject } from '@/context/ProjectProvider';

import {
  getProjectStageEnumValue,
  IProjectAttributes,
  ProjectStatusEnum,
} from '../../types/ProjectData';
import { SkeletonCard } from '../common/SkeletonCard';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { ProjectCard } from './Card';
import { ProjectListView } from './ProjectListView';

type GroupedCardsType = {
  STARTED: IProjectAttributes[];
  PAUSED: IProjectAttributes[];
  CANCELLED: IProjectAttributes[];
  ACTIVE: IProjectAttributes[];
  // RAG_INGESTION: IProjectAttributes[];
  // VERSIONING: IProjectAttributes[];
  // RAG: IProjectAttributes[];
  // PUBLISHED: IProjectAttributes[];
};

const Board: React.FC = () => {
  // const [filters, setFilters] = useState({ sort: '', name: '', status: '' });
  const [groupedCards, setGroupedCards] = useState<GroupedCardsType>();
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<{
    data: IProjectAttributes[];
    index: number | null;
  }>({ data: [], index: null });
  const { projects, loadingProject } = useProject();

  useEffect(() => {
    const getData = () => {
      if (!loadingProject) {
        const groupedData = getGroupedData(projects);
        setGroupedCards(groupedData);
        if (projects && projects.length) {
          setSelectedProject({
            data: getInitialSelection(groupedData).data,
            index: getInitialSelection(groupedData).index,
          });
        }
      }
    };
    getData();
    const intervalId = setInterval(() => {
      getData();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [projects, loadingProject]);

  const getInitialSelection = (gropedData: GroupedCardsType) => {
    if (
      gropedData.STARTED.length > 0 &&
      (activeCard === 0 || activeCard === null)
    ) {
      setActiveCard(0);
      return { data: gropedData.STARTED, index: 0 };
    } else if (
      gropedData.ACTIVE.length > 0 &&
      (activeCard === 1 || activeCard === null)
    ) {
      setActiveCard(1);
      return { data: gropedData.ACTIVE, index: 1 };
    } else if (
      gropedData.PAUSED.length > 0 &&
      (activeCard === 2 || activeCard === null)
    ) {
      setActiveCard(2);
      return { data: gropedData.PAUSED, index: 2 };
    } else if (
      gropedData.CANCELLED.length > 0 &&
      (activeCard === 3 || activeCard === null)
    ) {
      setActiveCard(3);
      return { data: gropedData.CANCELLED, index: 3 };
    }
    // else if (
    //   gropedData.RAG_INGESTION.length > 0 &&
    //   (activeCard === 4 || activeCard === null)
    // ) {
    //   setActiveCard(4);
    //   return { data: gropedData.RAG_INGESTION, index: 4 };
    //   // } else if (gropedData.VERSIONING.length > 0) {
    //   //   return gropedData.VERSIONING;
    //   // } else if (gropedData.RAG.length > 0) {
    //   //   return gropedData.RAG;
    // } else if (
    //   gropedData.PUBLISHED.length > 0 &&
    //   (activeCard === 5 || activeCard === null)
    // ) {
    //   setActiveCard(5);
    //   return { data: gropedData.PUBLISHED, index: 5 };
    // }
    else {
      setActiveCard(null);
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
      [ProjectStatusEnum.STARTED]: projects.filter(
        (card) =>
          card.projectstatus ===
          getProjectStageEnumValue(ProjectStatusEnum.STARTED),
      ),
      [ProjectStatusEnum.ACTIVE]: projects.filter(
        (card) =>
          card.projectstatus ===
          getProjectStageEnumValue(ProjectStatusEnum.ACTIVE),
      ),
      [ProjectStatusEnum.PAUSED]: projects.filter(
        (card) =>
          card.projectstatus ===
          getProjectStageEnumValue(ProjectStatusEnum.PAUSED),
      ),
      [ProjectStatusEnum.CANCELLED]: projects.filter(
        (card) =>
          card.projectstatus ===
          getProjectStageEnumValue(ProjectStatusEnum.CANCELLED),
      ),
      // [ProjectStageEnum.RAG_INGESTION]: projects.filter(
      //   (card) =>
      //     card.projectstage ===
      //     getProjectStageEnumValue(ProjectStageEnum.RAG_INGESTION),
      // ),
      // [ProjectStageEnum.VERSIONING]: projects.filter(
      //   (card) =>
      //     card.projectstage ===
      //     getProjectStageEnumValue(ProjectStageEnum.VERSIONING),
      // ),
      // [ProjectStageEnum.RAG]: projects.filter(
      //   (card) =>
      //     card.projectstage === getProjectStageEnumValue(ProjectStageEnum.RAG),
      // ),
      // [ProjectStageEnum.PUBLISHED]: projects.filter(
      //   (card) =>
      //     card.projectstage ===
      //     getProjectStageEnumValue(ProjectStageEnum.PUBLISHED),
      // ),
    };
  };
  return (
    <>
      <div>
        <div className="uppercase text-md text-[#486581] py-4">
          Projects status
        </div>
        <ScrollArea
          className=" rounded-md"
          style={{ width: 'calc(100vw - 250px)' }}
        >
          {groupedCards ? (
            <div className="flex pb-4  gap-4">
              {/* Render Columns here using groupedCards */}
              {Object.entries(groupedCards).map(([stage, cardData], i) => (
                <ProjectCard
                  key={i}
                  data={cardData}
                  title={ProjectStatusEnum[stage as ProjectStatusEnum]}
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
        <div className="uppercase text-md text-[#486581] py-4">Projects</div>
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
