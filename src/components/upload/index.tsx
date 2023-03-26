import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, message, Modal, Spin, Upload } from 'antd';
import { useState } from 'react';

const { Dragger } = Upload;

export default function UploadWithModal() {
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onButtonClick = () => {
    setShowModal(true);
  };

  const onCancelModal = () => {
    setShowModal(false);
  };

  const onUploadChange = (info: any) => {
    setUploading(true);
    const { status } = info.file;
    if (status === 'done') {
      void message.success(`${info.file.name} file uploaded successfully.`);
      setShowModal(false);
      setUploading(false);
    } else if (status === 'error') {
      void message.error(`${info.file.name} file upload failed.`);
      setUploading(false);
    }
  };

  return (
    <>
      <Button icon={<UploadOutlined />} onClick={onButtonClick}></Button>
      <Modal
        open={showModal}
        onCancel={onCancelModal}
        maskClosable={false}
        closable={!uploading}
        okButtonProps={{
          style: { display: 'none' }
        }}
        cancelButtonProps={{
          style: { display: 'none' }
        }}
        bodyStyle={{
          paddingTop: 30
        }}
      >
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
      </Modal>
    </>
  );
}
