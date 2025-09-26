/**
 * 消息输入组件
 */
import { cn } from '@/lib/utils';

/**
 * 消息输入组件的属性接口
 */
export interface MessageInputProps {
  messageContent: string;
  error: string | null;
  isSubmitting: boolean;
  onContentChange: (content: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

/**
 * 消息输入组件
 */
export const MessageInput = ({ 
  messageContent, 
  error, 
  isSubmitting, 
  onContentChange, 
  onSubmit, 
  onKeyDown 
}: MessageInputProps) => {
  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      {error && (
        <div className="text-red-500 text-sm mb-2 animate-fade-in">
          {error}
        </div>
      )}
      <div className="flex items-end gap-3">
        <textarea
          value={messageContent}
          onChange={(e) => onContentChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="输入消息..."
          className={cn(
            "flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none min-h-[40px] max-h-[120px]",
            error ? 'border-red-500' : ''
          )}
          disabled={isSubmitting}
        />
        <button
          onClick={onSubmit}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!messageContent.trim() || isSubmitting}
          aria-label="发送消息"
        >
          {isSubmitting ? (
            <i className="fa-solid fa-spinner fa-spin"></i>
          ) : (
            <i className="fa-solid fa-paper-plane"></i>
          )}
        </button>
      </div>
    </div>
  );
};