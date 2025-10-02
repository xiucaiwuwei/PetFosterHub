import { useRoutes } from 'react-router-dom';
import routes from "./routes";
import { Provider } from 'react-redux';
import store, { persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { FavoritesProvider } from '@/lib/contexts/favoritesContext';
// import LocalStorageViewer from '@/components/ui/feedback/LocalStorageViewer';

export default function App() {
  // 可以自定义loading组件
  const Loading = () => <div>加载中...</div>;

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <FavoritesProvider>
          {useRoutes(routes)}
        </FavoritesProvider>
      </PersistGate>
      {/*/!* 右下角的本地存储查看器 *!/*/}
      {/*<div className="fixed bottom-4 right-4 z-50">*/}
      {/*  <LocalStorageViewer />*/}
      {/*</div>*/}
    </Provider>
  );
}