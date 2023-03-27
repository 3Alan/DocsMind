import { HighlightOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { MessageItem } from './constants';
import Loading from './Loading';
import { isString } from 'lodash';

interface MessageProps extends PropsWithChildren {
  isQuestion?: boolean;
  loading?: boolean;
  text: ReactNode;
  item?: MessageItem;
  chunkIdList?: number[];
  error?: boolean;
  onReplyClick?: (data: any) => void;
}

const Message: FC<MessageProps> = ({
  text = '',
  isQuestion,
  item,
  loading,
  error,
  onReplyClick
}) => {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    if (!error && isString(text)) {
      setWords(text.split(' '));
    }
  }, [text]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      className={classNames(
        'flex flex-col pt-2 shadow rounded-lg max-w-md mb-5',
        isQuestion ? 'bg-blue-500 self-end text-white' : 'bg-blue-50'
      )}
    >
      {isQuestion ? (
        <div className="px-3 pb-2">{text}</div>
      ) : (
        <div className="px-3 pb-2 text-gray-800">
          {error && text}
          {words.map((word, index) => (
            <span
              key={index}
              className="text-gray-800 animate-fade-in"
              style={{ animationDelay: `${index * 0.01}s` }}
            >
              {word}{' '}
            </span>
          ))}
        </div>
      )}

      {(item?.sources || item?.cost) && (
        <div className="flex px-3 pt-2 pb-2 border-t-gray-200 border-t items-center justify-between">
          {item?.sources && (
            <HighlightOutlined className=" text-gray-400" onClick={() => onReplyClick?.(item)} />
          )}

          {item?.cost && (
            <div className=" border-t-gray-200 border-t text-right">
              <span className=" text-gray-400">cost {item.cost} tokens</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Message;
