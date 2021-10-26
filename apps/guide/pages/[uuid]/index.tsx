import { Calendar } from 'phosphor-react';

export { getStaticPaths, getStaticProps } from '@issue-demo/util-next-dynamic-routes';

export const DemoPage = () => {
  return (
    <div>
      <Calendar size="16" weight="fill" />
    </div>
  );
};

export default DemoPage;
