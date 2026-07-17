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
    <div className="p-3 bg-panel border-2 border-accent/30 rounded-lg w-40 text-center pixel-text text-xs text-gray-300 shadow-lg">
      📝 {data.label}
    </div>
  ),
  search: ({ data }: any) => (
    <div className="p-3 bg-panel border-2 border-info/30 rounded-lg w-40 text-center pixel-text text-xs text-gray-300 shadow-lg">
      🔍 {data.label}
    </div>
  ),
  tool: ({ data }: any) => (
    <div className="p-3 bg-panel border-2 border-warning/30 rounded-lg w-40 text-center pixel-text text-xs text-gray-300 shadow-lg">
      🛠️ {data.label}
    </div>
  ),
};

const initialNodes = [
  { id: '1', type: 'prompt', position: { x: 100, y: 100 }, data: { label: 'System Prompt' } },
  { id: '2', type: 'search', position: { x: 300, y: 100 }, data: { label: 'Web Search' } },
  { id: '3', type: 'tool', position: { x: 500, y: 100 }, data: { label: 'Code Exec' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#6EE7B7' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#6EE7B7' } },
];

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('My Workflow');
  const [savedWorkflows, setSavedWorkflows] = useState([]);

  useEffect(() => {
    fetch('/api/workflows')
      .then((res) => res.json())
      .then(setSavedWorkflows);
  }, []);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
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
    alert('✅ Workflow saved!');
  };

  return (
    <div className="w-screen h-screen bg-bg p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl pixel-text text-accent">Workflow Builder</h1>
        <div className="flex gap-4">
          <Link href="/" className="text-sm pixel-text text-gray-400 hover:text-white">
            ← Back to Office
          </Link>
        </div>
      </div>

      <div className="flex flex-1 gap-4">
        {/* Main Canvas */}
        <div className="flex-[3] border-2 border-panel rounded-lg overflow-hidden relative">
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
            <MiniMap />
            <Background color="#161B22" gap={20} />
          </ReactFlow>
        </div>

        {/* Side Panel */}
        <div className="flex-1 bg-panel/50 border border-panel rounded-lg p-4 flex flex-col gap-4">
          <div>
            <label className="text-xs pixel-text text-gray-400">Workflow Name</label>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full bg-bg border border-gray-700 px-3 py-2 rounded text-sm text-gray-300 mt-1"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-accent text-black py-2 rounded pixel-text text-sm hover:bg-accent/80"
          >
            SAVE WORKFLOW
          </button>
          <div className="mt-4">
            <h3 className="text-xs pixel-text text-gray-400 mb-2">Saved Workflows</h3>
            <ul className="space-y-2">
              {savedWorkflows.map((wf: any) => (
                <li key={wf.id} className="text-xs text-gray-300 bg-panel/30 p-2 rounded border border-gray-700">
                  {wf.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
