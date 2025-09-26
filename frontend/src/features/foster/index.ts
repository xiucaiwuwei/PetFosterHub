// 导出寄养服务模块的主要功能
import fosterService from './services/fosterService';
import fosterApi from './api/fosterApi';
import fosterReducer from './slice/fosterSlice';
import * as fosterHooks from './hooks/useFosters';
import * as fosterComponents from './components';
import * as fosterTypes from './types';
import * as fosterUtils from './utils/formatUtils';
import * as fosterActions from './slice/fosterSlice';

// 导出服务
export { fosterService };

// 导出API
export { fosterApi };

// 导出Reducer
export { fosterReducer };

// 导出Hooks
export { fosterHooks };

export * from './hooks/useFosters';

// 导出组件
export { fosterComponents };

export * from './components';

// 导出类型
export { fosterTypes };

export * from './types';

// 导出工具函数
export { fosterUtils };

export * from './utils/formatUtils';

// 导出Actions
export { fosterActions };

export * from './slice/fosterSlice';