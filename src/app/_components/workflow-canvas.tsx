'use client';

import {
  addEdge,
  Background,
  Controls,
  Edge,
  Node,
  OnConnect,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';

import TTSNode from './nodes/tts-node';
import VideoSourceNode from './nodes/video-source-node';

const nodeTypes = {
  videoSource: VideoSourceNode,
  tts: TTSNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'videoSource',
    position: { x: 100, y: 100 },
    data: { label: 'Video Source' },
  },
  {
    id: '2',
    type: 'tts',
    position: { x: 400, y: 100 },
    data: { label: 'TTS' },
  },
];

const initialEdges: Edge[] = [];

export default function WorkflowCanvas() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
}
