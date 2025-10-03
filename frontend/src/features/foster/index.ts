// 导出寄养服务模块的主要功能
import fosterService from './services/fosterService';
import fosterApi from './api/fosterApi';
import fosterReducer from './slice/fosterSlice';
import * as useFostersHooks from './hooks/useFosters';
import useFosterListData from './hooks/useFosterListData';
import useFosterDetailForm from './hooks/useFosterDetailForm';
import useFosterDetail from './hooks/useFosterDetail';
import * as fosterComponents from './components';
import * as fosterUtils from './utils/formatUtils';
import * as fosterActions from './slice/fosterSlice';

// 合并所有hooks
const fosterHooks = {
  ...useFostersHooks,
  useFosterListData,
  useFosterDetailForm,
  useFosterDetail
};

// 导出服务
export { fosterService };

// 导出API
export { fosterApi };

// 导出Reducer
export { fosterReducer };

// 导出Hooks
export { fosterHooks };

export * from './hooks/useFosters';
export { useFosterListData } from './hooks/useFosterListData';
export { useFosterDetailForm } from './hooks/useFosterDetailForm';
export { useFosterDetail } from './hooks/useFosterDetail';

// 导出组件
export { fosterComponents };

export * from './components';


// 导出工具函数
export { fosterUtils };

export * from './utils/formatUtils';

// 导出Actions
export { fosterActions };

export * from './slice/fosterSlice';