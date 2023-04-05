import { ProfileOutlined, SendOutlined, WarningTwoTone } from '@ant-design/icons';
import { Button, Card, Input, Popconfirm, Tooltip } from 'antd';
import { AxiosResponse } from 'axios';
import { isEmpty } from 'lodash';
import { FC, Fragment, KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

  useLayoutEffect(() => {
    // TODO: bug
    scrollToBottom();
  }, [messageList]);

  const scrollToBottom = (delay = false) => {
    const chatWindowEnd = chatWindowEndRef.current;

    if (chatWindowEnd) {
      if (delay) {
        setTimeout(() => {
          chatWindowEnd.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        chatWindowEnd.scrollIntoView({ behavior: 'smooth' });
      }
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
          },
          responseType: 'stream'
        });
      } else {
        // TODO: axios
        fetch(
          `http://127.0.0.1:5000/api/query?query=${value}&index=${fileName}&openAiKey=${openAiKey}`
        )
          .then(async (response) => {
            setLoading(false);
            const reader = response?.body?.getReader() as ReadableStreamDefaultReader;

            const decoder = new TextDecoder();
            let done = false;
            let metaData: any;

            while (!done) {
              const { value, done: doneReading } = await reader.read();

              done = doneReading;
              const chunkValue = decoder.decode(value);
              const hasMeta = chunkValue.includes('\n ###endjson### \n\n');
              if (hasMeta) {
                const [metaDataStr, message] = chunkValue.split('\n ###endjson### \n\n');
                metaData = JSON.parse(metaDataStr);

                // TODO: bug
                setMessageList((pre) => {
                  return [
                    ...pre.slice(0, -1),
                    {
                      ...pre.slice(-1),
                      reply: pre.slice(-1)[0].reply + message
                    }
                  ];
                });
              } else {
                setMessageList((pre) => {
                  return [
                    ...pre.slice(0, -1),
                    {
                      ...pre.slice(-1),
                      reply: pre.slice(-1)[0].reply + chunkValue
                    }
                  ];
                });
              }
            }

            // setMessageList((pre) => {
            //   console.log(pre.slice(0, -1), pre.slice(-1));

            //   return [
            //     ...pre.slice(0, -1),
            //     {
            //       ...pre.slice(-1),
            //       cost: metaData.cost,
            //       sources: metaData.sources
            //     }
            //   ];
            // });
            onReplyComplete({ sources: metaData?.sources });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } catch (error) {
      setLoading(false);
      setMessageList((pre) => {
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
    // scrollToBottom();
    onReply(query);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.shiftKey) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  const onSummarize = async () => {
    setMessageList([...messageList, { question: 'Summarize the Document' }, { reply: '' }]);
    // scrollToBottom();
    onReply('', true);
  };

  const onSummarizeClick = () => {
    if (!isEmpty(fileName)) {
      onSummarize();
    }
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
      extra={
        <Popconfirm
          title="This will consume a large amount of tokens"
          description="Do you want to continue?"
          okText="Yes"
          cancelText="No"
          onConfirm={onSummarizeClick}
        >
          <Tooltip title="Summarize">
            <Button icon={<ProfileOutlined />}></Button>
          </Tooltip>
        </Popconfirm>
      }
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
            onKeyDown={onKeyDown}
            autoSize
            onChange={(e) => setQuery(e.target.value)}
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
