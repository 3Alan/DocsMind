import { Form, Input, Modal } from 'antd';
import { useEffect, useRef } from 'react';
import eventEmitter from '../../utils/eventEmitter';

interface SettingsModalProps {
  open: boolean;
  onChange: (open: boolean) => void;
}

export default function SettingsModal({ open, onChange }: SettingsModalProps) {
  const settings = useRef<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const localSettings = JSON.parse(localStorage.getItem('settings') as string);
    settings.current = localSettings;
  }, [open]);

  const onSaveSettings = () => {
    form
      .validateFields()
      .then((values) => {
        localStorage.setItem('settings', JSON.stringify(values));
        onChange(false);
        eventEmitter.emit('refreshSettings');
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal title="Settings" open={open} onOk={onSaveSettings} onCancel={() => onChange(false)}>
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
