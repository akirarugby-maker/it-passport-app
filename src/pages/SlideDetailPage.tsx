import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookMarked, ClipboardList, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RepetitionBadge } from '@/components/ui/RepetitionBadge';
import { Card, CardBody } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { getSlideById } from '@/data/slides';
import { getQuestionsByIds } from '@/data/questions';
import { getTermsByIds } from '@/data/glossary';
import { domainLabel, domainBadgeClass } from '@/utils/domain';
import { cn } from '@/utils/cn';

function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  const isSeparatorRow = (l: string) => /^\s*\|[\s\-|:]+\|\s*$/.test(l);

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines
        .filter((l) => !isSeparatorRow(l))
        .map((l) =>
          l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())
        );
      if (rows.length > 0) {
        const [header, ...body] = rows;
        elements.push(
          <div key={key++} className="overflow-x-auto my-3 rounded-lg border border-gray-200">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  {header.map((cell, ci) => (
                    <th key={ci} className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri} className={ri % 2 !== 0 ? 'bg-gray-50' : ''}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-gray-700 border-t border-gray-100">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    if (line.startsWith('■')) {
      elements.push(
        <p key={key++} className="text-sm font-bold text-gray-800 mt-4 mb-1">
          {line}
        </p>
      );
      i++;
      continue;
    }

    if (line.trim() === '') {
      elements.push(<div key={key++} className="h-1" />);
      i++;
      continue;
    }

    elements.push(
      <p key={key++} className="text-sm text-gray-700 leading-relaxed">
        {line}
      </p>
    );
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

export const SlideDetailPage = () => {
  const { slideId } = useParams<{ slideId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  const { recordSlideSection, progress, setNavigationHistory } = useAppStore();

  const slide = slideId ? getSlideById(slideId) : null;

  useEffect(() => {
    if (slide) {
      const sec = slide.sections[currentSection];
      if (sec) {
        recordSlideSection(sec.id);
        setNavigationHistory(slide.id, sec.id);
      }
    }
  }, [slide, currentSection]);

  if (!slide) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">スライドが見つかりません</p>
        <Button variant="ghost" onClick={() => navigate('/slides')} className="mt-4">
          一覧に戻る
        </Button>
      </div>
    );
  }

  const section = slide.sections[currentSection];
  const repetition = progress.slidesSections[section.id] || { count: 0, dates: [] };
  const quizQuestions = getQuestionsByIds(slide.quizQuestionIds);

  const goToQuiz = () => {
    navigate(`/quiz?slideId=${slide.id}`);
  };

  const goToGlossary = (termId?: string) => {
    const base = termId ? `/glossary?term=${termId}` : '/glossary';
    navigate(`${base}&from=slide&fromSlide=${slide.id}`);
  };

  const handleQuizAnswer = (questionId: string, idx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: idx }));
    setShowExplanations((prev) => ({ ...prev, [questionId]: true }));
  };

  const answeredAll = quizQuestions.every((q) => quizAnswers[q.id] !== undefined);
  const correctCount = quizQuestions.filter((q) => quizAnswers[q.id] === q.correctIndex).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/slides')}>
          <ChevronLeft className="w-4 h-4" />
          一覧
        </Button>
        <div className="flex-1">
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded', domainBadgeClass[slide.domain])}>
            {domainLabel[slide.domain]}
          </span>
          <h1 className="font-bold text-gray-900 mt-1">{slide.title}</h1>
        </div>
      </div>

      {!showQuiz ? (
        <>
          {/* Section navigation tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {slide.sections.map((sec, idx) => {
              const count = progress.slidesSections[sec.id]?.count ?? 0;
              return (
                <button
                  key={sec.id}
                  onClick={() => setCurrentSection(idx)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border',
                    currentSection === idx
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  )}
                >
                  {idx + 1}. {sec.title.length > 12 ? sec.title.slice(0, 12) + '…' : sec.title}
                  {count >= 3 && <CheckCircle2 className="inline w-3 h-3 ml-1 text-green-400" />}
                </button>
              );
            })}
          </div>

          {/* Section content */}
          <Card>
            <CardBody>
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                <RepetitionBadge count={repetition.count} />
              </div>

              {/* Content */}
              <div className="max-w-none">
                {renderContent(section.content)}
              </div>

              {/* Key points */}
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">📌 ポイント</h3>
                <ul className="space-y-1">
                  {section.keyPoints.map((point, i) => (
                    <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Navigation links */}
              {section.relatedGlossaryIds && section.relatedGlossaryIds.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {getTermsByIds(section.relatedGlossaryIds).slice(0, 4).map((term) => (
                    <button
                      key={term.id}
                      onClick={() => goToGlossary(term.id)}
                      className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full border border-purple-200 hover:bg-purple-100 transition-colors"
                    >
                      <BookMarked className="inline w-3 h-3 mr-1" />
                      {term.term}を用語集で確認
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => goToQuiz()}
                  className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200 hover:bg-green-100 transition-colors"
                >
                  <ClipboardList className="inline w-3 h-3 mr-1" />
                  関連問題を解く
                </button>
              </div>
            </CardBody>
          </Card>

          {/* Prev/Next navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentSection((p) => p - 1)}
              disabled={currentSection === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              前へ
            </Button>

            {currentSection === slide.sections.length - 1 ? (
              <Button onClick={() => setShowQuiz(true)}>
                確認クイズ（{quizQuestions.length}問）
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentSection((p) => p + 1)}
              >
                次へ
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </>
      ) : (
        /* Quiz section */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">確認クイズ（{quizQuestions.length}問）</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowQuiz(false)}>
              <ArrowLeft className="w-4 h-4" />
              スライドに戻る
            </Button>
          </div>

          {quizQuestions.map((q, qi) => {
            const answered = quizAnswers[q.id] !== undefined;
            const isCorrect = quizAnswers[q.id] === q.correctIndex;

            return (
              <Card key={q.id}>
                <CardBody>
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-0.5 shrink-0">Q{qi + 1}</span>
                    <p className="text-sm font-medium text-gray-900">{q.text}</p>
                  </div>
                  <div className="space-y-2">
                    {q.choices.map((choice, ci) => (
                      <button
                        key={ci}
                        onClick={() => !answered && handleQuizAnswer(q.id, ci)}
                        disabled={answered}
                        className={cn(
                          'w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors',
                          !answered && 'hover:bg-blue-50 hover:border-blue-300 border-gray-200',
                          answered && ci === q.correctIndex && 'bg-green-50 border-green-400 text-green-800',
                          answered && ci === quizAnswers[q.id] && ci !== q.correctIndex && 'bg-red-50 border-red-400 text-red-800',
                          answered && ci !== q.correctIndex && ci !== quizAnswers[q.id] && 'border-gray-200 text-gray-500'
                        )}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + ci)}.</span>
                        {choice}
                      </button>
                    ))}
                  </div>
                  {showExplanations[q.id] && (
                    <div className={cn('mt-3 p-3 rounded-lg text-sm', isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800')}>
                      <span className="font-medium">{isCorrect ? '✓ 正解！' : '✗ 不正解'}</span>
                      <p className="mt-1 text-gray-700">{q.explanation}</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}

          {answeredAll && (
            <Card className="border-blue-200 bg-blue-50">
              <CardBody className="text-center">
                <div className="text-2xl font-bold text-blue-700">{correctCount}/{quizQuestions.length}問正解</div>
                <p className="text-sm text-blue-600 mt-1">
                  {correctCount === quizQuestions.length ? 'パーフェクト！全問正解です 🎉' : '解説を確認して復習しましょう'}
                </p>
                <Button className="mt-4" onClick={() => navigate('/slides')}>
                  スライド一覧へ戻る
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
