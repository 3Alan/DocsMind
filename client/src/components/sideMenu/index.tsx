import { Alert, Button, Divider, Space } from 'antd';
import FileItem from '../../constants/fileItem';
import FileCard from '../fileCard';
import FileUpload from '../upload';
import { GithubOutlined, SettingOutlined } from '@ant-design/icons';

interface SideMenuProps {
  fileList: FileItem[];
  activeFile: string;
  onFileClick: (item: FileItem) => void;
  onOpenSetting: () => void;
}

const disableUpload = import.meta.env.VITE_DISABLED_UPLOAD;

export default function SideMenu({
  fileList,
  onFileClick,
  activeFile,
  onOpenSetting
}: SideMenuProps) {
  return (
    <div className="flex flex-col w-[250px] h-full  bg-white py-4 px-2 justify-between">
      <div className="flex-1 overflow-auto">
        {fileList.map((item) => (
          <FileCard
            key={item.name}
            active={activeFile === item.name}
            onClick={() => onFileClick(item)}
            item={item}
          />
        ))}
      </div>

      <Divider />

      {disableUpload ? (
        <Alert
          type="warning"
          description={
            <>
              The upload is not available on the current website. You can
              <a href="https://github.com/3Alan/DocsMind" target="__blank">
                {' '}
                fork and clone the project{' '}
              </a>
              to your local device to complete the upload.
            </>
          }
        />
      ) : (
        <FileUpload />
      )}

      <div className="mt-2 flex justify-between items-center">
        <span className="text-xs text-gray-500">Made by Alan</span>

        <Space>
          <Button
            href="https://github.com/3Alan/DocsMind"
            target="__blank"
            icon={<GithubOutlined />}
          ></Button>
          <Button icon={<SettingOutlined />} onClick={onOpenSetting}></Button>
        </Space>
      </div>
    </div>
  );
}
