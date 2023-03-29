import { Button, Card, Empty, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import ChatWindow from '../components/chatWindow';
import { Link } from 'react-router-dom';
import request from '../utils/request';

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

function addHighLight(chunkId: string, time = 400) {
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
  const [loading] = message.useMessage();

  async function getFileList() {
    loading.loading('loading...');
    const res = await request('/api/html-list');
    loading.destroy();
    setFileList(res.data);

    if (res.data.length > 0) {
      setCurrentFile(res.data[0]);
      const htmlRes = await request(`${res.data[0]?.path}`);

      setHtml(htmlRes.data);
    }
  }

  async function onFileChange(_item: string, option: any) {
    const res = await request(option.value);
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
          </div>
        }
      >
        {html ? (
          <div
            className="markdown-body h-full overflow-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
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
        fileName={currentFile?.name!}
        className="flex flex-col"
        onReplyComplete={onReplyComplete}
        onReplyClick={data => onReplyComplete(data, 0)}
      />
    </>
  );
};

export default Home;
