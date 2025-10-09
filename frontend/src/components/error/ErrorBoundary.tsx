import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * 错误边界组件 - 用于捕获子组件树中的JavaScript错误
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新状态，以便下一次渲染显示降级UI
    return {
      hasError: true,
      error: error,
      errorInfo: null
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 你同样可以将错误日志发送到服务器
    console.error('组件错误:', error, errorInfo);
    this.setState({ errorInfo });
  }

  override render() {
    if (this.state.hasError) {
      // 你可以自定义降级UI
      return (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg max-w-2xl mx-auto my-8">
          <h3 className="text-lg font-medium mb-2">哎呀，发生了一些错误</h3>
          <p className="mb-2">抱歉，该组件无法正常加载。</p>
          {process.env.NODE_ENV === 'development' && (
            <>
              <details className="text-sm">
                <summary>错误详情</summary>
                <p className="text-xs mt-1 whitespace-pre-wrap">{this.state.error?.toString()}</p>
                {this.state.errorInfo && (
                  <p className="text-xs mt-1 whitespace-pre-wrap">{this.state.errorInfo.componentStack}</p>
                )}
              </details>
            </>
          )}
          <button 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            刷新页面
          </button>
        </div>
      );
    }

    // 正常情况下，渲染子组件树
    return this.props.children;
  }
}