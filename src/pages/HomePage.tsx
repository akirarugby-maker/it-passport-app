import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronDown, ChevronUp, RotateCcw,
  BookOpen, ClipboardList, BookMarked, X, Info, Download, Upload, Database,
  Zap, RefreshCw, CheckCircle, XCircle,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { slides, getSlideById, getSlideByQuestionId } from '@/data/slides';
import { glossaryTerms } from '@/data/glossary';
import { questions } from '@/data/questions';
import { domainLabel } from '@/utils/domain';
import { cn } from '@/utils/cn';
import type { Domain, Slide, StudyProgress, Question } from '@/types';

const DOMAINS: Domain[] = ['strategy', 'management', 'technology'];
const TARGET = new Date('2026-08-20T00:00:00+09:00');
const ANSWER_LABELS = ['ア', 'イ', 'ウ', 'エ'] as const;

function shuffleChoicesHP(q: Question): Question {
  const paired = q.choices.map((c, i) => ({ c, isCorrect: i === q.correctIndex }));
  for (let i = paired.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [paired[i], paired[j]] = [paired[j], paired[i]];
  }
  return { ...q, choices: paired.map((p) => p.c), correctIndex: paired.findIndex((p) => p.isCorrect) };
}

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function computeRaw(slide: Slide, progress: StudyProgress) {
  const sectionCounts = slide.sections.map((s) => progress.slidesSections[s.id]?.count ?? 0);
  const rawSlide = sectionCounts.length ? Math.min(...sectionCounts) : 0;

  const quizCounts = slide.quizQuestionIds.map((id) => progress.questions[id]?.count ?? 0);
  const rawQuiz = quizCounts.length ? Math.min(...quizCounts) : 0;

  const gIds = [...new Set(slide.sections.flatMap((s) => s.relatedGlossaryIds ?? []))];
  const rawGlossary = gIds.length
    ? Math.min(...gIds.map((id) => progress.glossaryTerms[id]?.count ?? 0))
    : null;

  return { rawSlide, rawQuiz, rawGlossary };
}

const EXAM_INFO: [string, string, boolean?][] = [
  ['試験形式', 'CBT（コンピュータ使用試験）'],
  ['問題数', '100問（すべて四択式）'],
  ['試験時間', '120分'],
  ['受験料', '7,500円（税込）'],
  ['合格基準', '総合600点以上、かつ各分野300点以上（1,000点満点）', true],
  ['出題分野', 'ストラテジ系・マネジメント系・テクノロジ系', true],
  ['受験資格', 'なし（誰でも受験可能）'],
  ['受験場所', '全国のテストセンター（随時受験可能）'],
];

const defaultAppState = {
  progress: { slidesSections: {}, questions: {}, glossaryTerms: {} },
  progressTableBaselines: {},
  answerHistory: [],
  dailyStudy: [],
  examSessions: [],
  streakDays: 0,
  lastStudyDate: '',
  navigationHistory: {},
};

