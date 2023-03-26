import { Button, Card, Form, Input, message, Modal } from 'antd';
import axios from 'axios';
import { FC, Fragment, useEffect, useRef, useState } from 'react';
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
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [messageList, setMessageList] = useState<MessageItem[]>([]);

  const scrollToBottom = () => {
    setTimeout(() => {
      const chatWindow = chatWindowRef.current;

      if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight + 300;
      }
    }, 0);
  };

  const onReply = async (value: string) => {
    try {
      setLoading(true);

      const res = await axios(`http://127.0.0.1:5000/api/query`, {
        params: {
          query: value,
          index: fileName
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(res);

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
      scrollToBottom();
      onReplyComplete(res.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onSearch = async (value: string) => {
    setQuery('');
    setMessageList([...messageList, { question: value.trim() }, { reply: '' }]);
    scrollToBottom();
    onReply(value);
  };

  return (
    <>
      <Card
        style={{ width: 500 }}
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
        <div
          ref={chatWindowRef}
          className="scroll-smooth flex flex-col items-start flex-1 overflow-auto px-6"
        >
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
                />
              )}
            </Fragment>
          ))}
        </div>

        <div className="p-4 pb-0 border-t border-t-gray-200 border-solid border-x-0 border-b-0">
          <Input.Search
            enterButton="Ask Question"
            size="large"
            value={query}
            placeholder="input your question"
            allowClear
            loading={loading}
            onChange={e => setQuery(e.target.value)}
            onSearch={onSearch}
          />
        </div>
      </Card>
    </>
  );
};

export default ChatWindow;
