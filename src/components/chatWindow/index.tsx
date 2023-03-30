import { SendOutlined, WarningTwoTone } from '@ant-design/icons';
import { Button, Card, Input } from 'antd';
import { AxiosResponse } from 'axios';
import { FC, Fragment, useEffect, useRef, useState } from 'react';
import eventEmitter from '../../utils/eventEmitter';
import request from '../../utils/request';
import useOpenAiKey from '../../utils/useOpenAiKey';
import { MessageItem } from './constants';
import Message from './Message';

interface ChatWindowProps {
  fileName: string;
  className?: string;
  onReplyComplete: (data: any) => void;
  onReplyClick: (data: any) => void;
}

const ChatWindow: FC<ChatWindowProps> = ({
  fileName,
  className,
  onReplyComplete,
  onReplyClick
}) => {
  const chatWindowEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [messageList, setMessageList] = useState<MessageItem[]>([]);
  const openAiKey = useOpenAiKey();

  function cleanChat() {
    setMessageList([]);
  }

  useEffect(() => {
    eventEmitter.on('cleanChat', cleanChat);

    return () => {
      eventEmitter.off('cleanChat', cleanChat);
    };
  }, []);

  const scrollToBottom = () => {
    const chatWindowEnd = chatWindowEndRef.current;

    if (chatWindowEnd) {
      setTimeout(() => {
        chatWindowEnd.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const onReply = async (value: string, summarize = false) => {
    try {
      let res: AxiosResponse;
      setLoading(true);

      if (summarize) {
        res = await request('/api/summarize', {
          params: {
            index: fileName,
            openAiKey
          }
        });
      } else {
        res = await request('/api/query', {
          params: {
            query: value,
            index: fileName,
            openAiKey
          }
        });
      }

      setLoading(false);
      setMessageList(pre => {
        return [
          ...pre.slice(0, -1),
          {
            ...pre.slice(-1),
            reply: res.data.answer,
            ...res.data
          }
        ];
      });
      onReplyComplete(res.data);
      scrollToBottom();
    } catch (error) {
      setLoading(false);
      setMessageList(pre => {
        return [
          ...pre.slice(0, -1),
          {
            ...pre.slice(-1),
            reply: (
              <>
                <WarningTwoTone /> please retry
              </>
            ),
            error: true
          }
        ];
      });
      console.log(error);
    }
  };

  const onSearch = async () => {
    setQuery('');
    setMessageList([...messageList, { question: query }, { reply: '' }]);
    scrollToBottom();
    onReply(query);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    console.log(e.isComposing, e.shiftKey, e.key);

    if (e.isComposing || e.shiftKey) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  const onSummarize = async () => {
    setMessageList([...messageList, { question: 'Summarize the Markdown Content' }, { reply: '' }]);
    scrollToBottom();
    onReply('', true);
  };

  return (
    <Card
      style={{ width: 450 }}
      className={className}
      bodyStyle={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0'
      }}
      title={fileName ? `Chat with ${fileName}` : 'Select File'}
      bordered={false}
    >
      <div className="flex flex-col items-start flex-1 overflow-auto px-6">
        {messageList.map((item, index) => (
          <Fragment key={index}>
            {item.question ? (
              <Message isQuestion text={item.question} />
            ) : (
              <Message
                loading={loading && index === messageList.length - 1}
                item={item}
                text={item.reply || ''}
                onReplyClick={onReplyClick}
                error={item.error}
              />
            )}
          </Fragment>
        ))}

        <div ref={chatWindowEndRef}></div>
      </div>

      <div className="p-4 pb-0 border-t border-t-gray-200 border-solid border-x-0 border-b-0">
        {/* <div className="pb-1 pt-2">
          <Tag onClick={onSummarize} className="cursor-pointer" color="blue">
            Summarize Markdown
          </Tag>
        </div> */}
        <div className="relative">
          <Input.TextArea
            size="large"
            placeholder="Input your question"
            value={query}
            className="pr-[36px]"
            // @ts-ignore
            onKeyDown={onKeyDown}
            autoSize
            onChange={e => setQuery(e.target.value)}
          />
          <Button
            style={{ width: 32 }}
            size="small"
            type="text"
            className="absolute right-1 top-2"
            icon={<SendOutlined style={{ color: '#3f95ff' }} />}
            onClick={onSearch}
          ></Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatWindow;