function SurpriseQuizPanel() {
  const navigate = useNavigate();
  const { progress, addAnswer } = useAppStore();

  // 学習済みスライドの問題を抽出
  const studiedPool = useMemo(() => {
    const studiedSlideIds = new Set<string>();
    for (const slide of slides) {
      if (slide.sections.some((s) => (progress.slidesSections[s.id]?.count ?? 0) > 0)) {
        studiedSlideIds.add(slide.id);
      }
    }
    return questions.filter((q) => {
      const slideId = q.relatedSlideId ?? getSlideByQuestionId(q.id)?.id;
      return slideId ? studiedSlideIds.has(slideId) : false;
    });
  }, [progress.slidesSections]);

  // クイズ状態
  const [quizQs, setQuizQs] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<{ q: Question; ok: boolean; sel: number }[]>([]);
  const [phase, setPhase] = useState<'quiz' | 'done'>('quiz');
  const initialized = useRef(false);

  const pickRandom = (pool: Question[]) => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setQuizQs(shuffled.slice(0, Math.min(5, shuffled.length)).map(shuffleChoicesHP));
    setIdx(0);
    setSelected(null);
    setAnswered(false);
    setResults([]);
    setPhase('quiz');
  };

  // アプリ起動時に1回だけ選出
  useEffect(() => {
    if (!initialized.current && studiedPool.length > 0) {
      initialized.current = true;
      pickRandom(studiedPool);
    }
  }, [studiedPool]);

  const currentQ = quizQs[idx] ?? null;
  const relatedSlide = currentQ
    ? (currentQ.relatedSlideId ? getSlideById(currentQ.relatedSlideId) : getSlideByQuestionId(currentQ.id))
    : null;

  const handleSelect = (i: number) => {
    if (answered || !currentQ) return;
    setSelected(i);
    setAnswered(true);
    const ok = i === currentQ.correctIndex;
    addAnswer({
      questionId: currentQ.id,
      isCorrect: ok,
      selectedIndex: i,
      timestamp: new Date().toISOString(),
      mode: 'random',
    });
    setResults((r) => [...r, { q: currentQ, ok, sel: i }]);
  };

  const handleNext = () => {
    if (idx + 1 >= quizQs.length) {
      setPhase('done');
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (studiedPool.length === 0) {
    return (
      <Card>
        <CardBody>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-gray-800">抜き打ちテスト</h3>
          </div>
          <p className="text-xs text-gray-500">スライド学習を進めると、学習済みの内容から抜き打ちテストが出題されます。</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="space-y-3">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-gray-800">抜き打ちテスト</h3>
            {phase === 'quiz' && quizQs.length > 0 && (
              <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                {idx + 1} / {quizQs.length}
              </span>
            )}
          </div>
          <button
            onClick={() => pickRandom(studiedPool)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors border border-gray-200 rounded-lg px-2 py-1 hover:border-blue-300"
          >
            <RefreshCw className="w-3 h-3" />
            別の問題
          </button>
        </div>

        {/* 問題フェーズ */}
        {phase === 'quiz' && currentQ && (
          <>
            <span className={cn(
              'inline-block text-xs px-2 py-0.5 rounded-full font-medium',
              currentQ.domain === 'strategy' ? 'bg-blue-100 text-blue-700' :
              currentQ.domain === 'management' ? 'bg-green-100 text-green-700' :
              'bg-purple-100 text-purple-700'
            )}>
              {domainLabel[currentQ.domain]}
            </span>

            <p className="text-sm text-gray-800 leading-relaxed font-medium">{currentQ.text}</p>

            {/* 関連スライドリンク（常時表示） */}
            {relatedSlide && (
              <button
                onClick={() => navigate(`/slides/${relatedSlide.id}?from=home`)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors text-xs"
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="text-left">スライドで確認：{relatedSlide.title}</span>
              </button>
            )}

            {/* 選択肢 */}
            <div className="space-y-1.5">
              {currentQ.choices.map((choice, ci) => {
                let cls = 'w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-colors ';
                if (!answered) {
                  cls += 'border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-gray-700';
                } else if (ci === currentQ.correctIndex) {
                  cls += 'border-green-400 bg-green-50 text-green-800 font-medium';
                } else if (ci === selected) {
                  cls += 'border-red-300 bg-red-50 text-red-700';
                } else {
                  cls += 'border-gray-100 bg-gray-50 text-gray-400';
                }
                return (
                  <button key={ci} onClick={() => handleSelect(ci)} disabled={answered} className={cls}>
                    <span className="font-bold mr-2">{ANSWER_LABELS[ci]}.</span>{choice}
                  </button>
                );
              })}
            </div>

            {/* 解答後フィードバック */}
            {answered && (
              <div className={cn(
                'rounded-xl p-3 space-y-2 border',
                selected === currentQ.correctIndex
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              )}>
                <div className="flex items-center gap-2">
                  {selected === currentQ.correctIndex
                    ? <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    : <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                  }
                  <span className={cn(
                    'text-sm font-bold',
                    selected === currentQ.correctIndex ? 'text-green-700' : 'text-red-600'
                  )}>
                    {selected === currentQ.correctIndex
                      ? '正解！'
                      : `不正解（正解：${ANSWER_LABELS[currentQ.correctIndex]}）`
                    }
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{currentQ.explanation}</p>
                {selected !== currentQ.correctIndex && relatedSlide && (
                  <button
                    onClick={() => navigate(`/slides/${relatedSlide.id}?from=home`)}
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {relatedSlide.title}で復習する →
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  {idx + 1 >= quizQs.length ? '結果を見る →' : '次の問題 →'}
                </button>
              </div>
            )}
          </>
        )}

        {/* 完了フェーズ */}
        {phase === 'done' && (
          <>
            <div className="text-center py-2">
              <p className="text-3xl font-bold text-gray-900">
                {results.filter((r) => r.ok).length}
                <span className="text-lg text-gray-400 font-normal"> / {results.length}問</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">正解</p>
            </div>

            <div className="space-y-2">
              {results.map((r, i) => {
                const slide = r.q.relatedSlideId
                  ? getSlideById(r.q.relatedSlideId)
                  : getSlideByQuestionId(r.q.id);
                return (
                  <div key={i} className={cn(
                    'rounded-lg p-2.5 border',
                    r.ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  )}>
                    <div className="flex items-start gap-2">
                      {r.ok
                        ? <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                        : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      }
                      <p className="text-xs text-gray-700 flex-1 line-clamp-2">{r.q.text}</p>
                    </div>
                    {!r.ok && slide && (
                      <button
                        onClick={() => navigate(`/slides/${slide.id}?from=home`)}
                        className="mt-1.5 ml-5 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <BookOpen className="w-3 h-3" />
                        {slide.title}で復習する →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {results.some((r) => !r.ok) && (
              <p className="text-xs text-red-500 text-center">
                ❗ 間違えた問題は苦手問題に自動登録されました
              </p>
            )}

            <button
              onClick={() => pickRandom(studiedPool)}
              className="w-full py-2 rounded-xl border border-blue-300 text-blue-600 text-xs font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              別の5問でもう一度
            </button>
          </>
        )}
      </CardBody>
    </Card>
  );
}

function ExportImportPanel() {
  const state = useAppStore();
  const [showImport, setShowImport] = useState(false);
  const [importMsg, setImportMsg] = useState('');

  const handleExport = () => {
    try {
      const data = {
        progress: state.progress,
        progressTableBaselines: state.progressTableBaselines,
        answerHistory: state.answerHistory,
        dailyStudy: state.dailyStudy,
        examSessions: state.examSessions,
        streakDays: state.streakDays,
        lastStudyDate: state.lastStudyDate,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `it-passport-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('エクスポートに失敗しました');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!parsed.progress || !parsed.answerHistory) {
          setImportMsg('❌ 無効なバックアップファイルです');
          return;
        }
        if (window.confirm('バックアップから復元しますか？\n現在のデータは上書きされます。')) {
          useAppStore.setState({ ...defaultAppState, ...parsed });
          setShowImport(false);
          setImportMsg('✅ 復元しました');
        }
      } catch {
        setImportMsg('❌ ファイルの読み込みに失敗しました');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-bold text-gray-800">データ管理</h3>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          進捗はこのブラウザのみに保存されます。定期的にバックアップして別のデバイスでも使えます。
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            エクスポート
          </button>
          <button
            onClick={() => { setShowImport((s) => !s); setImportMsg(''); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-blue-600 text-xs font-bold border border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            インポート
          </button>
        </div>
        {showImport && (
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <p className="text-xs text-gray-500">バックアップ（.json）ファイルを選択してください</p>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="text-xs w-full file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        )}
        {importMsg && (
          <p className={cn('text-xs font-medium', importMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500')}>
            {importMsg}
          </p>
        )}
      </CardBody>
    </Card>
  );
}

export const HomePage = () => {
  const navigate = useNavigate();
  const { progress, progressTableBaselines, resetDomainProgress } = useAppStore();

  // ─── Search ───────────────────────────────────────────────
  const [query, setQuery] = useState('');
  const [showDrop, setShowDrop] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return {
      glossary: glossaryTerms
        .filter((t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q) || (t.reading ?? '').toLowerCase().includes(q))
        .slice(0, 5),
      slides: slides
        .filter((s) => s.title.toLowerCase().includes(q) || s.sections.some((sec) => sec.keywords.some((kw) => kw.toLowerCase().includes(q)) || sec.title.toLowerCase().includes(q)))
        .slice(0, 4),
      questions: questions
        .filter((q2) => q2.text.toLowerCase().includes(q) || (q2.keywords ?? []).some((kw) => kw.toLowerCase().includes(q)))
        .slice(0, 3),
    };
  }, [query]);

  const hasResults = results && (results.glossary.length + results.slides.length + results.questions.length) > 0;

  // ─── Countdown ────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1_000);
    return () => clearInterval(id);
  }, []);

  // ─── UI state ─────────────────────────────────────────────
  const [showExam, setShowExam] = useState(false);
  const [expanded, setExpanded] = useState<Record<Domain, boolean>>({
    strategy: true,
    management: true,
    technology: true,
  });

  const toggleDomain = (d: Domain) => setExpanded((p) => ({ ...p, [d]: !p[d] }));

  // ─── Progress helpers ─────────────────────────────────────
  const getDisplay = (slide: Slide) => {
    const { rawSlide, rawQuiz, rawGlossary } = computeRaw(slide, progress);
    const base = progressTableBaselines[slide.id] ?? { slide: 0, quiz: 0, glossary: 0 };
    return {
      slide: Math.min(3, Math.max(0, rawSlide - base.slide)),
      quiz: Math.min(3, Math.max(0, rawQuiz - base.quiz)),
      glossary: rawGlossary !== null ? Math.min(3, Math.max(0, rawGlossary - base.glossary)) : null,
    };
  };

  const handleReset = (domain: Domain) => {
    const newBases: Record<string, { slide: number; quiz: number; glossary: number }> = {};
    for (const slide of slides.filter((s) => s.domain === domain)) {
      const { rawSlide, rawQuiz, rawGlossary } = computeRaw(slide, progress);
      newBases[slide.id] = { slide: rawSlide, quiz: rawQuiz, glossary: rawGlossary ?? 0 };
    }
    resetDomainProgress(newBases);
  };

  return (
    <div className="space-y-4">

      {/* ① 検索窓 */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="用語・キーワード・問題を検索..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDrop(true); }}
            onFocus={() => setShowDrop(true)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {query && (
            <button onClick={() => { setQuery(''); setShowDrop(false); }} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {showDrop && query.trim().length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden max-h-80 overflow-y-auto">
            {hasResults ? (
              <>
                {results!.glossary.length > 0 && (
                  <div>
                    <div className="px-3 py-1 text-xs font-semibold text-gray-400 bg-gray-50">用語集</div>
                    {results!.glossary.map((t) => (
                      <button key={t.id} onClick={() => { navigate(`/glossary?term=${t.id}`); setQuery(''); setShowDrop(false); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-purple-50 border-b border-gray-100 last:border-0 flex items-start gap-2">
                        <BookMarked className="w-3.5 h-3.5 text-purple-500 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900">{t.term}</div>
                          <div className="text-xs text-gray-500 truncate">{t.definition}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {results!.slides.length > 0 && (
                  <div>
                    <div className="px-3 py-1 text-xs font-semibold text-gray-400 bg-gray-50">スライド</div>
                    {results!.slides.map((s) => (
                      <button key={s.id} onClick={() => { navigate(`/slides/${s.id}`); setQuery(''); setShowDrop(false); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-blue-50 border-b border-gray-100 last:border-0 flex items-start gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{s.title}</div>
                          <div className="text-xs text-gray-500">{domainLabel[s.domain]} · {s.sections.length}セクション</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {results!.questions.length > 0 && (
                  <div>
                    <div className="px-3 py-1 text-xs font-semibold text-gray-400 bg-gray-50">問題</div>
                    {results!.questions.map((q2) => (
                      <button key={q2.id} onClick={() => { navigate(`/quiz?mode=domain&domain=${q2.domain}`); setQuery(''); setShowDrop(false); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-green-50 border-b border-gray-100 last:border-0 flex items-start gap-2">
                        <ClipboardList className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm text-gray-900 line-clamp-2">{q2.text}</div>
                          <div className="text-xs text-gray-500">{domainLabel[q2.domain]}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">「{query}」に一致する結果がありません</div>
            )}
          </div>
        )}
      </div>

      {/* ② 試験の概要 */}
      <Card>
        <CardBody>
          <button onClick={() => setShowExam((p) => !p)} className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-900">ITパスポート試験の概要</span>
            </div>
            {showExam ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {showExam && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {EXAM_INFO.map(([label, value, full]) => (
                <div key={label} className={cn('bg-gray-50 rounded-lg p-2.5', full && 'col-span-2')}>
                  <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                  <div className="text-xs font-medium text-gray-800">{value}</div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* ③ カウントダウン */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
        <p className="text-xs text-blue-200 mb-2 text-center">試験日まで（2026年8月20日）</p>
        <div className="flex gap-2">
          {([['日', timeLeft.days], ['時間', timeLeft.hours], ['分', timeLeft.minutes], ['秒', timeLeft.seconds]] as [string, number][]).map(([label, val]) => (
            <div key={label} className="flex-1 bg-blue-500/50 rounded-xl py-2 text-center">
              <div className="text-2xl font-bold tabular-nums leading-none">{String(val).padStart(2, '0')}</div>
              <div className="text-xs text-blue-200 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ④ 抜き打ちテスト */}
      <SurpriseQuizPanel />

      {/* ⑤ 進捗表 */}
      <div>
        <div className="flex items-start gap-1.5 mb-2">
          <h2 className="font-bold text-gray-900 text-sm">学習進捗</h2>
          <span className="text-xs text-gray-400 mt-0.5">全セクション閲覧・全問回答・全用語閲覧で各●1つ（最大3回）</span>
        </div>
        <div className="space-y-3">
          {DOMAINS.map((domain) => {
            const domainSlides = slides.filter((s) => s.domain === domain);
            const isOpen = expanded[domain];
            return (
              <Card key={domain}>
                <CardBody className="p-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleDomain(domain)} className="flex-1 flex items-center gap-1.5 text-left min-w-0">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                      <span className="font-semibold text-sm text-gray-900">{domainLabel[domain]}</span>
                      <span className="text-xs text-gray-400 shrink-0">（{domainSlides.length}テーマ）</span>
                    </button>
                    <button
                      onClick={() => handleReset(domain)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-300 rounded-lg px-2 py-1 transition-colors shrink-0"
                    >
                      <RotateCcw className="w-3 h-3" />
                      リセット
                    </button>
                  </div>

                  {isOpen && (
                    <div className="mt-2">
                      <div className="grid grid-cols-[1fr_52px_52px_52px] gap-x-1 px-1 pb-1 border-b border-gray-100">
                        <div className="text-xs text-gray-400">テーマ</div>
                        <div className="text-center">
                          <BookOpen className="w-3 h-3 text-blue-400 mx-auto" />
                          <div className="text-xs text-gray-400">学習</div>
                        </div>
                        <div className="text-center">
                          <ClipboardList className="w-3 h-3 text-green-400 mx-auto" />
                          <div className="text-xs text-gray-400">問題</div>
                        </div>
                        <div className="text-center">
                          <BookMarked className="w-3 h-3 text-purple-400 mx-auto" />
                          <div className="text-xs text-gray-400">用語</div>
                        </div>
                      </div>

                      <div className="divide-y divide-gray-100">
                        {domainSlides.map((slide) => {
                          const counts = getDisplay(slide);
                          return (
                            <div key={slide.id} className="grid grid-cols-[1fr_52px_52px_52px] gap-x-1 items-center py-1.5 px-1">
                              <button
                                onClick={() => navigate(`/slides/${slide.id}`)}
                                className="text-xs text-blue-600 hover:text-blue-800 text-left font-medium truncate pr-1 hover:underline"
                              >
                                {slide.title}
                              </button>
                              <div className="flex gap-0.5 justify-center">
                                {[0, 1, 2].map((i) => (
                                  <div key={i} className={cn('w-2.5 h-2.5 rounded-full', i < counts.slide ? 'bg-blue-500' : 'bg-gray-200')} />
                                ))}
                              </div>
                              <div className="flex gap-0.5 justify-center">
                                {[0, 1, 2].map((i) => (
                                  <div key={i} className={cn('w-2.5 h-2.5 rounded-full', i < counts.quiz ? 'bg-green-500' : 'bg-gray-200')} />
                                ))}
                              </div>
                              <div className="flex gap-0.5 justify-center">
                                {counts.glossary !== null
                                  ? [0, 1, 2].map((i) => (
                                    <div key={i} className={cn('w-2.5 h-2.5 rounded-full', i < counts.glossary! ? 'bg-purple-500' : 'bg-gray-200')} />
                                  ))
                                  : <span className="text-xs text-gray-300 w-full text-center">―</span>
                                }
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Data management */}
        <ExportImportPanel />
      </div>
    </div>
  );
};
