import { Form, Input, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';

export default function KeyModal() {
  const settings = useRef<any>(null);
  const [form] = Form.useForm();
  const [showSettingModal, setShowSettingModal] = useState(false);

  useEffect(() => {
    const localSettings = JSON.parse(localStorage.getItem('settings') as string);
    if (!localSettings) {
      setShowSettingModal(true);
    } else {
      settings.current = localSettings;
    }
  }, [showSettingModal]);

  const onSaveSettings = () => {
    form
      .validateFields()
      .then((values) => {
        localStorage.setItem('settings', JSON.stringify(values));
        setShowSettingModal(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Settings"
      open={showSettingModal}
      onOk={onSaveSettings}
      onCancel={() => setShowSettingModal(false)}
    >
      <Form
        form={form}
        initialValues={{
          apiKey: settings.current?.apiKey
        }}
      >
        <Form.Item
          label="apiKey"
          name="apiKey"
          rules={[{ required: true, message: 'Please input your apiKey!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
