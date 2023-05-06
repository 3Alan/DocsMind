import { Button, Card, Empty, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ChatWindow from '../components/chatWindow';
import { Link } from 'react-router-dom';
import request from '../utils/request';
import eventEmitter from '../utils/eventEmitter';

interface FileItem {
  name: string;
  path: string;
  ext: string;
}

function removeHighLight() {
  const highLightElements = document.querySelectorAll('.hl-source');
  highLightElements?.forEach((element) => {
    element.classList.remove('hl-source');
  });
}

function addHighLight(chunkId: string, time = 400) {
  removeHighLight();
  const firstElement = document.querySelector(`[data-chunk_id=${chunkId}]`);
  setTimeout(() => {
    firstElement?.scrollIntoView({ behavior: 'smooth' });
  }, time);

  const highLightElements = document.querySelectorAll(`[data-chunk_id=${chunkId}]`);

  highLightElements?.forEach((element) => {
    element.classList.add('hl-source');
  });
}

const Home = () => {
  const htmlRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState<FileItem>();
  const [fileList, setFileList] = useState<FileItem[]>([]);

  useEffect(() => {
    eventEmitter.emit('cleanChat');

    if (htmlRef.current) {
      htmlRef.current.scrollTop = 0;
    }
  }, [currentFile]);

  async function getFileList() {
    const res = await request('/api/file-list');
    setFileList(res.data);

    if (res.data.length > 0) {
      setCurrentFile(res.data[0]);

      setLoading(true);
      const fileRes = await request(`${res.data[0]?.path}`);
      setLoading(false);

      setFile(fileRes.data);
    }
  }

  async function onFileChange(_item: string, option: any) {
    setLoading(true);
    const res = await request(option.value);
    setLoading(false);
    setFile(res.data);
    // TODO:
    setCurrentFile({ name: option.label, path: option.value });
  }

  function handleHighLight(item: any, time?: number) {
    addHighLight(item.extraInfo.chunk_id, time);
  }

  useEffect(() => {
    getFileList();
  }, []);

  return (
    <>
      <Card
        style={{ width: 700 }}
        className="flex flex-col h-full overflow-auto"
        bordered={false}
        bodyStyle={{
          overflow: 'hidden',
          padding: 0,
          height: '100%'
        }}
        headStyle={{
          marginBottom: 2
        }}
        title={
          <div className="flex justify-between">
            <span>
              File:
              <Select
                defaultValue={(fileList[0] as any)?.value}
                options={fileList.map((item) => ({
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
          </div>
        }
      >
        {file ? (
          <div
            ref={htmlRef}
            className="markdown-body h-full overflow-auto relative"
            dangerouslySetInnerHTML={{ __html: file }}
          />
        ) : (
          <Empty
            className="mt-24"
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 60 }}
            description={<span>No uploaded file.</span>}
          >
            <Link to="/upload">
              <Button type="primary">Upload Now</Button>
            </Link>
          </Empty>
        )}
      </Card>

      <ChatWindow
        fileName={currentFile?.name || ''}
        className="flex flex-col"
        onReplyComplete={handleHighLight}
        onSourceClick={(item) => handleHighLight(item, 0)}
      />
    </>
  );
};

export default Home;
