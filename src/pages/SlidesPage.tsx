import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, CheckCircle2, Lock } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RepetitionBadge } from '@/components/ui/RepetitionBadge';
import { useAppStore } from '@/store/useAppStore';
import { slides } from '@/data/slides';
import { domainLabel, domainBadgeClass, domainBgClass } from '@/utils/domain';
import { cn } from '@/utils/cn';
import type { Domain } from '@/types';

const DOMAINS: { key: Domain | 'all'; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'strategy', label: 'ストラテジ系' },
  { key: 'management', label: 'マネジメント系' },
  { key: 'technology', label: 'テクノロジ系' },
];

export const SlidesPage = () => {
  const navigate = useNavigate();
  const { progress } = useAppStore();
  const [filter, setFilter] = useState<Domain | 'all'>('all');

  const filtered = filter === 'all' ? slides : slides.filter((s) => s.domain === filter);

  const getSlideMastered = (slide: typeof slides[0]) => {
    const masteredCount = slide.sections.filter(
      (sec) => (progress.slidesSections[sec.id]?.count ?? 0) >= 3
    ).length;
    return { masteredCount, total: slide.sections.length };
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">スライド学習</h1>
        <p className="text-sm text-gray-500 mt-1">各カテゴリを学習して確認クイズに挑戦しましょう</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {DOMAINS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              filter === key ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Slides list */}
      <div className="space-y-3">
        {filtered.map((slide) => {
          const { masteredCount, total } = getSlideMastered(slide);
          const isComplete = masteredCount === total && total > 0;

          return (
            <Card
              key={slide.id}
              onClick={() => navigate(`/slides/${slide.id}`)}
              className={cn('transition-all', isComplete && 'border-green-200')}
            >
              <CardBody>
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                      isComplete ? 'bg-green-100' : 'bg-blue-50'
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          'text-xs font-medium px-2 py-0.5 rounded',
                          domainBadgeClass[slide.domain]
                        )}
                      >
                        {domainLabel[slide.domain]}
                      </span>
                      {isComplete && <Badge variant="success">習得済み</Badge>}
                    </div>
                    <h3 className="font-medium text-gray-900">{slide.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs text-gray-500">
                        {slide.sections.length}セクション / クイズ{slide.quizQuestionIds.length}問
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{masteredCount}/{total} 習得</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    {/* Section progress */}
                    <div className="mt-2 flex gap-1">
                      {slide.sections.map((sec) => {
                        const count = progress.slidesSections[sec.id]?.count ?? 0;
                        return (
                          <div
                            key={sec.id}
                            className={cn(
                              'flex-1 h-1 rounded-full',
                              count >= 3 ? 'bg-green-400' : count >= 1 ? 'bg-blue-300' : 'bg-gray-200'
                            )}
                            title={sec.title}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
