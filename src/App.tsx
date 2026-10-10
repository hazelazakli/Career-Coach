import React, { useState } from 'react';
import { Header } from './components/Header';
import { InterviewCoach } from './components/InterviewCoach';
import { CareerAdvisor } from './components/CareerAdvisor';
import { GuideModal } from './components/GuideModal';
import { Sparkles, Briefcase, Compass, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'interview' | 'career'>('interview');
  const [showGuideModal, setShowGuideModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'guide') {
            setShowGuideModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenGuide={() => setShowGuideModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        {activeTab === 'interview' ? (
          <InterviewCoach />
        ) : (
          <CareerAdvisor />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 z-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span>Kariyer & Mülakat Koçu Agent • Powered by Gemini 3.8 Flash</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowGuideModal(true)}
              className="hover:text-slate-300 transition-colors"
            >
              STAR Metodu Kılavuzu
            </button>
            <span>•</span>
            <span className="text-slate-600">Gizlilik & Yerel Çalışma Güvencesi</span>
          </div>
        </div>
      </footer>

      {/* Guide & Tips Modal */}
      {showGuideModal && <GuideModal onClose={() => setShowGuideModal(false)} />}
    </div>
  );
}
