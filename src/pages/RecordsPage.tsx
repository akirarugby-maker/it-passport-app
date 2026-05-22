import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from 'recharts';
import { Calendar, BarChart2, ListChecks, RotateCcw } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RepetitionBadge } from '@/components/ui/RepetitionBadge';
import { useAppStore } from '@/store/useAppStore';
import { questions } from '@/data/questions';
import { slides } from '@/data/slides';
import { glossaryTerms } from '@/data/glossary';
import { domainLabel, domainChartColor, domainBadgeClass } from '@/utils/domain';
import { cn } from '@/utils/cn';
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns';
import type { Domain } from '@/types';

const DOMAINS: Domain[] = ['strategy', 'management', 'technology'];

type TabKey = 'overview' | 'calendar' | 'weak' | 'progress';

export const RecordsPage = () => {
  const navigate = useNavigate();
  const { answerHistory, dailyStudy, progress, streakDays } = useAppStore();
  const [tab, setTab] = useState<TabKey>('overview');

  // Last 14 days
  const last14 = eachDayOfInterval({ start: subDays(new Date(), 13), end: new Date() });
  const calendarData = last14.map((d) => {
    const dateStr = format(d, 'yyyy-MM-dd');
    const day = dailyStudy.find((ds) => ds.date === dateStr);
    return {
      date: format(d, 'M/d'),
      fullDate: dateStr,
      questions: day?.questionCount ?? 0,
      correct: day?.correctCount ?? 0,
      slides: day?.slidesSeen ?? 0,
    };
  });

  // Domain accuracy over time (last 30 days)
  const domainAccuracyData = DOMAINS.map((domain) => {
    const domainQs = questions.filter((q) => q.domain === domain);
    const answered = answerHistory.filter((a) => domainQs.some((q) => q.id === a.questionId));
    const correct = answered.filter((a) => a.isCorrect).length;
    return {
      name: domainLabel[domain],
      accuracy: answered.length > 0 ? Math.round((correct / answered.length) * 100) : 0,
      answered: answered.length,
      fill: domainChartColor[domain],
    };
  });

  // Weak questions (answered at least once, accuracy < 60%)
  const questionAccuracy: Record<string, { total: number; correct: number }> = {};
  for (const a of answerHistory) {
    if (!questionAccuracy[a.questionId]) questionAccuracy[a.questionId] = { total: 0, correct: 0 };
    questionAccuracy[a.questionId].total++;
    if (a.isCorrect) questionAccuracy[a.questionId].correct++;
  }
  const weakQuestions = questions
    .filter((q) => {
      const r = questionAccuracy[q.id];
      return r && r.total >= 1 && r.correct / r.total < 0.6;
    })
    .map((q) => {
      const r = questionAccuracy[q.id];
      return { ...q, accuracy: Math.round((r.correct / r.total) * 100), attempts: r.total };
    })
    .sort((a, b) => a.accuracy - b.accuracy);

  // Progress tracking
  const allSections = slides.flatMap((s) => s.sections.map((sec) => ({ ...sec, slideTitle: s.title, domain: s.domain as Domain })));
  const sectionProgress = allSections.map((sec) => ({
    ...sec,
    count: progress.slidesSections[sec.id]?.count ?? 0,
  }));

  const masteredSections = sectionProgress.filter((s) => s.count >= 3).length;
  const masteredQuestions = questions.filter((q) => (progress.questions[q.id]?.count ?? 0) >= 3).length;
  const masteredGlossary = glossaryTerms.filter((t) => (progress.glossaryTerms[t.id]?.count ?? 0) >= 3).length;

  const tabs = [
    { key: 'overview' as TabKey, label: '概要', icon: BarChart2 },
    { key: 'calendar' as TabKey, label: 'カレンダー', icon: Calendar },
    { key: 'weak' as TabKey, label: '苦手問題', icon: ListChecks },
    { key: 'progress' as TabKey, label: '反復進捗', icon: RotateCcw },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">学習記録</h1>
        <p className="text-sm text-gray-500 mt-1">継続日数: {streakDays}日</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all',
              tab === key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '総解答数', value: answerHistory.length, unit: '問' },
              { label: '全体正答率', value: answerHistory.length > 0 ? Math.round(answerHistory.filter(a => a.isCorrect).length / answerHistory.length * 100) : 0, unit: '%' },
              { label: '連続学習', value: streakDays, unit: '日' },
              { label: '苦手問題', value: weakQuestions.length, unit: '問' },
            ].map(({ label, value, unit }) => (
              <Card key={label}>
                <CardBody className="text-center py-4">
                  <div className="text-2xl font-bold text-gray-900">{value}<span className="text-base text-gray-400">{unit}</span></div>
                  <div className="text-xs text-gray-500 mt-1">{label}</div>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader><h2 className="font-semibold">分野別正答率</h2></CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={domainAccuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v}%`, '正答率']} />
                  <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                    {domainAccuracyData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="font-semibold">14日間の学習推移</h2></CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={calendarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="questions" stroke="#3b82f6" strokeWidth={2} dot={false} name="解答数" />
                  <Line type="monotone" dataKey="correct" stroke="#10b981" strokeWidth={2} dot={false} name="正解数" />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Calendar tab */}
      {tab === 'calendar' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="font-semibold">学習カレンダー（直近14日）</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-7 gap-1">
                {calendarData.map((day) => (
                  <div key={day.fullDate} className="text-center">
                    <div className="text-xs text-gray-400 mb-1">{day.date}</div>
                    <div
                      className={cn(
                        'w-full aspect-square rounded-md flex items-center justify-center text-xs font-bold',
                        day.questions === 0 ? 'bg-gray-100 text-gray-300' :
                        day.questions < 5 ? 'bg-blue-100 text-blue-600' :
                        day.questions < 10 ? 'bg-blue-300 text-blue-800' :
                        'bg-blue-500 text-white'
                      )}
                    >
                      {day.questions > 0 ? day.questions : ''}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-3 justify-end text-xs text-gray-500">
                <span>少</span>
                {['bg-gray-100', 'bg-blue-100', 'bg-blue-300', 'bg-blue-500'].map((c, i) => (
                  <div key={i} className={cn('w-4 h-4 rounded', c)} />
                ))}
                <span>多</span>
              </div>
            </CardBody>
          </Card>

          {calendarData.map((day) => day.questions > 0 && (
            <Card key={day.fullDate}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{day.fullDate}</span>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span>解答 {day.questions}問</span>
                    <span>正解 {day.correct}問</span>
                    <span>({day.questions > 0 ? Math.round(day.correct / day.questions * 100) : 0}%)</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Weak questions tab */}
      {tab === 'weak' && (
        <div className="space-y-3">
          {weakQuestions.length === 0 ? (
            <Card>
              <CardBody className="text-center py-8 text-gray-400">
                <ListChecks className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>苦手問題はありません</p>
              </CardBody>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{weakQuestions.length}問の苦手問題</span>
                <Button size="sm" onClick={() => navigate('/quiz?mode=weak')}>
                  <RotateCcw className="w-4 h-4" />
                  苦手問題を解く
                </Button>
              </div>
              {weakQuestions.map((q) => (
                <Card key={q.id} className="border-red-100">
                  <CardBody>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('text-xs px-2 py-0.5 rounded font-medium', domainBadgeClass[q.domain])}>
                            {domainLabel[q.domain]}
                          </span>
                          <span className="text-xs text-gray-400">{q.category}</span>
                        </div>
                        <p className="text-sm text-gray-900">{q.text}</p>
                      </div>
                      <div className="text-center shrink-0">
                        <div className="text-lg font-bold text-red-600">{q.accuracy}%</div>
                        <div className="text-xs text-gray-400">{q.attempts}回</div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </>
          )}
        </div>
      )}

      {/* Progress tab */}
      {tab === 'progress' && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'スライド習得', value: masteredSections, total: allSections.length },
              { label: '問題習得', value: masteredQuestions, total: questions.length },
              { label: '用語習得', value: masteredGlossary, total: glossaryTerms.length },
            ].map(({ label, value, total }) => (
              <Card key={label}>
                <CardBody className="text-center py-3">
                  <div className="text-xl font-bold text-gray-900">{value}<span className="text-sm text-gray-400">/{total}</span></div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-green-400 h-1 rounded-full" style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }} />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Section progress by domain */}
          {DOMAINS.map((domain) => {
            const domainSections = sectionProgress.filter((s) => s.domain === domain);
            return (
              <Card key={domain}>
                <CardHeader>
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded', domainBadgeClass[domain])}>
                    {domainLabel[domain]}
                  </span>
                </CardHeader>
                <CardBody className="space-y-2">
                  {domainSections.map((sec) => (
                    <div key={sec.id} className="flex items-center justify-between">
                      <span className="text-xs text-gray-700 flex-1">{sec.title}</span>
                      <RepetitionBadge count={sec.count} size="sm" />
                    </div>
                  ))}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
