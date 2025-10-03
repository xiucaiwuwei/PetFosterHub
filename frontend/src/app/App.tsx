/**
 * 应用入口组件
 */
import { useRoutes } from 'react-router-dom';
import routes from "./routes";
import { Provider } from 'react-redux';
import store, { persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { FavoritesProvider } from '@/lib/contexts/favoritesContext';
import { FosterFavoritesProvider } from '@/features/foster/components/favorites';

export default function App() {
  // 可以自定义loading组件
  const Loading = () => <div>加载中...</div>;

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <FavoritesProvider>
          <FosterFavoritesProvider>
            {useRoutes(routes)}
          </FosterFavoritesProvider>
        </FavoritesProvider>
      </PersistGate>
    </Provider>
  );
}