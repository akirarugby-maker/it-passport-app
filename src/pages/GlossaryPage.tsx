import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, BookMarked, ArrowLeft, ExternalLink, X } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RepetitionBadge } from '@/components/ui/RepetitionBadge';
import { useAppStore } from '@/store/useAppStore';
import { glossaryTerms, searchTerms, getTermById } from '@/data/glossary';
import { domainLabel, domainBadgeClass } from '@/utils/domain';
import { cn } from '@/utils/cn';
import type { Domain } from '@/types';

const DOMAINS: { key: Domain | 'all'; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'strategy', label: 'ストラテジ系' },
  { key: 'management', label: 'マネジメント系' },
  { key: 'technology', label: 'テクノロジ系' },
];

export const GlossaryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { recordGlossaryTerm, progress, navigationHistory } = useAppStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Domain | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('term'));

  useEffect(() => {
    const termId = searchParams.get('term');
    if (termId) {
      setSelectedId(termId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedId) {
      recordGlossaryTerm(selectedId);
    }
  }, [selectedId]);

  const filtered = query
    ? searchTerms(query)
    : filter === 'all'
    ? glossaryTerms
    : glossaryTerms.filter((t) => t.domain === filter);

  const selectedTerm = selectedId ? getTermById(selectedId) : null;
  const fromSlide = navigationHistory.fromSlideId;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {fromSlide && (
          <Button variant="ghost" size="sm" onClick={() => navigate(`/slides/${fromSlide}`)}>
            <ArrowLeft className="w-4 h-4" />
            スライドに戻る
          </Button>
        )}
        <div>
          <h1 className="text-xl font-bold text-gray-900">用語集</h1>
          <p className="text-sm text-gray-500">{glossaryTerms.length}用語収録</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="用語を検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter */}
      {!query && (
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
      )}

      {/* Term detail modal */}
      {selectedTerm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <CardBody>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedTerm.term}</h2>
                  {selectedTerm.reading && (
                    <p className="text-xs text-gray-400">読み：{selectedTerm.reading}</p>
                  )}
                </div>
                <button onClick={() => setSelectedId(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded', domainBadgeClass[selectedTerm.domain])}>
                  {domainLabel[selectedTerm.domain]}
                </span>
                <span className="text-xs text-gray-400">{selectedTerm.category}</span>
                <RepetitionBadge count={progress.glossaryTerms[selectedTerm.id]?.count ?? 0} size="sm" />
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">{selectedTerm.definition}</p>

              {selectedTerm.example && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs font-medium text-yellow-700 mb-1">使用例</p>
                  <p className="text-xs text-gray-700">{selectedTerm.example}</p>
                </div>
              )}

              {selectedTerm.relatedTermIds && selectedTerm.relatedTermIds.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-2">関連用語</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.relatedTermIds.map((id) => {
                      const t = getTermById(id);
                      if (!t) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedId(id)}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                          {t.term}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                {selectedTerm.relatedSlideId && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/slides/${selectedTerm.relatedSlideId}`)}
                    className="flex-1"
                  >
                    <BookMarked className="w-4 h-4" />
                    スライドで学ぶ
                  </Button>
                )}
                {selectedTerm.relatedQuestionIds && selectedTerm.relatedQuestionIds.length > 0 && (
                  <Button
                    size="sm"
                    onClick={() => navigate(`/quiz?mode=domain&domain=${selectedTerm.domain}`)}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    関連問題を解く
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Terms list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <BookMarked className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">「{query}」に一致する用語が見つかりません</p>
          </div>
        )}
        {filtered.map((term) => {
          const count = progress.glossaryTerms[term.id]?.count ?? 0;
          return (
            <Card
              key={term.id}
              onClick={() => setSelectedId(term.id)}
              className="hover:border-blue-200 transition-colors"
            >
              <CardBody>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded', domainBadgeClass[term.domain])}>
                        {domainLabel[term.domain]}
                      </span>
                      <span className="text-xs text-gray-400">{term.category}</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mt-1">{term.term}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{term.definition}</p>
                  </div>
                  <RepetitionBadge count={count} size="sm" />
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
