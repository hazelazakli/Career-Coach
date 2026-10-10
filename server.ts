import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. Generate Interview Questions based on Interviewer Title & Context
app.post('/api/interview/generate', async (req: Request, res: Response) => {
  try {
    const {
      interviewerTitle,
      candidateRole,
      candidateSeniority = 'Mid-Senior',
      companyType = 'Genel Teknoloji / Kurumsal',
      focusArea = 'Tümü (Kültür, Teknik, Liderlik)',
      customNotes = '',
      language = 'tr',
    } = req.body;

    if (!interviewerTitle || !candidateRole) {
      return res.status(400).json({
        error: 'Mülakatçı unvanı (interviewerTitle) ve hedeflenen rol (candidateRole) gereklidir.',
      });
    }

    const ai = getAiClient();

    const prompt = `
Sen dünya standartlarında kıdemli bir Kariyer & Mülakat Koçusun (Senior Executive Interview Coach).
Kullanıcı gireceği mülakata hazırlanıyor. Katılımcı olacak mülakatçının unvanı ve pozisyon detayları aşağıdadır:

- Mülakatı Yapan Kişinin Unvanı (Interviewer Title): "${interviewerTitle}"
- Adayın Başvurduğu Rol: "${candidateRole}"
- Adayın Kıdem Seviyesi: "${candidateSeniority}"
- Şirket / Sektör Türü: "${companyType}"
- Odak Alanı: "${focusArea}"
- Ekstra Bağlam / Notlar: "${customNotes}"
- Dil: "${language === 'en' ? 'English' : 'Türkçe'}"

GÖREVİN:
1. "${interviewerTitle}" unvanındaki bir kişinin psikolojisini, önceliklerini, şirket içindeki sorumluluğunu ve bir adayı elerken/seçerken nelere dikkat ettiğini derinlemesine analiz et. (Örn: Bir VP of Eng ölçeklenebilirlik, maliyet, iş değeri ve liderlik ararken; bir Senior HR uyum, motivasyon, kriz çözümü ve sadakat arar; bir Lead Developer ise kod kalitesi, mimari ödünleşimler (trade-offs) ve debug pratikliği arar).
2. Bu mülakatçının MUTLAKA veya BÜYÜK İHTİMALLE soracağı 6 ile 8 adet özgün, derinlikli ve gerçekçi mülakat sorusu üret.
3. Her soru için mülakatçının asıl amacını ("Satır Arasında Ne Arıyor?"), STAR metoduyla (Durum, Görev, Eylem, Sonuç) güçlü bir yanıtın içermesi gereken kilit noktaları, kaçınılması gereken tuzakları/kırmızı bayrakları belirt.
4. Adayın mülakatın sonunda BU UNVANDAKİ KİŞİYE sorabileceği 3 adet zekice, vizyoner "Ters Soru" (Reverse Questions) öner.

Yanıtı kesinlikle aşağıdaki JSON şemasına uygun olarak üret:
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interviewerMindset: {
              type: Type.OBJECT,
              properties: {
                roleFocus: { type: Type.STRING, description: 'Bu unvanın mülakattaki temel odak noktası ve sorumluluğu' },
                evaluationCriteria: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Adayı değerlendirirken baktığı en kritik 3-4 kriter',
                },
                redFlags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Bu unvandaki kişiyi en çok rahatsız eden davranış/cevap hataları',
                },
                coachingTip: { type: Type.STRING, description: 'Adaya bu unvan için altın değerinde koçluk tavsiyesi' },
              },
              required: ['roleFocus', 'evaluationCriteria', 'redFlags', 'coachingTip'],
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING, description: 'Örn: Davranışsal, Teknik/Mimari, Liderlik & İletişim, Strateji' },
                  question: { type: Type.STRING, description: 'Mülakatçının yönelteceği tam soru cümlesi' },
                  hiddenAgenda: { type: Type.STRING, description: 'Mülakatçı bu soruyla bilinçaltında/aslında neyi test ediyor?' },
                  starWinningPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'İyi bir yanıtta yer alması gereken 3-4 kilit bileşen veya STAR stratejisi',
                  },
                  commonMistakes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Yapılmaması gerekenler veya elenmeye yol açan zayıf yanıtlar',
                  },
                  sampleModelAnswerSnippet: { type: Type.STRING, description: 'Örnek güçlü başlangıç veya yanıt taslağı' },
                  difficulty: { type: Type.STRING, description: 'Kolay / Orta / Zor / Kritik' },
                },
                required: ['id', 'category', 'question', 'hiddenAgenda', 'starWinningPoints', 'commonMistakes', 'sampleModelAnswerSnippet', 'difficulty'],
              },
            },
            reverseQuestionsForInterviewer: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  whyItWorks: { type: Type.STRING, description: 'Neden bu unvandaki kişiyi etkiler?' },
                },
                required: ['question', 'whyItWorks'],
              },
            },
          },
          required: ['interviewerMindset', 'questions', 'reverseQuestionsForInterviewer'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating interview questions:', error);
    return res.status(500).json({
      error: error?.message || 'Mülakat soruları üretilirken bir hata oluştu.',
    });
  }
});

// 2. Evaluate Candidate's Answer in Mock Practice
app.post('/api/interview/evaluate', async (req: Request, res: Response) => {
  try {
    const {
      interviewerTitle,
      candidateRole,
      question,
      userAnswer,
      hiddenAgenda = '',
      language = 'tr',
    } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ error: 'Soru ve aday cevabı zorunludur.' });
    }

    const ai = getAiClient();

    const prompt = `
Sen ${interviewerTitle || 'Kıdemli Mülakatçı'} unvanına sahip bir değerlendirici ve aynı zamanda adayı hazırlayan uzman bir Kariyer Koçusun.
Pozisyon: "${candidateRole || 'Belirtilmedi'}"
Soru: "${question}"
Mülakatçının Asıl Amacı: "${hiddenAgenda}"
Adayın Verdiği Cevap:
"""
${userAnswer}
"""
Dil: "${language === 'en' ? 'English' : 'Türkçe'}"

Adayın cevabını analiz et:
1. 10 üzerinden puanla (1-10)
2. STAR Metodu (Situation, Task, Action, Result) uyumunu değerlendir.
3. Güçlü yönleri ve eksik/geliştirilmesi gereken yönleri listele.
4. Bu mülakatçının (${interviewerTitle}) perspektifinden adayın bıraktığı etkiyi belirt.
5. Bu cevabın çok daha etkileyici, profesyonel ve ikna edici bir "Örnek İdeal Versiyonunu" (Model Answer) yaz.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: '1-10 puan' },
            starRating: {
              type: Type.OBJECT,
              properties: {
                situationTask: { type: Type.STRING, description: 'Durum ve görevin netliği (1-5 puan ve yorum)' },
                actionTaken: { type: Type.STRING, description: 'Adayın kendi rolü ve aldığı aksiyonlar' },
                measurableResult: { type: Type.STRING, description: 'Ölçülebilir sonuç ve öğrenimler' },
              },
              required: ['situationTask', 'actionTaken', 'measurableResult'],
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
            interviewerImpression: { type: Type.STRING, description: 'Mülakatçının bu cevaptan çıkardığı ilk izlenim' },
            polishedAnswer: { type: Type.STRING, description: 'Cevabın yeniden yazılmış en iyi versiyonu' },
            coachVerdict: { type: Type.STRING, description: 'Koçtan tek cümlelik özet geri bildirim' },
          },
          required: ['score', 'starRating', 'strengths', 'areasForImprovement', 'interviewerImpression', 'polishedAnswer', 'coachVerdict'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    return res.status(500).json({
      error: error?.message || 'Cevap değerlendirilirken hata oluştu.',
    });
  }
});

