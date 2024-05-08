import { Route, Routes } from 'react-router-dom';
import { Authenticated } from '@/components/Routers';
import { CategoriesRoutes as CategoriesRoutesEnum } from './constants';
import { Categories } from './Categories';
import { CategoryManage } from './CategoryManage';

function CategoriesRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Authenticated element={<Categories />} />} />
      <Route path="/manage/:id?" element={<Authenticated element={<CategoryManage />} />} />
    </Routes>
  );
}

export { CategoriesRoutes, CategoriesRoutesEnum };
