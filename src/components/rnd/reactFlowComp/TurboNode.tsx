import './index.css';

import { Handle, type Node, type NodeProps, Position } from '@xyflow/react';
import { Cloud } from 'lucide-react';
import { memo, type ReactNode } from 'react';
export type TurboNodeData = {
  title: string;
  icon?: ReactNode;
  subline?: string;
};

const TurboNode = memo(({ data }: NodeProps<Node<TurboNodeData>>) => {
  return (
    <>
      <div className="cloud gradient">
        <div>
          <Cloud />
        </div>
      </div>
      <div className="wrapper gradient">
        <div className="inner">
          <div className="body">
            {data.icon && <div className="icon">{data.icon}</div>}
            <div>
              <div className="title">{data.title}</div>
              {data.subline && <div className="subline">{data.subline}</div>}
            </div>
          </div>
          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} />
        </div>
      </div>
    </>
  );
});

TurboNode.displayName = 'TurboNode';
export { TurboNode };
