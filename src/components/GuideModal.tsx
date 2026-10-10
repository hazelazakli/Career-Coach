import React from 'react';
import { X, BookOpen, Star, Users, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BookOpen className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white">
              Kariyer & Mülakat Koçluk Kılavuzu
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Section 1: STAR Metodu */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase text-xs tracking-wider">
              <Star className="w-4 h-4 fill-indigo-400" />
              <span>STAR Metodu Nedir ve Neden Hayatidir?</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              Dünya çapında tüm modern mülakatçılar (Google, Amazon, Meta ve önde gelen şirketler) adayların geçmiş deneyimlerini STAR formatında duymak ister. STAR kullanmadığınızda cevabınız teorik veya havada kalır.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-bold text-indigo-300 block mb-1">S - Situation (Durum):</span>
                Karşılaştığınız bağlamı, projeyi veya zorluğu kısaca ve net olarak anlatın (zaman, ölçek, kriz).
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-bold text-indigo-300 block mb-1">T - Task (Görev):</span>
                Bu durumda sizin bizzat üstlendiğiniz sorumluluk ve ulaşılması gereken hedef neydi?
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-bold text-emerald-400 block mb-1">A - Action (Eylemler):</span>
                "Biz yaptık" yerine "Ben şu adımları attım, şu teknolojiyi seçtim, şu analizi yürüttüm" diyerek kendi katkınızı somutlaştırın.
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-bold text-amber-300 block mb-1">R - Result (Sonuç):</span>
                Mutlaka ölçülebilir sonuç (%40 hız artışı, sıfır kesinti, 2 haftada teslim) ve edindiğiniz dersi belirtin.
              </div>
            </div>
          </div>

          {/* Section 2: Mülakatçı Rollerinin Psikolojisi */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-violet-400 font-bold uppercase text-xs tracking-wider">
              <Users className="w-4 h-4" />
              <span>Mülakatçı Unvanına Göre Öncelikler</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong className="text-white block mb-0.5">Engineering Manager / Team Lead:</strong>
                <span className="text-slate-400">
                  Takımla uyumunuzu, çatışmaları nasıl çözdüğünüzü, belirsizlikte nasıl iş bitirdiğinizi ve junior'lara mentorluk yapıp yapamayacağınızı test eder. "Ben her şeyi tek başıma yaparım" tavrından hoşlanmaz.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong className="text-white block mb-0.5">Senior HR Business Partner / Recruiter:</strong>
                <span className="text-slate-400">
                  Şirket değerlerine uyum, motivasyonunuzun samimiyeti, işten ayrılma geçmişiniz ve olası kriz anlarındaki duygusal zekanızı (EQ) arar.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong className="text-white block mb-0.5">Lead Architect / Principal Engineer:</strong>
                <span className="text-slate-400">
                  Tasarım kararlarınızdaki ödünleşimleri (Trade-offs: neden Redis ve RabbitMQ? Neden SQL ve NoSQL?), ölçeklenebilirlik sınırlarını ve sistem dayanıklılığını sorgular.
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Eğitim ve Kariyer Stratejisi */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-xs tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>"Tutorial Hell" Tuzağından Kurtulma Kuralı</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sadece eğitim videosu izlemek veya peş peşe sertifika toplamak kariyerde bir sonraki seviyeye taşımaz. Aldığınız her eğitimin ardından en az 1 adet <strong>gerçek dünya mimarisini simüle eden ve kodları GitHub'da okunabilir olan bir Kanıt Projesi</strong> inşa etmelisiniz. Bu ajan, eğitim içeriklerinizin hemen ardından size özel bu kanıt projesini önerir.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
