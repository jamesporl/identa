import { useContext, useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ConfigProvider } from 'antd';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'styled-components';
import { AUTH_TOKEN_KEY } from 'client/core/utils/storageKeys';
import getPageTitle from 'client/core/utils/getPageTitle';
import { RoleKey } from 'server/mods/base/db/_types';
import AuthContext from 'client/core/mobx/Auth';
import theme from 'client/core/styles/theme';
import trpc from '../utils/trpc';
import 'antd/dist/reset.css';

function MyApp({ Component, pageProps }: AppProps) {
  const authCtx = useContext(AuthContext);

  const trpcCtx = trpc.useContext();

  const router = useRouter();

  useEffect(() => {
    const getMyAccount = async () => {
      try {
        const myAccount = await trpcCtx.base.myAccount.fetch();
        authCtx.setMyAccount(myAccount);
      } catch (error) {
        authCtx.setIsLoadingMyAccount(false);
      }
    };
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (authToken) {
        getMyAccount();
      } else {
        authCtx.setIsLoadingMyAccount(false);
      }
    }
  }, [router.asPath]);

  useEffect(() => {
    const isAppPage = router.asPath.startsWith('/app');
    const isAdminPage = router.asPath.startsWith('/site-admin');
    const isNotPublicPage = isAppPage || isAdminPage;
    if (!authCtx.isLoadingMyAccount) {
      if (authCtx.myAccount) {
        if (authCtx.myAccount.roleKey === RoleKey.admin && isAppPage) {
          router.push('/site-admin');
        } else if (authCtx.myAccount.roleKey === RoleKey.user && isAdminPage) {
          router.push('/app');
        }
      } else if (!isNotPublicPage) {
        router.push('/account/login');
      }
    }
  }, [router.asPath, authCtx.isLoadingMyAccount, authCtx.myAccount]);

  return (
    <>
      <Head>
        <title>{getPageTitle()}</title>
        <meta name="viewport" content="user-scalable=0, initial-scale=1 minimum-scale=1, width=device-width, height=device-height" />
      </Head>
      <ThemeProvider theme={theme}>
        <ConfigProvider theme={{
          token: {
            colorPrimary: '#0f52ba',
          },
          components: {
            Table: {
              borderRadiusLG: 0,
            },
          },
        }}
        >
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </ConfigProvider>
      </ThemeProvider>
    </>
  );
}

export default trpc.withTRPC(MyApp);
