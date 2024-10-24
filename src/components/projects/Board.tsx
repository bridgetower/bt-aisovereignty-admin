// src/components/Board.tsx
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useProject } from '@/context/ProjectProvider';

import {
  getProjectStageEnumValue,
  IProjectAttributes,
  ProjectStageEnum,
  ProjectStageLabel,
  ProjectStatusKeyValueArray,
} from '../../types/ProjectData';
import RightDrawer from '../common/rightDrawer';
import { SkeletonCard } from '../common/SkeletonCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import TrelloCard from './Card';
import Column from './Column';
import ProjectDetails from './ProjectDetails';

// const initialCards: IProjectAttributes[] = [
//   {
//     id: 1,
//     name: 'Task 1',
//     description: 'Description for Task 1',
//     status: 'To Do',
//   },
//   {
//     id: 2,
//     name: 'Task 2',
//     description: 'Description for Task 2',
//     status: 'To Do',
//   },
//   {
//     id: 3,
//     name: 'Task 3',
//     description: 'Description for Task 3',
//     status: 'In Progress',
//   },
//   {
//     id: 4,
//     name: 'Task 4',
//     description: 'Description for Task 4',
//     status: 'In Progress',
//   },
//   {
//     id: 5,
//     name: 'Task 5',
//     description: 'Description for Task 5',
//     status: 'Completed',
//   },
//   {
//     id: 6,
//     name: 'Task 6',
//     description: 'Description for Task 6',
//     status: 'Completed',
//   },
//   {
//     id: 7,
//     name: 'Task 7',
//     description: 'Description for Task 7',
//     status: 'Pending',
//   },
//   {
//     id: 8,
//     name: 'Task 8',
//     description: 'Description for Task 8',
//     status: 'Pending',
//   },
// ];
type GroupedCardsType = {
  DATA_SELECTION: IProjectAttributes[];
  DATA_INGESTION: IProjectAttributes[];
  DATA_STORAGE: IProjectAttributes[];
  DATA_PREPARATION: IProjectAttributes[];
  LLM_FINE_TUNING: IProjectAttributes[];
  VERSIONING: IProjectAttributes[];
  RAG: IProjectAttributes[];
  PUBLISHED: IProjectAttributes[];
};
const Board: React.FC = () => {
  // const [projects, setCards] = useState<IProjectAttributes[]>(initialCards);
  const [sortCriteria, setSortCriteria] = useState<string>('');
  const [filter, setFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [groupedCards, setGroupedCards] = useState<GroupedCardsType>();

  const [showRightPanel, setShowRightPanel] = useState<boolean>(false);
  const { projects } = useProject();
  useEffect(() => {
    if (sortCriteria) {
      const data = sortCards(projects);
      getGroupedData(data);
    }
  }, [sortCriteria, projects]);

  useEffect(() => {
    if (filter || statusFilter) {
      const data = applyFilters(projects);
      getGroupedData(data);
    }
  }, [filter, statusFilter]);

  const sortCards = (projects: IProjectAttributes[]) => {
    return [...projects].sort((a, b) => {
      if (sortCriteria === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortCriteria === 'status') {
        return a.projectstatus.localeCompare(b.projectstatus);
      }
      return 0;
    });
  };

  const handleSortChange = (value: string) => {
    setSortCriteria(value);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const applyFilters = (projects: IProjectAttributes[]) => {
    return projects.filter((card) => {
      const matchesName =
        filter !== 'All'
          ? card.name.toLowerCase().includes(filter.toLowerCase())
          : true;

      const matchesStatus = statusFilter
        ? card.projectstatus === statusFilter
        : true;
      return matchesName && matchesStatus;
    });
  };

  useEffect(() => {
    if (projects && projects.length) {
      getGroupedData(projects);
    }
  }, [projects]);

  const getGroupedData = (projects: IProjectAttributes[]) => {
    const sortedCards = sortCards(projects);
    const filteredCards = applyFilters(sortedCards);
    const groupedCard = {
      [ProjectStageEnum.DATA_SELECTION]: filteredCards.filter(
        (card) =>
          card.projectstage ===
          getProjectStageEnumValue(ProjectStageEnum.DATA_SELECTION),
      ),
      [ProjectStageEnum.DATA_INGESTION]: filteredCards.filter(
        (card) =>
          card.projectstage ===
          getProjectStageEnumValue(ProjectStageEnum.DATA_INGESTION),
      ),
      [ProjectStageEnum.DATA_STORAGE]: filteredCards.filter(
        (card) =>
          card.projectstage ===
          getProjectStageEnumValue(ProjectStageEnum.DATA_STORAGE),
      ),
      [ProjectStageEnum.DATA_PREPARATION]: filteredCards.filter(
        (card) =>
          card.projectstage ===
          getProjectStageEnumValue(ProjectStageEnum.DATA_PREPARATION),
      ),
      [ProjectStageEnum.LLM_FINE_TUNING]: filteredCards.filter(
        (card) =>
          card.projectstage ===
          getProjectStageEnumValue(ProjectStageEnum.LLM_FINE_TUNING),
      ),
      [ProjectStageEnum.VERSIONING]: filteredCards.filter(
        (card) =>
          card.projectstage ===
          getProjectStageEnumValue(ProjectStageEnum.VERSIONING),
      ),
      [ProjectStageEnum.RAG]: filteredCards.filter(
        (card) =>
          card.projectstage === getProjectStageEnumValue(ProjectStageEnum.RAG),
      ),
      [ProjectStageEnum.PUBLISHED]: filteredCards.filter(
        (card) =>
          card.projectstage ===
          getProjectStageEnumValue(ProjectStageEnum.PUBLISHED),
      ),
    };
    setGroupedCards(groupedCard);
  };
  const togglePanel = () => {
    setShowRightPanel(!showRightPanel);
  };
  return (
    <>
      <RightDrawer
        onClose={togglePanel}
        isOpen={showRightPanel}
        title="Project Details"
      >
        <ProjectDetails />
      </RightDrawer>
      <div>
        <Separator />
        <div className="my-4 flex items-center justify-end space-x-8">
          <div className="flex flex-col">
            <label
              className="mr-2 text-muted-foreground text-sm"
              htmlFor="filter1"
            >
              Name
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center justify-between text-sm">
                  {filter || 'All'} <ChevronDown className="ml-5" size={18} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleFilterChange('All')}>
                  {'All'}
                </DropdownMenuItem>
                {projects
                  .map((e) => e.name)
                  .map((item, i) => (
                    <DropdownMenuItem
                      key={item + i}
                      onClick={() => handleFilterChange(item)}
                    >
                      {item}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col">
            <label
              className="mr-2 text-muted-foreground text-sm"
              htmlFor="filter2"
            >
              Status
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center justify-between text-sm">
                  {statusFilter || 'All'}{' '}
                  <ChevronDown className="ml-5" size={18} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleStatusFilterChange('all')}
                >
                  {'All'}
                </DropdownMenuItem>
                {ProjectStatusKeyValueArray.map((item, i) => (
                  <DropdownMenuItem
                    key={item.value + i}
                    onClick={() => handleStatusFilterChange(item.key)}
                  >
                    {item.value.replace('_', ' ')}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col">
            <label
              className="mr-2 text-muted-foreground text-sm"
              htmlFor="sort"
            >
              Sort
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center justify-between text-sm">
                  {sortCriteria || 'Default'}{' '}
                  <ChevronDown className="ml-5" size={18} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSortChange('name')}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange('projectstatus')}
                >
                  Status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <ScrollArea className="min-h-screen w-full rounded-md p-4">
          {groupedCards ? (
            <div className="flex">
              <Column
                title={ProjectStageLabel[ProjectStageEnum.DATA_SELECTION]}
              >
                {groupedCards[ProjectStageEnum.DATA_SELECTION].map((card) => (
                  <TrelloCard
                    key={card.id}
                    title={card.name}
                    description={card.description}
                    status={card.projectstatus}
                    projecttype={card.projecttype}
                    onClick={togglePanel}
                  />
                ))}
              </Column>
              <Column
                title={ProjectStageLabel[ProjectStageEnum.DATA_INGESTION]}
              >
                {groupedCards[ProjectStageEnum.DATA_INGESTION].map((card) => (
                  <TrelloCard
                    key={card.id}
                    title={card.name}
                    description={card.description}
                    status={card.projectstatus}
                    projecttype={card.projecttype}
                    onClick={togglePanel}
                  />
                ))}
              </Column>
              <Column title={ProjectStageLabel[ProjectStageEnum.DATA_STORAGE]}>
                {groupedCards[ProjectStageEnum.DATA_STORAGE].map((card) => (
                  <TrelloCard
                    key={card.id}
                    title={card.name}
                    description={card.description}
                    status={card.projectstatus}
                    projecttype={card.projecttype}
                    onClick={togglePanel}
                  />
                ))}
              </Column>
              <Column
                title={ProjectStageLabel[ProjectStageEnum.DATA_PREPARATION]}
              >
                {groupedCards[ProjectStageEnum.DATA_PREPARATION].map((card) => (
                  <TrelloCard
                    key={card.id}
                    title={card.name}
                    description={card.description}
                    status={card.projectstatus}
                    projecttype={card.projecttype}
                  />
                ))}
              </Column>
              <Column
                title={ProjectStageLabel[ProjectStageEnum.LLM_FINE_TUNING]}
              >
                {groupedCards[ProjectStageEnum.LLM_FINE_TUNING].map((card) => (
                  <TrelloCard
                    key={card.id}
                    title={card.name}
                    description={card.description}
                    status={card.projectstatus}
                    projecttype={card.projecttype}
                  />
                ))}
              </Column>
              <Column title={ProjectStageLabel[ProjectStageEnum.VERSIONING]}>
                {groupedCards[ProjectStageEnum.VERSIONING].map((card) => (
                  <TrelloCard
                    key={card.id}
                    title={card.name}
                    description={card.description}
                    status={card.projectstatus}
                    projecttype={card.projecttype}
                  />
                ))}
              </Column>
              <Column title={ProjectStageLabel[ProjectStageEnum.RAG]}>
                {groupedCards[ProjectStageEnum.RAG].map((card) => (
                  <TrelloCard
                    key={card.id}
                    title={card.name}
                    description={card.description}
                    status={card.projectstatus}
                    projecttype={card.projecttype}
                  />
                ))}
              </Column>
              <Column title={ProjectStageLabel[ProjectStageEnum.PUBLISHED]}>
                {groupedCards[ProjectStageEnum.PUBLISHED].map((card) => (
                  <TrelloCard
                    key={card.id}
                    title={card.name}
                    description={card.description}
                    status={card.projectstatus}
                    projecttype={card.projecttype}
                  />
                ))}
              </Column>
            </div>
          ) : (
            <SkeletonBoard />
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};

const SkeletonBoard: React.FC = () => {
  return (
    <div className="flex ">
      <Column title="">
        <div className="mt-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </Column>
      <Column title="">
        <div className="mt-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </Column>
      <Column title="">
        <div className="mt-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </Column>
      <Column title="">
        <div className="mt-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </Column>
      <Column title="">
        <div className="mt-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </Column>
    </div>
  );
};

export default Board;
