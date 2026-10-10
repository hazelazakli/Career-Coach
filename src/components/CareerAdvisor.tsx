import React, { useState, useEffect } from 'react';
import {
  Compass,
  GraduationCap,
  Target,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Calendar,
  Layers,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  Award,
  Zap,
} from 'lucide-react';
import { CareerPathwayResult } from '../types';
import { TRAINING_PRESETS } from '../constants/presets';

export const CareerAdvisor: React.FC = () => {
  const [completedTrainings, setCompletedTrainings] = useState(
    TRAINING_PRESETS[0].content
  );
  const [currentRole, setCurrentRole] = useState(TRAINING_PRESETS[0].currentRole);
  const [targetGoal, setTargetGoal] = useState(TRAINING_PRESETS[0].targetGoal);
  const [learningStyle, setLearningStyle] = useState('Uygulamalı & Proje Odaklı');
  const [weeklyHours, setWeeklyHours] = useState('5-10 saat');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CareerPathwayResult | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem('career_advisor_last_result');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.result) {
          setResult(parsed.result);
          if (parsed.completedTrainings) setCompletedTrainings(parsed.completedTrainings);
          if (parsed.targetGoal) setTargetGoal(parsed.targetGoal);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleApplyPreset = (preset: (typeof TRAINING_PRESETS)[0]) => {
    setCompletedTrainings(preset.content);
    setCurrentRole(preset.currentRole);
    setTargetGoal(preset.targetGoal);
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!completedTrainings.trim()) {
      setError('Lütfen katıldığınız eğitim içeriklerini veya ders konularını girin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/career/pathway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTrainings,
          currentRole,
          targetGoal,
          learningStyle,
          weeklyHours,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Eğitim analizinde bir hata oluştu.');
      }

      const data: CareerPathwayResult = await response.json();
      setResult(data);

      try {
        localStorage.setItem(
          'career_advisor_last_result',
          JSON.stringify({ result: data, completedTrainings, targetGoal })
        );
      } catch (err) {
        // ignore
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Yol haritası oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  const copyRoadmap = () => {
    if (!result) return;
    const text = `KARİYER & EĞİTİM YOL HARİTASI
Hedef: ${targetGoal}
Mevcut Durum: ${currentRole}

1. KAZANILAN BECERİLER:
${result.competencyAudit.acquiredSkills.join(', ')}

2. KRİTİK BECERİ AÇIKLARI (GAPS):
${result.competencyAudit.identifiedGaps.join(', ')}

3. ÖNERİLEN SONRAKİ ADIM EĞİTİMLERİ:
${result.nextStepRecommendations
  .map(
    (rec) => `
[${rec.phaseName}] - ${rec.courseTitle} (${rec.estimatedDurationWeeks})
Neden Bu Eğitim: ${rec.whyThisTraining}
Müfredat Modülleri:
${rec.coreCurriculum.map((m) => `  - ${m}`).join('\n')}
Pratik Çıktı: ${rec.handsOnMilestone}
Sertifika/Platform: ${rec.suggestedPlatformsAndCerts.join(', ')}
`
  )
  .join('\n')}

4. KANIT PORTFOLYO PROJESİ:
${result.capstoneProject.title}
${result.capstoneProject.description}
Teknolojiler: ${result.capstoneProject.techStack.join(', ')}
Mülakat Vurgusu: ${result.capstoneProject.interviewTalkingPoint}

5. KOÇ NOTU:
${result.coachSummaryMessage}`;

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-violet-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-amber-400" /> Kişiselleştirilmiş Sonraki Adım Eğitim Mimarı
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Katıldığınız Eğitimlerin İçeriklerini Girin, Sıradaki En Doğru Eğitimi Belirleyin
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Tamamladığınız kurs, atölye veya sertifikaların konularını yapıştırın. Yapay zeka eğitim mimarı mevcut bilgi birikiminizi analiz etsin, hedefiniz için eksik kalan halkaları (Skill Gaps) tespit etsin ve tam olarak <strong>hangi konuları kapsayan, nasıl bir eğitim</strong> almanız gerektiğini çıkarsın.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
            Örnek Eğitim Geçmişleri (1-Tıkla Doldur):
          </span>
          <div className="flex flex-wrap gap-2">
            {TRAINING_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-xs px-3 py-1.5 rounded-xl border bg-slate-950/60 border-slate-800 text-slate-300 hover:border-violet-500 hover:text-white transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleAnalyze} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-violet-400" />
              <span>Katıldığınız / Tamamladığınız Eğitimlerin İçerikleri *</span>
            </label>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Müfredat maddelerini, ders başlıklarını veya kurs özetini yazabilirsiniz
            </span>
          </div>
          <textarea
            rows={7}
            required
            value={completedTrainings}
            onChange={(e) => setCompletedTrainings(e.target.value)}
            placeholder="Örnek:
1. React 18 Temelleri, Hooks, Context API
2. Node.js Express REST API ve PostgreSQL
3. Docker Temelleri ve Git / GitHub
4. Temel CSS & Tailwind..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all font-mono leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Role */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Mevcut Pozisyon / Deneyim
            </label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="Örn: Frontend Developer (2 Yıl)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Target Goal */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Hedeflenen Kariyer Sıçraması</span>
            </label>
            <input
              type="text"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              placeholder="Örn: Fullstack & Cloud Architect"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Learning Style */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Öğrenme Tercihi</span>
            </label>
            <select
              value={learningStyle}
              onChange={(e) => setLearningStyle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="Uygulamalı & Proje Odaklı">Uygulamalı & Proje Odaklı</option>
              <option value="Resmi Sertifikasyon Odaklı (AWS/GCP/CKA)">Resmi Sertifikasyon Odaklı</option>
              <option value="Sistem Tasarımı & Mimari Kitaplar">Sistem Tasarımı & Mimari</option>
              <option value="Yoğun Bootcamp & Hızlandırılmış">Hızlandırılmış İntensif</option>
            </select>
          </div>

          {/* Weekly Hours */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Haftalık Ayrılacak Süre</span>
            </label>
            <select
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="3-5 saat (Günde ~45 dk)">3-5 saat (Günde ~45 dk)</option>
              <option value="5-10 saat (Dengeli Tempo)">5-10 saat (Dengeli Tempo)</option>
              <option value="10-20 saat (Hızlı İlerleme)">10-20 saat (Hızlı İlerleme)</option>
              <option value="20+ saat (Tam Zamanlı Odak)">20+ saat (Tam Zamanlı)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500 hidden sm:block">
            Gemini 3.8 Flash, tamamlanan konular ile hedef rol arasındaki müfredat boşluklarını haritalandırır.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Müfredat & Boşluk Analizi Yapılıyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Sonraki Adım Eğitim Yol Haritasını Çıkar</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Analysis & Roadmap Results */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Bar Actions */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider block">
                Eğitim Stratejisi Raporu
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Sıradaki Adım İçin Özel Hazırlanan Eğitim Planı
              </h3>
            </div>
            <button
              onClick={copyRoadmap}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors shadow-md"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Yol Haritası Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Planı Kopyala</span>
                </>
              )}
            </button>
          </div>

          {/* 1. Competency & Skill Gap Audit Card */}
          <div className="bg-slate-900 border border-violet-500/30 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-violet-400 block mb-1">
                Yetkinlik & Eksik Beceri Denetimi (Competency & Skill Gap Audit)
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {result.competencyAudit.currentLevelAssessment}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Acquired Skills */}
              <div className="bg-slate-950/70 border border-emerald-900/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Kazanılmış & Pekiştirilmiş Beceriler (Sağlam Temeller)
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.competencyAudit.acquiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Identified Gaps */}
              <div className="bg-slate-950/70 border border-amber-900/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Hedefe Ulaşmak İçin Eksik Kalan Kritik Halkalar (Skill Gaps)
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.competencyAudit.identifiedGaps.map((gap, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    >
                      {gap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Recommended Next-Step Trainings (3-Phase Pathway) */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Alınması Gereken Sonraki Adım Eğitimleri</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {result.nextStepRecommendations.length} Aşamalı Sıralı Müfredat
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Önceki eğitimlerinizin üstüne doğrudan oturan, her biri somut bir pratik çıktı üreten eğitim basamakları:
              </p>
            </div>

            <div className="space-y-5">
              {result.nextStepRecommendations.map((rec, idx) => {
                const phaseColors = [
                  {
                    border: 'border-indigo-500/40',
                    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                    dot: 'bg-indigo-500',
                  },
                  {
                    border: 'border-violet-500/40',
                    badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
                    dot: 'bg-violet-500',
                  },
                  {
                    border: 'border-fuchsia-500/40',
                    badge: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
                    dot: 'bg-fuchsia-500',
                  },
                ][idx % 3];

                return (
                  <div
                    key={idx}
                    className={`bg-slate-900 border ${phaseColors.border} rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden transition-all`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${phaseColors.badge}`}>
                          {rec.phaseName}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">
                          {rec.targetDomain}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20 w-fit">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Süre: {rec.estimatedDurationWeeks}</span>
                      </div>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {rec.courseTitle}
                    </h4>

                    {/* Why this training */}
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4 text-xs sm:text-sm text-slate-300">
                      <span className="text-violet-400 font-bold block mb-1">
                        🎯 Neden Bu Eğitimi Almalısınız? (Önceki İçeriklerle Köprü):
                      </span>
                      <p className="leading-relaxed">{rec.whyThisTraining}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Core Curriculum Modules */}
                      <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                          <span>Bu Eğitimin Kapsaması Gereken 4-5 Ana Modül:</span>
                        </span>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                          {rec.coreCurriculum.map((mod, mIdx) => (
                            <li key={mIdx} className="flex items-start gap-2">
                              <span className="h-5 w-5 rounded-full bg-violet-500/20 text-violet-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {mIdx + 1}
                              </span>
                              <span>{mod}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Hands-on Milestone & Certificates */}
                      <div className="space-y-3 flex flex-col justify-between">
                        {/* Milestone */}
                        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5" />
                            <span>Eğitim Sonunda İnşa Edilecek Pratik Çıktı:</span>
                          </span>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {rec.handsOnMilestone}
                          </p>
                        </div>

                        {/* Suggested Certs & Platforms */}
                        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5" />
                            <span>Önerilen Platformlar / Saygın Sertifikasyonlar:</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {rec.suggestedPlatformsAndCerts.map((cert, cIdx) => (
                              <span
                                key={cIdx}
                                className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Capstone Portfolio Project */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
                  Öğrenilenleri Kanıtlama Projesi (Capstone)
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-white">
                  {result.capstoneProject.title}
                </h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {result.capstoneProject.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase">Teknoloji Yığını:</span>
              {result.capstoneProject.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-slate-800 text-slate-200 border border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs sm:text-sm text-indigo-200">
              <span className="font-bold text-amber-300 block mb-0.5">
                💼 Mülakatlarda Bu Projeyi Anlatırken Vurgulanacak Değer:
              </span>
              <p className="leading-relaxed">{result.capstoneProject.interviewTalkingPoint}</p>
            </div>
          </div>

          {/* 4. Strategic Milestones Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-fuchsia-400">
                  Uygulama Takvimi
                </span>
                <h4 className="text-lg font-bold text-white">
                  3 - 6 - 12 Aylık Gelişim Kilometre Taşları
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.strategicMilestonesTimeline.map((ms, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-extrabold text-violet-400 block mb-1">
                      {ms.timeframe}
                    </span>
                    <h5 className="text-sm font-bold text-white mb-2">
                      {ms.milestoneGoal}
                    </h5>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                    <span className="text-emerald-400 font-semibold">Başarı Ölçütü: </span>
                    <span>{ms.successMetric}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Executive Coach Note */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-purple-950/30 to-slate-950 border border-violet-500/30 flex items-start gap-3.5">
            <Sparkles className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                Kariyer Koçundan Stratejik Tavsiye:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                {result.coachSummaryMessage}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
