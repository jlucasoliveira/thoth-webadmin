import { Route, Routes } from 'react-router-dom';
import { OrderRoutes as OrderRoutesEnum } from './constants';
import { Orders } from './Orders';
import { OrderManage } from './OrderManage';

function OrderRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Orders />} />
      <Route path="/manage/:id?" element={<OrderManage />} />
    </Routes>
  );
}

export { OrderRoutes, OrderRoutesEnum };
