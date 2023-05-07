import mitt from 'mitt';

type Events = {
  scrollToPage: { pageNo: number; time: number };
  cleanChat?: null;
  refreshFileList?: null;
};

const eventEmitter = mitt<Events>();

export default eventEmitter;
