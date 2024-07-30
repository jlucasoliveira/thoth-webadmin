import { Route, Routes } from 'react-router-dom';
import { ClientRoutes as ClientRoutesEnum } from './constants';
import { Clients } from './Clients';
import { ClientManage } from './ClientManage';

function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Clients />} />
      <Route path="/manage/:id?" element={<ClientManage />} />
    </Routes>
  );
}

export { ClientRoutes, ClientRoutesEnum };
