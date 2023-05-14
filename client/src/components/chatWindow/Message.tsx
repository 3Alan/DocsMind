import { DollarOutlined, HighlightOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { FC, MouseEvent, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { MessageItem } from './constants';
import Loading from './Loading';
import { isEmpty, isString } from 'lodash';
import { Collapse, Space, Tooltip } from 'antd';

const { Panel } = Collapse;

interface MessageProps extends PropsWithChildren {
  isQuestion?: boolean;
  loading?: boolean;
  text: ReactNode;
  item?: MessageItem;
  chunkIdList?: number[];
  error?: boolean;
  onSourceClick?: (data: any) => void;
}

const Message: FC<MessageProps> = ({
  text = '',
  isQuestion,
  item,
  loading,
  error,
  onSourceClick
}) => {
  const [words, setWords] = useState<string[]>([]);
  const [showSources, setShowSources] = useState<boolean>(false);

  useEffect(() => {
    if (!error && isString(text)) {
      setWords(text.split(' '));
    }
  }, [text]);

  if (loading) {
    return <Loading />;
  }

  function handleSourceClick(e: MouseEvent, item: any) {
    e.stopPropagation();
    onSourceClick?.(item);
  }

  function toggleShowSource() {
    setShowSources(!showSources);
  }

  return (
    <div
      className={classNames('flex flex-col pt-2 mb-5', {
        ['self-end']: isQuestion,
        ['w-full']: !isQuestion
      })}
    >
      <div
        className={classNames('flex mb-1 justify-between', {
          ['self-end']: isQuestion
        })}
      >
        <Space className="text-gray-400">
          <strong className="text-gray-400 pr-2 ">{isQuestion ? 'You' : 'AI'}</strong>

          {item?.cost && (
            <Tooltip title={`Estimated cost ${item.cost} tokens`}>
              <span className="cursor-pointer">
                <DollarOutlined /> cost
              </span>
            </Tooltip>
          )}
        </Space>

        {!isEmpty(item?.sources) && (
          <div
            className="cursor-pointer text-gray-400 text-xs items-center flex"
            onClick={toggleShowSource}
          >
            {showSources ? 'Hide Sources' : 'Show Source'}
          </div>
        )}
      </div>

      {showSources && (
        <Collapse accordion expandIconPosition="end" size="small" className="mb-3">
          {item?.sources?.map((item, index) => (
            <Panel
              header={`Source ${index + 1}`}
              key={index + 1}
              extra={
                <HighlightOutlined
                  className="text-gray-400 hover:text-gray-800"
                  onClick={(e) => handleSourceClick(e, item)}
                />
              }
            >
              {item.text}
            </Panel>
          ))}
        </Collapse>
      )}

      <div
        className={classNames(
          'flex flex-col pt-2 shadow rounded-lg mb-5 whitespace-pre-wrap',
          isQuestion ? 'bg-blue-500 self-end text-white' : 'bg-blue-50 w-full'
        )}
      >
        {isQuestion ? (
          <div className="px-3 pb-2">{text}</div>
        ) : (
          <div className="px-3 pb-2 text-gray-800">
            {error && text}
            {words.map((word, index) => (
              <span key={index}>{word} </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
