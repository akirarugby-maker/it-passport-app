import { useNavigate } from 'react-router-dom';
import { Flame, BookOpen, ClipboardList, TrendingUp, AlertTriangle, CheckCircle2, Target } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/store/useAppStore';
import { questions } from '@/data/questions';
import { slides } from '@/data/slides';
import { domainLabel, domainChartColor } from '@/utils/domain';
import type { Domain } from '@/types';

const DOMAINS: Domain[] = ['strategy', 'management', 'technology'];
const DAILY_GOAL_QUESTIONS = 20;

export const HomePage = () => {
  const navigate = useNavigate();
  const { answerHistory, streakDays, progress } = useAppStore();
  const todayStats = useAppStore((s) => s.getTodayStats());
  const weakIds = useAppStore((s) => s.getWeakQuestionIds());

  const domainStats = DOMAINS.map((domain) => {
    const domainQs = questions.filter((q) => q.domain === domain);
    const answered = answerHistory.filter((a) => domainQs.some((q) => q.id === a.questionId));
    const correct = answered.filter((a) => a.isCorrect);
    const accuracy = answered.length > 0 ? Math.round((correct.length / answered.length) * 100) : 0;

    const allSections = slides.filter((s) => s.domain === domain).flatMap((s) => s.sections);
    const masteredSections = allSections.filter((sec) => (progress.slidesSections[sec.id]?.count ?? 0) >= 3).length;

    return {
      domain,
      label: domainLabel[domain],
      answered: answered.length,
      correct: correct.length,
      accuracy,
      masteredSections,
      totalSections: allSections.length,
      color: domainChartColor[domain],
    };
  });

  const totalAnswered = answerHistory.length;
  const totalCorrect = answerHistory.filter((a) => a.isCorrect).length;
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const weakDomains = domainStats.filter((d) => d.answered >= 5 && d.accuracy < 60);

  const pieData = DOMAINS.map((domain) => ({
    name: domainLabel[domain],
    value: domainStats.find((d) => d.domain === domain)?.accuracy ?? 0,
    color: domainChartColor[domain],
  }));

  const dailyProgress = Math.min(100, Math.round((todayStats.questions / DAILY_GOAL_QUESTIONS) * 100));

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold mb-1">ITパスポート学習</h1>
            <p className="text-blue-100 text-sm">合格基準：総合600点以上・各分野300点以上</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-2">
            <Flame className="w-5 h-5 text-orange-300" />
            <span className="font-bold text-lg">{streakDays}</span>
            <span className="text-sm text-blue-100">日連続</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{totalAnswered}</div>
            <div className="text-xs text-blue-100 mt-0.5">総解答数</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{overallAccuracy}%</div>
            <div className="text-xs text-blue-100 mt-0.5">全体正答率</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{weakIds.length}</div>
            <div className="text-xs text-blue-100 mt-0.5">苦手問題数</div>
          </div>
        </div>
      </div>

      {/* Today's progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-gray-900">今日の学習進捗</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <ProgressBar
              value={todayStats.questions}
              max={DAILY_GOAL_QUESTIONS}
              color={dailyProgress >= 100 ? 'bg-green-500' : 'bg-blue-500'}
              showLabel
              label={`問題演習（${todayStats.questions}/${DAILY_GOAL_QUESTIONS}問）`}
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>今日の正答数：{todayStats.correct}問</span>
              <span>スライド閲覧：{todayStats.slides}件</span>
              {dailyProgress >= 100 && (
                <Badge variant="success">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  ノルマ達成！
                </Badge>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Weak domain alert */}
      {weakDomains.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardBody>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-medium text-red-800 mb-1">苦手分野があります</h3>
                <div className="flex flex-wrap gap-2">
                  {weakDomains.map((d) => (
                    <Badge key={d.domain} variant="danger">
                      {d.label}（{d.accuracy}%）
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate('/quiz?mode=weak')}
                >
                  苦手問題を解く
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Domain accuracy chart */}
      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h2 className="font-semibold text-gray-900">分野別正答率</h2>
            </div>
          </CardHeader>
          <CardBody>
            {totalAnswered === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">まだ問題を解いていません</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, '正答率']} />
                  <Legend
                    formatter={(value) => <span className="text-xs">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">分野別詳細</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {domainStats.map((d) => (
              <div key={d.domain}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{d.label}</span>
                  <span className="text-sm text-gray-500">
                    {d.answered > 0 ? `${d.accuracy}%` : '未挑戦'}
                  </span>
                </div>
                <ProgressBar
                  value={d.accuracy}
                  color={
                    d.accuracy >= 60 ? 'bg-green-500' : d.accuracy >= 40 ? 'bg-yellow-500' : 'bg-red-400'
                  }
                />
                <div className="text-xs text-gray-400 mt-1">
                  {d.answered}問解答 / スライド習得: {d.masteredSections}/{d.totalSections}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Card onClick={() => navigate('/slides')} className="hover:border-blue-300">
          <CardBody className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 text-sm">スライド学習</div>
              <div className="text-xs text-gray-500">10カテゴリ</div>
            </div>
          </CardBody>
        </Card>
        <Card onClick={() => navigate('/quiz')} className="hover:border-green-300">
          <CardBody className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 text-sm">問題演習</div>
              <div className="text-xs text-gray-500">{questions.length}問収録</div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
