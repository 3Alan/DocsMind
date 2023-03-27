import Home from './pages/Home';
import UploadFile from './pages/Upload';

const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/upload',
    element: <UploadFile />
  }
];

export default routes;
