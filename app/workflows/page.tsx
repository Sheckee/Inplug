'use client';

import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Link from 'next/link';

const nodeTypes = {
  prompt: ({ data }: any) => (
    <div className="px-4 py-3 bg-[#F5EFE0] border-2 border-[#E8B84B] rounded-2xl w-44 text-center font-display text-xs text-[#3A2A18] shadow-md">
      <div className="text-lg mb-1">🏛</div>
      {data.label}
    </div>
  ),
  search: ({ data }: any) => (
    <div className="px-4 py-3 bg-[#F5EFE0] border-2 border-[#5B8C5A] rounded-2xl w-44 text-center font-display text-xs text-[#3A2A18] shadow-md">
      <div className="text-lg mb-1">🌾</div>
      {data.label}
    </div>
  ),
  tool: ({ data }: any) => (
    <div className="px-4 py-3 bg-[#F5EFE0] border-2 border-[#8B5E3C] rounded-2xl w-44 text-center font-display text-xs text-[#3A2A18] shadow-md">
      <div className="text-lg mb-1">⚒</div>
      {data.label}
    </div>
  ),
};

const initialNodes = [
  { id: '1', type: 'prompt', position: { x: 100, y: 100 }, data: { label: 'Village Hall -- receives the request' } },
  { id: '2', type: 'search', position: { x: 380, y: 100 }, data: { label: 'Research Farm -- gathers context' } },
  { id: '3', type: 'tool', position: { x: 660, y: 100 }, data: { label: 'Workshop -- builds the answer' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#E8B84B', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#E8B84B', strokeWidth: 2 } },
];

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('My Workflow');
  const [savedWorkflows, setSavedWorkflows] = useState([]);

  useEffect(() => {
    fetch('/api/workflows')
      .then((res) => res.json())
      .then(setSavedWorkflows)
      .catch(() => {});
  }, []);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#E8B84B', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  const handleSave = async () => {
    const payload = {
      name: workflowName,
      definition: { nodes, edges },
    };
    await fetch('/api/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    alert('📜 Workflow trail saved!');
  };

  return (
    <div
      className="w-screen h-screen p-4 flex flex-col"
      style={{ background: 'linear-gradient(180deg, #DCEFD9 0%, #EAF3D8 100%)' }}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-display text-[#3A2A18]">🪧 Workflow Trail</h1>
          <p className="text-xs text-[#8B5E3C] mt-0.5">
            Lay out the path a quest takes through the village: User → Village Hall → Research Farm → Workshop → … → Response
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-display text-[#3A2A18] bg-[#F5EFE0] border-2 border-[#C9BC9C] rounded-xl px-4 py-2 hover:bg-[#E8DCC4] transition-colors shadow"
        >
          ← Back to Village
        </Link>
      </div>

      <div className="flex flex-1 gap-4 min-h-0">
        {/* Main Canvas */}
        <div className="flex-[3] border-2 border-[#C9BC9C] rounded-2xl overflow-hidden relative shadow-lg">
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
            <MiniMap maskColor="rgba(220, 239, 217, 0.6)" nodeColor="#E8B84B" />
            <Background color="#B7A87E" gap={22} />
          </ReactFlow>
        </div>

        {/* Side Panel */}
        <div className="flex-1 bg-[#F5EFE0] border-2 border-[#C9BC9C] rounded-2xl p-4 flex flex-col gap-4 shadow-lg overflow-y-auto">
          <div>
            <label className="text-xs font-display text-[#8B5E3C]">Trail Name</label>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full bg-white/60 border border-[#C9BC9C] px-3 py-2 rounded-lg text-sm text-[#3A2A18] mt-1 focus:outline-none focus:border-[#E8B84B]"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-[#5B8C5A] hover:bg-[#4F7D51] text-[#F5EFE0] py-2.5 rounded-xl font-display text-sm shadow transition-colors"
          >
            Save Trail
          </button>
          <div className="mt-2">
            <h3 className="text-xs font-display text-[#8B5E3C] mb-2">Saved Trails</h3>
            <ul className="space-y-2">
              {savedWorkflows.length === 0 && (
                <li className="text-xs text-[#8B5E3C]/70">No trails saved yet.</li>
              )}
              {savedWorkflows.map((wf: any) => (
                <li
                  key={wf.id}
                  className="text-xs text-[#3A2A18] bg-white/50 p-2.5 rounded-lg border border-[#E8DCC4]"
                >
                  🪧 {wf.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
