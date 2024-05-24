import { Route, Routes } from 'react-router-dom';
import { ProductRoutes as ProductRoutesEnum } from './constants';
import { Products } from './Products';
import { ProductManage } from './ProductManage';

function ProductRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/manage/:id?" element={<ProductManage />} />
    </Routes>
  );
}

export { ProductRoutes, ProductRoutesEnum };
