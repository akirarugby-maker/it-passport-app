import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, BookOpen, RotateCcw, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/store/useAppStore';
import { questions, getQuestionsByIds } from '@/data/questions';
import { domainLabel, domainBadgeClass } from '@/utils/domain';
import { cn } from '@/utils/cn';

export const WeakPage = () => {
  const navigate = useNavigate();
  const { answerHistory } = useAppStore();

  // Group answer history by questionId, compute stats
  const weakQuestions = useMemo(() => {
    const stats: Record<string, { total: number; correct: number }> = {};
    for (const record of answerHistory) {
      if (!stats[record.questionId]) stats[record.questionId] = { total: 0, correct: 0 };
      stats[record.questionId].total++;
      if (record.isCorrect) stats[record.questionId].correct++;
    }

    return questions
      .filter((q) => {
        const s = stats[q.id];
        // Show any question answered at least once with at least one wrong answer
        return s && s.total > 0 && s.correct < s.total;
      })
      .map((q) => ({
        question: q,
        total: stats[q.id].total,
        correct: stats[q.id].correct,
        accuracy: Math.round((stats[q.id].correct / stats[q.id].total) * 100),
      }))
      .sort((a, b) => a.accuracy - b.accuracy); // worst first
  }, [answerHistory]);

  const avgAccuracy = weakQuestions.length
    ? Math.round(weakQuestions.reduce((s, q) => s + q.accuracy, 0) / weakQuestions.length)
    : 0;

  if (weakQuestions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-red-500" />
          <h1 className="text-xl font-bold text-gray-900">苦手問題</h1>
        </div>
        <div className="text-center py-16 text-gray-400">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400 opacity-60" />
          <p className="font-medium text-gray-600">苦手問題はまだありません</p>
          <p className="text-sm mt-1">問題演習を進めると、間違えた問題がここに登録されます。</p>
          <Button className="mt-6" onClick={() => navigate('/quiz')}>
            問題演習を始める
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-red-500" />
        <h1 className="text-xl font-bold text-gray-900">苦手問題</h1>
        <span className="text-sm text-gray-500">{weakQuestions.length}問</span>
      </div>

      {/* Summary card */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">平均正答率</p>
              <p className={cn('text-3xl font-bold', avgAccuracy < 40 ? 'text-red-600' : 'text-orange-500')}>
                {avgAccuracy}<span className="text-lg font-normal text-gray-500">%</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">苦手問題数</p>
              <p className="text-3xl font-bold text-gray-700">{weakQuestions.length}<span className="text-lg font-normal text-gray-500">問</span></p>
            </div>
          </div>
          <Button
            className="w-full mt-3"
            onClick={() => navigate('/quiz?mode=weak')}
          >
            <RotateCcw className="w-4 h-4" />
            苦手問題をまとめて練習
          </Button>
        </CardBody>
      </Card>

      {/* Question list */}
      <div className="space-y-2">
        {weakQuestions.map(({ question: q, total, correct, accuracy }) => (
          <Card key={q.id} className="border-l-4 border-l-red-400">
            <CardBody className="py-3">
              <div className="flex items-start gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-900 leading-snug line-clamp-3 flex-1">{q.text}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded', domainBadgeClass[q.domain])}>
                  {domainLabel[q.domain]}
                </span>
                <span className="text-xs text-gray-400">{q.category}</span>
              </div>

              {/* Stats row */}
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-500">
                    正答 <span className="font-bold text-green-600">{correct}</span> / {total}回
                  </span>
                  <Badge variant={accuracy < 40 ? 'danger' : 'warning'}>
                    正答率 {accuracy}%
                  </Badge>
                </div>
                <div className="flex gap-2 shrink-0">
                  {q.relatedSlideId && (
                    <button
                      onClick={() => navigate(`/slides/${q.relatedSlideId}`)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 rounded-lg px-2 py-1 transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      スライド
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/quiz?mode=weak')}
                    className="flex items-center gap-1 text-xs text-white bg-red-500 hover:bg-red-600 rounded-lg px-2 py-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    練習
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
