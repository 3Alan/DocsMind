import { Menu } from 'antd';
import { RobotOutlined, UploadOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const menuItem = [
  {
    key: '/',
    icon: <RobotOutlined />
  },
  {
    key: '/upload',
    label: <UploadOutlined />
  }
];

export default function SideMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(location.pathname);

  const onItemClick = (item: any) => {
    setActiveKey(item.key);
    navigate(item.key);
  };

  return (
    <Menu
      selectedKeys={[activeKey]}
      onClick={onItemClick}
      style={{ width: 54 }}
      defaultSelectedKeys={['/']}
      mode="inline"
      items={menuItem}
    />
  );
}
