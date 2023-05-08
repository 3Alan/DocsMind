import { InboxOutlined } from '@ant-design/icons';
import { message, Spin, Upload } from 'antd';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import { baseURL } from '../../utils/request';
import useOpenAiKey from '../../utils/useOpenAiKey';
import eventEmitter from '../../utils/eventEmitter';

const { Dragger } = Upload;

function generateConfetti() {
  confetti({
    spread: 90,
    particleCount: 80,
    origin: { y: 0.5 },
    ticks: 300
  });
}

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const openAiKey = useOpenAiKey();

  const onUploadChange = (info: any) => {
    setUploading(true);
    const { status } = info.file;
    if (status === 'done' || status === 'success') {
      generateConfetti();
      void message.success({
        content: `${info.file.name} file uploaded successfully. token usage: 💰 ${info.file.response}`,
        duration: 8
      });
      eventEmitter.emit('refreshFileList');
      setUploading(false);
    } else if (status === 'error') {
      void message.error(
        `${info.file.name} file upload failed. ${JSON.stringify(info.file.response)}`
      );
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <Spin spinning={uploading}>
        <Dragger
          action={`${baseURL}/api/upload`}
          data={{ openAiKey }}
          multiple={false}
          showUploadList={false}
          name="file"
          accept=".md,.pdf"
          onChange={onUploadChange}
          disabled={!openAiKey}
        >
          <p className="text-blue-500">
            <InboxOutlined style={{ fontSize: 32 }} />
          </p>
          <p className="text-sm">Click or drag file to this area to upload</p>
          <p className="text-xs text-gray-400">Support .md,.pdf</p>
        </Dragger>
      </Spin>
    </div>
  );
}
