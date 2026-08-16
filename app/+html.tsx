import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

const baseUrl = '/my-first-project';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="zh-Hant">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
        />
        <meta name="theme-color" content="#F7F3EC" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cozy Planner" />
        <meta name="application-name" content="Adaptive Cozy Planner" />
        <meta
          name="description"
          content="A cozy AI-assisted planner with your Old English Sheepdog companion."
        />
        <link rel="manifest" href={`${baseUrl}/manifest.webmanifest`} />
        <link rel="apple-touch-icon" href={`${baseUrl}/apple-touch-icon.png`} />
        <link rel="icon" href={`${baseUrl}/icon-192.png`} />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: 'body{background:#F7F3EC}' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

