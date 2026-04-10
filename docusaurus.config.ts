import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Insightech React Native SDK',
  tagline: 'Session replay, heatmaps, and analytics for React Native apps',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://insightechprojects.github.io',
  baseUrl: '/react-native-sdk-docs/',

  organizationName: 'InsightechProjects',
  projectName: 'react-native-sdk-docs',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Insightech React Native SDK',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://www.insightech.com',
          label: 'Insightech',
          position: 'right',
        },
        {
          href: 'https://support.insightech.com',
          label: 'Support',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Getting Started', to: '/' },
            { label: 'Configuration', to: '/configuration' },
            { label: 'API Reference', to: '/api-reference' },
          ],
        },
        {
          title: 'Insightech',
          items: [
            { label: 'Website', href: 'https://www.insightech.com' },
            { label: 'Dashboard', href: 'https://app.insightech.com' },
            { label: 'Support', href: 'https://support.insightech.com' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Insightech. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
