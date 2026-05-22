import type { Domain } from '@/types';

export const domainLabel: Record<Domain, string> = {
  strategy: 'ストラテジ系',
  management: 'マネジメント系',
  technology: 'テクノロジ系',
};

export const domainColor: Record<Domain, string> = {
  strategy: 'strategy',
  management: 'management',
  technology: 'technology',
};

export const domainBgClass: Record<Domain, string> = {
  strategy: 'bg-yellow-50 border-yellow-200',
  management: 'bg-green-50 border-green-200',
  technology: 'bg-blue-50 border-blue-200',
};

export const domainBadgeClass: Record<Domain, string> = {
  strategy: 'bg-yellow-100 text-yellow-800',
  management: 'bg-green-100 text-green-800',
  technology: 'bg-blue-100 text-blue-800',
};

export const domainIconColor: Record<Domain, string> = {
  strategy: 'text-yellow-600',
  management: 'text-green-600',
  technology: 'text-blue-600',
};

export const domainChartColor: Record<Domain, string> = {
  strategy: '#f59e0b',
  management: '#10b981',
  technology: '#3b82f6',
};
