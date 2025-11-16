import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR,
  APP_READY,
  initialize,
  mergeConfig,
  subscribe,
} from '@edx/frontend-platform';
import {
  AppProvider,
  ErrorPage,
} from '@edx/frontend-platform/react';

import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';

import Header from '@edx/frontend-component-header';
import { FooterSlot } from '@edx/frontend-component-footer';
import { ChalixHeaderWithUserPopup } from '@chalix/frontend-component-header';
import { getConfig } from '@edx/frontend-platform';

import messages from './i18n';
import configureStore from './data/configureStore';

import Head from './head/Head';

import AppRoutes from './routes/AppRoutes';

import './index.scss';

const rootNode = createRoot(document.getElementById('root'));
subscribe(APP_READY, async () => {
  // Handler for header navigation
  const handleHeaderNavigation = (tab) => {
    const config = getConfig();
    const lmsBaseUrl = config.LMS_BASE_URL;
    const mfeBaseUrl = config.BASE_URL ;
    const learnerDashboardUrl = `${mfeBaseUrl}/learner-dashboard`;
    
    switch (tab) {
      case 'home':
        window.location.href = lmsBaseUrl;
        break;
      case 'category':
        window.location.href = learnerDashboardUrl;
        break;
      case 'learning':
        window.location.href = lmsBaseUrl;
        break;
      case 'personalize':
        window.location.href = `${learnerDashboardUrl}?tab=personalized`;
        break;
      default:
        break;
    }
  };

  rootNode.render(
    <AppProvider store={configureStore()}>
      <Head />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ChalixHeaderWithUserPopup
          organizationTitle="PHẦN MỀM HỌC TẬP THÔNG MINH DÀNH CHO CÔNG CHỨC, VIÊN CHỨC"
          searchPlaceholder="Nhập từ khóa tìm kiếm"
          baseApiUrl={getConfig().LMS_BASE_URL || ''}
          logoutUrl="/logout"
          onNavigate={handleHeaderNavigation}
        />
        <main id="main" style={{ flex: 1 }}>
          <AppRoutes />
        </main>
        <FooterSlot />
      </div>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  rootNode.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages,
  hydrateAuthenticatedUser: true,
  handlers: {
    config: () => {
      mergeConfig({
        COLLECT_YEAR_OF_BIRTH: process.env.COLLECT_YEAR_OF_BIRTH,
        ENABLE_SKILLS_BUILDER_PROFILE: process.env.ENABLE_SKILLS_BUILDER_PROFILE,
        DISABLE_VISIBILITY_EDITING: process.env.DISABLE_VISIBILITY_EDITING,
      }, 'App loadConfig override handler');
    },
  },
});
