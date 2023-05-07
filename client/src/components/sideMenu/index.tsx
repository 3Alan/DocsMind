import { Alert, Button, Divider } from 'antd';
import FileItem from '../../constants/fileItem';
import FileCard from '../fileCard';
import FileUpload from '../upload';

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
              <a href="https://github.com/3Alan/chat-markdown" target="__blank">
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

      <Button onClick={onOpenSetting}>Setting</Button>
    </div>
  );
}
