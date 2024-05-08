import { Route, Routes } from 'react-router-dom';
import { Authenticated } from '@/components/Routers';
import { BrandsRoutes as BrandsRoutesEnum } from './constants';
import { Brands } from './Brands';
import { BrandManage } from './BrandManage';

function BrandsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Authenticated element={<Brands />} />} />
      <Route path="/manage/:id?" element={<Authenticated element={<BrandManage />} />} />
    </Routes>
  );
}

export { BrandsRoutes, BrandsRoutesEnum };
