import { InboxOutlined } from '@ant-design/icons';
import { Alert, Card, message, Spin, Upload } from 'antd';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import { baseURL } from '../utils/request';
import useOpenAiKey from '../utils/useOpenAiKey';

const { Dragger } = Upload;

const disableUpload = import.meta.env.VITE_DISABLED_UPLOAD;

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
      setUploading(false);
    } else if (status === 'error') {
      void message.error(
        `${info.file.name} file upload failed. ${JSON.stringify(info.file.response)}`
      );
      setUploading(false);
    }
  };

  return (
    <Card title="Upload File" className="w-full">
      {disableUpload && (
        <Alert
          className="mb-6"
          showIcon
          type="warning"
          description={
            <>
              The upload is not available on the current website. You can
              <a href="https://github.com/3Alan/chat-markdown" target="__blank">
                {' '}
                clone the project{' '}
              </a>
              to your local device to complete the upload.
            </>
          }
        />
      )}

      <Spin spinning={uploading}>
        <Dragger
          action={`${baseURL}/api/upload`}
          data={{ openAiKey }}
          multiple={false}
          showUploadList={false}
          name="file"
          accept=".md,.html"
          onChange={onUploadChange}
          disabled={disableUpload}
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
