import { Route, Routes } from 'react-router-dom';
import { Authenticated } from '@/components/Routers';
import { BatchRegistration } from './BatchRegistration';
import { Products } from './Products';
import { StockManage } from './StockManage';

function StockRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Authenticated element={<Products />} />} />
      <Route path="/batch" element={<Authenticated element={<BatchRegistration />} />} />
      <Route path="/manage/:id" element={<Authenticated element={<StockManage />} />} />
    </Routes>
  );
}

export { StockRoutes };
