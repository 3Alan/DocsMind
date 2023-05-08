import { Spin } from 'antd';

export default function PageSpin() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Spin delay={500} />
    </div>
  );
}
