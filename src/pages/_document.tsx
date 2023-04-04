/* eslint-disable react/jsx-props-no-spreading, react/no-array-index-key, react/no-danger */
import Document, {
  DocumentContext, Html, Head, Main, NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { createCache, StyleProvider } from '@ant-design/cssinjs';
import { ReactNode } from 'react';

// Ant design is having issues with SSR
// See https://github.com/ant-design/ant-design/issues/38671#issuecomment-1345686330

const ATTR_TOKEN = 'data-token-hash';
const ATTR_MARK = 'data-css-hash';

type CacheObject = ReturnType<typeof createCache>;

function extractStyle(cache: CacheObject) {
  const styleKeys = Array.from(cache.cache.keys()).filter((key) => key.startsWith('style%'));

  const styleText: ReactNode[] = [];

  styleKeys.forEach((key) => {
    const [styleStr, tokenKey, styleId] = cache.cache.get(key)?.[1] || [];
    styleText.push(
      <style
        key={tokenKey + styleId}
        {...{ [ATTR_TOKEN]: tokenKey, [ATTR_MARK]: styleId }}
        dangerouslySetInnerHTML={{ __html: styleStr }}
      />,
    );
  });

  return styleText;
}

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    const antdCache = createCache();

    try {
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(
          <StyleProvider cache={antdCache}><App {...props} /></StyleProvider>,
        ),
      });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [...extractStyle(antdCache), initialProps.styles, sheet.getStyleElement()],
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const favicons = [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicons/apple-touch-icon.png?v=6',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicons/favicon-32x32.png?v=6',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicons/favicon-16x16.png?v=6',
      },
      {
        rel: 'manifest',
        href: '/favicons/site.webmanifest',
      },
    ];

    const meta = [
      {
        name: 'google-site-verification',
        content: 'todo-gsite-config',
      },
    ];

    return (
      <Html>
        <Head>
          {meta.map((tag, index) => (
            <meta key={index} {...tag} />
          ))}
          {favicons.map((link, index) => (
            <link key={index} {...link} />
          ))}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
