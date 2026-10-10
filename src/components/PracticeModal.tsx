import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, AlertTriangle, UserCheck, Award, RefreshCw, Copy, Check } from 'lucide-react';
import { InterviewQuestion, AnswerEvaluationResult } from '../types';

interface PracticeModalProps {
  question: InterviewQuestion | null;
  interviewerTitle: string;
  candidateRole: string;
  onClose: () => void;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  question,
  interviewerTitle,
  candidateRole,
  onClose,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<AnswerEvaluationResult | null>(null);
  const [copiedPolished, setCopiedPolished] = useState(false);

  if (!question) return null;

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      setError('Lütfen bir cevap yazın.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerTitle,
          candidateRole,
          question: question.question,
          hiddenAgenda: question.hiddenAgenda,
          userAnswer,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Cevap değerlendirilirken sunucu hatası oluştu.');
      }

      const result: AnswerEvaluationResult = await response.json();
      setEvaluation(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Cevabınız analiz edilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const copyPolishedAnswer = () => {
    if (!evaluation?.polishedAnswer) return;
    navigator.clipboard.writeText(evaluation.polishedAnswer);
    setCopiedPolished(true);
    setTimeout(() => setCopiedPolished(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Canlı Mülakat Cevap Simülatörü</h3>
              <p className="text-xs text-slate-400">
                Mülakatçı: <span className="text-indigo-300 font-semibold">{interviewerTitle}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Target Question Box */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {question.category}
              </span>
              <span className="text-xs text-amber-400 font-medium">
                Zorluk: {question.difficulty}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-100">
              "{question.question}"
            </h4>
            <div className="mt-2.5 pt-2.5 border-t border-slate-800/60 flex items-start gap-2 text-xs text-slate-400">
              <span className="text-indigo-400 font-semibold whitespace-nowrap">Gizli Amaç:</span>
              <span>{question.hiddenAgenda}</span>
            </div>
          </div>

          {/* Answer Input Area */}
          {!evaluation ? (
            <form onSubmit={handleEvaluate} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                    <span>Cevabınızı Yazın (STAR Tekniğini Deneyin)</span>
                  </label>
                  <span className="text-xs text-slate-500">
                    Durum ➔ Görev ➔ Eylemleriniz ➔ Somut Sonuç
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Örnek: 'Önceki projemizde yüksek trafik anında veritabanı darboğazı yaşamıştık (Durum). Ben bu sorunu 48 saat içinde çözmekle görevlendirildim (Görev). İlk olarak Redis önbellekleme katmanı ekledim ve N+1 sorgularını optimize ettim (Eylem). Sonuç olarak yanıt süreleri %65 azaldı ve sistem kesintisiz çalıştı (Sonuç)...'"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans leading-relaxed"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Tips for candidate */}
              <div className="bg-indigo-950/30 border border-indigo-900/30 rounded-xl p-3 text-xs text-indigo-300 space-y-1">
                <p className="font-semibold text-indigo-200">
                  {interviewerTitle} İçin Kazandıran İpuçları:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-indigo-300/90 pl-1">
                  {question.starWinningPoints.slice(0, 3).map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading || !userAnswer.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Koç Analiz Ediyor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Cevabımı Değerlendir</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Evaluation Results */
            <div className="space-y-6">
              {/* Score Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex flex-col items-center justify-center shrink-0">
                    <span className="text-2xl font-black text-indigo-400">
                      {evaluation.score}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      / 10 Puan
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        Koç Değerlendirme Özeti
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 italic">
                      "{evaluation.coachVerdict}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEvaluation(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-700 flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tekrar Cevapla</span>
                </button>
              </div>

              {/* Interviewer's Perception */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>{interviewerTitle} Bu Cevaptan Ne Anladı?</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {evaluation.interviewerImpression}
                </p>
              </div>

              {/* STAR Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Durum & Görev (S & T)
                  </span>
                  <p className="text-xs text-slate-300">
                    {evaluation.starRating.situationTask}
                  </p>
                </div>
                <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Aksiyon & Eylemler (A)
                  </span>
                  <p className="text-xs text-slate-300">
                    {evaluation.starRating.actionTaken}
                  </p>
                </div>
                <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Ölçülebilir Sonuç (R)
                  </span>
                  <p className="text-xs text-slate-300">
                    {evaluation.starRating.measurableResult}
                  </p>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4">
                  <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Güçlü Yönler</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {evaluation.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-4">
                  <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Geliştirilecek Noktalar</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {evaluation.areasForImprovement.map((area, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Polished Model Answer */}
              <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/30 rounded-xl p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Koçun Önerdiği İdeal Versiyon (Model Answer)</span>
                  </div>
                  <button
                    onClick={copyPolishedAnswer}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                  >
                    {copiedPolished ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line bg-slate-950/70 p-3.5 rounded-lg border border-slate-800/80">
                  {evaluation.polishedAnswer}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
