import { InboxOutlined } from '@ant-design/icons';
import { Card, message, Spin, Upload } from 'antd';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

const { Dragger } = Upload;

function generateConfetti() {
  confetti({
    spread: 90,
    particleCount: 80,
    origin: { y: 0.5 },
    ticks: 300
  });
}

export default function UploadFile() {
  const [uploading, setUploading] = useState(false);

  const onUploadChange = (info: any) => {
    setUploading(true);
    const { status } = info.file;
    if (status === 'done' || status === 'success') {
      generateConfetti();
      void message.success({
        content: `${info.file.name} file uploaded successfully. token usage: 💰 ${info.file.response}`,
        duration: 8
      });
      setUploading(false);
    } else if (status === 'error') {
      void message.error(`${info.file.name} file upload failed. ${JSON.stringify(info.file.response)}`);
      setUploading(false);
    }
  };

  return (
    <Card title="Upload File" className="w-full">
      <Spin spinning={uploading}>
        <Dragger
          action="http://127.0.0.1:5000/api/upload"
          multiple={false}
          showUploadList={false}
          name="file"
          accept=".md"
          onChange={onUploadChange}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support markdown file</p>
        </Dragger>
      </Spin>
    </Card>
  );
}