// 3. Career Learning Pathway Advisor (Eğitim İçeriklerine Göre Sonraki Adım Eğitimi Önerisi)
app.post('/api/career/pathway', async (req: Request, res: Response) => {
  try {
    const {
      completedTrainings,
      currentRole = '',
      targetGoal = '',
      learningStyle = 'Uygulamalı & Proje Odaklı',
      weeklyHours = '5-10 saat',
      industryPreference = 'Modern Teknoloji & Yazılım',
      language = 'tr',
    } = req.body;

    if (!completedTrainings || typeof completedTrainings !== 'string' || completedTrainings.trim().length === 0) {
      return res.status(400).json({
        error: 'Lütfen tamamladığınız eğitimlerin içeriklerini veya isimlerini girin.',
      });
    }

    const ai = getAiClient();

    const prompt = `
Sen kıdemli bir Kariyer & Eğitim Mimarı (Chief Learning Officer & Career Strategist).
Kullanıcı sana bugüne kadar katıldığı ve tamamladığı eğitimlerin detaylı içeriklerini sunuyor:

TAMAMLANAN EĞİTİMLER VE İÇERİKLERİ:
"""
${completedTrainings}
"""

KULLANICININ MEVCUT DURUMU VE HEDEFLERİ:
- Mevcut Rol / Deneyim: "${currentRole || 'Geliştirici / Uzman'}"
- Hedeflenen Rol / Sonraki Kariyer Aşaması: "${targetGoal || 'Bir sonraki kıdem seviyesi ve uzmanlaşma'}"
- Tercih Edilen Öğrenme Şekli: "${learningStyle}"
- Haftalık Ayırabileceği Süre: "${weeklyHours}"
- Tercih Edilen Alan/Sektör: "${industryPreference}"
- Dil: "${language === 'en' ? 'English' : 'Türkçe'}"

GÖREVİN:
1. Tamamlanan bu eğitim içeriklerini titizlikle analiz et.
   - Hangi temel yetkinlikler kazanılmış?
   - Hangi alanlarda tavan yapılmış (güçlü kaslar)?
   - Hedeflenen kariyer sıçraması için en kritik BECERİ VE BİLGİ AÇIKLARI (Skill Gaps) nelerdir?
2. Bu içeriklerden doğrudan yola çıkarak; "Bir sonraki adım için tam olarak nasıl bir eğitim/eğitimler almalı?" sorusunu somut ve adım adım yanıtla.
   - Sadece genel tavsiye verme! Tam olarak hangi konu başlıklarını, hangi modülleri, hangi pratik projeleri ve hangi sertifikaları/ekosistemleri içermesi gerektiğini belirle.
   - Önerileri 3 aşamalı (Faz 1: Acil/Öncelikli Sonraki Adım, Faz 2: Derinleşme & Pratik Proje, Faz 3: Stratejik Liderlik/Uzmanlık) bir yol haritası olarak yapılandır.
3. Kullanıcının portfolyosuna koyup mülakatlarda gösterebileceği "Kanıt Projesi" (Capstone Portfolio Project) tanımla.
4. Önerilen eğitimleri alırken dikkat edilecek kaynak türleri (Kitaplar, Dokümantasyonlar, Resmi Sertifikasyonlar, Mimari Pratikler) öner.

Yanıtı kesinlikle aşağıdaki JSON şemasına uygun olarak üret:
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            competencyAudit: {
              type: Type.OBJECT,
              properties: {
                acquiredSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Tamamlanan eğitimlerle pekişmiş yetkinlikler',
                },
                identifiedGaps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Hedefe ulaşmak için eksik kalan kritik bilgi/deneyim halkaları',
                },
                currentLevelAssessment: {
                  type: Type.STRING,
                  description: 'Mevcut birikimin özeti ve seviye analizi',
                },
              },
              required: ['acquiredSkills', 'identifiedGaps', 'currentLevelAssessment'],
            },
            nextStepRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.INTEGER },
                  phaseName: { type: Type.STRING, description: 'Örn: 1. Öncelikli Adım (Hemen Başlanmalı)' },
                  courseTitle: { type: Type.STRING, description: 'Alınması gereken eğitimin tam adı/konusu' },
                  targetDomain: { type: Type.STRING, description: 'Örn: Sistem Mimarisi, Cloud & DevOps, State Management' },
                  whyThisTraining: {
                    type: Type.STRING,
                    description: 'Önceki eğitimlerin üzerine nasıl bir köprü kuruyor ve neden gerekli?',
                  },
                  coreCurriculum: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Bu eğitimin içinde MUTLAKA bulunması gereken 4-5 ana modül/ders konusu',
                  },
                  handsOnMilestone: {
                    type: Type.STRING,
                    description: 'Bu eğitim bittiğinde inşa edilmesi gereken somut pratik çıktı',
                  },
                  suggestedPlatformsAndCerts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Önerilen saygın platformlar veya sertifikalar (AWS, CKA, Coursera, vd.)',
                  },
                  estimatedDurationWeeks: { type: Type.STRING, description: 'Tahmini tamamlanma süresi' },
                },
                required: [
                  'phaseNumber',
                  'phaseName',
                  'courseTitle',
                  'targetDomain',
                  'whyThisTraining',
                  'coreCurriculum',
                  'handsOnMilestone',
                  'suggestedPlatformsAndCerts',
                  'estimatedDurationWeeks',
                ],
              },
            },
            capstoneProject: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                interviewTalkingPoint: {
                  type: Type.STRING,
                  description: 'Mülakatçılara bu projeyi anlatırken vurgulanacak ana değer',
                },
              },
              required: ['title', 'description', 'techStack', 'interviewTalkingPoint'],
            },
            strategicMilestonesTimeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeframe: { type: Type.STRING, description: 'Örn: 1-3. Ay, 3-6. Ay, 6-12. Ay' },
                  milestoneGoal: { type: Type.STRING },
                  successMetric: { type: Type.STRING },
                },
                required: ['timeframe', 'milestoneGoal', 'successMetric'],
              },
            },
            coachSummaryMessage: {
              type: Type.STRING,
              description: 'Koçtan adaya özel stratejik motivasyon ve rehberlik mesajı',
            },
          },
          required: [
            'competencyAudit',
            'nextStepRecommendations',
            'capstoneProject',
            'strategicMilestonesTimeline',
            'coachSummaryMessage',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error calculating career pathway:', error);
    return res.status(500).json({
      error: error?.message || 'Eğitim yol haritası oluşturulurken hata oluştu.',
    });
  }
});

// Configure Vite integration for dev, static serving for production
const setupServer = async () => {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
};

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
