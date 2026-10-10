import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Users,
  Target,
  Briefcase,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  MessageSquareQuote,
  ShieldAlert,
  ArrowRight,
  Copy,
  Check,
  Building,
  GraduationCap,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { InterviewGenerationResult, InterviewQuestion } from '../types';
import { INTERVIEWER_PRESETS } from '../constants/presets';
import { PracticeModal } from './PracticeModal';

export const InterviewCoach: React.FC = () => {
  const [interviewerTitle, setInterviewerTitle] = useState('Satış Yöneticisi (Sales Manager)');
  const [candidateRole, setCandidateRole] = useState('B2B Kıdemli Satış Uzmanı / Account Executive');
  const [candidateSeniority, setCandidateSeniority] = useState('Mid-Senior (3-6 Yıl)');
  const [companyType, setCompanyType] = useState('B2B Kurumsal Çözümler & SaaS');
  const [focusArea, setFocusArea] = useState('Satış Hunisi (Pipeline), İtiraz Yönetimi & Kapanış');
  const [customNotes, setCustomNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InterviewGenerationResult | null>(null);

  const [activeQuestionForPractice, setActiveQuestionForPractice] = useState<InterviewQuestion | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Load saved state from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('interview_coach_last_result');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.result) {
          setResult(parsed.result);
          if (parsed.interviewerTitle) setInterviewerTitle(parsed.interviewerTitle);
          if (parsed.candidateRole) setCandidateRole(parsed.candidateRole);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!interviewerTitle.trim() || !candidateRole.trim()) {
      setError('Lütfen mülakatçı unvanı ve başvurulan rolü belirtin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/interview/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerTitle,
          candidateRole,
          candidateSeniority,
          companyType,
          focusArea,
          customNotes,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Sorular üretilirken sunucu hatası oluştu.');
      }

      const data: InterviewGenerationResult = await response.json();
      setResult(data);
      if (data.questions.length > 0) {
        setExpandedQuestionId(data.questions[0].id);
      }

      // Save to localStorage
      try {
        localStorage.setItem(
          'interview_coach_last_result',
          JSON.stringify({ result: data, interviewerTitle, candidateRole })
        );
      } catch (err) {
        // ignore storage errors
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Sorular oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset: (typeof INTERVIEWER_PRESETS)[0]) => {
    setInterviewerTitle(preset.title);
    setCandidateRole(preset.defaultRole);
    setCandidateSeniority(preset.seniority);
    setCompanyType(preset.companyType);
    setFocusArea(preset.focusArea);
  };

  const copyQuestionsText = () => {
    if (!result) return;
    const text = `Mülakatçı: ${interviewerTitle}
Hedef Rol: ${candidateRole} (${candidateSeniority})

MÜLAKATÇI ODAK NOKTASI:
${result.interviewerMindset.roleFocus}

BEKLENEN SORULAR:
${result.questions
  .map(
    (q, i) => `${i + 1}. [${q.category}] ${q.question}
- Gizli Amaç: ${q.hiddenAgenda}
- Kazandıran Puanlar: ${q.starWinningPoints.join(' | ')}
`
  )
  .join('\n')}

TERS SORULAR (ADAYIN SORABİLECEĞİ):
${result.reverseQuestionsForInterviewer.map((rq, i) => `${i + 1}. ${rq.question} (${rq.whyItWorks})`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Unvana Özel Mülakat Soru Simülatörü
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Mülakatçının Unvanını Girin, Potansiyel Sorularını ve Zihin Yapısını Önceden Çözün
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Mülakata katılacak kişinin unvanına (örn: <em>Engineering Manager</em>, <em>Senior HR BP</em>, <em>Lead Architect</em>, <em>Head of Product</em>) göre neleri test edeceğini, hangi soruları soracağını ve o unvanı en çok etkileyen STAR yanıt çerçevesini anında öğrenin.
          </p>
        </div>

        {/* Quick Presets Pills */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
            Hızlı Örnek Unvanlar:
          </span>
          <div className="flex flex-wrap gap-2">
            {INTERVIEWER_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  interviewerTitle === preset.title
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-semibold shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form Input Panel */}
      <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Interviewer Title */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" />
                Mülakatı Yapanın Unvanı *
              </span>
            </label>
            <input
              type="text"
              required
              value={interviewerTitle}
              onChange={(e) => setInterviewerTitle(e.target.value)}
              placeholder="Örn: Engineering Manager, VP of Product, Senior HR BP..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Bu unvandaki kişinin yetki alanı ve sorumluluklarına göre analiz edilir.
            </p>
          </div>

          {/* Candidate Target Role */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-violet-400" />
                Hedef Pozisyon / Rolünüz *
              </span>
            </label>
            <input
              type="text"
              required
              value={candidateRole}
              onChange={(e) => setCandidateRole(e.target.value)}
              placeholder="Örn: Senior Full Stack Developer, Product Manager..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Başvurduğunuz pozisyonun teknik ve fonksiyonel kapsamı.
            </p>
          </div>

          {/* Candidate Seniority */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                Kıdem Seviyesi
              </span>
            </label>
            <select
              value={candidateSeniority}
              onChange={(e) => setCandidateSeniority(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="Junior (0-2 Yıl)">Junior (0-2 Yıl)</option>
              <option value="Mid-Level (2-5 Yıl)">Mid-Level (2-5 Yıl)</option>
              <option value="Senior (5-8 Yıl)">Senior (5-8 Yıl)</option>
              <option value="Lead / Staff / Principal (8+ Yıl)">Lead / Staff / Principal (8+ Yıl)</option>
              <option value="Engineering Manager / Director">Yönetici / Director</option>
            </select>
          </div>

          {/* Company Type */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-400" />
                Şirket / Sektör Türü
              </span>
            </label>
            <input
              type="text"
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              placeholder="Örn: Büyüyen Scale-Up, Kurumsal Bankacılık, Erken Aşama Startup..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Focus Area */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-pink-400" />
                Mülakat Odak Formatı
              </span>
            </label>
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="Satış Hunisi (Pipeline), İtiraz Yönetimi & Kapanış">Satış Hunisi, İtiraz Yönetimi & Kapanış</option>
              <option value="Ticari Müzakere, Fiyatlandırma & C-Level İkna">Ticari Müzakere & C-Level İkna</option>
              <option value="Tümü (Teknik, Mimari, Kültür & Liderlik)">Tümü (Dengeli Karma)</option>
              <option value="Davranışsal & Kültür Uyumu (Behavioral)">Davranışsal & Kültür Uyumu (Behavioral)</option>
              <option value="Sistem Tasarımı & Mimari Derinlik">Sistem Tasarımı & Mimari Derinlik</option>
              <option value="Problem Çözme, Canlı Kod & Algoritma">Problem Çözme & Canlı Vaka</option>
              <option value="Liderlik, Mentorluk & Takım Yönetimi">Liderlik, Çatışma & Takım Yönetimi</option>
            </select>
          </div>

          {/* Custom Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <MessageSquareQuote className="w-4 h-4 text-cyan-400" />
                Özel Not / Şirket Bilgisi (İsteğe Bağlı)
              </span>
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Örn: Mikroservislere geçiyorlar, 2. tur mülakatı..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500 hidden sm:block">
            Gemini 3.8 Flash zeka modeliyle saniyeler içinde unvana özel analiz üretir.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Mülakatçı Profili & Sorular Hazırlanıyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Soruları & Zihin Yapısını Çıkar</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results View */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* 1. Interviewer Mindset Profile Card */}
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={copyQuestionsText}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
                title="Tüm hazırlık dosyasını kopyala"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Tümünü Kopyala</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
                  Mülakatçı Zihin Haritası
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {interviewerTitle} Bu Mülakatta Neye Bakıyor?
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
              {/* Focus */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-400" />
                  Mülakattaki Temel Odak Noktası
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {result.interviewerMindset.roleFocus}
                </p>
              </div>

              {/* Evaluation Rubric */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Baktığı En Kritik 4 Kriter
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                  {result.interviewerMindset.evaluationCriteria.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold shrink-0">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Red Flags to Avoid */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  Bu Unvan İçin Kırmızı Bayraklar (Elenme Sebepleri)
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                  {result.interviewerMindset.redFlags.map((rf, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold shrink-0">•</span>
                      <span>{rf}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Golden Tip */}
            <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-violet-950/40 to-slate-950 border border-indigo-500/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Koçun Altın Tavsiyesi:
                </span>
                <p className="text-xs sm:text-sm text-slate-200 mt-0.5 leading-relaxed">
                  {result.interviewerMindset.coachingTip}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Questions List with Interactive Practice */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>Potansiyel Mülakat Soruları ({result.questions.length})</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {interviewerTitle}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Her sorunun gizli amacını inceleyin veya "Pratik Yap" butonuna basarak cevabınızı test edin.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {result.questions.map((q, idx) => {
                const isExpanded = expandedQuestionId === q.id;
                return (
                  <div
                    key={q.id || idx}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all shadow-md"
                  >
                    {/* Question Header Bar */}
                    <div
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="h-7 w-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                              {q.category}
                            </span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              Zorluk: {q.difficulty}
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
                            {q.question}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveQuestionForPractice(q);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-transform active:scale-95"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Pratik Yap</span>
                        </button>
                        <div className="text-slate-400 p-1">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Breakdown */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 bg-slate-950/40 space-y-4">
                        {/* Hidden Agenda */}
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                          <span className="text-indigo-400 font-bold uppercase tracking-wider block mb-1">
                            🕵️ Mülakatçı Satır Arasında Ne Arıyor? (Gizli Amaç)
                          </span>
                          <p className="leading-relaxed">{q.hiddenAgenda}</p>
                        </div>

                        {/* STAR Winning points */}
                        <div>
                          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
                            ⭐ Kazandıran Yanıt Çerçevesi (STAR Kilit Noktaları):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.starWinningPoints.map((pt, pIdx) => (
                              <div
                                key={pIdx}
                                className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-xs text-slate-300 flex items-start gap-2"
                              >
                                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Common Mistakes */}
                        <div>
                          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block mb-1.5">
                            ⚠️ Kaçınılması Gereken Hatalar (Tuzaklar):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.commonMistakes.map((cm, cIdx) => (
                              <div
                                key={cIdx}
                                className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/30 text-xs text-slate-300 flex items-start gap-2"
                              >
                                <span className="text-rose-400 font-bold shrink-0">✗</span>
                                <span>{cm}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Model Answer Snippet */}
                        <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/30 text-xs">
                          <span className="text-amber-300 font-bold uppercase tracking-wider block mb-1">
                            💡 Örnek Giriş ve Strateji Taslağı:
                          </span>
                          <p className="text-slate-300 italic leading-relaxed">
                            "{q.sampleModelAnswerSnippet}"
                          </p>
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => setActiveQuestionForPractice(q)}
                            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                          >
                            <span>Bu soru için kendi cevabımı yazıp puan almak istiyorum</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Reverse Questions for Candidate to Ask */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-violet-400">
                  Mülakatın Sonunda Sizin Soracağınız Sorular
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  "{interviewerTitle}" Unvanındaki Kişiyi En Çok Etkileyen 3 Ters Soru
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {result.reverseQuestionsForInterviewer.map((rq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-black text-violet-400 block mb-1">
                      Soru {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                      "{rq.question}"
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span className="text-indigo-400 font-semibold">Neden İşe Yarar: </span>
                    <span>{rq.whyItWorks}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Practice Modal */}
      {activeQuestionForPractice && (
        <PracticeModal
          question={activeQuestionForPractice}
          interviewerTitle={interviewerTitle}
          candidateRole={candidateRole}
          onClose={() => setActiveQuestionForPractice(null)}
        />
      )}
    </div>
  );
};
