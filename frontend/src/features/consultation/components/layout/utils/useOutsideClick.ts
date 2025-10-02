import { useEffect, RefObject } from 'react';

/**
 * 自定义 hook 用于检测点击元素外部的事件
 * @param ref 需要检测的元素引用
 * @param handler 点击外部时执行的回调函数
 */
function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: () => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // 如果点击的元素在引用元素内部，则不执行回调
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
}

export default useOutsideClick;