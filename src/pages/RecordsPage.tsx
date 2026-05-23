import { useState } from 'react';
import { Clapperboard, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { slides } from '@/data/slides';
import { domainLabel, domainBadgeClass } from '@/utils/domain';
import { cn } from '@/utils/cn';
import type { Domain } from '@/types';

const DOMAINS: Domain[] = ['strategy', 'management', 'technology'];

function youtubeUrl(keyword: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`ITパスポート ${keyword}`)}`;
}

export const RecordsPage = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Clapperboard className="w-5 h-5 text-red-500" />
          <h1 className="text-xl font-bold text-gray-900">YouTube検索</h1>
        </div>
        <p className="text-sm text-gray-500">
          テーマ名またはキーワードをタップすると、YouTubeで解説動画を検索できます。
        </p>
      </div>

      {DOMAINS.map((domain) => {
        const domainSlides = slides.filter((s) => s.domain === domain);
        return (
          <div key={domain}>
            <div className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold mb-3', domainBadgeClass[domain])}>
              {domainLabel[domain]}
            </div>

            <div className="space-y-2">
              {domainSlides.map((slide) => {
                const isOpen = expanded[slide.id] ?? false;
                const allKeywords = [...new Set(slide.sections.flatMap((sec) => sec.keywords))];
                return (
                  <Card key={slide.id}>
                    <CardBody className="p-0">
                      {/* Slide title row */}
                      <div className="flex items-center gap-2 p-3">
                        <button
                          onClick={() => toggle(slide.id)}
                          className="flex-1 flex items-center gap-2 text-left"
                        >
                          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                          <span className="font-medium text-sm text-gray-900">{slide.title}</span>
                        </button>
                        <a
                          href={youtubeUrl(slide.title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-lg px-2 py-1 transition-colors shrink-0"
                        >
                          <Clapperboard className="w-3 h-3" />
                          動画を検索
                        </a>
                      </div>

                      {/* Keywords */}
                      {isOpen && (
                        <div className="px-3 pb-3 border-t border-gray-100">
                          <p className="text-xs text-gray-400 mt-2 mb-1.5">キーワードから検索</p>
                          <div className="flex flex-wrap gap-1.5">
                            {allKeywords.map((kw) => (
                              <a
                                key={kw}
                                href={youtubeUrl(kw)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full hover:bg-red-100 transition-colors"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                                {kw}
                              </a>
                            ))}
                          </div>

                          {/* Section titles */}
                          <p className="text-xs text-gray-400 mt-3 mb-1.5">セクション別に検索</p>
                          <div className="space-y-1">
                            {slide.sections.map((sec) => (
                              <a
                                key={sec.id}
                                href={youtubeUrl(sec.title)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-gray-700 hover:text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors"
                              >
                                <Clapperboard className="w-3 h-3 text-red-400 shrink-0" />
                                {sec.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
