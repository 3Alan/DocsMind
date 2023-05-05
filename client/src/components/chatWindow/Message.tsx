import { HighlightOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { MessageItem } from './constants';
import Loading from './Loading';
import { isEmpty, isString } from 'lodash';
import { Collapse } from 'antd';

const { Panel } = Collapse;

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
        'flex flex-col pt-2 shadow rounded-lg max-w-md mb-5 whitespace-pre-wrap',
        isQuestion ? 'bg-blue-500 self-end text-white' : 'bg-blue-50'
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

      {(item?.sources || item?.cost) && (
        <div className="flex px-3 pt-2 pb-2 border-t-gray-200 border-t justify-between">
          {!isEmpty(item?.sources) && (
            <HighlightOutlined className=" text-gray-400" onClick={() => onReplyClick?.(item)} />
          )}

          <Collapse bordered={false} expandIconPosition="end" ghost>
            {item.sources?.map((item, index) => (
              <Panel header={`Source ${index + 1}`} key={index + 1}>
                {item.text}
              </Panel>
            ))}
          </Collapse>

          {item?.cost && (
            <div className=" border-t-gray-200 border-t text-right">
              <span className=" text-gray-400">Estimated {item.cost} tokens</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Message;
