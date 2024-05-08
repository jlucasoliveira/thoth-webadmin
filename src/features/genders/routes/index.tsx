import { Route, Routes } from 'react-router-dom';
import { Authenticated } from '@/components/Routers';
import { GendersRoutes as GendersRoutesEnum } from './constants';
import { Genders } from './Genders';
import { GenderManage } from './GenderManage';

function GendersRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Authenticated element={<Genders />} />} />
      <Route path="/manage/:id?" element={<Authenticated element={<GenderManage />} />} />
    </Routes>
  );
}

export { GendersRoutes, GendersRoutesEnum };
