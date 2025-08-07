/* eslint-disable no-console */
import { NextRouter } from 'next/router';

let router: NextRouter;

export const setRouter = (r: NextRouter) => {
  router = r;
};

export const redirect = (url: string) => {
  if (router) {
    router.push(url);
  } else {
    console.warn('Router not set. Falling back to window.location.href');
    window.location.href = url;
  }
};
