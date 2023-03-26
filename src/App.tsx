import { Card, Select } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ChatWindow from './components/chatWindow';
import UploadWithModal from './components/upload';
import { invoke } from '@tauri-apps/api/tauri';
import './styles/globals.css';
import 'github-markdown-css';

interface FileItem {
  name: string;
  path: string;
}

function removeHighLight() {
  const highLightElements = document.querySelectorAll('.highlight');
  highLightElements?.forEach(element => {
    element.classList.remove('highlight');
  });
}

function addHighLight(chunkId: string, time = 1000) {
  removeHighLight();
  const firstElement = document.querySelector(`[data-chunk_id=${chunkId}]`);
  setTimeout(() => {
    firstElement?.scrollIntoView({ behavior: 'smooth' });
  }, time);

  const highLightElements = document.querySelectorAll(`[data-chunk_id=${chunkId}]`);

  highLightElements?.forEach(element => {
    element.classList.add('highlight');
  });
}

const Home = () => {
  const [html, setHtml] = useState('');
  const [currentFile, setCurrentFile] = useState<FileItem>();
  const [fileList, setFileList] = useState<FileItem[]>([]);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    await invoke('greet', { name: 'Alan' });
  }

  async function getFileList() {
    const res = await axios('http://127.0.0.1:5000/api/html-list');
    setFileList(res.data);

    if (res.data.length > 0) {
      setCurrentFile(res.data[0]);
      const htmlRes = await axios(`http://127.0.0.1:5000/${res.data[0]?.path}`);
      setHtml(htmlRes.data);
    }
  }

  async function onFileChange(_item: string, option: any) {
    const res = await axios(`http://127.0.0.1:5000/${option.value}`);
    setHtml(res.data);
    setCurrentFile({ name: option.label, path: option.value });
  }

  function onReplyComplete(data: any, time?: number) {
    const { sources } = data;
    for (const item of sources) {
      addHighLight(item.extraInfo.chunk_id, time);
    }
  }

  useEffect(() => {
    getFileList();
  }, []);

  return (
    <main className="bg-slate-100 py-4 h-screen">
      <div className="flex flex-row justify-center m-auto w-5/6 space-x-4 h-full overflow-hidden">
        <ChatWindow
          fileName={currentFile?.name!}
          className="flex flex-col h-full overflow-hidden"
          onReplyComplete={onReplyComplete}
          onReplyClick={data => onReplyComplete(data, 0)}
        />

        <Card
          style={{ width: 700 }}
          className="flex flex-col h-full overflow-auto scroll-smooth"
          bodyStyle={{
            overflow: 'hidden',
            padding: 0
          }}
          title={
            <div className="flex justify-between">
              <span>
                File:
                <Select
                  defaultValue={(fileList[0] as any)?.value}
                  options={fileList.map(item => ({
                    label: item.name,
                    value: item.path
                  }))}
                  value={currentFile?.path}
                  style={{
                    width: 200,
                    marginLeft: 5
                  }}
                  onChange={onFileChange}
                ></Select>
              </span>

              <UploadWithModal />
            </div>
          }
        >
          {html && (
            <div
              className="markdown-body h-full overflow-auto scroll-smooth"
              dangerouslySetInnerHTML={{ __html: html }}
            ></div>
          )}
        </Card>
      </div>
    </main>
  );
};

export default Home;
