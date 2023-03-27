import { WarningTwoTone } from '@ant-design/icons';
import { Card, Form, Input, message, Modal, Tag } from 'antd';
import axios, { AxiosResponse } from 'axios';
import { FC, Fragment, useEffect, useRef, useState } from 'react';
import request from '../../utils/request';
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
            index: fileName
          }
        });
      } else {
        res = await request('/api/query', {
          params: {
            query: value,
            index: fileName
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

  const onSearch = async (value: string) => {
    setQuery('');
    setMessageList([...messageList, { question: value.trim() }, { reply: '' }]);
    scrollToBottom();
    onReply(value);
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
        <Input.Search
          enterButton="Ask Question"
          size="large"
          value={query}
          placeholder="Input your question"
          allowClear
          loading={loading}
          onChange={e => setQuery(e.target.value)}
          onSearch={onSearch}
        />
      </div>
    </Card>
  );
};

export default ChatWindow;
