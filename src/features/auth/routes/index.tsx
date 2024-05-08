import { Route, Routes } from 'react-router-dom';
import { Login } from './Login';
import { PasswordRecovery } from './PasswordRecovery';
import { ResetPassword } from './ResetPassword';
import { AuthRoutes as AuthRoutesEnum } from './constants';

function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<PasswordRecovery />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}

export { AuthRoutes, AuthRoutesEnum };
