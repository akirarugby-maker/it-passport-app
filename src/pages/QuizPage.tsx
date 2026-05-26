import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ClipboardList, Timer, ChevronLeft, ChevronRight, RotateCcw, BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/store/useAppStore';
import { questions, getQuestionsByDomain, getQuestionsByIds } from '@/data/questions';
import { getSlideById } from '@/data/slides';
import { getTermById } from '@/data/glossary';
import { domainLabel, domainBadgeClass } from '@/utils/domain';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import type { Domain, Question, QuizMode } from '@/types';

const EXAM_QUESTION_COUNT = 100;
const EXAM_MINUTES = 165;

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const shuffleChoices = (q: Question): Question => {
  const indices = q.choices.map((_, i) => i);
  const shuffled = shuffle(indices);
  return {
    ...q,
    choices: shuffled.map((i) => q.choices[i]),
    correctIndex: shuffled.indexOf(q.correctIndex),
  };
};

type QuizState = 'select' | 'playing' | 'result';

export const QuizPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addAnswer, recordQuestion, getWeakQuestionIds, navigationHistory } = useAppStore();

  const urlSlideId = searchParams.get('slideId') ?? undefined;
  const urlTermId = searchParams.get('termId') ?? undefined;

  const [state, setState] = useState<QuizState>('select');
  const [mode, setMode] = useState<QuizMode>((searchParams.get('mode') as QuizMode) || 'random');
  const [selectedDomain, setSelectedDomain] = useState<Domain | undefined>(
    (searchParams.get('domain') as Domain) || undefined
  );
  const [quizQuestions, setQuizQuestions] = useState(questions.slice(0, 10));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXAM_MINUTES * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Title shown when coming from a slide or term
  const quizTitle = useMemo(() => {
    if (urlSlideId) {
      const slide = getSlideById(urlSlideId);
      return slide ? `「${slide.title}」の関連問題` : '';
    }
    if (urlTermId) {
      const term = getTermById(urlTermId);
      return term ? `「${term.term}」の関連問題` : '';
    }
    return '';
  }, [urlSlideId, urlTermId]);

  // Auto-start if slideId / termId / mode is passed in URL
  useEffect(() => {
    if (urlSlideId || urlTermId) {
      const qs = buildQuestionsFromUrl().map(shuffleChoices);
      if (qs.length > 0) {
        setQuizQuestions(qs);
        setCurrentIdx(0);
        setAnswers({});
        setShowExplanation(false);
        setState('playing');
      }
    } else {
      const urlMode = searchParams.get('mode') as QuizMode;
      if (urlMode) setMode(urlMode);
    }
  }, []);

  // Exam timer
  useEffect(() => {
    if (state === 'playing' && mode === 'exam') {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setState('result');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state, mode]);

  // Build questions specifically linked to a slide or term (used on auto-start)
  const buildQuestionsFromUrl = () => {
    if (urlSlideId) {
      const slide = getSlideById(urlSlideId);
      if (slide?.quizQuestionIds.length) {
        return shuffle(getQuestionsByIds(slide.quizQuestionIds));
      }
    }
    if (urlTermId) {
      const term = getTermById(urlTermId);
      if (term?.relatedQuestionIds?.length) {
        return shuffle(getQuestionsByIds(term.relatedQuestionIds));
      }
      if (term) {
        return shuffle(getQuestionsByDomain(term.domain)).slice(0, 10);
      }
    }
    return shuffle(questions).slice(0, 10);
  };

  const buildQuestions = () => {
    // When re-starting from results screen while slideId/termId is in URL, reuse same pool
    if (urlSlideId || urlTermId) return buildQuestionsFromUrl();

    let pool = questions;
    if (mode === 'domain' && selectedDomain) {
      pool = getQuestionsByDomain(selectedDomain);
    } else if (mode === 'weak') {
      const weakIds = getWeakQuestionIds();
      pool = weakIds.length > 0 ? getQuestionsByIds(weakIds) : questions;
    }

    const shuffled = shuffle(pool);
    const count = mode === 'exam' ? Math.min(EXAM_QUESTION_COUNT, shuffled.length) : Math.min(10, shuffled.length);
    return shuffled.slice(0, count);
  };

  const startQuiz = () => {
    const qs = buildQuestions().map(shuffleChoices);
    setQuizQuestions(qs);
    setCurrentIdx(0);
    setAnswers({});
    setShowExplanation(false);
    setTimeLeft(EXAM_MINUTES * 60);
    setState('playing');
  };

  const handleAnswer = (idx: number) => {
    if (answers[currentIdx] !== undefined) return;
    const q = quizQuestions[currentIdx];
    setAnswers((prev) => ({ ...prev, [currentIdx]: idx }));
    setShowExplanation(true);
    recordQuestion(q.id);
    addAnswer({
      questionId: q.id,
      isCorrect: idx === q.correctIndex,
      selectedIndex: idx,
      timestamp: new Date().toISOString(),
      mode,
    });
  };

  const next = () => {
    if (currentIdx === quizQuestions.length - 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      setState('result');
    } else {
      setCurrentIdx((p) => p + 1);
      setShowExplanation(false);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const correctCount = Object.entries(answers).filter(([i, a]) => quizQuestions[Number(i)]?.correctIndex === a).length;
  const accuracy = quizQuestions.length > 0 ? Math.round((correctCount / Object.keys(answers).length) * 100) : 0;

  const fromSlide = navigationHistory.fromSlideId;

  if (state === 'select') {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          {fromSlide && (
            <Button variant="ghost" size="sm" onClick={() => navigate(`/slides/${fromSlide}`)}>
              <ArrowLeft className="w-4 h-4" />
              スライドに戻る
            </Button>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">問題演習</h1>
            <p className="text-sm text-gray-500">{questions.length}問収録</p>
          </div>
        </div>

        <div className="grid gap-3">
          {[
            { mode: 'domain' as QuizMode, title: '分野別出題', desc: '特定の分野から出題', icon: BookOpen },
            { mode: 'weak' as QuizMode, title: '苦手問題', desc: '正答率60%未満の問題から出題', icon: RotateCcw },
            { mode: 'random' as QuizMode, title: 'ランダム出題', desc: '全分野からランダムに10問', icon: ClipboardList },
            { mode: 'exam' as QuizMode, title: '模擬試験モード', desc: `${EXAM_QUESTION_COUNT}問・${EXAM_MINUTES}分タイマー付き`, icon: Timer },
          ].map(({ mode: m, title, desc, icon: Icon }) => (
            <Card
              key={m}
              onClick={() => setMode(m)}
              className={cn(mode === m ? 'border-blue-400 bg-blue-50' : '')}
            >
              <CardBody className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', mode === m ? 'bg-blue-500' : 'bg-gray-100')}>
                  <Icon className={cn('w-5 h-5', mode === m ? 'text-white' : 'text-gray-500')} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{title}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {mode === 'domain' && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">分野を選択</p>
            <div className="grid grid-cols-3 gap-2">
              {(['strategy', 'management', 'technology'] as Domain[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDomain(d)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs font-medium border transition-colors',
                    selectedDomain === d ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  )}
                >
                  {domainLabel[d]}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button onClick={startQuiz} className="w-full" size="lg">
          {mode === 'exam' ? '模擬試験を開始' : '演習を開始'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (state === 'result') {
    const domainResults = (['strategy', 'management', 'technology'] as Domain[]).map((domain) => {
      const domainQs = quizQuestions.filter((q) => q.domain === domain);
      const answered = domainQs.filter((_, i) => answers[quizQuestions.indexOf(domainQs[i])] !== undefined);
      const correct = answered.filter((q, i) => answers[quizQuestions.indexOf(q)] === q.correctIndex);
      const acc = answered.length > 0 ? Math.round((correct.length / answered.length) * 100) : 0;
      return { domain, answered: answered.length, correct: correct.length, acc };
    });

    return (
      <div className="space-y-5">
        <h1 className="text-xl font-bold text-gray-900">結果</h1>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="text-center py-6">
            <div className="text-5xl font-bold text-blue-700">{correctCount}<span className="text-2xl text-blue-500">/{Object.keys(answers).length}</span></div>
            <div className="text-gray-600 mt-1">正答率 {accuracy}%</div>
            {mode === 'exam' && (
              <div className={cn('mt-2 text-lg font-bold', accuracy >= 60 ? 'text-green-600' : 'text-red-600')}>
                {accuracy >= 60 ? '合格ライン達成！' : '合格ラインまであと少し'}
              </div>
            )}
          </CardBody>
        </Card>

        {mode === 'exam' && (
          <Card>
            <CardHeader><h2 className="font-semibold">分野別スコア</h2></CardHeader>
            <CardBody className="space-y-2">
              {domainResults.map((d) => (
                <div key={d.domain} className="flex items-center justify-between">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded', domainBadgeClass[d.domain])}>
                    {domainLabel[d.domain]}
                  </span>
                  <span className="text-sm text-gray-700">{d.correct}/{d.answered}問（{d.acc}%）</span>
                  <Badge variant={d.acc >= 30 ? 'success' : 'danger'}>{d.acc >= 30 ? 'クリア' : '要学習'}</Badge>
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-2">※ 合格基準：各分野300点相当（約30%）以上・総合600点相当（60%）以上</p>
            </CardBody>
          </Card>
        )}

        <div className="space-y-2">
          <h2 className="font-semibold text-gray-900">問題の振り返り</h2>
          {quizQuestions.map((q, i) => {
            const answered = answers[i];
            if (answered === undefined) return null;
            const isCorrect = answered === q.correctIndex;
            return (
              <Card key={q.id} className={cn(isCorrect ? 'border-green-200' : 'border-red-200')}>
                <CardBody>
                  <div className="flex items-start gap-2">
                    <span className={cn('text-xs font-bold shrink-0 mt-0.5', isCorrect ? 'text-green-600' : 'text-red-600')}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">{q.text}</p>
                      {!isCorrect && (
                        <p className="text-xs text-gray-600">
                          正答：<span className="font-medium text-green-700">{q.choices[q.correctIndex]}</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{q.explanation}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => {
              if (urlSlideId) navigate(`/slides/${urlSlideId}`);
              else if (urlTermId) navigate('/glossary');
              else setState('select');
            }}
          >
            {urlSlideId ? 'スライドに戻る' : urlTermId ? '用語集に戻る' : '出題設定に戻る'}
          </Button>
          <Button className="flex-1" onClick={startQuiz}>
            もう一度
          </Button>
        </div>
      </div>
    );
  }

  // Playing state
  const q = quizQuestions[currentIdx];
  const answered = answers[currentIdx] !== undefined;
  const isCorrect = answers[currentIdx] === q.correctIndex;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (urlSlideId) navigate(`/slides/${urlSlideId}`);
            else if (urlTermId) navigate('/glossary');
            else setState('select');
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          {urlSlideId || urlTermId ? '戻る' : '終了'}
        </Button>
        <div className="text-center">
          {quizTitle && <div className="text-xs text-blue-600 font-medium truncate max-w-[180px]">{quizTitle}</div>}
          <div className="text-sm text-gray-500">{currentIdx + 1} / {quizQuestions.length}</div>
        </div>
        {mode === 'exam' && (
          <div className={cn('flex items-center gap-1 font-mono font-bold', timeLeft < 300 ? 'text-red-600' : 'text-gray-700')}>
            <Timer className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all"
          style={{ width: `${((currentIdx) / quizQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-2 mb-3">
            <span className={cn('text-xs px-2 py-0.5 rounded font-medium', domainBadgeClass[q.domain])}>
              {domainLabel[q.domain]}
            </span>
            <span className="text-xs text-gray-400">{q.category}</span>
          </div>
          <p className="text-base font-medium text-gray-900 leading-relaxed">{q.text}</p>
        </CardBody>
      </Card>

      {/* Choices */}
      <div className="space-y-2">
        {q.choices.map((choice, ci) => (
          <button
            key={ci}
            onClick={() => handleAnswer(ci)}
            disabled={answered}
            className={cn(
              'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all',
              !answered && 'border-gray-200 hover:border-blue-300 hover:bg-blue-50',
              answered && ci === q.correctIndex && 'bg-green-50 border-green-400 text-green-800',
              answered && ci === answers[currentIdx] && ci !== q.correctIndex && 'bg-red-50 border-red-400 text-red-800',
              answered && ci !== q.correctIndex && ci !== answers[currentIdx] && 'border-gray-200 text-gray-400'
            )}
          >
            <span className="font-bold mr-2">{String.fromCharCode(65 + ci)}.</span>
            {choice}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <Card className={cn(isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50')}>
          <CardBody>
            <p className={cn('font-bold text-sm mb-2', isCorrect ? 'text-green-700' : 'text-red-700')}>
              {isCorrect ? '✓ 正解！' : '✗ 不正解'}
            </p>
            <p className="text-sm text-gray-700">{q.explanation}</p>
            {q.relatedSlideId && (
              <button
                onClick={() => navigate(`/slides/${q.relatedSlideId}?from=quiz`)}
                className="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <BookOpen className="w-3 h-3" />
                スライドで復習する
              </button>
            )}
          </CardBody>
        </Card>
      )}

      {/* Next button */}
      {answered && (
        <Button onClick={next} className="w-full" size="lg">
          {currentIdx === quizQuestions.length - 1 ? '結果を見る' : '次の問題'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
