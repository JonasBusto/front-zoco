import { Route, Routes } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';
import { Layout } from '../components/structure/Layout';
import { UploadUser } from '../pages/users/UploadUser';
import { StudyList } from '../pages/studies/Studies';
import { UploadStudy } from '../pages/studies/UploadStudy';
import { DirectionList } from '../pages/directions/Directions';
import { UploadDirection } from '../pages/directions/UploadDirection';
import { Error } from '../pages/Error';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PrivateRoutes allowedRoles={['admin', 'user']} />}>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={<Home />} />
        </Route>
      </Route>
      <Route element={<PrivateRoutes allowedRoles={['admin']} />}>
        <Route element={<Layout />}>
          <Route path='/directions' element={<DirectionList />} />
          <Route path='/directions/upload' element={<UploadDirection />} />
          <Route path='/directions/upload/:id' element={<UploadDirection />} />
          <Route path='/studies' element={<StudyList />} />
          <Route path='/studies/upload' element={<UploadStudy />} />
          <Route path='/studies/upload/:id' element={<UploadStudy />} />
          <Route path='/users/upload' element={<UploadUser />} />
          <Route path='/users/upload/:id' element={<UploadUser />} />
        </Route>
      </Route>
      <Route element={<PublicRoutes />}>
        <Route path='/login' element={<Login />} />
      </Route>
      <Route path='*' element={<Error />} />
    </Routes>
  );
}
