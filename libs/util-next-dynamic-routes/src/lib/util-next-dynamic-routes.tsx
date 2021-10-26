import { GetStaticPaths, GetStaticProps } from 'next';

/*
 * NOTE: getStaticPaths with `fallback: true` is required to serve dynamic, yet unknown, routes
 * on Netlify (and getStaticProps is required when using getStaticPaths).
 *
 * See https://explorers.netlify.com/learn/nextjs/nextjs-ssr-non
 */
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: true,
});
export const getStaticProps: GetStaticProps = async () => ({ props: {} });
