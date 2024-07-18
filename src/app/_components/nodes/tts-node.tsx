import { zodResolver } from '@hookform/resolvers/zod';
import {
  Connection,
  Handle,
  Position,
  useHandleConnections,
  useUpdateNodeInternals,
} from '@xyflow/react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'lucide-react';

const ttsSchema = z.object({
  videoUrl: z.string().url(),
});

type TTSFormData = z.infer<typeof ttsSchema>;

interface InputFieldProps {
  name: 'videoUrl';
  label: string;
  nodeId: string;
}

const InputField: React.FC<InputFieldProps> = ({ name, label, nodeId }) => {
  const { register, setValue, watch } = useFormContext<TTSFormData>();
  const [isReferencing, setIsReferencing] = useState(false);
  const updateNodeInternals = useUpdateNodeInternals();
  const value = watch(name);

  const connections = useHandleConnections({ type: 'target', nodeId });
  console.log('connections', connections);
  console.log({ nodeId });

  const toggleReference = useCallback(() => {
    setIsReferencing((prev) => !prev);
    if (!isReferencing) {
      setValue(name, '');
    }
  }, [isReferencing, setValue, name]);

  useEffect(() => {
    updateNodeInternals(nodeId);
  }, [isReferencing, nodeId, updateNodeInternals]);

  const handleConnection = useCallback(
    (params: Connection) => {
      console.log(params);
      if (params.target === nodeId && params.targetHandle === name) {
        const referenceValue = `nodeAncestors.${params.source}.${params.sourceHandle}`;
        setValue(name, referenceValue);
        setIsReferencing(true);
      }
    },
    [setValue, name, nodeId, setIsReferencing],
  );

  useEffect(() => {
    // This effect is to handle connections made outside of this component
    if (value && value.startsWith('nodeAncestors.')) {
      setIsReferencing(true);
    }
  }, [value]);

  return (
    <div className="mb-3 relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center">
        <input
          {...register(name)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isReferencing}
        />
        <Button
          type="button"
          onClick={toggleReference}
          className={`ml-2 p-2 ${isReferencing ? 'bg-indigo-500' : 'bg-gray-200'}`}
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id={`${nodeId}__${name}`}
        isConnectable={connections.length === 0}
      />
    </div>
  );
};

interface TTSNodeProps {
  id: string;
  data: TTSFormData;
}

export default function TTSNode({ id, data }: TTSNodeProps) {
  const methods = useForm<TTSFormData>({
    resolver: zodResolver(ttsSchema),
    defaultValues: data,
  });

  const onSubmit = (formData: TTSFormData) => {
    console.log(formData);
    // Here you would update the node data
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 w-64">
      <div className="font-bold mb-4 text-lg">TTS Node</div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <InputField name="videoUrl" label="Video URL" nodeId={id} />
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
