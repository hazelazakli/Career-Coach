export const INTERVIEWER_PRESETS = [
  {
    title: 'Satış Yöneticisi (Sales Manager / Head of Sales)',
    defaultRole: 'B2B Kıdemli Satış Uzmanı / Account Executive',
    seniority: 'Mid-Senior (3-6 Yıl)',
    companyType: 'B2B Kurumsal Çözümler / Teknoloji & Hizmet',
    focusArea: 'Satış Hunisi (Pipeline), İtiraz Yönetimi, Kota Disiplini & Kapanış',
  },
  {
    title: 'Engineering Manager',
    defaultRole: 'Senior Full Stack Developer',
    seniority: 'Senior (5-8 Yıl)',
    companyType: 'Büyüyen Scale-Up / SaaS',
    focusArea: 'Teknik Liderlik & Takım İçi İletişim',
  },
  {
    title: 'Senior HR Business Partner / Talent Acquisition Lead',
    defaultRole: 'Kıdemli Uzman / Ekip Lideri',
    seniority: 'Mid-Level (2-5 Yıl)',
    companyType: 'Kurumsal Teknoloji Şirketi',
    focusArea: 'Kültür Uyumu, Kriz Yönetimi & Motivasyon',
  },
  {
    title: 'Pazarlama Müdürü (Marketing Manager / CMO)',
    defaultRole: 'Büyüme & Dijital Pazarlama Uzmanı (Growth Marketer)',
    seniority: 'Mid-Senior',
    companyType: 'E-Ticaret / D2C & SaaS',
    focusArea: 'CAC/LTV Optimizasyonu, Kanal Performansı & Kampanya Stratejisi',
  },
  {
    title: 'Lead Software Architect / Principal Engineer',
    defaultRole: 'Backend Developer',
    seniority: 'Senior / Lead',
    companyType: 'Fintech / Yüksek Trafikli Sistem',
    focusArea: 'Sistem Tasarımı, Ölçeklenebilirlik & Mimari Ödünleşimler',
  },
  {
    title: 'Head of Product / Lead PM',
    defaultRole: 'Product Manager',
    seniority: 'Mid-Senior',
    companyType: 'B2B SaaS / E-Ticaret',
    focusArea: 'İş Değeri, Kullanıcı Deneyimi & Çapraz Fonksiyonel Çalışma',
  },
  {
    title: 'Genel Müdür / Kurucu Ortak (CEO / Startup Founder)',
    defaultRole: 'Bölüm Yöneticisi / Lead',
    seniority: 'Senior',
    companyType: 'Büyüme Aşamasında Şirket (Scale-Up)',
    focusArea: 'Hız, Sahiplenme, Belirsizlikle Başa Çıkma & Şirket Vizyonu',
  },
];

export const TRAINING_PRESETS = [
  {
    label: 'B2B Satış, Müzakere & Pipeline',
    currentRole: 'Satış Temsilcisi (Sales Rep - 2 Yıl)',
    targetGoal: 'Satış Müdürü (Sales Manager / Head of Sales)',
    content: `1. B2B Satış Metodolojileri (MEDDIC, BANT, SPIN Selling)
2. Satış Hunisi (Pipeline) Yönetimi ve Salesforce/HubSpot CRM Disiplini
3. Müşteri İtirazlarını Karşılama ve Değer Odaklı İkna Teknikleri
4. Üst Düzey Yönetici (C-Level) Sunumları ve Kurumsal Müzakere
5. Kota Planlaması, Tahminleme (Forecasting) ve Dönüşüm Oranları (Conversion Rates)
6. Soğuk İletişim (Cold Outreach) ve Çok Kanallı Lead Üretimi`,
  },
  {
    label: 'Modern Frontend (React + TS)',
    currentRole: 'Junior-Mid Frontend Developer',
    targetGoal: 'Senior Full Stack & Frontend Architect',
    content: `1. Modern JavaScript (ES6+, Async/Await, Prototypes, Closures, Event Loop)
2. React 18/19 Temelleri (Hooks, Context API, Custom Hooks, Performance Optimization)
3. TypeScript ile Tip Güvenliği (Generics, Interfaces, Utility Types)
4. State Management (Redux Toolkit, Zustand temelleri)
5. Tailwind CSS ve Responsive UI Tasarımı
6. REST API entegrasyonu ve Axios pratikleri
7. Git & GitHub sürüm kontrolü`,
  },
  {
    label: 'Backend & Node.js REST API',
    currentRole: 'Backend Developer (1.5 Yıl)',
    targetGoal: 'Cloud-Native Backend & Dağıtık Sistem Mühendisi',
    content: `1. Node.js & Express.js ile RESTful Web Servisleri Geliştirme
2. PostgreSQL Veritabanı Modelleme, Temel SQL ve Prisma ORM
3. JWT tabanlı Kimlik Doğrulama (Authentication & Authorization)
4. Temel Docker Konteynerizasyonu (Dockerfile & Docker Compose)
5. Postman ile API Testleri ve Swagger Dokümantasyonu
6. Hata Yönetimi ve Winston ile Loglama
7. Git Temelleri ve GitHub CI/CD Pipeline temelleri`,
  },
  {
    label: 'Veri Analitiği & Python',
    currentRole: 'Junior Veri Analisti',
    targetGoal: 'Kıdemli Veri Bilimci / ML Mühendisi',
    content: `1. Python ile Programlamaya Giriş (Veri yapıları, Fonksiyonlar, OOP)
2. Pandas ve NumPy ile Veri Manipülasyonu ve Temizleme
3. Matplotlib & Seaborn ile Keşifçi Veri Analizi (EDA)
4. İleri SQL (Window Functions, CTEs, Agregasyonlar)
5. Tableau ile İş Zekası Gösterge Panelleri (Dashboards)
6. Temel Olasılık ve İstatistik`,
  },
  {
    label: 'Agile & Ürün Yönetimi (Product)',
    currentRole: 'Associate Product Manager',
    targetGoal: 'Senior / Lead Product Manager',
    content: `1. Agile & Scrum Metodolojileri (Sprint Planlama, Retrospektif, Backlog Yönetimi)
2. Kullanıcı Hikayeleri Yazımı (User Stories & Acceptance Criteria)
3. Jira ve Confluence ile Proje Yönetimi
4. Temel Kullanıcı Araştırmaları ve Mülakat Teknikleri
5. A/B Testi Tasarımı ve Temel Metrikler (DAU, MAU, Retention, CAC, LTV)
6. Figma ile Wireframing ve Tasarımcılarla İletişim`,
  },
];
