import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ConfigProvider } from 'antd';
import getPageTitle from '../client/core/utils/getPageTitle';
import useStores from '../client/core/mobx/useStores';
import trpc from '../utils/trpc';
import 'antd/dist/reset.css';

function MyApp({ Component, pageProps }: AppProps) {
  const { authStore } = useStores();

  const trpcCtx = trpc.useContext();

  useEffect(() => {
    const getMyAccount = async () => {
      try {
        const myAccount = await trpcCtx.base.myAccount.fetch();
        authStore.setMyAccount(myAccount);
      } catch (error) {
        // do nothing
      }
    };
    getMyAccount();
  }, []);

  return (
    <>
      <Head>
        <title>{getPageTitle()}</title>
        <meta name="viewport" content="user-scalable=0, initial-scale=1 minimum-scale=1, width=device-width, height=device-height" />
      </Head>
      <ConfigProvider theme={{
        token: {
          colorPrimary: '#0f52ba',
        },
      }}
      >
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </ConfigProvider>

    </>
  );
}

export default trpc.withTRPC(MyApp);
