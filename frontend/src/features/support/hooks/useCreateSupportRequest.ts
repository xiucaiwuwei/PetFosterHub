import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSupportRequest as createSupportRequestAction } from '../slice/supportSlice';
import { SupportRequestDto } from '../types';
import { toast } from 'sonner';

interface UseCreateSupportRequestReturn {
  createSupportRequest: (request: SupportRequestDto) => Promise<boolean>;
  isSubmitting: boolean;
  error: string | null;
}

export const useCreateSupportRequest = (): UseCreateSupportRequestReturn => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSupportRequest = async (request: SupportRequestDto): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      await dispatch(createSupportRequestAction(request)).unwrap();
      toast.success('支持请求提交成功');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '提交支持请求失败';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createSupportRequest,
    isSubmitting,
    error
  };
};