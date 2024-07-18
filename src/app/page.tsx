import dynamic from 'next/dynamic';

const WorkflowCanvas = dynamic(() => import('@/app/_components/workflow-canvas'), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Workflow Automation</h1>
      <div className="w-full h-[600px]">
        <WorkflowCanvas />
      </div>
    </main>
  );
}
