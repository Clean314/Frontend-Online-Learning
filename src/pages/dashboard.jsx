// src/pages/DashboardPage.jsx
import * as React from 'react';
import { createTheme, styled } from '@mui/material/styles';
import {
  AccountCircle as AccountCircleIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  BarChart as BarChartIcon,
  Description as DescriptionIcon,
  Layers as LayersIcon,
} from '@mui/icons-material';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid';

const NAVIGATION = [/* 생략: 기존 코드 그대로 */];
const demoTheme = createTheme({ /* 생략 */ });

const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function DashboardPage() {
  const [pathname, setPathname] = React.useState('/dashboard');

  const router = React.useMemo(() => ({
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path) => setPathname(String(path)),
  }), [pathname]);

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{ title: '온라인 평생학습 관리 시스템' }}
      router={router}
      theme={demoTheme}
    >
      <DashboardLayout>
        <PageContainer>
          <Grid container spacing={1}>
            {/* 기존 Grid 내용 유지 */}
          </Grid>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
