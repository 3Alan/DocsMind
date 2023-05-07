import { FilePdfTwoTone, FileTextTwoTone } from '@ant-design/icons';
import { Card, Space } from 'antd';
import classNames from 'classnames';
import { MouseEventHandler } from 'react';
import FileItem from '../../constants/fileItem';
import isPdf from '../../utils/isPdf';

interface FileCardProps {
  item: FileItem;
  active?: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
}

export default function FileCard({ item, onClick, active }: FileCardProps) {
  return (
    <Card
      bodyStyle={{ padding: '12px 10px' }}
      className={classNames('p-0 text-sm mb-3 cursor-pointer hover:border-blue-500', {
        ['border-blue-50 bg-card-blue']: active
      })}
      onClick={onClick}
    >
      <Space className="flex items-start">
        {isPdf(item.ext) ? <FilePdfTwoTone twoToneColor="#e94847" /> : <FileTextTwoTone />}
        <div>{item.name.split(item.ext)}</div>
      </Space>
    </Card>
  );
}
