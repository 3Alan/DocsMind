import './styles/globals.scss';
import 'github-markdown-css/github-markdown-light.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routes from './routes';
import SideMenu from './components/sideMenu';
import SettingsModal from './components/settingsModal';
import { useEffect, useState } from 'react';
import request from './utils/request';
import FileItem from './constants/fileItem';
import { CurrentFileContext } from './context/currentFile';
import eventEmitter from './utils/eventEmitter';

const App = () => {
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [showSettingModal, setShowSettingModal] = useState(false);

  async function getFileList() {
    const res = await request('/api/file-list');
    setFileList(res.data);

    if (res.data.length > 0) {
      setCurrentFile(res.data[0]);
    }
  }

  function handleFileClick(item: any) {
    const file = fileList.find((f) => f.name === item.name) || null;
    setCurrentFile(file);
  }

  function toggleSettingModal(open: boolean) {
    setShowSettingModal(open);
  }

  useEffect(() => {
    getFileList();

    eventEmitter.on('refreshFileList', getFileList);
    return () => {
      eventEmitter.off('refreshFileList', getFileList);
    };
  }, []);

  return (
    <BrowserRouter>
      <main className="bg-slate-100 h-screen flex">
        <SideMenu
          onFileClick={handleFileClick}
          fileList={fileList}
          activeFile={currentFile?.name || ''}
          onOpenSetting={() => toggleSettingModal(true)}
        />
        <SettingsModal open={showSettingModal} onChange={toggleSettingModal} />
        <div className="flex flex-1 h-full overflow-hidden">
          <CurrentFileContext.Provider value={currentFile}>
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
          </CurrentFileContext.Provider>
        </div>
      </main>
    </BrowserRouter>
  );
};

export default App;
