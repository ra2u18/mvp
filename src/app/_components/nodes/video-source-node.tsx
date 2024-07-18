import { zodResolver } from '@hookform/resolvers/zod';
import { Handle, Position, useHandleConnections, useUpdateNodeInternals } from '@xyflow/react';
import { Info, MoreHorizontal, Scissors, Video, Volume2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const videoSourceSchema = z.object({
  videoUrl: z.string().url(),
  keepOriginalAudio: z.boolean(),
  videoSections: z.array(
    z.object({
      start: z.string(),
      end: z.string(),
    }),
  ),
});

type VideoSourceFormData = z.infer<typeof videoSourceSchema>;

const possibleOutputs = [
  { id: 'videoUrl', label: 'URL', icon: Video, color: 'bg-blue-100 text-blue-800' },
  { id: 'keepOriginalAudio', label: 'Audio', icon: Volume2, color: 'bg-green-100 text-green-800' },
  {
    id: 'videoSections',
    label: 'Sections',
    icon: Scissors,
    color: 'bg-purple-100 text-purple-800',
  },
];

export default function VideoSourceNode({ id, data }: any) {
  const [activeOutputIndices, setActiveOutputIndices] = useState<number[]>([]);
  const updateNodeInternals = useUpdateNodeInternals();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VideoSourceFormData>({
    resolver: zodResolver(videoSourceSchema),
  });

  const onSubmit = (formData: VideoSourceFormData) => {
    console.log(formData);
    // Here you would update the node data
  };

  const toggleOutput = useCallback(
    (index: number) => {
      setActiveOutputIndices((prev) => {
        const newIndices = prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index];

        return newIndices;
      });

      console.log(`UPDATE NODE INTERNALS FOR ID ${id}`);
      updateNodeInternals(id);
    },
    [id, updateNodeInternals],
  );

  return (
    <div className="bg-white shadow rounded-lg p-4 w-64">
      <div className="font-bold mb-4 text-lg">{data.label}</div>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
          <input
            {...register('videoUrl')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.videoUrl && (
            <p className="text-red-500 text-xs mt-1">{errors.videoUrl.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('keepOriginalAudio')}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Keep Original Audio</span>
          </label>
        </div>
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Outputs</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {possibleOutputs.map((output, index) => (
              <DropdownMenuItem key={output.id} onSelect={() => toggleOutput(index)}>
                {output.label} {activeOutputIndices.includes(index) ? '(Active)' : ''}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {activeOutputIndices.length > 0 && (
        <div className="mt-2 space-y-2">
          {activeOutputIndices.map((index) => {
            const output = possibleOutputs[index];
            const Icon = output.icon;
            return (
              <div
                key={output.id}
                className={`flex items-center justify-between py-[2px] px-2 rounded-md ${output.color} relative`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{output.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 hover:bg-transparent hover:ring-none"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{output.label} Output</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`${id}__${output.id}`}
                    style={{ right: -5, background: '#555', width: 10, height: 10 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
