import type { Locale } from '../../i18n/types';

interface HomePresetCopy {
  title: string;
  prompt: string;
}

// Home recommendations describe the user's intended result. Template details
// keep their original names and technical descriptions from the manifest.
// Every curated preset must provide copy for all supported UI locales.
const HOME_PRESET_COPY: Record<string, Record<Locale, HomePresetCopy>> = {
  'example-pm-spec': {
    'zh-CN': {
      title: '产品规格文档',
      prompt: '为一款帮助远程团队安排跨时区会议的工具撰写产品规格文档，包含用户需求、核心功能、使用流程和验收标准。',
    },
    'zh-TW': {
      title: '產品規格文件',
      prompt: '為一款協助遠端團隊安排跨時區會議的工具撰寫產品規格文件，包含使用者需求、核心功能、使用流程和驗收標準。',
    },
    en: {
      title: 'Product Specification',
      prompt: 'Write a product specification for a tool that helps remote teams schedule meetings across time zones, covering user needs, core features, user flows, and acceptance criteria.',
    },
    id: {
      title: 'Spesifikasi Produk',
      prompt: 'Tulis spesifikasi produk untuk alat yang membantu tim jarak jauh menjadwalkan rapat lintas zona waktu, mencakup kebutuhan pengguna, fitur utama, alur penggunaan, dan kriteria penerimaan.',
    },
    de: {
      title: 'Produktspezifikation',
      prompt: 'Schreibe eine Produktspezifikation für ein Tool, mit dem verteilte Teams Besprechungen über Zeitzonen hinweg planen. Beschreibe Nutzerbedürfnisse, Kernfunktionen, Nutzungsabläufe und Abnahmekriterien.',
    },
    'pt-BR': {
      title: 'Especificação de produto',
      prompt: 'Escreva uma especificação de produto para uma ferramenta que ajuda equipes remotas a agendar reuniões entre fusos horários, incluindo necessidades dos usuários, recursos principais, fluxos de uso e critérios de aceitação.',
    },
    'es-ES': {
      title: 'Especificación de producto',
      prompt: 'Redacta una especificación de producto para una herramienta que ayude a equipos remotos a programar reuniones entre zonas horarias, con necesidades de los usuarios, funciones principales, flujos de uso y criterios de aceptación.',
    },
    ru: {
      title: 'Спецификация продукта',
      prompt: 'Напиши спецификацию инструмента, который помогает удалённым командам планировать встречи в разных часовых поясах. Опиши потребности пользователей, основные функции, сценарии использования и критерии приёмки.',
    },
    fa: {
      title: 'سند مشخصات محصول',
      prompt: 'برای ابزاری که به تیم‌های دورکار در زمان‌بندی جلسه میان منطقه‌های زمانی مختلف کمک می‌کند، سند مشخصات محصول بنویس. نیازهای کاربران، قابلیت‌های اصلی، مسیرهای استفاده و معیارهای پذیرش را پوشش بده.',
    },
    ar: {
      title: 'مواصفات المنتج',
      prompt: 'اكتب وثيقة مواصفات لأداة تساعد الفرق التي تعمل عن بُعد على جدولة اجتماعات عبر مناطق زمنية مختلفة، مع احتياجات المستخدمين والميزات الأساسية ومسارات الاستخدام ومعايير القبول.',
    },
    ja: {
      title: '製品仕様書',
      prompt: '離れたタイムゾーンで働くリモートチームの会議調整ツールについて、製品仕様書を作成してください。ユーザーニーズ、主要機能、利用フロー、受け入れ基準を含めてください。',
    },
    ko: {
      title: '제품 사양서',
      prompt: '여러 시간대의 원격 팀이 회의 일정을 잡도록 돕는 도구의 제품 사양서를 작성해 주세요. 사용자 요구, 핵심 기능, 사용 흐름, 인수 기준을 포함해 주세요.',
    },
    pl: {
      title: 'Specyfikacja produktu',
      prompt: 'Napisz specyfikację narzędzia pomagającego zdalnym zespołom planować spotkania w różnych strefach czasowych. Uwzględnij potrzeby użytkowników, główne funkcje, przebieg korzystania i kryteria akceptacji.',
    },
    hu: {
      title: 'Termékspecifikáció',
      prompt: 'Írj termékspecifikációt egy eszközhöz, amely különböző időzónákban dolgozó távoli csapatoknak segít megbeszéléseket ütemezni. Térj ki a felhasználói igényekre, fő funkciókra, használati folyamatokra és elfogadási feltételekre.',
    },
    fr: {
      title: 'Spécification produit',
      prompt: 'Rédige une spécification produit pour un outil qui aide les équipes à distance à planifier des réunions entre fuseaux horaires. Présente les besoins des utilisateurs, les fonctions essentielles, les parcours et les critères d’acceptation.',
    },
    uk: {
      title: 'Специфікація продукту',
      prompt: 'Напиши специфікацію інструмента, що допомагає віддаленим командам планувати зустрічі в різних часових поясах. Опиши потреби користувачів, основні функції, сценарії використання та критерії приймання.',
    },
    tr: {
      title: 'Ürün Şartnamesi',
      prompt: 'Uzak ekiplerin farklı saat dilimlerinde toplantı planlamasını sağlayan bir araç için ürün şartnamesi yaz. Kullanıcı ihtiyaçlarını, temel özellikleri, kullanım akışlarını ve kabul kriterlerini dahil et.',
    },
    th: {
      title: 'เอกสารข้อกำหนดผลิตภัณฑ์',
      prompt: 'เขียนเอกสารข้อกำหนดผลิตภัณฑ์สำหรับเครื่องมือที่ช่วยทีมทำงานทางไกลนัดประชุมข้ามเขตเวลา โดยระบุความต้องการของผู้ใช้ ฟีเจอร์หลัก ขั้นตอนการใช้งาน และเกณฑ์การยอมรับ',
    },
    it: {
      title: 'Specifica di prodotto',
      prompt: 'Scrivi una specifica di prodotto per uno strumento che aiuti i team remoti a pianificare riunioni tra fusi orari, includendo esigenze degli utenti, funzioni principali, flussi d’uso e criteri di accettazione.',
    },
  },
  'example-finance-report': {
    'zh-CN': {
      title: '财务报告',
      prompt: '制作一家虚构咖啡品牌的季度财务报告，用合理的示例数据展示收入、成本、利润和现金流，并分析经营表现。注明数据仅供示例。',
    },
    'zh-TW': {
      title: '財務報告',
      prompt: '製作一家虛構咖啡品牌的季度財務報告，用合理的範例數據呈現收入、成本、利潤和現金流，並分析經營表現。註明數據僅供示例。',
    },
    en: {
      title: 'Financial Report',
      prompt: 'Create a quarterly financial report for a fictional coffee brand, using plausible sample data to show revenue, costs, profit, and cash flow and analyze business performance. Label the data as illustrative.',
    },
    id: {
      title: 'Laporan Keuangan',
      prompt: 'Buat laporan keuangan triwulanan untuk merek kopi fiktif. Gunakan data contoh yang masuk akal untuk menunjukkan pendapatan, biaya, laba, dan arus kas serta menganalisis kinerja usaha. Tandai data sebagai ilustrasi.',
    },
    de: {
      title: 'Finanzbericht',
      prompt: 'Erstelle einen Quartalsfinanzbericht für eine fiktive Kaffeemarke. Zeige Umsatz, Kosten, Gewinn und Cashflow anhand plausibler Beispieldaten und analysiere die Geschäftsentwicklung. Kennzeichne die Daten als Beispiel.',
    },
    'pt-BR': {
      title: 'Relatório financeiro',
      prompt: 'Crie um relatório financeiro trimestral para uma marca de café fictícia, usando dados de exemplo plausíveis para mostrar receita, custos, lucro e fluxo de caixa e analisar o desempenho do negócio. Identifique os dados como ilustrativos.',
    },
    'es-ES': {
      title: 'Informe financiero',
      prompt: 'Crea un informe financiero trimestral de una marca de café ficticia. Utiliza datos de ejemplo plausibles para mostrar ingresos, costes, beneficios y flujo de caja, y analizar el rendimiento del negocio. Indica que los datos son ilustrativos.',
    },
    ru: {
      title: 'Финансовый отчёт',
      prompt: 'Создай квартальный финансовый отчёт вымышленного кофейного бренда. На правдоподобных демонстрационных данных покажи выручку, расходы, прибыль и денежный поток, проанализируй результаты бизнеса. Отметь, что данные приведены для примера.',
    },
    fa: {
      title: 'گزارش مالی',
      prompt: 'برای یک برند خیالی قهوه، گزارش مالی سه‌ماهه تهیه کن. با داده‌های نمونه و معقول، درآمد، هزینه، سود و جریان نقدی را نشان بده و عملکرد کسب‌وکار را تحلیل کن. مشخص کن که داده‌ها صرفاً نمونه هستند.',
    },
    ar: {
      title: 'تقرير مالي',
      prompt: 'أنشئ تقريراً مالياً ربع سنوي لعلامة قهوة خيالية. استخدم بيانات توضيحية معقولة لعرض الإيرادات والتكاليف والأرباح والتدفقات النقدية وتحليل أداء النشاط. وضّح أن البيانات مخصصة للمثال.',
    },
    ja: {
      title: '財務レポート',
      prompt: '架空のコーヒーブランドの四半期財務レポートを作成してください。妥当なサンプルデータで売上、費用、利益、キャッシュフローを示し、業績を分析してください。データが例示用であることを明記してください。',
    },
    ko: {
      title: '재무 보고서',
      prompt: '가상의 커피 브랜드를 위한 분기 재무 보고서를 만들어 주세요. 타당한 예시 데이터로 매출, 비용, 이익, 현금 흐름을 보여 주고 경영 성과를 분석해 주세요. 예시 데이터임을 명시해 주세요.',
    },
    pl: {
      title: 'Raport finansowy',
      prompt: 'Przygotuj kwartalny raport finansowy fikcyjnej marki kawy. Użyj wiarygodnych danych przykładowych, aby przedstawić przychody, koszty, zysk i przepływy pieniężne oraz przeanalizować wyniki firmy. Oznacz dane jako ilustracyjne.',
    },
    hu: {
      title: 'Pénzügyi jelentés',
      prompt: 'Készíts negyedéves pénzügyi jelentést egy kitalált kávémárkának. Életszerű mintaadatokkal mutasd be a bevételt, költségeket, nyereséget és pénzforgalmat, és elemezd az üzleti teljesítményt. Jelezd, hogy az adatok szemléltető jellegűek.',
    },
    fr: {
      title: 'Rapport financier',
      prompt: 'Crée un rapport financier trimestriel pour une marque de café fictive. Utilise des données d’exemple plausibles pour présenter les revenus, les coûts, les bénéfices et la trésorerie, et analyser les performances. Indique que les données sont illustratives.',
    },
    uk: {
      title: 'Фінансовий звіт',
      prompt: 'Створи квартальний фінансовий звіт вигаданого кавового бренду. На правдоподібних демонстраційних даних покажи виручку, витрати, прибуток і грошовий потік та проаналізуй результати бізнесу. Зазнач, що дані наведено для прикладу.',
    },
    tr: {
      title: 'Finansal Rapor',
      prompt: 'Hayali bir kahve markası için üç aylık finansal rapor oluştur. Makul örnek verilerle gelir, maliyet, kâr ve nakit akışını göster ve işletme performansını analiz et. Verilerin örnek amaçlı olduğunu belirt.',
    },
    th: {
      title: 'รายงานการเงิน',
      prompt: 'สร้างรายงานการเงินรายไตรมาสของแบรนด์กาแฟสมมติ ใช้ข้อมูลตัวอย่างที่สมเหตุสมผลแสดงรายได้ ต้นทุน กำไร และกระแสเงินสด พร้อมวิเคราะห์ผลการดำเนินงาน ระบุว่าข้อมูลใช้เพื่อเป็นตัวอย่าง',
    },
    it: {
      title: 'Report finanziario',
      prompt: 'Crea un report finanziario trimestrale per un marchio di caffè immaginario. Usa dati di esempio plausibili per illustrare ricavi, costi, utili e flussi di cassa e analizzare l’andamento dell’attività. Indica che i dati sono illustrativi.',
    },
  },
  'example-clinical-case-report': {
    'zh-CN': {
      title: '临床病例报告',
      prompt: '编写一份用于教学的虚构社区获得性肺炎病例报告，包含主诉、病史、检查结果、诊断依据、诊疗经过和随访情况。注明为虚构教学病例。',
    },
    'zh-TW': {
      title: '臨床病例報告',
      prompt: '編寫一份用於教學的虛構社區型肺炎病例報告，包含主訴、病史、檢查結果、診斷依據、診療經過和追蹤情況。註明為虛構教學病例。',
    },
    en: {
      title: 'Clinical Case Report',
      prompt: 'Write a fictional case report about community-acquired pneumonia for teaching, including the chief complaint, medical history, examination findings, diagnostic reasoning, clinical course, and follow-up. Label it as a fictional teaching case.',
    },
    id: {
      title: 'Laporan Kasus Klinis',
      prompt: 'Tulis laporan kasus pneumonia komunitas fiktif untuk pembelajaran, mencakup keluhan utama, riwayat medis, hasil pemeriksaan, dasar diagnosis, perjalanan perawatan, dan tindak lanjut. Tandai sebagai kasus pembelajaran fiktif.',
    },
    de: {
      title: 'Klinischer Fallbericht',
      prompt: 'Schreibe einen fiktiven Fallbericht über eine ambulant erworbene Pneumonie für Lehrzwecke. Beschreibe Leitsymptom, Anamnese, Untersuchungsbefunde, diagnostische Begründung, Behandlungsverlauf und Nachsorge. Kennzeichne ihn als fiktiven Lehrfall.',
    },
    'pt-BR': {
      title: 'Relato de caso clínico',
      prompt: 'Escreva um relato fictício de pneumonia adquirida na comunidade para fins didáticos, incluindo queixa principal, histórico clínico, achados dos exames, justificativa diagnóstica, evolução clínica e acompanhamento. Identifique-o como caso didático fictício.',
    },
    'es-ES': {
      title: 'Informe de caso clínico',
      prompt: 'Redacta un caso ficticio de neumonía adquirida en la comunidad con fines docentes. Incluye motivo de consulta, antecedentes, resultados de las exploraciones, razonamiento diagnóstico, evolución clínica y seguimiento. Identifícalo como caso docente ficticio.',
    },
    ru: {
      title: 'Клинический случай',
      prompt: 'Напиши вымышленный учебный отчёт о случае внебольничной пневмонии. Включи жалобы, анамнез, результаты обследований, обоснование диагноза, ход лечения и последующее наблюдение. Отметь, что это вымышленный учебный случай.',
    },
    fa: {
      title: 'گزارش مورد بالینی',
      prompt: 'یک گزارش آموزشی درباره موردی خیالی از پنومونی اکتسابی از جامعه بنویس. شکایت اصلی، سابقه پزشکی، یافته‌های معاینه و آزمایش، استدلال تشخیصی، روند درمان و پیگیری را بیاور. مشخص کن که این یک مورد آموزشی خیالی است.',
    },
    ar: {
      title: 'تقرير حالة سريرية',
      prompt: 'اكتب تقريراً تعليمياً عن حالة خيالية لالتهاب رئوي مكتسب من المجتمع. ضمّن الشكوى الرئيسية والتاريخ المرضي ونتائج الفحوص ومبررات التشخيص ومسار العلاج والمتابعة. وضّح أنها حالة تعليمية خيالية.',
    },
    ja: {
      title: '臨床症例報告',
      prompt: '教育用の架空の市中肺炎症例報告を作成してください。主訴、病歴、検査所見、診断根拠、診療経過、フォローアップを含め、架空の教育症例であることを明記してください。',
    },
    ko: {
      title: '임상 증례 보고서',
      prompt: '교육용으로 가상의 지역사회획득 폐렴 증례 보고서를 작성해 주세요. 주호소, 병력, 검사 소견, 진단 근거, 진료 경과, 추적 관찰을 포함하고 가상의 교육용 증례임을 명시해 주세요.',
    },
    pl: {
      title: 'Opis przypadku klinicznego',
      prompt: 'Napisz fikcyjny opis przypadku pozaszpitalnego zapalenia płuc do celów dydaktycznych. Uwzględnij główne dolegliwości, wywiad, wyniki badań, uzasadnienie rozpoznania, przebieg leczenia i dalszą obserwację. Oznacz go jako fikcyjny przypadek dydaktyczny.',
    },
    hu: {
      title: 'Klinikai esetismertetés',
      prompt: 'Írj kitalált, oktatási célú esetismertetést közösségben szerzett tüdőgyulladásról. Tartalmazza a fő panaszt, kórelőzményt, vizsgálati eredményeket, a diagnózis indoklását, a kezelés menetét és az utánkövetést. Jelöld kitalált oktatási esetként.',
    },
    fr: {
      title: 'Rapport de cas clinique',
      prompt: 'Rédige un cas fictif de pneumonie communautaire à des fins pédagogiques, avec le motif de consultation, les antécédents, les résultats des examens, le raisonnement diagnostique, l’évolution clinique et le suivi. Identifie-le comme cas pédagogique fictif.',
    },
    uk: {
      title: 'Клінічний випадок',
      prompt: 'Напиши вигаданий навчальний звіт про випадок негоспітальної пневмонії. Додай скарги, анамнез, результати обстежень, обґрунтування діагнозу, перебіг лікування та подальше спостереження. Познач його як вигаданий навчальний випадок.',
    },
    tr: {
      title: 'Klinik Olgu Raporu',
      prompt: 'Eğitim amacıyla toplum kökenli pnömoni hakkında hayali bir olgu raporu yaz. Başlıca şikâyet, tıbbi öykü, muayene ve tetkik bulguları, tanısal gerekçe, klinik seyir ve takibi dahil et. Bunun hayali bir eğitim olgusu olduğunu belirt.',
    },
    th: {
      title: 'รายงานกรณีศึกษาทางคลินิก',
      prompt: 'เขียนรายงานผู้ป่วยปอดอักเสบที่เกิดในชุมชนแบบสมมติเพื่อการเรียนการสอน โดยมีอาการสำคัญ ประวัติ ผลตรวจ เหตุผลในการวินิจฉัย ลำดับการรักษา และการติดตามผล ระบุว่าเป็นกรณีสมมติเพื่อการศึกษา',
    },
    it: {
      title: 'Caso clinico',
      prompt: 'Scrivi un caso clinico immaginario di polmonite acquisita in comunità a scopo didattico. Includi motivo della visita, anamnesi, risultati degli esami, ragionamento diagnostico, decorso clinico e controlli successivi. Indica che si tratta di un caso didattico immaginario.',
    },
  },
  'example-resume-modern': {
    'zh-CN': {
      title: '极简简历',
      prompt: '为一位有三年工作经验的虚构产品设计师制作一页式极简简历，包含个人简介、专业技能、工作经历和代表项目。使用完整的虚构信息，并注明为示例简历。',
    },
    'zh-TW': {
      title: '極簡履歷',
      prompt: '為一位有三年工作經驗的虛構產品設計師製作一頁式極簡履歷，包含個人簡介、專業技能、工作經歷和代表專案。使用完整的虛構資訊，並註明為範例履歷。',
    },
    en: {
      title: 'Minimal Resume',
      prompt: 'Create a minimal one-page resume for a fictional product designer with three years of experience, including a profile, skills, work history, and selected projects. Fill in all details with fictional information and label it as a sample resume.',
    },
    id: {
      title: 'CV Minimalis',
      prompt: 'Buat CV minimalis satu halaman untuk desainer produk fiktif dengan pengalaman tiga tahun, mencakup profil, keterampilan, pengalaman kerja, dan proyek pilihan. Isi semua detail dengan informasi fiktif dan tandai sebagai contoh CV.',
    },
    de: {
      title: 'Minimalistischer Lebenslauf',
      prompt: 'Erstelle einen minimalistischen, einseitigen Lebenslauf für eine fiktive Person im Produktdesign mit drei Jahren Berufserfahrung. Fülle Profil, Fähigkeiten, Berufserfahrung und ausgewählte Projekte vollständig mit fiktiven Angaben aus und kennzeichne den Lebenslauf als Muster.',
    },
    'pt-BR': {
      title: 'Currículo minimalista',
      prompt: 'Crie um currículo minimalista de uma página para uma pessoa fictícia que atua em design de produto há três anos, incluindo perfil, habilidades, experiência profissional e projetos selecionados. Preencha todos os detalhes com informações fictícias e identifique-o como exemplo de currículo.',
    },
    'es-ES': {
      title: 'Currículum minimalista',
      prompt: 'Crea un currículum minimalista de una página para una persona ficticia dedicada al diseño de producto con tres años de experiencia. Incluye perfil, habilidades, experiencia laboral y proyectos destacados. Completa todos los datos con información ficticia e identifícalo como currículum de ejemplo.',
    },
    ru: {
      title: 'Минималистичное резюме',
      prompt: 'Создай минималистичное резюме на одну страницу для вымышленного продуктового дизайнера с трёхлетним опытом. Включи сведения о специалисте, навыки, опыт работы и избранные проекты. Заполни все поля вымышленными данными и обозначь документ как пример резюме.',
    },
    fa: {
      title: 'رزومه مینیمال',
      prompt: 'برای یک طراح محصول خیالی با سه سال سابقه، رزومه‌ای مینیمال و یک‌صفحه‌ای تهیه کن. معرفی، مهارت‌ها، سوابق کاری و پروژه‌های منتخب را بگنجان. همه جزئیات را با اطلاعات خیالی تکمیل کن و آن را به‌عنوان رزومه نمونه مشخص کن.',
    },
    ar: {
      title: 'سيرة ذاتية بسيطة',
      prompt: 'أنشئ سيرة ذاتية بسيطة من صفحة واحدة لمصمم منتجات خيالي لديه خبرة ثلاث سنوات. ضمّن نبذة شخصية ومهارات وخبرات عملية ومشاريع مختارة. املأ جميع التفاصيل بمعلومات خيالية ووضّح أنها سيرة ذاتية نموذجية.',
    },
    ja: {
      title: 'ミニマルな職務経歴書',
      prompt: '実務経験3年の架空のプロダクトデザイナーについて、1ページのミニマルな職務経歴書を作成してください。自己紹介、スキル、職歴、代表的なプロジェクトを架空の情報ですべて埋め、記入例であることを明記してください。',
    },
    ko: {
      title: '미니멀 이력서',
      prompt: '경력 3년인 가상의 프로덕트 디자이너를 위한 한 페이지 미니멀 이력서를 만들어 주세요. 자기소개, 기술, 경력, 대표 프로젝트를 포함하고 모든 항목을 가상의 정보로 채운 뒤 예시 이력서임을 명시해 주세요.',
    },
    pl: {
      title: 'Minimalistyczne CV',
      prompt: 'Stwórz minimalistyczne, jednostronicowe CV fikcyjnej osoby zajmującej się projektowaniem produktów z trzyletnim doświadczeniem. Uwzględnij profil, umiejętności, doświadczenie zawodowe i wybrane projekty. Uzupełnij wszystkie szczegóły fikcyjnymi danymi i oznacz dokument jako przykładowe CV.',
    },
    hu: {
      title: 'Minimalista önéletrajz',
      prompt: 'Készíts egyoldalas, minimalista önéletrajzot egy kitalált, hároméves tapasztalattal rendelkező terméktervezőnek. Tartalmazzon bemutatkozást, készségeket, munkatapasztalatot és válogatott projekteket. Minden részletet tölts ki kitalált adatokkal, és jelöld mintaönéletrajzként.',
    },
    fr: {
      title: 'CV minimaliste',
      prompt: 'Crée un CV minimaliste d’une page pour une personne fictive exerçant le design produit depuis trois ans. Inclus le profil, les compétences, l’expérience et une sélection de projets. Renseigne tous les détails avec des informations fictives et indique qu’il s’agit d’un exemple de CV.',
    },
    uk: {
      title: 'Мінімалістичне резюме',
      prompt: 'Створи мінімалістичне резюме на одну сторінку для вигаданого продуктового дизайнера з трирічним досвідом. Додай профіль, навички, досвід роботи та вибрані проєкти. Заповни всі відомості вигаданими даними й познач документ як приклад резюме.',
    },
    tr: {
      title: 'Minimal Özgeçmiş',
      prompt: 'Üç yıllık deneyime sahip hayali bir ürün tasarımcısı için tek sayfalık minimal özgeçmiş oluştur. Profil, beceriler, iş deneyimi ve seçilmiş projeleri dahil et. Tüm ayrıntıları hayali bilgilerle doldur ve örnek özgeçmiş olduğunu belirt.',
    },
    th: {
      title: 'เรซูเม่มินิมอล',
      prompt: 'สร้างเรซูเม่มินิมอลหนึ่งหน้าสำหรับนักออกแบบผลิตภัณฑ์สมมติที่มีประสบการณ์สามปี โดยมีประวัติย่อ ทักษะ ประสบการณ์ทำงาน และผลงานเด่น กรอกข้อมูลสมมติให้ครบและระบุว่าเป็นเรซูเม่ตัวอย่าง',
    },
    it: {
      title: 'Curriculum minimalista',
      prompt: 'Crea un curriculum minimalista di una pagina per una persona immaginaria con tre anni di esperienza nel design di prodotto. Includi profilo, competenze, esperienze lavorative e progetti selezionati. Completa tutti i dettagli con informazioni inventate e indicalo come curriculum di esempio.',
    },
  },
  'example-invoice': {
    'zh-CN': {
      title: '发票',
      prompt: '为一家虚构设计工作室制作品牌设计服务发票，填入完整的示例客户信息、服务项目、费用明细和付款说明。注明为示例发票。',
    },
    'zh-TW': {
      title: '發票',
      prompt: '為一家虛構設計工作室製作品牌設計服務發票，填入完整的範例客戶資訊、服務項目、費用明細和付款說明。註明為範例發票。',
    },
    en: {
      title: 'Invoice',
      prompt: 'Create an invoice for branding services from a fictional design studio, filling in complete sample client details, services, itemized fees, and payment instructions. Label it as a sample invoice.',
    },
    id: {
      title: 'Faktur',
      prompt: 'Buat faktur layanan desain merek dari studio desain fiktif, lengkap dengan contoh informasi klien, layanan, rincian biaya, dan petunjuk pembayaran. Tandai sebagai contoh faktur.',
    },
    de: {
      title: 'Rechnung',
      prompt: 'Erstelle eine Rechnung für Branding-Leistungen eines fiktiven Designstudios. Fülle Kundenangaben, Leistungen, Einzelpreise und Zahlungsinformationen mit vollständigen Beispieldaten aus. Kennzeichne sie als Musterrechnung.',
    },
    'pt-BR': {
      title: 'Fatura',
      prompt: 'Crie uma fatura de serviços de identidade de marca de um estúdio de design fictício, preenchendo dados completos de exemplo do cliente, serviços, valores discriminados e instruções de pagamento. Identifique-a como fatura de exemplo.',
    },
    'es-ES': {
      title: 'Factura',
      prompt: 'Crea una factura de servicios de diseño de marca de un estudio ficticio, con datos completos de ejemplo del cliente, servicios, importes desglosados e instrucciones de pago. Identifícala como factura de ejemplo.',
    },
    ru: {
      title: 'Счёт на оплату',
      prompt: 'Создай счёт за услуги по разработке фирменного стиля от вымышленной дизайн-студии. Укажи полные примерные данные клиента, услуги, детализацию стоимости и порядок оплаты. Обозначь документ как образец счёта.',
    },
    fa: {
      title: 'فاکتور',
      prompt: 'برای خدمات طراحی هویت برند یک استودیوی طراحی خیالی، فاکتور تهیه کن. اطلاعات نمونه مشتری، خدمات، ریز هزینه‌ها و راهنمای پرداخت را کامل بنویس. مشخص کن که فاکتور نمونه است.',
    },
    ar: {
      title: 'فاتورة',
      prompt: 'أنشئ فاتورة لخدمات تصميم هوية علامة تجارية من استوديو تصميم خيالي. املأ بيانات العميل والخدمات وتفاصيل الرسوم وتعليمات الدفع بمعلومات نموذجية كاملة. وضّح أنها فاتورة نموذجية.',
    },
    ja: {
      title: '請求書',
      prompt: '架空のデザインスタジオのブランドデザイン業務について、請求書を作成してください。顧客情報、業務内容、金額の内訳、支払い案内をサンプル情報ですべて記入し、請求書の記入例であることを明記してください。',
    },
    ko: {
      title: '청구서',
      prompt: '가상의 디자인 스튜디오가 제공한 브랜드 디자인 서비스의 청구서를 만들어 주세요. 고객 정보, 서비스 항목, 세부 비용, 결제 안내를 완전한 예시 정보로 채우고 예시 청구서임을 명시해 주세요.',
    },
    pl: {
      title: 'Faktura',
      prompt: 'Stwórz fakturę za projekt identyfikacji marki wystawioną przez fikcyjne studio projektowe. Wypełnij komplet przykładowych danych klienta, usług, szczegółowych kosztów i instrukcji płatności. Oznacz ją jako fakturę przykładową.',
    },
    hu: {
      title: 'Számla',
      prompt: 'Készíts számlát egy kitalált designstúdió arculattervezési szolgáltatásairól. Töltsd ki teljes mintaadatokkal az ügyfél adatait, a szolgáltatásokat, a tételes díjakat és a fizetési tudnivalókat. Jelöld mintaszámlaként.',
    },
    fr: {
      title: 'Facture',
      prompt: 'Crée une facture de prestations d’identité de marque pour un studio de design fictif, avec des coordonnées client complètes d’exemple, les prestations, les montants détaillés et les modalités de paiement. Indique qu’il s’agit d’une facture d’exemple.',
    },
    uk: {
      title: 'Рахунок на оплату',
      prompt: 'Створи рахунок за послуги з розробки айдентики від вигаданої дизайн-студії. Додай повні приклади даних клієнта, перелік послуг, деталізацію вартості та порядок оплати. Познач документ як зразок рахунку.',
    },
    tr: {
      title: 'Fatura',
      prompt: 'Hayali bir tasarım stüdyosunun marka tasarımı hizmetleri için fatura oluştur. Örnek müşteri bilgilerini, hizmetleri, ücret dökümünü ve ödeme talimatlarını eksiksiz doldur. Örnek fatura olduğunu belirt.',
    },
    th: {
      title: 'ใบแจ้งหนี้',
      prompt: 'สร้างใบแจ้งหนี้ค่าบริการออกแบบแบรนด์ของสตูดิโอออกแบบสมมติ กรอกข้อมูลลูกค้าตัวอย่าง รายการบริการ ค่าใช้จ่ายแยกรายการ และคำแนะนำการชำระเงินให้ครบ ระบุว่าเป็นใบแจ้งหนี้ตัวอย่าง',
    },
    it: {
      title: 'Fattura',
      prompt: 'Crea una fattura per servizi di identità di marca di uno studio di design immaginario, compilando dati completi di esempio del cliente, servizi, importi dettagliati e istruzioni di pagamento. Indicala come fattura di esempio.',
    },
  },
  'image-template-vr-headset-exploded-view-poster': {
    'zh-CN': {
      title: 'VR 头显拆解海报',
      prompt: '为一款名为 NOVA VR 的概念头显制作拆解海报，用悬浮分层展示外壳、镜片、显示屏和传感器，并配上组件标注与简短的产品文案。',
    },
    'zh-TW': {
      title: 'VR 頭戴裝置拆解海報',
      prompt: '為一款名為 NOVA VR 的概念頭戴裝置製作拆解海報，用懸浮分層呈現外殼、鏡片、顯示螢幕和感測器，並配上組件標註與簡短的產品文案。',
    },
    en: {
      title: 'VR Headset Exploded View Poster',
      prompt: 'Create an exploded-view poster for a concept headset called NOVA VR, showing the shell, lenses, displays, and sensors in floating layers with component labels and short product copy.',
    },
    id: {
      title: 'Poster Komponen Headset VR',
      prompt: 'Buat poster tampilan terurai untuk konsep headset NOVA VR, menampilkan cangkang, lensa, layar, dan sensor dalam lapisan melayang, dengan label komponen dan teks produk singkat.',
    },
    de: {
      title: 'VR-Headset als Explosionszeichnung',
      prompt: 'Erstelle ein Poster mit einer Explosionszeichnung des Konzept-Headsets NOVA VR. Zeige Gehäuse, Linsen, Displays und Sensoren in schwebenden Ebenen mit Bauteilbeschriftungen und kurzen Produkttexten.',
    },
    'pt-BR': {
      title: 'Pôster de headset VR desmontado',
      prompt: 'Crie um pôster em vista explodida de um headset conceitual chamado NOVA VR, mostrando carcaça, lentes, telas e sensores em camadas suspensas, com identificação dos componentes e textos curtos sobre o produto.',
    },
    'es-ES': {
      title: 'Póster de despiece de visor VR',
      prompt: 'Crea un póster con una vista explosionada de un visor conceptual llamado NOVA VR. Muestra carcasa, lentes, pantallas y sensores en capas flotantes, con etiquetas de los componentes y textos breves sobre el producto.',
    },
    ru: {
      title: 'Постер с разборкой VR-гарнитуры',
      prompt: 'Создай постер с разнесённым видом концептуальной гарнитуры NOVA VR. Покажи корпус, линзы, дисплеи и датчики парящими слоями с подписями компонентов и коротким текстом о продукте.',
    },
    fa: {
      title: 'پوستر نمای انفجاری هدست VR',
      prompt: 'برای هدست مفهومی NOVA VR یک پوستر نمای انفجاری بساز. بدنه، عدسی‌ها، نمایشگرها و حسگرها را در لایه‌های شناور، همراه با برچسب قطعات و متن کوتاه محصول نمایش بده.',
    },
    ar: {
      title: 'ملصق تفكيك نظارة واقع افتراضي',
      prompt: 'أنشئ ملصقاً بمنظور تفكيكي لنظارة تصورية باسم NOVA VR. اعرض الهيكل والعدسات والشاشات والمستشعرات في طبقات عائمة مع تسميات للمكونات ونصوص قصيرة عن المنتج.',
    },
    ja: {
      title: 'VRヘッドセット分解ポスター',
      prompt: 'NOVA VRというコンセプトヘッドセットの分解図ポスターを作成してください。外装、レンズ、ディスプレイ、センサーを浮遊する層で見せ、部品名と短い製品コピーを添えてください。',
    },
    ko: {
      title: 'VR 헤드셋 분해도 포스터',
      prompt: 'NOVA VR이라는 콘셉트 헤드셋의 분해도 포스터를 만들어 주세요. 외장, 렌즈, 디스플레이, 센서를 공중에 떠 있는 층으로 보여 주고 부품 이름과 짧은 제품 문구를 넣어 주세요.',
    },
    pl: {
      title: 'Plakat rozstrzelonego widoku gogli VR',
      prompt: 'Stwórz plakat z rozstrzelonym widokiem koncepcyjnych gogli NOVA VR. Pokaż obudowę, soczewki, ekrany i czujniki w unoszących się warstwach, z podpisami elementów i krótkimi tekstami o produkcie.',
    },
    hu: {
      title: 'VR-szemüveg robbantott ábrás posztere',
      prompt: 'Készíts robbantott ábrás posztert a NOVA VR nevű koncepciószemüvegről. A burkolatot, lencséket, kijelzőket és érzékelőket lebegő rétegekben mutasd be, alkatrészfeliratokkal és rövid termékszövegekkel.',
    },
    fr: {
      title: 'Affiche de casque VR en vue éclatée',
      prompt: 'Crée une affiche en vue éclatée d’un casque conceptuel nommé NOVA VR. Montre la coque, les lentilles, les écrans et les capteurs en couches flottantes, avec des légendes et de courts textes produit.',
    },
    uk: {
      title: 'Постер із розбиранням VR-гарнітури',
      prompt: 'Створи постер із рознесеним виглядом концептуальної гарнітури NOVA VR. Покажи корпус, лінзи, дисплеї та датчики шарами, що ширяють, із підписами компонентів і коротким текстом про продукт.',
    },
    tr: {
      title: 'VR Başlık Parça Görünümü Posteri',
      prompt: 'NOVA VR adlı konsept başlık için patlatılmış görünüm posteri oluştur. Gövde, lensler, ekranlar ve sensörleri havada duran katmanlar halinde, parça etiketleri ve kısa ürün metinleriyle göster.',
    },
    th: {
      title: 'โปสเตอร์แยกชิ้นส่วนแว่น VR',
      prompt: 'สร้างโปสเตอร์แสดงชิ้นส่วนแยกของแว่นแนวคิด NOVA VR จัดตัวเครื่อง เลนส์ จอแสดงผล และเซนเซอร์เป็นชั้นลอย พร้อมป้ายชื่อชิ้นส่วนและข้อความผลิตภัณฑ์สั้น ๆ',
    },
    it: {
      title: 'Poster esploso di un visore VR',
      prompt: 'Crea un poster con vista esplosa di un visore concettuale chiamato NOVA VR, mostrando scocca, lenti, schermi e sensori in strati sospesi, con etichette dei componenti e brevi testi sul prodotto.',
    },
  },
  'image-template-social-media-post-psg-transfer-announcement-poster': {
    'zh-CN': {
      title: '球员转会官宣海报',
      prompt: '设计一张虚构球员 Lucas Moreau 加盟巴黎圣日耳曼的概念转会海报，使用红蓝配色、球员肖像和醒目的 WELCOME LUCAS 标题，并在角落标注球迷概念设计。',
    },
    'zh-TW': {
      title: '球員轉會官宣海報',
      prompt: '設計一張虛構球員 Lucas Moreau 加盟巴黎聖日耳曼的概念轉會海報，使用紅藍配色、球員肖像和醒目的 WELCOME LUCAS 標題，並在角落標註球迷概念設計。',
    },
    en: {
      title: 'Player Transfer Announcement',
      prompt: 'Design a concept transfer poster for fictional player Lucas Moreau joining Paris Saint-Germain, with red and blue colors, a player portrait, and a bold WELCOME LUCAS headline. Add a small fan concept label in a corner.',
    },
    id: {
      title: 'Poster Pengumuman Transfer Pemain',
      prompt: 'Rancang poster konsep transfer pemain fiktif Lucas Moreau ke Paris Saint-Germain, dengan warna merah dan biru, potret pemain, serta judul WELCOME LUCAS yang menonjol. Tambahkan label kecil konsep penggemar di sudut.',
    },
    de: {
      title: 'Spielertransfer-Poster',
      prompt: 'Gestalte ein Transfer-Konzeptposter für den fiktiven Spieler Lucas Moreau bei Paris Saint-Germain, mit Rot und Blau, einem Spielerporträt und der auffälligen Überschrift WELCOME LUCAS. Ergänze in einer Ecke den kleinen Hinweis Fan-Konzept.',
    },
    'pt-BR': {
      title: 'Pôster de anúncio de contratação',
      prompt: 'Crie um pôster conceitual da contratação do jogador fictício Lucas Moreau pelo Paris Saint-Germain, com cores vermelha e azul, retrato do jogador e o título WELCOME LUCAS em destaque. Inclua uma pequena indicação de conceito de fã em um canto.',
    },
    'es-ES': {
      title: 'Póster de anuncio de fichaje',
      prompt: 'Diseña un póster conceptual del fichaje del jugador ficticio Lucas Moreau por el Paris Saint-Germain, con colores rojo y azul, un retrato del jugador y el titular WELCOME LUCAS destacado. Añade una pequeña indicación de concepto de aficionado en una esquina.',
    },
    ru: {
      title: 'Постер о трансфере игрока',
      prompt: 'Создай концептуальный постер о переходе вымышленного игрока Lucas Moreau в «Пари Сен-Жермен». Используй красный и синий цвета, портрет игрока и крупный заголовок WELCOME LUCAS. В углу добавь небольшую пометку «фанатский концепт».',
    },
    fa: {
      title: 'پوستر اعلام انتقال بازیکن',
      prompt: 'یک پوستر مفهومی برای پیوستن بازیکن خیالی Lucas Moreau به پاری سن ژرمن طراحی کن. از قرمز و آبی، پرتره بازیکن و تیتر برجسته WELCOME LUCAS استفاده کن و در گوشه‌ای برچسب کوچک «طرح مفهومی هواداری» بگذار.',
    },
    ar: {
      title: 'ملصق إعلان انتقال لاعب',
      prompt: 'صمّم ملصقاً تصورياً لانتقال اللاعب الخيالي Lucas Moreau إلى باريس سان جيرمان. استخدم الأحمر والأزرق وصورة اللاعب وعنوان WELCOME LUCAS بارزاً، وأضف في الزاوية عبارة صغيرة توضح أنه تصور من أحد المشجعين.',
    },
    ja: {
      title: '選手移籍発表ポスター',
      prompt: '架空の選手Lucas Moreauがパリ・サンジェルマンに加入するコンセプトポスターをデザインしてください。赤と青、選手のポートレート、大きなWELCOME LUCASの見出しを使い、隅にファン制作のコンセプトであることを小さく記載してください。',
    },
    ko: {
      title: '선수 영입 발표 포스터',
      prompt: '가상의 선수 Lucas Moreau가 파리 생제르맹에 합류하는 콘셉트 포스터를 디자인해 주세요. 빨강과 파랑, 선수 초상, 눈에 띄는 WELCOME LUCAS 제목을 사용하고 모서리에 팬 콘셉트 디자인이라는 표시를 작게 넣어 주세요.',
    },
    pl: {
      title: 'Plakat ogłoszenia transferu',
      prompt: 'Zaprojektuj koncepcyjny plakat transferu fikcyjnego zawodnika Lucas Moreau do Paris Saint-Germain. Użyj czerwieni i błękitu, portretu zawodnika oraz wyrazistego nagłówka WELCOME LUCAS. Dodaj w rogu niewielki napis „koncepcja kibicowska”.',
    },
    hu: {
      title: 'Játékosigazolási poszter',
      prompt: 'Tervezz koncepcióposztert a kitalált Lucas Moreau Paris Saint-Germainhez igazolásáról. Használj piros és kék színeket, játékosportrét és feltűnő WELCOME LUCAS címet. A sarokban kis felirattal jelezd, hogy rajongói koncepció.',
    },
    fr: {
      title: 'Affiche d’annonce de transfert',
      prompt: 'Conçois une affiche de transfert conceptuelle pour le joueur fictif Lucas Moreau au Paris Saint-Germain, avec du rouge et du bleu, un portrait du joueur et le titre WELCOME LUCAS bien visible. Ajoute une petite mention concept de fan dans un coin.',
    },
    uk: {
      title: 'Постер про трансфер гравця',
      prompt: 'Створи концептуальний постер про перехід вигаданого гравця Lucas Moreau до «Парі Сен-Жермен». Використай червоний і синій кольори, портрет гравця та виразний заголовок WELCOME LUCAS. У кутку додай невелику позначку «фанатський концепт».',
    },
    tr: {
      title: 'Oyuncu Transfer Duyurusu',
      prompt: 'Hayali oyuncu Lucas Moreau’nun Paris Saint-Germain’e transferini duyuran bir konsept poster tasarla. Kırmızı ve mavi renkler, oyuncu portresi ve belirgin WELCOME LUCAS başlığını kullan. Köşeye küçük bir taraftar konsepti etiketi ekle.',
    },
    th: {
      title: 'โปสเตอร์ประกาศย้ายทีม',
      prompt: 'ออกแบบโปสเตอร์แนวคิดการย้ายทีมของนักเตะสมมติ Lucas Moreau ไปปารีสแซงต์แชร์กแมง ใช้สีแดงและน้ำเงิน ภาพนักเตะ และหัวข้อ WELCOME LUCAS ที่โดดเด่น พร้อมข้อความเล็ก ๆ ที่มุมว่าเป็นคอนเซ็ปต์จากแฟนบอล',
    },
    it: {
      title: 'Poster di annuncio di un acquisto',
      prompt: 'Progetta un poster concettuale del trasferimento del calciatore immaginario Lucas Moreau al Paris Saint-Germain, con colori rosso e blu, ritratto del giocatore e il titolo WELCOME LUCAS in evidenza. Aggiungi in un angolo una piccola dicitura concept di un tifoso.',
    },
  },
  'image-template-social-media-post-vintage-sign-painter-sketch': {
    'zh-CN': {
      title: '复古手绘字海报',
      prompt: '把 SLOW MORNINGS 设计成复古咖啡馆招牌风的手绘字海报，搭配咖啡杯小插画，保留奶油色纸张纹理、铅笔底稿和马克笔笔触。',
    },
    'zh-TW': {
      title: '復古手繪字海報',
      prompt: '把 SLOW MORNINGS 設計成復古咖啡館招牌風的手繪字海報，搭配咖啡杯小插畫，保留奶油色紙張紋理、鉛筆底稿和麥克筆筆觸。',
    },
    en: {
      title: 'Vintage Hand-Lettered Poster',
      prompt: 'Turn SLOW MORNINGS into a hand-lettered poster inspired by vintage cafe signs, with a small coffee cup illustration, cream paper texture, pencil guidelines, and visible marker strokes.',
    },
    id: {
      title: 'Poster Huruf Tangan Retro',
      prompt: 'Ubah SLOW MORNINGS menjadi poster huruf tangan bergaya papan nama kafe retro, dengan ilustrasi kecil cangkir kopi, tekstur kertas krem, garis bantu pensil, dan goresan spidol yang terlihat.',
    },
    de: {
      title: 'Retro-Handlettering-Poster',
      prompt: 'Gestalte SLOW MORNINGS als handgezeichnetes Schriftposter im Stil alter Café-Schilder, mit einer kleinen Kaffeetassenillustration, cremefarbener Papierstruktur, Bleistift-Hilfslinien und sichtbaren Markerstrichen.',
    },
    'pt-BR': {
      title: 'Pôster de lettering retrô',
      prompt: 'Transforme SLOW MORNINGS em um pôster de lettering manual inspirado em letreiros de cafeterias antigas, com uma pequena ilustração de xícara de café, textura de papel creme, linhas-guia de lápis e traços visíveis de marcador.',
    },
    'es-ES': {
      title: 'Póster de rotulación retro',
      prompt: 'Convierte SLOW MORNINGS en un póster de rotulación a mano inspirado en los letreros de cafeterías antiguas, con una pequeña ilustración de una taza de café, textura de papel crema, guías de lápiz y trazos visibles de rotulador.',
    },
    ru: {
      title: 'Постер с ретро-леттерингом',
      prompt: 'Оформи SLOW MORNINGS как постер с ручным леттерингом в стиле старых вывесок кафе. Добавь небольшую иллюстрацию кофейной чашки, фактуру кремовой бумаги, карандашные направляющие и заметные штрихи маркера.',
    },
    fa: {
      title: 'پوستر حروف‌نگاری رترو',
      prompt: 'عبارت SLOW MORNINGS را به پوستری با حروف دست‌نویس، الهام‌گرفته از تابلوهای قدیمی کافه تبدیل کن. تصویر کوچکی از فنجان قهوه، بافت کاغذ کرم، خطوط راهنمای مدادی و رد واضح ماژیک را اضافه کن.',
    },
    ar: {
      title: 'ملصق حروف مرسومة بطابع قديم',
      prompt: 'حوّل SLOW MORNINGS إلى ملصق حروف مرسومة يدوياً مستوحى من لافتات المقاهي القديمة، مع رسم صغير لفنجان قهوة وملمس ورق كريمي وخطوط إرشادية بالقلم الرصاص وآثار واضحة لقلم التحديد.',
    },
    ja: {
      title: 'レトロな手描き文字ポスター',
      prompt: 'SLOW MORNINGSを、昔の喫茶店の看板を思わせる手描き文字ポスターにしてください。小さなコーヒーカップのイラスト、クリーム色の紙の質感、鉛筆の下書き線、マーカーの筆跡を取り入れてください。',
    },
    ko: {
      title: '레트로 손글씨 포스터',
      prompt: 'SLOW MORNINGS를 오래된 카페 간판에서 영감을 받은 손글씨 포스터로 디자인해 주세요. 작은 커피잔 그림, 크림색 종이 질감, 연필 밑그림, 눈에 보이는 마커 자국을 살려 주세요.',
    },
    pl: {
      title: 'Plakat z liternictwem retro',
      prompt: 'Zaprojektuj SLOW MORNINGS jako plakat z ręcznym liternictwem inspirowanym starymi szyldami kawiarni. Dodaj małą ilustrację filiżanki kawy, fakturę kremowego papieru, ołówkowe linie pomocnicze i widoczne ślady markera.',
    },
    hu: {
      title: 'Retró kézi betűrajzos poszter',
      prompt: 'Alakítsd a SLOW MORNINGS szöveget régi kávézótáblák ihlette, kézzel rajzolt betűs poszterré. Adj hozzá kis kávéscsésze-illusztrációt, krémszínű papírtextúrát, ceruzás segédvonalakat és látható filctollvonásokat.',
    },
    fr: {
      title: 'Affiche de lettrage rétro',
      prompt: 'Transforme SLOW MORNINGS en affiche de lettrage à la main inspirée des anciennes enseignes de cafés, avec une petite tasse illustrée, une texture de papier crème, des lignes de construction au crayon et des traits de feutre visibles.',
    },
    uk: {
      title: 'Постер із ретролетерингом',
      prompt: 'Оформи SLOW MORNINGS як постер із ручним летерингом у стилі старих вивісок кав’ярень. Додай маленьку ілюстрацію чашки кави, фактуру кремового паперу, олівцеві напрямні та помітні штрихи маркера.',
    },
    tr: {
      title: 'Retro El Yazısı Posteri',
      prompt: 'SLOW MORNINGS yazısını eski kafe tabelalarından esinlenen, elle çizilmiş bir harf posteri olarak tasarla. Küçük bir kahve fincanı çizimi, krem kâğıt dokusu, kurşun kalem kılavuz çizgileri ve görünür keçeli kalem izleri ekle.',
    },
    th: {
      title: 'โปสเตอร์ตัวอักษรวาดมือย้อนยุค',
      prompt: 'ออกแบบ SLOW MORNINGS เป็นโปสเตอร์ตัวอักษรวาดมือที่ได้แรงบันดาลใจจากป้ายร้านกาแฟเก่า พร้อมภาพถ้วยกาแฟเล็ก ๆ พื้นผิวกระดาษสีครีม เส้นร่างดินสอ และรอยปากกาเมจิกที่มองเห็นได้',
    },
    it: {
      title: 'Poster di lettering rétro',
      prompt: 'Trasforma SLOW MORNINGS in un poster di lettering a mano ispirato alle vecchie insegne dei caffè, con una piccola tazza illustrata, texture di carta color crema, linee guida a matita e tratti visibili di pennarello.',
    },
  },
  'image-template-profile-avatar-cyberpunk-anime-portrait-with-neon-face-text': {
    'zh-CN': {
      title: '赛博朋克动漫头像',
      prompt: '创作一张银色短发、佩戴耳机的原创动漫角色头像，用蓝紫霓虹光照亮面部，将 DREAM IN NEON 字样融入脸部光影，背景是虚化的未来城市夜景。',
    },
    'zh-TW': {
      title: '賽博龐克動漫頭像',
      prompt: '創作一張銀色短髮、佩戴耳機的原創動漫角色頭像，用藍紫霓虹光照亮面部，將 DREAM IN NEON 字樣融入臉部光影，背景是虛化的未來城市夜景。',
    },
    en: {
      title: 'Cyberpunk Anime Avatar',
      prompt: 'Create an avatar of an original anime character with short silver hair and headphones, using blue and violet neon light across the face. Blend DREAM IN NEON lettering into the facial lighting against a blurred futuristic city at night.',
    },
    id: {
      title: 'Avatar Anime Cyberpunk',
      prompt: 'Buat avatar karakter anime orisinal berambut perak pendek dan memakai headphone. Gunakan cahaya neon biru dan ungu pada wajah, padukan tulisan DREAM IN NEON dengan pencahayaan wajah, dan gunakan latar kota masa depan pada malam hari yang diburamkan.',
    },
    de: {
      title: 'Cyberpunk-Anime-Avatar',
      prompt: 'Gestalte den Avatar einer eigenen Anime-Figur mit kurzen silbernen Haaren und Kopfhörern. Beleuchte das Gesicht mit blauem und violettem Neonlicht und integriere DREAM IN NEON in die Lichtgestaltung. Der Hintergrund zeigt eine unscharfe futuristische Stadt bei Nacht.',
    },
    'pt-BR': {
      title: 'Avatar de anime cyberpunk',
      prompt: 'Crie um avatar de um personagem original de anime com cabelo prateado curto e fones de ouvido, iluminado por neon azul e violeta. Integre DREAM IN NEON à iluminação do rosto, com uma cidade futurista noturna desfocada ao fundo.',
    },
    'es-ES': {
      title: 'Avatar de anime ciberpunk',
      prompt: 'Crea un avatar de un personaje original de anime con pelo plateado corto y auriculares, iluminado con neón azul y violeta. Integra las letras DREAM IN NEON en la iluminación del rostro, con una ciudad futurista nocturna desenfocada de fondo.',
    },
    ru: {
      title: 'Аниме-аватар в стиле киберпанк',
      prompt: 'Создай аватар оригинального аниме-персонажа с короткими серебристыми волосами и наушниками. Освети лицо синим и фиолетовым неоном, вплети надпись DREAM IN NEON в световой рисунок на лице. Фоном сделай размытый ночной город будущего.',
    },
    fa: {
      title: 'آواتار انیمه سایبرپانک',
      prompt: 'آواتاری از یک شخصیت انیمه اصیل با موهای کوتاه نقره‌ای و هدفون بساز. صورت را با نئون آبی و بنفش روشن کن و نوشته DREAM IN NEON را در نورپردازی چهره ادغام کن. پس‌زمینه، نمای محو یک شهر آینده‌نگر در شب باشد.',
    },
    ar: {
      title: 'صورة رمزية أنمي سايبربانك',
      prompt: 'أنشئ صورة رمزية لشخصية أنمي أصلية بشعر فضي قصير وسماعات رأس. أضئ الوجه بنيون أزرق وبنفسجي وادمج عبارة DREAM IN NEON في إضاءة الوجه، مع خلفية ضبابية لمدينة مستقبلية ليلاً.',
    },
    ja: {
      title: 'サイバーパンクアニメアバター',
      prompt: '短い銀髪でヘッドホンを着けたオリジナルのアニメキャラクターのアバターを作成してください。青と紫のネオンで顔を照らし、DREAM IN NEONの文字を顔の光の表現に溶け込ませ、背景にはぼかした未来都市の夜景を使ってください。',
    },
    ko: {
      title: '사이버펑크 애니메이션 아바타',
      prompt: '짧은 은발에 헤드폰을 쓴 오리지널 애니메이션 캐릭터의 아바타를 만들어 주세요. 파랑과 보라 네온으로 얼굴을 비추고 DREAM IN NEON 글자를 얼굴의 빛에 녹여 넣어 주세요. 배경은 흐릿한 미래 도시의 야경으로 해 주세요.',
    },
    pl: {
      title: 'Cyberpunkowy awatar anime',
      prompt: 'Stwórz awatar oryginalnej postaci anime z krótkimi srebrnymi włosami i słuchawkami. Oświetl twarz niebieskim i fioletowym neonem, wkomponuj napis DREAM IN NEON w światło na twarzy, a w tle umieść rozmyte futurystyczne miasto nocą.',
    },
    hu: {
      title: 'Cyberpunk anime avatár',
      prompt: 'Készíts avatárt egy eredeti animekarakterről rövid ezüst hajjal és fejhallgatóval. Világítsd meg az arcot kék és lila neonnal, építsd a DREAM IN NEON feliratot az arc fényrajzába, háttérként pedig használj elmosódott futurisztikus éjszakai várost.',
    },
    fr: {
      title: 'Avatar anime cyberpunk',
      prompt: 'Crée un avatar de personnage anime original aux cheveux argentés courts et portant un casque audio. Éclaire son visage de néons bleus et violets et intègre DREAM IN NEON à l’éclairage du visage, sur fond flou de ville futuriste nocturne.',
    },
    uk: {
      title: 'Аніме-аватар у стилі кіберпанк',
      prompt: 'Створи аватар оригінального аніме-персонажа з коротким сріблястим волоссям і навушниками. Освіти обличчя синім і фіолетовим неоном, вплети напис DREAM IN NEON у світловий малюнок на обличчі. Тло — розмите нічне місто майбутнього.',
    },
    tr: {
      title: 'Siberpunk Anime Avatarı',
      prompt: 'Kısa gümüş saçlı ve kulaklıklı özgün bir anime karakterinin avatarını oluştur. Yüzü mavi ve mor neonla aydınlat, DREAM IN NEON yazısını yüzdeki ışığa yedir ve arka planda bulanık bir gelecek şehrinin gece manzarasını kullan.',
    },
    th: {
      title: 'อวตารอนิเมะไซเบอร์พังก์',
      prompt: 'สร้างอวตารตัวละครอนิเมะต้นฉบับผมสั้นสีเงินสวมหูฟัง ใช้แสงนีออนสีน้ำเงินและม่วงบนใบหน้า ผสานข้อความ DREAM IN NEON เข้ากับแสงบนใบหน้า โดยมีฉากหลังเป็นเมืองอนาคตยามค่ำคืนแบบเบลอ',
    },
    it: {
      title: 'Avatar anime cyberpunk',
      prompt: 'Crea un avatar di un personaggio anime originale con capelli argento corti e cuffie. Illumina il volto con neon blu e viola e integra la scritta DREAM IN NEON nella luce del viso, con una città futuristica notturna sfocata sullo sfondo.',
    },
  },
  'image-template-profile-avatar-monochrome-studio-portrait': {
    'zh-CN': {
      title: '黑白棚拍肖像',
      prompt: '生成一张虚构年轻创意工作者的黑白棚拍肖像，人物穿黑色高领上衣、神态自然，以深浅分割背景和侧面柔光突出面部轮廓，保留真实皮肤质感。',
    },
    'zh-TW': {
      title: '黑白棚拍肖像',
      prompt: '生成一張虛構年輕創意工作者的黑白棚拍肖像，人物穿黑色高領上衣、神態自然，以深淺分割背景和側面柔光突出面部輪廓，保留真實皮膚質感。',
    },
    en: {
      title: 'Black and White Studio Portrait',
      prompt: 'Generate a black and white studio portrait of a fictional young creative professional in a black turtleneck with a relaxed expression. Use a split light-and-dark background and soft side lighting to define the face, preserving natural skin texture.',
    },
    id: {
      title: 'Potret Studio Hitam Putih',
      prompt: 'Buat potret studio hitam putih seorang pekerja kreatif muda fiktif yang mengenakan atasan turtleneck hitam dengan ekspresi santai. Gunakan latar terbagi terang dan gelap serta cahaya samping lembut untuk menonjolkan wajah, sambil mempertahankan tekstur kulit alami.',
    },
    de: {
      title: 'Schwarz-Weiß-Studioporträt',
      prompt: 'Erzeuge ein Schwarz-Weiß-Studioporträt einer fiktiven jungen Person aus der Kreativbranche mit schwarzem Rollkragenpullover und entspanntem Gesichtsausdruck. Nutze einen hell-dunkel geteilten Hintergrund und weiches Seitenlicht, das die Gesichtszüge und natürliche Hautstruktur betont.',
    },
    'pt-BR': {
      title: 'Retrato de estúdio em preto e branco',
      prompt: 'Gere um retrato de estúdio em preto e branco de uma pessoa jovem fictícia da área criativa, com blusa preta de gola alta e expressão descontraída. Use fundo dividido entre claro e escuro e luz lateral suave para destacar o rosto, preservando a textura natural da pele.',
    },
    'es-ES': {
      title: 'Retrato de estudio en blanco y negro',
      prompt: 'Genera un retrato de estudio en blanco y negro de una persona joven ficticia del sector creativo, con jersey negro de cuello alto y expresión relajada. Usa un fondo dividido entre claro y oscuro y una luz lateral suave que destaque el rostro, manteniendo la textura natural de la piel.',
    },
    ru: {
      title: 'Чёрно-белый студийный портрет',
      prompt: 'Создай чёрно-белый студийный портрет вымышленного молодого специалиста творческой профессии в чёрной водолазке со спокойным выражением лица. Используй фон из светлой и тёмной половин и мягкий боковой свет, подчёркивающий черты лица и естественную текстуру кожи.',
    },
    fa: {
      title: 'پرتره استودیویی سیاه‌وسفید',
      prompt: 'یک پرتره استودیویی سیاه‌وسفید از فردی جوان و خیالی در حرفه‌ای خلاق بساز که یقه‌اسکی مشکی پوشیده و حالت چهره آرامی دارد. با پس‌زمینه دو بخش روشن و تیره و نور جانبی نرم، فرم صورت را برجسته کن و بافت طبیعی پوست را نگه دار.',
    },
    ar: {
      title: 'بورتريه استوديو بالأبيض والأسود',
      prompt: 'أنشئ بورتريهاً بالأبيض والأسود لشخص خيالي شاب يعمل في مجال إبداعي، يرتدي كنزة سوداء بياقة عالية وتبدو عليه ملامح هادئة. استخدم خلفية مقسمة إلى فاتح وداكن وإضاءة جانبية ناعمة لإبراز الوجه مع الحفاظ على ملمس البشرة الطبيعي.',
    },
    ja: {
      title: 'モノクロのスタジオポートレート',
      prompt: '黒いタートルネックを着た、架空の若いクリエイティブ職の人物のモノクロスタジオポートレートを生成してください。自然な表情、明暗に分かれた背景、柔らかなサイドライトで顔の輪郭を際立たせ、自然な肌の質感を残してください。',
    },
    ko: {
      title: '흑백 스튜디오 인물 사진',
      prompt: '검은 터틀넥을 입고 편안한 표정을 지은 가상의 젊은 창작자의 흑백 스튜디오 인물 사진을 생성해 주세요. 밝고 어둡게 나뉜 배경과 부드러운 측면 조명으로 얼굴 윤곽을 살리고 자연스러운 피부 질감을 유지해 주세요.',
    },
    pl: {
      title: 'Czarno-biały portret studyjny',
      prompt: 'Wygeneruj czarno-biały portret studyjny fikcyjnej młodej osoby z branży kreatywnej w czarnym golfie, ze swobodnym wyrazem twarzy. Użyj tła podzielonego na jasną i ciemną część oraz miękkiego światła bocznego, aby podkreślić rysy i zachować naturalną fakturę skóry.',
    },
    hu: {
      title: 'Fekete-fehér stúdióportré',
      prompt: 'Készíts fekete-fehér stúdióportrét egy kitalált fiatal kreatív szakemberről, fekete garbóban, nyugodt arckifejezéssel. Használj világos és sötét részre osztott hátteret és lágy oldalfényt az arcvonások kiemelésére, a természetes bőrtextúra megőrzésével.',
    },
    fr: {
      title: 'Portrait studio en noir et blanc',
      prompt: 'Génère un portrait studio en noir et blanc d’une jeune personne fictive travaillant dans la création, en col roulé noir et à l’expression détendue. Utilise un fond partagé entre clair et sombre et une lumière latérale douce qui souligne le visage tout en préservant la texture naturelle de la peau.',
    },
    uk: {
      title: 'Чорно-білий студійний портрет',
      prompt: 'Створи чорно-білий студійний портрет вигаданої молодої людини творчої професії в чорній водолазці зі спокійним виразом обличчя. Використай тло зі світлої та темної половин і м’яке бічне світло, що підкреслює риси обличчя та природну текстуру шкіри.',
    },
    tr: {
      title: 'Siyah Beyaz Stüdyo Portresi',
      prompt: 'Siyah balıkçı yaka kazaklı, rahat ifadeli, yaratıcı bir meslekte çalışan hayali bir gencin siyah beyaz stüdyo portresini oluştur. Doğal cilt dokusunu koruyarak yüz hatlarını vurgulamak için açık ve koyu bölünmüş arka plan ile yumuşak yan ışık kullan.',
    },
    th: {
      title: 'ภาพพอร์ตเทรตสตูดิโอขาวดำ',
      prompt: 'สร้างภาพพอร์ตเทรตสตูดิโอขาวดำของคนหนุ่มสาวสมมติในสายงานสร้างสรรค์ สวมเสื้อคอเต่าสีดำและมีสีหน้าผ่อนคลาย ใช้ฉากหลังแบ่งส่วนสว่างและมืดกับแสงด้านข้างนุ่ม ๆ เพื่อเน้นใบหน้าและคงพื้นผิวผิวหนังตามธรรมชาติ',
    },
    it: {
      title: 'Ritratto in studio in bianco e nero',
      prompt: 'Genera un ritratto in studio in bianco e nero di una giovane persona immaginaria del settore creativo, con dolcevita nero ed espressione rilassata. Usa uno sfondo diviso tra chiaro e scuro e luce laterale morbida per definire il volto, preservando la texture naturale della pelle.',
    },
  },
  'example-fs-creative-voltage': {
    'zh-CN': {
      title: '种子轮融资路演',
      prompt: '为我的创业项目制作一份融资路演，讲清市场机会、产品优势、业务进展和融资计划。',
    },
    'zh-TW': {
      title: '種子輪融資簡報',
      prompt: '為我的創業專案製作一份融資簡報，講清市場機會、產品優勢、業務進展和融資計畫。',
    },
    en: {
      title: 'Seed Funding Pitch',
      prompt: 'Create a pitch deck for my startup that explains the market opportunity, product advantages, business traction, and fundraising plan.',
    },
    id: {
      title: 'Presentasi Pendanaan Awal',
      prompt: 'Buat presentasi pendanaan untuk startup saya yang menjelaskan peluang pasar, keunggulan produk, perkembangan bisnis, dan rencana pendanaan.',
    },
    de: {
      title: 'Seed-Finanzierungspräsentation',
      prompt: 'Erstelle eine Finanzierungspräsentation für mein Startup, die Marktchance, Produktvorteile, Geschäftsentwicklung und Finanzierungsplan erläutert.',
    },
    'pt-BR': {
      title: 'Apresentação para rodada seed',
      prompt: 'Crie uma apresentação de captação para minha startup que explique a oportunidade de mercado, os diferenciais do produto, a evolução do negócio e o plano de investimento.',
    },
    'es-ES': {
      title: 'Presentación de ronda semilla',
      prompt: 'Crea una presentación de financiación para mi startup que explique la oportunidad de mercado, las ventajas del producto, la evolución del negocio y el plan de financiación.',
    },
    ru: {
      title: 'Презентация для посевного раунда',
      prompt: 'Создай инвестиционную презентацию моего стартапа, раскрывающую рыночную возможность, преимущества продукта, развитие бизнеса и план привлечения средств.',
    },
    fa: {
      title: 'ارائه جذب سرمایه بذری',
      prompt: 'برای استارتاپ من یک ارائه جذب سرمایه تهیه کن که فرصت بازار، مزیت‌های محصول، پیشرفت کسب‌وکار و برنامه تأمین مالی را توضیح دهد.',
    },
    ar: {
      title: 'عرض تمويل تأسيسي',
      prompt: 'أنشئ عرضاً لجمع التمويل لشركتي الناشئة يشرح فرصة السوق ومزايا المنتج وتقدم الأعمال وخطة التمويل.',
    },
    ja: {
      title: 'シードラウンドの資金調達資料',
      prompt: '私のスタートアップの資金調達プレゼンを作成してください。市場機会、製品の強み、事業の進捗、資金調達計画を説明してください。',
    },
    ko: {
      title: '시드 투자 유치 발표',
      prompt: '제 스타트업의 투자 유치 발표 자료를 만들어 주세요. 시장 기회, 제품 강점, 사업 진행 상황, 투자 유치 계획을 설명해 주세요.',
    },
    pl: {
      title: 'Prezentacja rundy zalążkowej',
      prompt: 'Stwórz prezentację inwestorską mojego startupu, przedstawiającą szansę rynkową, zalety produktu, rozwój biznesu i plan pozyskania finansowania.',
    },
    hu: {
      title: 'Magvető befektetői prezentáció',
      prompt: 'Készíts befektetői prezentációt a startupomnak, amely bemutatja a piaci lehetőséget, a termék előnyeit, az üzleti előrehaladást és a finanszírozási tervet.',
    },
    fr: {
      title: 'Présentation de levée d’amorçage',
      prompt: 'Crée une présentation de levée de fonds pour ma startup qui explique l’opportunité de marché, les atouts du produit, les progrès de l’activité et le plan de financement.',
    },
    uk: {
      title: 'Презентація для посівного раунду',
      prompt: 'Створи інвестиційну презентацію мого стартапу, що пояснює ринкову можливість, переваги продукту, розвиток бізнесу та план залучення коштів.',
    },
    tr: {
      title: 'Tohum Yatırım Sunumu',
      prompt: 'Girişimim için pazar fırsatını, ürün avantajlarını, işin ilerleyişini ve yatırım planını açıklayan bir yatırım sunumu oluştur.',
    },
    th: {
      title: 'พรีเซนเทชันระดมทุนรอบ Seed',
      prompt: 'สร้างพรีเซนเทชันระดมทุนสำหรับสตาร์ทอัพของฉัน โดยอธิบายโอกาสทางการตลาด จุดเด่นผลิตภัณฑ์ ความคืบหน้าธุรกิจ และแผนระดมทุน',
    },
    it: {
      title: 'Presentazione per un round seed',
      prompt: 'Crea una presentazione di raccolta fondi per la mia startup che illustri opportunità di mercato, vantaggi del prodotto, progressi dell’attività e piano di finanziamento.',
    },
  },
  'example-fs-electric-studio': {
    'zh-CN': {
      title: 'B2B 销售提案',
      prompt: '为企业客户制作一份销售提案，围绕客户痛点介绍解决方案、预期收益和实施计划。',
    },
    'zh-TW': {
      title: 'B2B 銷售提案',
      prompt: '為企業客戶製作一份銷售提案，圍繞客戶痛點介紹解決方案、預期效益和實施計畫。',
    },
    en: {
      title: 'B2B Sales Proposal',
      prompt: 'Create a sales proposal for an enterprise customer, addressing their pain points with a solution, expected benefits, and an implementation plan.',
    },
    id: {
      title: 'Proposal Penjualan B2B',
      prompt: 'Buat proposal penjualan untuk klien perusahaan, yang menjawab masalah mereka dengan solusi, manfaat yang diharapkan, dan rencana implementasi.',
    },
    de: {
      title: 'B2B-Verkaufspräsentation',
      prompt: 'Erstelle eine Verkaufspräsentation für einen Unternehmenskunden, die seine Probleme mit einer Lösung, dem erwarteten Nutzen und einem Umsetzungsplan adressiert.',
    },
    'pt-BR': {
      title: 'Proposta comercial B2B',
      prompt: 'Crie uma proposta comercial para um cliente empresarial, abordando suas dificuldades com uma solução, os benefícios esperados e um plano de implementação.',
    },
    'es-ES': {
      title: 'Propuesta comercial B2B',
      prompt: 'Crea una propuesta comercial para un cliente empresarial que aborde sus problemas con una solución, los beneficios esperados y un plan de implantación.',
    },
    ru: {
      title: 'Коммерческое предложение B2B',
      prompt: 'Создай коммерческое предложение для корпоративного клиента: опиши его проблемы, решение, ожидаемые выгоды и план внедрения.',
    },
    fa: {
      title: 'پیشنهاد فروش سازمانی',
      prompt: 'برای یک مشتری سازمانی، پیشنهاد فروشی تهیه کن که مشکلات او را با راه‌حل، مزایای مورد انتظار و برنامه اجرا پاسخ دهد.',
    },
    ar: {
      title: 'عرض مبيعات للشركات',
      prompt: 'أنشئ عرض مبيعات لعميل من الشركات يعالج مشكلاته من خلال حل وفوائد متوقعة وخطة تنفيذ.',
    },
    ja: {
      title: 'B2B営業提案書',
      prompt: '企業顧客向けの営業提案書を作成してください。顧客の課題に対する解決策、期待される効果、導入計画を示してください。',
    },
    ko: {
      title: 'B2B 영업 제안서',
      prompt: '기업 고객을 위한 영업 제안서를 만들어 주세요. 고객의 문제에 대한 해결책, 기대 효과, 도입 계획을 제시해 주세요.',
    },
    pl: {
      title: 'Oferta sprzedażowa B2B',
      prompt: 'Stwórz ofertę sprzedażową dla klienta biznesowego, która odpowiada na jego problemy rozwiązaniem, oczekiwanymi korzyściami i planem wdrożenia.',
    },
    hu: {
      title: 'B2B értékesítési ajánlat',
      prompt: 'Készíts értékesítési ajánlatot egy vállalati ügyfélnek, amely a problémáira megoldást, várható előnyöket és bevezetési tervet kínál.',
    },
    fr: {
      title: 'Proposition commerciale B2B',
      prompt: 'Crée une proposition commerciale pour une entreprise cliente, en répondant à ses difficultés par une solution, les bénéfices attendus et un plan de mise en œuvre.',
    },
    uk: {
      title: 'Комерційна пропозиція B2B',
      prompt: 'Створи комерційну пропозицію для корпоративного клієнта: опиши його проблеми, рішення, очікувані вигоди та план упровадження.',
    },
    tr: {
      title: 'B2B Satış Teklifi',
      prompt: 'Kurumsal bir müşteri için sorunlarına çözüm, beklenen faydalar ve uygulama planı sunan bir satış teklifi oluştur.',
    },
    th: {
      title: 'ข้อเสนอขาย B2B',
      prompt: 'สร้างข้อเสนอขายสำหรับลูกค้าองค์กร โดยนำเสนอวิธีแก้ปัญหาของลูกค้า ประโยชน์ที่คาดหวัง และแผนการนำไปใช้',
    },
    it: {
      title: 'Proposta commerciale B2B',
      prompt: 'Crea una proposta commerciale per un cliente aziendale che risponda alle sue difficoltà con una soluzione, i benefici previsti e un piano di implementazione.',
    },
  },
  'example-html-ppt-zhangzara-block-frame': {
    'zh-CN': {
      title: '董事会汇报',
      prompt: '帮我把现有演示文稿打磨成适合董事会汇报的版本，理清叙事、突出关键证据，并统一视觉风格。',
    },
    'zh-TW': {
      title: '董事會簡報',
      prompt: '幫我把現有簡報打磨成適合董事會報告的版本，理清敘事、突出關鍵證據，並統一視覺風格。',
    },
    en: {
      title: 'Board Presentation',
      prompt: 'Refine my existing presentation for a board meeting by clarifying the narrative, highlighting key evidence, and creating a consistent visual style.',
    },
    id: {
      title: 'Presentasi Dewan Direksi',
      prompt: 'Sempurnakan presentasi saya yang sudah ada untuk rapat dewan direksi dengan memperjelas alur cerita, menonjolkan bukti utama, dan menyatukan gaya visual.',
    },
    de: {
      title: 'Präsentation für den Vorstand',
      prompt: 'Überarbeite meine bestehende Präsentation für eine Vorstandssitzung: Schärfe den roten Faden, hebe die wichtigsten Belege hervor und vereinheitliche die visuelle Gestaltung.',
    },
    'pt-BR': {
      title: 'Apresentação ao conselho',
      prompt: 'Aprimore minha apresentação existente para uma reunião do conselho, esclarecendo a narrativa, destacando as principais evidências e unificando o estilo visual.',
    },
    'es-ES': {
      title: 'Presentación al consejo',
      prompt: 'Mejora mi presentación existente para una reunión del consejo: aclara el hilo narrativo, destaca las pruebas clave y unifica el estilo visual.',
    },
    ru: {
      title: 'Презентация для совета директоров',
      prompt: 'Доработай мою существующую презентацию для совета директоров: выстрой последовательное повествование, выдели ключевые доказательства и приведи оформление к единому стилю.',
    },
    fa: {
      title: 'ارائه به هیئت‌مدیره',
      prompt: 'ارائه فعلی من را برای جلسه هیئت‌مدیره بهبود بده. مسیر روایت را روشن کن، شواهد کلیدی را برجسته کن و سبک بصری را یکدست کن.',
    },
    ar: {
      title: 'عرض لمجلس الإدارة',
      prompt: 'حسّن عرضي الحالي ليلائم اجتماع مجلس الإدارة، مع توضيح تسلسل الأفكار وإبراز الأدلة الرئيسية وتوحيد الأسلوب البصري.',
    },
    ja: {
      title: '取締役会向けプレゼン',
      prompt: '既存のプレゼンを取締役会向けに磨き上げてください。話の流れを明確にし、重要な根拠を強調し、ビジュアルスタイルを統一してください。',
    },
    ko: {
      title: '이사회 보고 자료',
      prompt: '기존 발표 자료를 이사회 보고에 맞게 다듬어 주세요. 이야기 흐름을 명확히 하고 핵심 근거를 강조하며 시각적 스타일을 통일해 주세요.',
    },
    pl: {
      title: 'Prezentacja dla zarządu',
      prompt: 'Dopracuj moją istniejącą prezentację na posiedzenie zarządu: uporządkuj narrację, podkreśl kluczowe dowody i nadaj spójny styl wizualny.',
    },
    hu: {
      title: 'Igazgatósági prezentáció',
      prompt: 'Dolgozd át a meglévő prezentációmat igazgatósági ülésre. Tedd világossá a történetvezetést, emeld ki a legfontosabb bizonyítékokat, és egységesítsd a vizuális stílust.',
    },
    fr: {
      title: 'Présentation au conseil',
      prompt: 'Améliore ma présentation existante pour une réunion du conseil d’administration : clarifie le fil narratif, souligne les preuves essentielles et harmonise le style visuel.',
    },
    uk: {
      title: 'Презентація для ради директорів',
      prompt: 'Удоскональ мою наявну презентацію для засідання ради директорів: вибудуй чітку розповідь, виділи ключові докази та узгодь візуальний стиль.',
    },
    tr: {
      title: 'Yönetim Kurulu Sunumu',
      prompt: 'Mevcut sunumumu yönetim kurulu toplantısına uygun hale getir. Anlatı akışını netleştir, temel kanıtları vurgula ve görsel tarzı tutarlı hale getir.',
    },
    th: {
      title: 'พรีเซนเทชันสำหรับคณะกรรมการ',
      prompt: 'ปรับปรุงพรีเซนเทชันที่มีอยู่ของฉันให้เหมาะกับการประชุมคณะกรรมการ ทำให้ลำดับเรื่องชัดเจน เน้นหลักฐานสำคัญ และใช้รูปแบบภาพที่สอดคล้องกัน',
    },
    it: {
      title: 'Presentazione al consiglio',
      prompt: 'Migliora la mia presentazione esistente per una riunione del consiglio di amministrazione, chiarendo il filo narrativo, evidenziando le prove principali e uniformando lo stile visivo.',
    },
  },
  'example-fs-notebook-tabs': {
    'zh-CN': {
      title: '毕业设计答辩',
      prompt: '为我的毕业设计制作答辩演示，清楚呈现研究问题、解决方法、成果验证和创新点。',
    },
    'zh-TW': {
      title: '畢業專題口試',
      prompt: '為我的畢業專題製作口試簡報，清楚呈現研究問題、解決方法、成果驗證和創新之處。',
    },
    en: {
      title: 'Capstone Defense',
      prompt: 'Create a defense presentation for my capstone project, clearly presenting the research problem, approach, validation results, and original contributions.',
    },
    id: {
      title: 'Presentasi Sidang Tugas Akhir',
      prompt: 'Buat presentasi sidang tugas akhir saya yang menjelaskan masalah penelitian, pendekatan, hasil validasi, dan kontribusi orisinal.',
    },
    de: {
      title: 'Präsentation zur Abschlussarbeit',
      prompt: 'Erstelle eine Präsentation zur Verteidigung meiner Abschlussarbeit, die Forschungsfrage, Vorgehen, Validierungsergebnisse und eigenständige Beiträge klar darstellt.',
    },
    'pt-BR': {
      title: 'Apresentação de TCC',
      prompt: 'Crie uma apresentação de defesa do meu trabalho de conclusão de curso, expondo com clareza o problema de pesquisa, a abordagem, os resultados da validação e as contribuições originais.',
    },
    'es-ES': {
      title: 'Defensa de proyecto de fin de grado',
      prompt: 'Crea una presentación para defender mi proyecto de fin de grado, exponiendo claramente el problema de investigación, el enfoque, los resultados de validación y las aportaciones originales.',
    },
    ru: {
      title: 'Защита дипломного проекта',
      prompt: 'Создай презентацию для защиты моего дипломного проекта. Ясно изложи исследовательскую проблему, подход, результаты проверки и оригинальный вклад.',
    },
    fa: {
      title: 'ارائه دفاع پروژه پایانی',
      prompt: 'برای دفاع از پروژه پایانی من ارائه‌ای تهیه کن که مسئله پژوهش، رویکرد، نتایج اعتبارسنجی و دستاوردهای اصیل را روشن نشان دهد.',
    },
    ar: {
      title: 'عرض مناقشة مشروع التخرج',
      prompt: 'أنشئ عرضاً لمناقشة مشروع تخرجي يوضح مشكلة البحث والمنهج المتبع ونتائج التحقق والإسهامات الأصلية.',
    },
    ja: {
      title: '卒業制作の発表資料',
      prompt: '私の卒業制作の発表資料を作成してください。研究課題、アプローチ、検証結果、独自の貢献を明確に示してください。',
    },
    ko: {
      title: '졸업 프로젝트 발표',
      prompt: '제 졸업 프로젝트의 심사 발표 자료를 만들어 주세요. 연구 문제, 접근 방법, 검증 결과, 독창적인 기여를 명확히 보여 주세요.',
    },
    pl: {
      title: 'Obrona projektu dyplomowego',
      prompt: 'Stwórz prezentację do obrony mojego projektu dyplomowego. Jasno przedstaw problem badawczy, podejście, wyniki weryfikacji i oryginalny wkład.',
    },
    hu: {
      title: 'Diplomaprojekt-védés',
      prompt: 'Készíts prezentációt a diplomaprojektem védéséhez, amely világosan bemutatja a kutatási problémát, a megközelítést, az ellenőrzés eredményeit és az eredeti hozzájárulást.',
    },
    fr: {
      title: 'Soutenance de projet de fin d’études',
      prompt: 'Crée une présentation de soutenance pour mon projet de fin d’études, exposant clairement la problématique, la démarche, les résultats de validation et les contributions originales.',
    },
    uk: {
      title: 'Захист дипломного проєкту',
      prompt: 'Створи презентацію для захисту мого дипломного проєкту. Чітко виклади дослідницьку проблему, підхід, результати перевірки та оригінальний внесок.',
    },
    tr: {
      title: 'Bitirme Projesi Savunması',
      prompt: 'Bitirme projem için araştırma problemini, yaklaşımı, doğrulama sonuçlarını ve özgün katkıları açıkça sunan bir savunma sunumu oluştur.',
    },
    th: {
      title: 'พรีเซนเทชันสอบโครงงานจบ',
      prompt: 'สร้างพรีเซนเทชันสอบโครงงานจบของฉัน โดยนำเสนอปัญหาวิจัย วิธีดำเนินงาน ผลการตรวจสอบ และผลงานริเริ่มอย่างชัดเจน',
    },
    it: {
      title: 'Discussione del progetto di laurea',
      prompt: 'Crea una presentazione per la discussione del mio progetto di laurea, illustrando chiaramente il problema di ricerca, l’approccio, i risultati della validazione e i contributi originali.',
    },
  },
  'example-guizang-ppt': {
    'zh-CN': {
      title: '品牌增长方案',
      prompt: '制作一份品牌增长方案，讲清目标人群、品牌定位、营销行动和衡量效果的指标。',
    },
    'zh-TW': {
      title: '品牌成長方案',
      prompt: '製作一份品牌成長方案，講清目標受眾、品牌定位、行銷行動和衡量成效的指標。',
    },
    en: {
      title: 'Brand Growth Plan',
      prompt: 'Create a brand growth plan that defines the target audience, brand positioning, marketing actions, and metrics for measuring results.',
    },
    id: {
      title: 'Rencana Pertumbuhan Merek',
      prompt: 'Buat rencana pertumbuhan merek yang menjelaskan target audiens, posisi merek, kegiatan pemasaran, dan metrik untuk mengukur hasil.',
    },
    de: {
      title: 'Markenwachstumsplan',
      prompt: 'Erstelle einen Markenwachstumsplan mit Zielgruppe, Markenpositionierung, Marketingmaßnahmen und Kennzahlen zur Erfolgsmessung.',
    },
    'pt-BR': {
      title: 'Plano de crescimento de marca',
      prompt: 'Crie um plano de crescimento de marca que defina público-alvo, posicionamento, ações de marketing e métricas para medir os resultados.',
    },
    'es-ES': {
      title: 'Plan de crecimiento de marca',
      prompt: 'Crea un plan de crecimiento de marca que defina el público objetivo, el posicionamiento, las acciones de marketing y las métricas para medir los resultados.',
    },
    ru: {
      title: 'План роста бренда',
      prompt: 'Создай план роста бренда с описанием целевой аудитории, позиционирования, маркетинговых действий и показателей для оценки результатов.',
    },
    fa: {
      title: 'برنامه رشد برند',
      prompt: 'یک برنامه رشد برند تهیه کن که مخاطب هدف، جایگاه برند، اقدامات بازاریابی و شاخص‌های سنجش نتیجه را مشخص کند.',
    },
    ar: {
      title: 'خطة نمو العلامة التجارية',
      prompt: 'أنشئ خطة لنمو العلامة التجارية تحدد الجمهور المستهدف والتموضع والإجراءات التسويقية ومؤشرات قياس النتائج.',
    },
    ja: {
      title: 'ブランド成長計画',
      prompt: 'ターゲット層、ブランドのポジショニング、マーケティング施策、成果を測る指標を明確にしたブランド成長計画を作成してください。',
    },
    ko: {
      title: '브랜드 성장 계획',
      prompt: '목표 고객, 브랜드 포지셔닝, 마케팅 활동, 성과 측정 지표를 정의하는 브랜드 성장 계획을 만들어 주세요.',
    },
    pl: {
      title: 'Plan rozwoju marki',
      prompt: 'Stwórz plan rozwoju marki definiujący grupę docelową, pozycjonowanie, działania marketingowe i wskaźniki pomiaru wyników.',
    },
    hu: {
      title: 'Márkanövekedési terv',
      prompt: 'Készíts márkanövekedési tervet a célközönség, a márkapozicionálás, a marketinglépések és az eredménymutatók meghatározásával.',
    },
    fr: {
      title: 'Plan de croissance de marque',
      prompt: 'Crée un plan de croissance de marque qui définit le public cible, le positionnement, les actions marketing et les indicateurs de résultats.',
    },
    uk: {
      title: 'План розвитку бренду',
      prompt: 'Створи план розвитку бренду з цільовою аудиторією, позиціонуванням, маркетинговими діями та показниками для оцінки результатів.',
    },
    tr: {
      title: 'Marka Büyüme Planı',
      prompt: 'Hedef kitleyi, marka konumlandırmasını, pazarlama adımlarını ve sonuçları ölçme metriklerini tanımlayan bir marka büyüme planı oluştur.',
    },
    th: {
      title: 'แผนเติบโตของแบรนด์',
      prompt: 'สร้างแผนเติบโตของแบรนด์ที่ระบุกลุ่มเป้าหมาย ตำแหน่งแบรนด์ กิจกรรมการตลาด และตัวชี้วัดผลลัพธ์',
    },
    it: {
      title: 'Piano di crescita del marchio',
      prompt: 'Crea un piano di crescita del marchio che definisca pubblico di riferimento, posizionamento, azioni di marketing e metriche per misurare i risultati.',
    },
  },
  'example-velar-luxury-real-estate': {
    'zh-CN': {
      title: '高端地产展示页',
      prompt: '为一个高端住宅项目设计展示页，用大幅建筑摄影和流畅的滚动动效呈现项目特色。',
    },
    'zh-TW': {
      title: '高端地產展示頁',
      prompt: '為一個高端住宅專案設計展示頁，用大幅建築攝影和流暢的捲動動畫呈現專案特色。',
    },
    en: {
      title: 'Luxury Property Website',
      prompt: 'Design a website for a luxury residential development, showcasing its character through large architectural photos and smooth scroll animations.',
    },
    id: {
      title: 'Situs Properti Mewah',
      prompt: 'Rancang situs untuk proyek hunian mewah, menampilkan karakternya melalui foto arsitektur berukuran besar dan animasi gulir yang mulus.',
    },
    de: {
      title: 'Website für Luxusimmobilien',
      prompt: 'Gestalte eine Website für ein luxuriöses Wohnprojekt, die dessen Charakter mit großformatigen Architekturfotos und flüssigen Scrollanimationen zeigt.',
    },
    'pt-BR': {
      title: 'Site de empreendimento de luxo',
      prompt: 'Crie um site para um empreendimento residencial de luxo, destacando sua identidade com grandes fotografias de arquitetura e animações suaves de rolagem.',
    },
    'es-ES': {
      title: 'Web de promoción inmobiliaria de lujo',
      prompt: 'Diseña una web para una promoción residencial de lujo que muestre su carácter con grandes fotografías de arquitectura y animaciones de desplazamiento fluidas.',
    },
    ru: {
      title: 'Сайт элитной недвижимости',
      prompt: 'Разработай сайт элитного жилого комплекса, передающий его характер с помощью крупных архитектурных фотографий и плавной анимации при прокрутке.',
    },
    fa: {
      title: 'وب‌سایت املاک لوکس',
      prompt: 'برای یک پروژه مسکونی لوکس، وب‌سایتی طراحی کن که با عکس‌های بزرگ معماری و انیمیشن‌های روان اسکرول، ویژگی‌های آن را نشان دهد.',
    },
    ar: {
      title: 'موقع عقارات فاخرة',
      prompt: 'صمّم موقعاً لمشروع سكني فاخر يعرض طابعه من خلال صور معمارية كبيرة وحركات تمرير سلسة.',
    },
    ja: {
      title: '高級住宅プロジェクトのサイト',
      prompt: '高級住宅プロジェクトの紹介サイトをデザインしてください。大きな建築写真となめらかなスクロールアニメーションで、その魅力を伝えてください。',
    },
    ko: {
      title: '고급 주거 단지 웹사이트',
      prompt: '고급 주거 단지를 소개하는 웹사이트를 디자인해 주세요. 대형 건축 사진과 부드러운 스크롤 애니메이션으로 프로젝트의 개성을 보여 주세요.',
    },
    pl: {
      title: 'Strona luksusowej inwestycji',
      prompt: 'Zaprojektuj stronę luksusowej inwestycji mieszkaniowej, podkreślającą jej charakter dużymi zdjęciami architektury i płynnymi animacjami przewijania.',
    },
    hu: {
      title: 'Luxuslakópark weboldala',
      prompt: 'Tervezz weboldalt egy luxus lakóingatlan-fejlesztésnek, amely nagy építészeti fotókkal és gördülékeny görgetési animációkkal mutatja be annak karakterét.',
    },
    fr: {
      title: 'Site immobilier haut de gamme',
      prompt: 'Conçois un site pour un programme résidentiel haut de gamme, en mettant en valeur son caractère avec de grandes photos d’architecture et des animations de défilement fluides.',
    },
    uk: {
      title: 'Сайт елітної нерухомості',
      prompt: 'Розроби сайт елітного житлового комплексу, що передає його характер великими архітектурними фотографіями та плавною анімацією під час прокручування.',
    },
    tr: {
      title: 'Lüks Konut Web Sitesi',
      prompt: 'Lüks bir konut projesi için büyük mimari fotoğraflar ve akıcı kaydırma animasyonlarıyla projenin karakterini yansıtan bir web sitesi tasarla.',
    },
    th: {
      title: 'เว็บไซต์โครงการที่พักหรู',
      prompt: 'ออกแบบเว็บไซต์สำหรับโครงการที่อยู่อาศัยระดับหรู แสดงเอกลักษณ์ด้วยภาพสถาปัตยกรรมขนาดใหญ่และแอนิเมชันเลื่อนหน้าที่ลื่นไหล',
    },
    it: {
      title: 'Sito immobiliare di lusso',
      prompt: 'Progetta un sito per un complesso residenziale di lusso, mettendone in risalto il carattere con grandi fotografie di architettura e animazioni di scorrimento fluide.',
    },
  },
  'example-hr-onboarding': {
    'zh-CN': {
      title: '新员工入职指南',
      prompt: '制作一份新员工入职指南，包含第一周日程、团队介绍、学习任务和设备清单。',
    },
    'zh-TW': {
      title: '新員工入職指南',
      prompt: '製作一份新員工入職指南，包含第一週日程、團隊介紹、學習任務和設備清單。',
    },
    en: {
      title: 'New Hire Onboarding Guide',
      prompt: 'Create a new hire onboarding guide with a first-week schedule, team introductions, learning tasks, and an equipment checklist.',
    },
    id: {
      title: 'Panduan Karyawan Baru',
      prompt: 'Buat panduan karyawan baru dengan jadwal minggu pertama, perkenalan tim, tugas pembelajaran, dan daftar perlengkapan.',
    },
    de: {
      title: 'Leitfaden für neue Mitarbeitende',
      prompt: 'Erstelle einen Leitfaden für neue Mitarbeitende mit einem Plan für die erste Woche, Teamvorstellungen, Lernaufgaben und einer Ausstattungsliste.',
    },
    'pt-BR': {
      title: 'Guia de integração de novos funcionários',
      prompt: 'Crie um guia de integração de novos funcionários com agenda da primeira semana, apresentação da equipe, atividades de aprendizagem e lista de equipamentos.',
    },
    'es-ES': {
      title: 'Guía de incorporación',
      prompt: 'Crea una guía para nuevos empleados con el programa de la primera semana, presentaciones del equipo, tareas de aprendizaje y una lista de equipos.',
    },
    ru: {
      title: 'Руководство для новых сотрудников',
      prompt: 'Создай руководство для новых сотрудников с расписанием первой недели, знакомством с командой, учебными заданиями и списком оборудования.',
    },
    fa: {
      title: 'راهنمای کارکنان جدید',
      prompt: 'یک راهنمای کارکنان جدید با برنامه هفته اول، معرفی تیم، فعالیت‌های یادگیری و فهرست تجهیزات تهیه کن.',
    },
    ar: {
      title: 'دليل الموظفين الجدد',
      prompt: 'أنشئ دليلاً للموظفين الجدد يتضمن جدول الأسبوع الأول والتعريف بالفريق ومهام التعلم وقائمة المعدات.',
    },
    ja: {
      title: '新入社員向けガイド',
      prompt: '新入社員向けガイドを作成してください。最初の1週間の予定、チーム紹介、学習課題、備品チェックリストを含めてください。',
    },
    ko: {
      title: '신입 직원 온보딩 가이드',
      prompt: '첫 주 일정, 팀 소개, 학습 과제, 장비 체크리스트가 포함된 신입 직원 온보딩 가이드를 만들어 주세요.',
    },
    pl: {
      title: 'Przewodnik dla nowych pracowników',
      prompt: 'Stwórz przewodnik dla nowych pracowników z harmonogramem pierwszego tygodnia, przedstawieniem zespołu, zadaniami edukacyjnymi i listą sprzętu.',
    },
    hu: {
      title: 'Új munkatársak útmutatója',
      prompt: 'Készíts útmutatót az új munkatársaknak az első hét programjával, a csapat bemutatásával, tanulási feladatokkal és eszközlistával.',
    },
    fr: {
      title: 'Guide d’intégration',
      prompt: 'Crée un guide pour les nouvelles recrues avec le programme de la première semaine, la présentation de l’équipe, des activités d’apprentissage et une liste du matériel.',
    },
    uk: {
      title: 'Посібник для нових співробітників',
      prompt: 'Створи посібник для нових співробітників із розкладом першого тижня, знайомством із командою, навчальними завданнями та списком обладнання.',
    },
    tr: {
      title: 'Yeni Çalışan Rehberi',
      prompt: 'İlk hafta programı, ekip tanıtımları, öğrenme görevleri ve ekipman listesi içeren bir yeni çalışan rehberi oluştur.',
    },
    th: {
      title: 'คู่มือพนักงานใหม่',
      prompt: 'สร้างคู่มือพนักงานใหม่ที่มีตารางสัปดาห์แรก การแนะนำทีม กิจกรรมการเรียนรู้ และรายการอุปกรณ์',
    },
    it: {
      title: 'Guida per nuovi dipendenti',
      prompt: 'Crea una guida per nuovi dipendenti con il programma della prima settimana, presentazioni del team, attività formative e un elenco delle attrezzature.',
    },
  },
  'example-pricing-page': {
    'zh-CN': {
      title: '产品定价页',
      prompt: '设计一个产品定价页，清楚对比各套餐的价格与功能，并解答常见购买问题。',
    },
    'zh-TW': {
      title: '產品定價頁',
      prompt: '設計一個產品定價頁，清楚比較各方案的價格與功能，並解答常見購買問題。',
    },
    en: {
      title: 'Product Pricing Page',
      prompt: 'Design a product pricing page that clearly compares plan prices and features and answers common purchase questions.',
    },
    id: {
      title: 'Halaman Harga Produk',
      prompt: 'Rancang halaman harga produk yang membandingkan harga dan fitur setiap paket dengan jelas serta menjawab pertanyaan pembelian yang umum.',
    },
    de: {
      title: 'Produktpreisseite',
      prompt: 'Gestalte eine Produktpreisseite, die Preise und Funktionen der Tarife klar vergleicht und häufige Fragen zum Kauf beantwortet.',
    },
    'pt-BR': {
      title: 'Página de preços',
      prompt: 'Crie uma página de preços que compare claramente os valores e recursos dos planos e responda às dúvidas comuns sobre a compra.',
    },
    'es-ES': {
      title: 'Página de precios',
      prompt: 'Diseña una página de precios que compare claramente los importes y las funciones de los planes y responda a las dudas habituales de compra.',
    },
    ru: {
      title: 'Страница тарифов',
      prompt: 'Разработай страницу тарифов, которая наглядно сравнивает цены и возможности планов и отвечает на частые вопросы о покупке.',
    },
    fa: {
      title: 'صفحه قیمت‌گذاری محصول',
      prompt: 'یک صفحه قیمت‌گذاری طراحی کن که قیمت و قابلیت‌های طرح‌ها را به‌روشنی مقایسه کند و به پرسش‌های رایج خرید پاسخ دهد.',
    },
    ar: {
      title: 'صفحة أسعار المنتج',
      prompt: 'صمّم صفحة أسعار تقارن بوضوح بين أسعار الخطط وميزاتها وتجيب عن أسئلة الشراء الشائعة.',
    },
    ja: {
      title: '料金プランページ',
      prompt: '各プランの料金と機能をわかりやすく比較し、購入時によくある質問に答える料金ページをデザインしてください。',
    },
    ko: {
      title: '제품 요금제 페이지',
      prompt: '각 요금제의 가격과 기능을 명확히 비교하고 구매 관련 자주 묻는 질문에 답하는 요금제 페이지를 디자인해 주세요.',
    },
    pl: {
      title: 'Strona cennika',
      prompt: 'Zaprojektuj stronę cennika, która jasno porównuje ceny i funkcje planów oraz odpowiada na częste pytania dotyczące zakupu.',
    },
    hu: {
      title: 'Termékárak oldala',
      prompt: 'Tervezz árazási oldalt, amely egyértelműen összehasonlítja a csomagok árait és funkcióit, és megválaszolja a gyakori vásárlási kérdéseket.',
    },
    fr: {
      title: 'Page de tarifs',
      prompt: 'Conçois une page de tarifs qui compare clairement les prix et les fonctionnalités des offres et répond aux questions d’achat courantes.',
    },
    uk: {
      title: 'Сторінка тарифів',
      prompt: 'Розроби сторінку тарифів, що наочно порівнює ціни й можливості планів та відповідає на поширені запитання щодо купівлі.',
    },
    tr: {
      title: 'Ürün Fiyatlandırma Sayfası',
      prompt: 'Paket fiyatlarını ve özelliklerini açıkça karşılaştıran, sık sorulan satın alma sorularını yanıtlayan bir fiyatlandırma sayfası tasarla.',
    },
    th: {
      title: 'หน้าราคาผลิตภัณฑ์',
      prompt: 'ออกแบบหน้าราคาที่เปรียบเทียบราคาและฟีเจอร์แต่ละแพ็กเกจอย่างชัดเจน พร้อมตอบคำถามที่พบบ่อยก่อนซื้อ',
    },
    it: {
      title: 'Pagina dei prezzi',
      prompt: 'Progetta una pagina dei prezzi che confronti chiaramente costi e funzioni dei piani e risponda alle domande d’acquisto più comuni.',
    },
  },
  'example-gamified-app': {
    'zh-CN': {
      title: '游戏化习惯应用',
      prompt: '设计一款把每日习惯变成闯关任务的手机应用，用经验值、等级和连续打卡记录成长。',
    },
    'zh-TW': {
      title: '遊戲化習慣應用',
      prompt: '設計一款把每日習慣變成闖關任務的手機應用，用經驗值、等級和連續打卡記錄成長。',
    },
    en: {
      title: 'Gamified Habit App',
      prompt: 'Design a mobile app that turns daily habits into quests, tracking progress with experience points, levels, and daily streaks.',
    },
    id: {
      title: 'Aplikasi Kebiasaan Bergamifikasi',
      prompt: 'Rancang aplikasi seluler yang mengubah kebiasaan harian menjadi misi, dengan poin pengalaman, level, dan rangkaian hari berturut-turut untuk memantau perkembangan.',
    },
    de: {
      title: 'Gamifizierte Gewohnheiten-App',
      prompt: 'Gestalte eine mobile App, die tägliche Gewohnheiten in Aufgaben verwandelt und Fortschritte mit Erfahrungspunkten, Leveln und Serien aufeinanderfolgender Tage erfasst.',
    },
    'pt-BR': {
      title: 'App de hábitos gamificado',
      prompt: 'Crie um aplicativo que transforme hábitos diários em missões, acompanhando o progresso com pontos de experiência, níveis e sequências de dias consecutivos.',
    },
    'es-ES': {
      title: 'App de hábitos gamificada',
      prompt: 'Diseña una aplicación móvil que convierta los hábitos diarios en misiones y registre el progreso con puntos de experiencia, niveles y rachas de días consecutivos.',
    },
    ru: {
      title: 'Приложение привычек с геймификацией',
      prompt: 'Разработай мобильное приложение, превращающее ежедневные привычки в задания и отслеживающее прогресс с помощью очков опыта, уровней и серий последовательных дней.',
    },
    fa: {
      title: 'اپ عادت‌سازی بازی‌وار',
      prompt: 'یک اپ موبایل طراحی کن که عادت‌های روزانه را به مأموریت تبدیل کند و پیشرفت را با امتیاز تجربه، سطح و زنجیره روزهای متوالی دنبال کند.',
    },
    ar: {
      title: 'تطبيق عادات بأسلوب الألعاب',
      prompt: 'صمّم تطبيقاً للهاتف يحوّل العادات اليومية إلى مهام، ويتابع التقدم عبر نقاط الخبرة والمستويات وسلاسل الأيام المتتالية.',
    },
    ja: {
      title: 'ゲーム感覚の習慣化アプリ',
      prompt: '毎日の習慣をクエストに変えるモバイルアプリをデザインしてください。経験値、レベル、連続達成日数で成長を記録できるようにしてください。',
    },
    ko: {
      title: '게임형 습관 앱',
      prompt: '매일의 습관을 퀘스트로 바꾸는 모바일 앱을 디자인해 주세요. 경험치, 레벨, 연속 달성 일수로 성장을 기록할 수 있게 해 주세요.',
    },
    pl: {
      title: 'Aplikacja nawyków z grywalizacją',
      prompt: 'Zaprojektuj aplikację mobilną, która zamienia codzienne nawyki w misje i śledzi postępy za pomocą punktów doświadczenia, poziomów i serii kolejnych dni.',
    },
    hu: {
      title: 'Játékos szokásépítő alkalmazás',
      prompt: 'Tervezz mobilalkalmazást, amely a napi szokásokat küldetésekké alakítja, és tapasztalati pontokkal, szintekkel és egymást követő napok sorozataival követi a fejlődést.',
    },
    fr: {
      title: 'Application d’habitudes gamifiée',
      prompt: 'Conçois une application mobile qui transforme les habitudes quotidiennes en quêtes et suit les progrès avec des points d’expérience, des niveaux et des séries de jours consécutifs.',
    },
    uk: {
      title: 'Застосунок звичок із гейміфікацією',
      prompt: 'Розроби мобільний застосунок, що перетворює щоденні звички на завдання та відстежує прогрес за допомогою балів досвіду, рівнів і серій послідовних днів.',
    },
    tr: {
      title: 'Oyunlaştırılmış Alışkanlık Uygulaması',
      prompt: 'Günlük alışkanlıkları görevlere dönüştüren; deneyim puanları, seviyeler ve ardışık gün serileriyle ilerlemeyi takip eden bir mobil uygulama tasarla.',
    },
    th: {
      title: 'แอปสร้างนิสัยแบบเกม',
      prompt: 'ออกแบบแอปมือถือที่เปลี่ยนนิสัยประจำวันเป็นภารกิจ โดยติดตามพัฒนาการด้วยค่าประสบการณ์ เลเวล และจำนวนวันที่ทำต่อเนื่อง',
    },
    it: {
      title: 'App di abitudini gamificata',
      prompt: 'Progetta un’app mobile che trasformi le abitudini quotidiane in missioni, monitorando i progressi con punti esperienza, livelli e serie di giorni consecutivi.',
    },
  },
  'example-open-design-landing': {
    'zh-CN': {
      title: '拼贴风品牌官网',
      prompt: '为我的品牌设计一个杂志拼贴风官网，用醒目的标题、图片拼贴和滚动动效介绍产品。',
    },
    'zh-TW': {
      title: '拼貼風品牌官網',
      prompt: '為我的品牌設計一個雜誌拼貼風官網，用醒目的標題、圖片拼貼和捲動動畫介紹產品。',
    },
    en: {
      title: 'Editorial Collage Brand Website',
      prompt: 'Design a magazine-inspired website for my brand, introducing the product with bold headlines, image collages, and scroll animations.',
    },
    id: {
      title: 'Situs Merek Bergaya Kolase',
      prompt: 'Rancang situs bergaya majalah untuk merek saya, memperkenalkan produk melalui judul yang menonjol, kolase gambar, dan animasi gulir.',
    },
    de: {
      title: 'Markenwebsite im Collage-Stil',
      prompt: 'Gestalte eine magazininspirierte Website für meine Marke, die das Produkt mit auffälligen Überschriften, Bildcollagen und Scrollanimationen vorstellt.',
    },
    'pt-BR': {
      title: 'Site de marca em estilo colagem',
      prompt: 'Crie um site inspirado em revistas para minha marca, apresentando o produto com títulos marcantes, colagens de imagens e animações de rolagem.',
    },
    'es-ES': {
      title: 'Web de marca con estilo collage',
      prompt: 'Diseña una web inspirada en revistas para mi marca, presentando el producto con titulares llamativos, collages de imágenes y animaciones de desplazamiento.',
    },
    ru: {
      title: 'Сайт бренда в стиле коллажа',
      prompt: 'Разработай для моего бренда сайт в журнальном стиле, представляющий продукт с помощью выразительных заголовков, фотоколлажей и анимации при прокрутке.',
    },
    fa: {
      title: 'وب‌سایت برند به سبک کلاژ',
      prompt: 'برای برند من وب‌سایتی الهام‌گرفته از مجله طراحی کن که محصول را با تیترهای برجسته، کلاژ تصاویر و انیمیشن‌های اسکرول معرفی کند.',
    },
    ar: {
      title: 'موقع علامة تجارية بأسلوب الكولاج',
      prompt: 'صمّم موقعاً مستوحى من المجلات لعلامتي التجارية يقدّم المنتج بعناوين بارزة وصور مجمّعة وحركات تمرير.',
    },
    ja: {
      title: 'コラージュ風ブランドサイト',
      prompt: '私のブランド向けに、雑誌を思わせるサイトをデザインしてください。印象的な見出し、画像のコラージュ、スクロールアニメーションで製品を紹介してください。',
    },
    ko: {
      title: '콜라주 스타일 브랜드 웹사이트',
      prompt: '제 브랜드를 위한 잡지 스타일 웹사이트를 디자인해 주세요. 눈에 띄는 제목, 이미지 콜라주, 스크롤 애니메이션으로 제품을 소개해 주세요.',
    },
    pl: {
      title: 'Strona marki w stylu kolażu',
      prompt: 'Zaprojektuj dla mojej marki stronę inspirowaną magazynami, przedstawiającą produkt za pomocą wyrazistych nagłówków, kolaży zdjęć i animacji przewijania.',
    },
    hu: {
      title: 'Kollázs stílusú márkaweboldal',
      prompt: 'Tervezz magazinok ihlette weboldalt a márkámnak, amely feltűnő címekkel, képkollázsokkal és görgetési animációkkal mutatja be a terméket.',
    },
    fr: {
      title: 'Site de marque en style collage',
      prompt: 'Conçois un site inspiré des magazines pour ma marque, présentant le produit avec des titres marquants, des collages d’images et des animations de défilement.',
    },
    uk: {
      title: 'Сайт бренду в стилі колажу',
      prompt: 'Розроби для мого бренду сайт у журнальному стилі, який представляє продукт виразними заголовками, фотоколажами та анімацією під час прокручування.',
    },
    tr: {
      title: 'Kolaj Tarzı Marka Web Sitesi',
      prompt: 'Markam için ürünü dikkat çekici başlıklar, görsel kolajlar ve kaydırma animasyonlarıyla tanıtan, dergilerden esinlenmiş bir web sitesi tasarla.',
    },
    th: {
      title: 'เว็บไซต์แบรนด์สไตล์คอลลาจ',
      prompt: 'ออกแบบเว็บไซต์ที่ได้แรงบันดาลใจจากนิตยสารให้แบรนด์ของฉัน แนะนำผลิตภัณฑ์ผ่านหัวข้อที่สะดุดตา ภาพคอลลาจ และแอนิเมชันเลื่อนหน้า',
    },
    it: {
      title: 'Sito del marchio in stile collage',
      prompt: 'Progetta un sito ispirato alle riviste per il mio marchio, presentando il prodotto con titoli d’impatto, collage di immagini e animazioni di scorrimento.',
    },
  },
  'example-motion-explainer': {
    'zh-CN': {
      title: '原理讲解动画',
      prompt: '做一段 20 秒的原理讲解动画：相机是怎么对焦的？开场是一张照片，焦点从花移到人再移到远山，配上问题“为什么只有一样东西是清楚的？”。然后切到侧视光学台：被摄物、镜头、传感器，光线按薄透镜公式真实计算：光线汇聚在传感器上就清楚；被摄物靠近后汇聚点跑到传感器后面，形成模糊光斑；移动镜头重新对焦；光圈从 f/1.8 收到 f/5.6，背景点的模糊光斑随之变小，这就是景深。加一个“传感器看到的画面”小窗、清楚的两行字幕和三条总结。蓝图深蓝底、琥珀色光线、青色镜片。',
    },
    'zh-TW': {
      title: '原理講解動畫',
      prompt: '做一段 20 秒的原理講解動畫：相機是怎麼對焦的？開場是一張照片，焦點從花移到人再移到遠山，配上問題「為什麼只有一樣東西是清楚的？」。然後切到側視光學台：被攝物、鏡頭、感光元件，光線按薄透鏡公式真實計算：光線匯聚在感光元件上就清楚；被攝物靠近後匯聚點跑到感光元件後面，形成模糊光斑；移動鏡頭重新對焦；光圈從 f/1.8 收到 f/5.6，背景點的模糊光斑隨之變小，這就是景深。加一個「感光元件看到的畫面」小窗、清楚的兩行字幕和三條總結。藍圖深藍底、琥珀色光線、青色鏡片。',
    },
    en: {
      title: 'How-It-Works Explainer',
      prompt: 'Make a 20-second explainer: how does a camera focus? Open on a photo that pulls focus from flowers to a person to the mountains, with the question "Why is only one thing sharp?". Then show a side-view optical bench — subject, lens, sensor — with light rays that follow the thin-lens equation: rays meet on the sensor (sharp); move the subject closer and they meet behind it (a blur disc); slide the lens to refocus; close the aperture from f/1.8 to f/5.6 and a background point\'s blur shrinks (depth of field). Add a "What the sensor sees" inset, clear two-line captions and a three-rule recap. Blueprint navy, amber rays, cyan glass.',
    },
    id: {
      title: 'Animasi Penjelas Cara Kerja',
      prompt: 'Buat animasi penjelas 20 detik: bagaimana kamera fokus? Buka dengan foto yang memindahkan fokus dari bunga ke orang lalu ke gunung, dengan pertanyaan "Mengapa hanya satu hal yang tajam?". Lalu tampilkan bangku optik tampak samping — subjek, lensa, sensor — dengan sinar yang mengikuti persamaan lensa tipis: sinar bertemu di sensor (tajam); dekatkan subjek dan sinar bertemu di belakangnya (lingkaran blur); geser lensa untuk fokus ulang; kecilkan bukaan dari f/1.8 ke f/5.6 dan blur titik latar menyusut (kedalaman ruang tajam). Tambahkan sisipan "Yang dilihat sensor", teks dua baris yang jelas, dan ringkasan tiga aturan. Biru tua cetak biru, sinar kuning amber, kaca sian.',
    },
    de: {
      title: 'Erklärfilm: So funktioniert es',
      prompt: 'Erstelle einen 20-sekündigen Erklärfilm: Wie fokussiert eine Kamera? Beginne mit einem Foto, dessen Schärfe von Blumen über eine Person zu den Bergen wandert, und der Frage „Warum ist nur eines scharf?“. Zeige dann eine optische Bank in Seitenansicht – Motiv, Linse, Sensor – mit Lichtstrahlen nach der Linsengleichung: Treffen sich die Strahlen auf dem Sensor, ist es scharf; rückt das Motiv näher, treffen sie sich dahinter (Unschärfescheibe); die Linse wird verschoben, um nachzufokussieren; die Blende schließt von f/1.8 auf f/5.6 und die Unschärfe eines Hintergrundpunkts schrumpft (Schärfentiefe). Mit Einblendung „Was der Sensor sieht“, klaren zweizeiligen Untertiteln und drei Regeln zum Schluss. Blaupausen-Navy, bernsteinfarbene Strahlen, cyanfarbenes Glas.',
    },
    'pt-BR': {
      title: 'Animação explicativa: como funciona',
      prompt: 'Crie uma animação explicativa de 20 segundos: como uma câmera foca? Abra com uma foto que muda o foco das flores para uma pessoa e depois para as montanhas, com a pergunta "Por que só uma coisa fica nítida?". Depois mostre uma bancada óptica vista de lado — objeto, lente, sensor — com raios de luz que seguem a equação da lente fina: os raios se encontram no sensor (nítido); aproxime o objeto e eles se encontram atrás dele (um disco de desfoque); deslize a lente para refocar; feche a abertura de f/1.8 para f/5.6 e o desfoque de um ponto ao fundo diminui (profundidade de campo). Inclua um quadro "O que o sensor vê", legendas claras de duas linhas e um resumo de três regras. Azul-marinho de planta técnica, raios âmbar, vidro ciano.',
    },
    'es-ES': {
      title: 'Animación explicativa: cómo funciona',
      prompt: 'Crea una animación explicativa de 20 segundos: ¿cómo enfoca una cámara? Empieza con una foto que pasa el foco de unas flores a una persona y luego a las montañas, con la pregunta «¿Por qué solo una cosa sale nítida?». Después muestra un banco óptico de perfil —sujeto, lente, sensor— con rayos que siguen la ecuación de la lente delgada: los rayos se juntan en el sensor (nítido); acerca el sujeto y se juntan detrás (un disco de desenfoque); desliza la lente para reenfocar; cierra el diafragma de f/1.8 a f/5.6 y el desenfoque de un punto del fondo se reduce (profundidad de campo). Añade un recuadro «Lo que ve el sensor», subtítulos claros de dos líneas y un resumen de tres reglas. Azul marino de plano, rayos ámbar, cristal cian.',
    },
    ru: {
      title: 'Анимация «Как это работает»',
      prompt: 'Сделай 20-секундный обучающий ролик: как фокусируется камера? Начни с фотографии, где фокус переходит с цветов на человека, а затем на горы, и вопроса «Почему резкое только что-то одно?». Затем покажи оптическую скамью сбоку — объект, линза, сенсор — с лучами по формуле тонкой линзы: лучи сходятся на сенсоре — резко; объект ближе — они сходятся за сенсором (кружок рассеяния); линза сдвигается и снова фокусирует; диафрагма закрывается с f/1.8 до f/5.6, и размытие точки на фоне уменьшается (глубина резкости). Добавь врезку «Что видит сенсор», понятные двухстрочные подписи и итог из трёх правил. Тёмно-синий «чертёжный» фон, янтарные лучи, бирюзовое стекло.',
    },
    fa: {
      title: 'انیمیشن توضیحی «چگونه کار می‌کند»',
      prompt: 'یک انیمیشن توضیحی ۲۰ ثانیه‌ای بساز: دوربین چطور فوکوس می‌کند؟ با عکسی شروع کن که فوکوس آن از گل‌ها به یک آدم و بعد به کوه‌ها می‌رود، همراه با پرسش «چرا فقط یک چیز واضح است؟». سپس یک میز اپتیکی از نمای کناری نشان بده — سوژه، عدسی، حسگر — با پرتوهایی که از معادلهٔ عدسی نازک پیروی می‌کنند: پرتوها روی حسگر به هم می‌رسند (واضح)؛ سوژه نزدیک‌تر شود و پشت حسگر به هم می‌رسند (دایرهٔ تاری)؛ عدسی جابه‌جا می‌شود تا دوباره فوکوس کند؛ دیافراگم از f/1.8 به f/5.6 بسته می‌شود و تاری یک نقطهٔ پس‌زمینه کوچک می‌شود (عمق میدان). یک کادر «آنچه حسگر می‌بیند»، زیرنویس‌های روشن دوخطی و جمع‌بندی سه‌قاعده‌ای اضافه کن. سرمه‌ای نقشه‌فنی، پرتوهای کهربایی، شیشهٔ فیروزه‌ای.',
    },
    ar: {
      title: 'رسوم توضيحية: كيف يعمل',
      prompt: 'اصنع رسومًا توضيحية مدتها 20 ثانية: كيف تركّز الكاميرا؟ ابدأ بصورة ينتقل تركيزها من الزهور إلى شخص ثم إلى الجبال، مع السؤال «لماذا يظهر شيء واحد فقط حادًا؟». ثم اعرض منضدة بصرية من الجانب — الهدف والعدسة والمستشعر — بأشعة تتبع معادلة العدسة الرقيقة: تلتقي الأشعة على المستشعر (حاد)؛ قرّب الهدف فتلتقي خلفه (قرص ضبابي)؛ حرّك العدسة لإعادة التركيز؛ أغلق الفتحة من f/1.8 إلى f/5.6 فيصغر ضباب نقطة في الخلفية (عمق الميدان). أضف نافذة «ما يراه المستشعر» وتعليقات واضحة من سطرين وخلاصة من ثلاث قواعد. كحلي المخططات، وأشعة كهرمانية، وزجاج سماوي.',
    },
    ja: {
      title: 'しくみ解説アニメーション',
      prompt: '20 秒の解説アニメーションを作って：カメラはどうやってピントを合わせる？　冒頭は写真で、ピントが花から人物、そして山へ移り、「なぜひとつだけがくっきり写るの？」と問いかける。続いて横から見た光学台（被写体・レンズ・センサー）を描き、光線は薄レンズの公式どおりに計算する。光線がセンサー上で集まればシャープ、被写体が近づくと集まる点がセンサーの後ろに移ってボケの円になり、レンズを動かしてピントを合わせ直す。絞りを f/1.8 から f/5.6 に絞ると背景の点のボケが小さくなる（被写界深度）。「センサーに写る像」の小窓、2 行の分かりやすい字幕、3 つのまとめを入れて。設計図風のネイビー、琥珀色の光線、シアンのガラス。',
    },
    ko: {
      title: '작동 원리 설명 애니메이션',
      prompt: '20초 설명 애니메이션을 만들어 줘: 카메라는 어떻게 초점을 맞출까? 꽃에서 사람, 그리고 산으로 초점이 옮겨 가는 사진과 "왜 하나만 선명할까?"라는 질문으로 시작해. 이어서 피사체·렌즈·센서를 옆에서 본 광학대를 보여 주고, 빛은 얇은 렌즈 공식대로 계산해: 광선이 센서에서 만나면 선명하고, 피사체가 가까워지면 센서 뒤에서 만나 흐림 원이 생기고, 렌즈를 움직여 다시 초점을 맞추고, 조리개를 f/1.8에서 f/5.6으로 조이면 배경 점의 흐림이 작아져(피사계 심도). "센서에 보이는 모습" 미니 창, 명확한 두 줄 자막, 세 가지 요약을 넣어 줘. 청사진 네이비, 호박색 광선, 청록 유리.',
    },
    pl: {
      title: 'Animacja: jak to działa',
      prompt: 'Stwórz 20-sekundową animację wyjaśniającą: jak aparat ustawia ostrość? Zacznij od zdjęcia, w którym ostrość przechodzi z kwiatów na osobę, a potem na góry, z pytaniem „Dlaczego ostra jest tylko jedna rzecz?”. Następnie pokaż ławę optyczną z boku — obiekt, soczewka, matryca — z promieniami zgodnymi z równaniem soczewki cienkiej: promienie spotykają się na matrycy (ostro); przybliż obiekt, a spotkają się za nią (krążek rozmycia); przesuń soczewkę, by ponownie ustawić ostrość; przymknij przysłonę z f/1.8 do f/5.6, a rozmycie punktu w tle się zmniejszy (głębia ostrości). Dodaj okienko „Co widzi matryca”, czytelne dwuwierszowe napisy i podsumowanie w trzech zasadach. Granat jak z planu technicznego, bursztynowe promienie, cyjanowe szkło.',
    },
    hu: {
      title: 'Magyarázó animáció: hogyan működik',
      prompt: 'Készíts egy 20 másodperces magyarázó animációt: hogyan fókuszál a fényképezőgép? Nyiss egy fotóval, amelyen az élesség a virágokról egy emberre, majd a hegyekre vándorol, és a kérdéssel: „Miért csak egy dolog éles?”. Ezután mutass oldalnézetes optikai padot – téma, lencse, szenzor – a vékonylencse-egyenletet követő fénysugarakkal: ha a sugarak a szenzoron találkoznak, éles; ha a téma közelebb jön, mögötte találkoznak (szórási kör); a lencse elmozdul, hogy újra fókuszáljon; a rekesz f/1.8-ról f/5.6-ra szűkül, és egy háttérpont elmosódása kisebb lesz (mélységélesség). Tegyél bele „Amit a szenzor lát” betétet, világos kétsoros feliratokat és háromszabályos összegzést. Tervrajz-sötétkék, borostyán sugarak, cián üveg.',
    },
    fr: {
      title: 'Animation explicative : comment ça marche',
      prompt: 'Crée une animation explicative de 20 secondes : comment un appareil photo fait-il la mise au point ? Ouvre sur une photo dont la netteté passe des fleurs à une personne puis aux montagnes, avec la question « Pourquoi une seule chose est-elle nette ? ». Montre ensuite un banc optique vu de côté — sujet, objectif, capteur — avec des rayons qui suivent l’équation des lentilles minces : les rayons se rejoignent sur le capteur (net) ; rapproche le sujet et ils se rejoignent derrière (un disque de flou) ; l’objectif glisse pour refaire la mise au point ; ferme le diaphragme de f/1.8 à f/5.6 et le flou d’un point d’arrière-plan rétrécit (profondeur de champ). Ajoute un encart « Ce que voit le capteur », des sous-titres clairs sur deux lignes et un récapitulatif en trois règles. Bleu nuit de plan technique, rayons ambre, verre cyan.',
    },
    uk: {
      title: 'Анімація «Як це працює»',
      prompt: 'Створи 20-секундний пояснювальний ролик: як фокусується камера? Почни з фото, де фокус переходить із квітів на людину, а потім на гори, і запитання «Чому різким є лише щось одне?». Далі покажи оптичну лаву збоку — об’єкт, лінза, сенсор — із променями за формулою тонкої лінзи: промені сходяться на сенсорі — різко; об’єкт ближче — вони сходяться за сенсором (коло розсіювання); лінза зсувається й знову фокусує; діафрагма закривається з f/1.8 до f/5.6, і розмиття точки на тлі меншає (глибина різкості). Додай врізку «Що бачить сенсор», зрозумілі двохрядкові підписи й підсумок із трьох правил. Темно-синій «креслярський» фон, бурштинові промені, бірюзове скло.',
    },
    tr: {
      title: 'Nasıl çalışır açıklama animasyonu',
      prompt: '20 saniyelik bir açıklama animasyonu yap: kamera nasıl netleme yapar? Netliğin çiçeklerden bir kişiye, sonra dağlara kaydığı bir fotoğraf ve "Neden yalnızca bir şey net?" sorusuyla aç. Ardından yandan görünen bir optik tezgâh göster — özne, mercek, sensör — ışınlar ince mercek denklemine uysun: ışınlar sensörde buluşursa net; özne yaklaşınca arkasında buluşur (bulanıklık diski); mercek kayarak yeniden netler; diyafram f/1.8’den f/5.6’ya kısılınca arka plandaki bir noktanın bulanıklığı küçülür (alan derinliği). "Sensörün gördüğü" küçük penceresi, net iki satırlık altyazılar ve üç kurallı bir özet ekle. Teknik çizim laciverti, kehribar ışınlar, camgöbeği cam.',
    },
    th: {
      title: 'แอนิเมชันอธิบายหลักการทำงาน',
      prompt: 'สร้างแอนิเมชันอธิบาย 20 วินาที: กล้องโฟกัสอย่างไร? เปิดด้วยภาพถ่ายที่ย้ายโฟกัสจากดอกไม้ไปที่คน แล้วไปที่ภูเขา พร้อมคำถาม "ทำไมมีแค่สิ่งเดียวที่คมชัด?" จากนั้นแสดงแท่นทัศนศาสตร์มุมด้านข้าง — วัตถุ เลนส์ เซนเซอร์ — โดยแสงเดินตามสมการเลนส์บาง: แสงมาบรรจบบนเซนเซอร์ = คมชัด; เลื่อนวัตถุเข้าใกล้ แสงไปบรรจบหลังเซนเซอร์ = วงเบลอ; เลื่อนเลนส์เพื่อโฟกัสใหม่; หรี่รูรับแสงจาก f/1.8 เป็น f/5.6 แล้ววงเบลอของจุดฉากหลังเล็กลง (ระยะชัด) เพิ่มกรอบ "สิ่งที่เซนเซอร์เห็น" คำบรรยายสองบรรทัดที่ชัดเจน และสรุปสามข้อ โทนน้ำเงินพิมพ์เขียว แสงสีอำพัน กระจกสีฟ้าอมเขียว',
    },
    it: {
      title: 'Animazione esplicativa: come funziona',
      prompt: 'Crea un’animazione esplicativa di 20 secondi: come mette a fuoco una fotocamera? Apri con una foto in cui il fuoco passa dai fiori a una persona e poi alle montagne, con la domanda «Perché solo una cosa è nitida?». Poi mostra un banco ottico visto di lato — soggetto, lente, sensore — con raggi che seguono l’equazione della lente sottile: i raggi si incontrano sul sensore (nitido); avvicina il soggetto e si incontrano dietro (un disco di sfocatura); la lente scorre per rimettere a fuoco; chiudi il diaframma da f/1.8 a f/5.6 e la sfocatura di un punto sullo sfondo si riduce (profondità di campo). Aggiungi un riquadro «Cosa vede il sensore», sottotitoli chiari su due righe e un riepilogo in tre regole. Blu notte da progetto tecnico, raggi ambra, vetro ciano.',
    },
  },
  'example-motion-showreel': {
    'zh-CN': {
      title: '动效设计师作品集快剪',
      prompt: '做一段 15 秒的动效设计作品集快剪，证明你是顶尖的动效设计师，全力以赴。深色舞台配摄影机式 HUD（取景角标、时间码、128 BPM 节拍方块），只用一种橙色强调色。跟着节拍切换五种手法：橙色放射星芒开场、TIMING / WEIGHT / RHYTHM 动态大字、变形的几何网格、由旋转 3D 点云球体变成的圆环，最后落在虚构工作室「Studio Kinetik」的签名卡上，开场的圆点变成句号。',
    },
    'zh-TW': {
      title: '動效設計師作品集快剪',
      prompt: '做一段 15 秒的動效設計作品集快剪，證明你是頂尖的動效設計師，全力以赴。深色舞台配攝影機式 HUD（取景角標、時間碼、128 BPM 節拍方塊），只用一種橘色強調色。跟著節拍切換五種手法：橘色放射星芒開場、TIMING / WEIGHT / RHYTHM 動態大字、變形的幾何網格、由旋轉 3D 點雲球體變成的圓環，最後落在虛構工作室「Studio Kinetik」的簽名卡上，開場的圓點變成句號。',
    },
    en: {
      title: 'Motion Designer Showreel',
      prompt: 'Make a dynamic 15-second motion graphics showreel that proves you are an incredible motion designer — go all out. Dark stage with a camera-style HUD (corner brackets, timecode, 128 BPM beat squares) and one orange accent. Cut on the beat through five techniques: an orange starburst identity, the kinetic words TIMING / WEIGHT / RHYTHM, a morphing shape grid, a rotating 3D point sphere that becomes a torus, and a signature card for the fictional "Studio Kinetik" where the opening dot becomes the full stop.',
    },
    id: {
      title: 'Showreel Desainer Motion',
      prompt: 'Buat showreel motion graphics 15 detik yang dinamis untuk membuktikan kamu desainer motion yang luar biasa — habis-habisan. Panggung gelap dengan HUD bergaya kamera (sudut bingkai, timecode, kotak ketukan 128 BPM) dan satu aksen oranye. Potong mengikuti ketukan melalui lima teknik: identitas ledakan bintang oranye, kata kinetik TIMING / WEIGHT / RHYTHM, grid bentuk yang berubah, bola titik 3D berputar yang menjadi torus, dan kartu tanda tangan studio fiktif "Studio Kinetik" tempat titik pembuka menjadi titik akhir.',
    },
    de: {
      title: 'Motion-Designer-Showreel',
      prompt: 'Erstelle ein dynamisches 15-sekündiges Motion-Graphics-Showreel, das beweist, dass du ein großartiger Motion Designer bist – gib alles. Dunkle Bühne mit kameraartigem HUD (Eckmarken, Timecode, 128-BPM-Taktquadrate) und einem orangefarbenen Akzent. Schneide im Takt durch fünf Techniken: orangefarbener Strahlenkranz als Identität, die kinetischen Wörter TIMING / WEIGHT / RHYTHM, ein sich wandelndes Formenraster, eine rotierende 3D-Punktkugel, die zum Torus wird, und eine Signaturkarte des fiktiven „Studio Kinetik“, auf der der Anfangspunkt zum Schlusspunkt wird.',
    },
    'pt-BR': {
      title: 'Showreel de motion designer',
      prompt: 'Crie um showreel de motion graphics dinâmico de 15 segundos que prove que você é um motion designer incrível — capriche ao máximo. Palco escuro com HUD estilo câmera (cantos de enquadramento, timecode, quadrados de batida a 128 BPM) e um único destaque laranja. Corte no ritmo por cinco técnicas: identidade em explosão laranja, as palavras cinéticas TIMING / WEIGHT / RHYTHM, uma grade de formas que se transformam, uma esfera 3D de pontos girando que vira um toro e um cartão de assinatura do estúdio fictício "Studio Kinetik", onde o ponto inicial vira o ponto final.',
    },
    'es-ES': {
      title: 'Showreel de motion designer',
      prompt: 'Crea un showreel de motion graphics dinámico de 15 segundos que demuestre que eres un motion designer increíble: dalo todo. Escenario oscuro con HUD de cámara (esquinas de encuadre, código de tiempo, cuadrados de compás a 128 BPM) y un único acento naranja. Corta al ritmo a través de cinco técnicas: un estallido naranja como identidad, las palabras cinéticas TIMING / WEIGHT / RHYTHM, una cuadrícula de formas cambiantes, una esfera 3D de puntos que gira y se convierte en un toro, y una tarjeta de firma del estudio ficticio «Studio Kinetik» donde el punto inicial pasa a ser el punto final.',
    },
    ru: {
      title: 'Шоурил моушн-дизайнера',
      prompt: 'Сделай динамичный 15-секундный шоурил моушн-графики, который докажет, что ты потрясающий моушн-дизайнер, — выложись по полной. Тёмная сцена с HUD в стиле камеры (уголки кадра, таймкод, квадраты долей на 128 BPM) и один оранжевый акцент. Монтируй в такт через пять техник: оранжевая вспышка-звезда, кинетические слова TIMING / WEIGHT / RHYTHM, сетка меняющихся фигур, вращающаяся 3D-сфера из точек, превращающаяся в тор, и финальная карточка вымышленной «Studio Kinetik», где начальная точка становится точкой в конце.',
    },
    fa: {
      title: 'شوریل طراح موشن',
      prompt: 'یک شوریل موشن‌گرافیک پویای ۱۵ ثانیه‌ای بساز که ثابت کند طراح موشن فوق‌العاده‌ای هستی — با تمام توان. صحنهٔ تیره با HUD شبیه دوربین (گوشه‌های کادر، تایم‌کد، مربع‌های ضرب ۱۲۸ BPM) و تنها یک رنگ تأکیدی نارنجی. روی ضرب بین پنج تکنیک برش بزن: هویت انفجار ستاره‌ای نارنجی، واژه‌های جنبشی TIMING / WEIGHT / RHYTHM، شبکهٔ شکل‌های دگرگون‌شونده، کرهٔ نقطه‌ای سه‌بعدی چرخان که به چنبره تبدیل می‌شود، و کارت امضای استودیوی خیالی «Studio Kinetik» که نقطهٔ آغاز در آن نقطهٔ پایان جمله می‌شود.',
    },
    ar: {
      title: 'عرض أعمال مصمم الحركة',
      prompt: 'اصنع عرض أعمال موشن جرافيك ديناميكيًا مدته 15 ثانية يثبت أنك مصمم حركة مذهل — ابذل كل ما لديك. مسرح داكن بواجهة HUD تشبه الكاميرا (زوايا الإطار، ورمز الوقت، ومربعات إيقاع 128 BPM) ولون تمييز برتقالي واحد. انتقل على الإيقاع بين خمس تقنيات: هوية انفجار نجمي برتقالي، والكلمات الحركية TIMING / WEIGHT / RHYTHM، وشبكة أشكال متحولة، وكرة نقاط ثلاثية الأبعاد دوّارة تتحول إلى حلقة، وبطاقة توقيع للاستوديو الخيالي «Studio Kinetik» حيث تصبح النقطة الأولى نقطة نهاية الكلمة.',
    },
    ja: {
      title: 'モーションデザイナーのショーリール',
      prompt: '自分がすごいモーションデザイナーだと証明する、ダイナミックな 15 秒のモーショングラフィックス・ショーリールを全力で作って。暗いステージにカメラ風 HUD（フレームの角、タイムコード、128 BPM のビート表示）、アクセントはオレンジ 1 色。ビートに合わせて 5 つの技法を切り替える：オレンジのスターバースト、TIMING / WEIGHT / RHYTHM のキネティックタイポ、変形する図形グリッド、回転する 3D 点群の球がトーラスに変わる場面、そして架空のスタジオ「Studio Kinetik」のサインカード。冒頭の点が最後のピリオドになる。',
    },
    ko: {
      title: '모션 디자이너 쇼릴',
      prompt: '네가 놀라운 모션 디자이너임을 증명하는 역동적인 15초 모션 그래픽 쇼릴을 전력을 다해 만들어 줘. 어두운 무대에 카메라 스타일 HUD(프레임 모서리, 타임코드, 128 BPM 비트 사각형)와 주황색 강조색 하나. 비트에 맞춰 다섯 가지 기법으로 컷: 주황색 스타버스트 아이덴티티, TIMING / WEIGHT / RHYTHM 키네틱 단어, 변형되는 도형 그리드, 회전하다 토러스로 바뀌는 3D 포인트 구, 그리고 첫 점이 마침표가 되는 가상 스튜디오 "Studio Kinetik"의 시그니처 카드.',
    },
    pl: {
      title: 'Showreel motion designera',
      prompt: 'Stwórz dynamiczny, 15-sekundowy showreel motion graphics, który udowodni, że jesteś niesamowitym motion designerem — daj z siebie wszystko. Ciemna scena z HUD w stylu kamery (narożniki kadru, timecode, kwadraty taktów 128 BPM) i jeden pomarańczowy akcent. Tnij w rytm przez pięć technik: pomarańczowy rozbłysk jako identyfikacja, kinetyczne słowa TIMING / WEIGHT / RHYTHM, siatka zmieniających się kształtów, obracająca się kula punktów 3D, która staje się torusem, oraz karta z podpisem fikcyjnego „Studio Kinetik”, w której początkowa kropka staje się kropką na końcu.',
    },
    hu: {
      title: 'Motion designer bemutatófilm',
      prompt: 'Készíts egy dinamikus, 15 másodperces motion graphics bemutatófilmet, amely bizonyítja, hogy elképesztő motion designer vagy – adj bele mindent. Sötét színpad kameraszerű HUD-dal (képkivágás-sarkok, időkód, 128 BPM-es ütemnégyzetek) és egyetlen narancs kiemelőszín. Ütemre vágj öt technikán át: narancs csillagrobbanás mint arculat, a TIMING / WEIGHT / RHYTHM kinetikus szavak, alakváltó formarács, forgó 3D-pontgömb, amely tóruszzá alakul, és a kitalált „Studio Kinetik” szignókártyája, ahol a nyitó pont lesz a záró pont.',
    },
    fr: {
      title: 'Showreel de motion designer',
      prompt: 'Crée un showreel de motion graphics dynamique de 15 secondes qui prouve que tu es un motion designer incroyable — donne tout. Scène sombre avec un HUD façon caméra (coins de cadre, timecode, carrés de mesure à 128 BPM) et un seul accent orange. Coupe sur le temps à travers cinq techniques : un éclat orange en guise d’identité, les mots cinétiques TIMING / WEIGHT / RHYTHM, une grille de formes qui se transforment, une sphère de points 3D en rotation qui devient un tore, et une carte de signature du studio fictif « Studio Kinetik » où le point d’ouverture devient le point final.',
    },
    uk: {
      title: 'Шоурил моушн-дизайнера',
      prompt: 'Створи динамічний 15-секундний шоурил моушн-графіки, який доведе, що ти неймовірний моушн-дизайнер, — викладись на повну. Темна сцена з HUD у стилі камери (кутики кадру, таймкод, квадрати долей на 128 BPM) і один помаранчевий акцент. Монтуй у такт через п’ять технік: помаранчевий спалах-зірка, кінетичні слова TIMING / WEIGHT / RHYTHM, сітка змінних фігур, обертова 3D-сфера з точок, що стає тором, і фінальна картка вигаданої «Studio Kinetik», де початкова крапка стає крапкою в кінці.',
    },
    tr: {
      title: 'Hareket tasarımcısı showreel',
      prompt: 'Harika bir hareket tasarımcısı olduğunu kanıtlayan 15 saniyelik dinamik bir motion graphics showreel yap — tüm gücünle. Kamera tarzı HUD’lu karanlık sahne (kadraj köşeleri, zaman kodu, 128 BPM vuruş kareleri) ve tek bir turuncu vurgu. Ritme göre beş teknik arasında kes: turuncu yıldız patlaması kimliği, TIMING / WEIGHT / RHYTHM kinetik kelimeleri, dönüşen şekil ızgarası, torusa dönüşen dönen 3D nokta küresi ve açılıştaki noktanın son noktaya dönüştüğü hayali "Studio Kinetik" imza kartı.',
    },
    th: {
      title: 'โชว์รีลนักออกแบบโมชัน',
      prompt: 'สร้างโชว์รีลโมชันกราฟิก 15 วินาทีที่มีพลัง พิสูจน์ว่าคุณเป็นนักออกแบบโมชันที่ยอดเยี่ยม — จัดเต็ม เวทีสีเข้มพร้อม HUD สไตล์กล้อง (มุมเฟรม ไทม์โค้ด ช่องจังหวะ 128 BPM) และสีเน้นสีส้มเพียงสีเดียว ตัดตามจังหวะผ่านห้าเทคนิค: ประกายดาวสีส้มเปิดตัว คำเคลื่อนไหว TIMING / WEIGHT / RHYTHM กริดรูปทรงที่แปรเปลี่ยน ทรงกลมจุด 3D หมุนแล้วกลายเป็นทอรัส และการ์ดลายเซ็นของสตูดิโอสมมติ "Studio Kinetik" ที่จุดเปิดเรื่องกลายเป็นจุดปิดท้าย',
    },
    it: {
      title: 'Showreel da motion designer',
      prompt: 'Crea uno showreel di motion graphics dinamico di 15 secondi che dimostri che sei un motion designer incredibile: dai il massimo. Palco scuro con HUD in stile videocamera (angoli di inquadratura, timecode, quadrati di battuta a 128 BPM) e un solo accento arancione. Taglia a tempo attraverso cinque tecniche: un’esplosione arancione come identità, le parole cinetiche TIMING / WEIGHT / RHYTHM, una griglia di forme che si trasformano, una sfera di punti 3D rotante che diventa un toro e una card con la firma dello studio fittizio «Studio Kinetik», dove il punto iniziale diventa il punto finale.',
    },
  },
  'example-motion-product-launch': {
    'zh-CN': {
      title: '产品发布短片',
      prompt: '为虚构应用 Driftnote 做一段 20 秒的产品发布短片，它能把混乱的会议变成明确的决定。暖纸色背景、黑色文字、一种橙色强调色。开场是大号动态文字“Every meeting ends with a mess.”；接着会议碎片散落在“Notes everywhere. Decisions nowhere.”周围；一个写着 Driftnote 的橙色大开关打开后，碎片飞进一张摘要卡片，列出三项决定。再展示三条行动项逐个打勾并分配负责人，按节拍切出“Listens. Sorts. Follows up.”，最后落在开关加品牌名的标志上，配“Meetings, minus the mess.”和“Out today”。',
    },
    'zh-TW': {
      title: '產品發布短片',
      prompt: '為虛構應用 Driftnote 做一段 20 秒的產品發布短片，它能把混亂的會議變成明確的決定。暖紙色背景、黑色文字、一種橘色強調色。開場是大號動態文字「Every meeting ends with a mess.」；接著會議碎片散落在「Notes everywhere. Decisions nowhere.」周圍；一個寫著 Driftnote 的橘色大開關打開後，碎片飛進一張摘要卡片，列出三項決定。再展示三條待辦事項逐一打勾並指派負責人，按節拍切出「Listens. Sorts. Follows up.」，最後落在開關加品牌名的標誌上，配「Meetings, minus the mess.」和「Out today」。',
    },
    en: {
      title: 'Product Launch Film',
      prompt: 'Make a 20-second launch film for Driftnote, a fictional app that turns messy meetings into decisions. Warm paper background, black type, one orange accent. Open with big kinetic type: "Every meeting ends with a mess." Scatter note fragments around "Notes everywhere. Decisions nowhere.", then flip a big orange toggle labeled Driftnote: the fragments fly into one summary card with three decisions. Show three action items checking off with owners, cut "Listens. Sorts. Follows up." on the beat, and end on the toggle-and-wordmark lockup with "Meetings, minus the mess." and "Out today".',
    },
    id: {
      title: 'Video Peluncuran Produk',
      prompt: 'Buat film peluncuran 20 detik untuk Driftnote, aplikasi fiktif yang mengubah rapat berantakan menjadi keputusan. Latar kertas hangat, teks hitam, satu aksen oranye. Buka dengan tipografi kinetik besar: "Every meeting ends with a mess." Sebarkan potongan catatan di sekitar "Notes everywhere. Decisions nowhere.", lalu nyalakan toggle oranye besar berlabel Driftnote: potongan itu terbang ke satu kartu ringkasan berisi tiga keputusan. Tampilkan tiga item tindakan yang dicentang beserta pemiliknya, potong "Listens. Sorts. Follows up." mengikuti ketukan, dan akhiri dengan logo toggle dan nama merek bersama "Meetings, minus the mess." serta "Out today".',
    },
    de: {
      title: 'Produkt-Launchfilm',
      prompt: 'Erstelle einen 20-sekündigen Launchfilm für Driftnote, eine fiktive App, die chaotische Meetings in Entscheidungen verwandelt. Warmer Papierhintergrund, schwarze Schrift, ein orangefarbener Akzent. Beginne mit großer kinetischer Typo: „Every meeting ends with a mess.“ Verstreue Notizfetzen um „Notes everywhere. Decisions nowhere.“ und lege dann einen großen orangefarbenen Schalter mit der Aufschrift Driftnote um: Die Fetzen fliegen in eine Zusammenfassungskarte mit drei Entscheidungen. Zeige drei Aufgaben, die mit Verantwortlichen abgehakt werden, schneide „Listens. Sorts. Follows up.“ im Takt und ende mit Schalter und Wortmarke samt „Meetings, minus the mess.“ und „Out today“.',
    },
    'pt-BR': {
      title: 'Filme de lançamento de produto',
      prompt: 'Crie um filme de lançamento de 20 segundos para o Driftnote, um app fictício que transforma reuniões bagunçadas em decisões. Fundo de papel quente, texto preto, um destaque laranja. Abra com tipografia cinética grande: "Every meeting ends with a mess." Espalhe fragmentos de notas ao redor de "Notes everywhere. Decisions nowhere." e então ligue um grande botão laranja chamado Driftnote: os fragmentos voam para um cartão de resumo com três decisões. Mostre três tarefas sendo marcadas com responsáveis, corte "Listens. Sorts. Follows up." no ritmo e termine na assinatura com o botão e o nome, com "Meetings, minus the mess." e "Out today".',
    },
    'es-ES': {
      title: 'Vídeo de lanzamiento de producto',
      prompt: 'Crea un vídeo de lanzamiento de 20 segundos para Driftnote, una app ficticia que convierte reuniones caóticas en decisiones. Fondo de papel cálido, texto negro y un acento naranja. Empieza con tipografía cinética grande: «Every meeting ends with a mess.». Dispersa fragmentos de notas alrededor de «Notes everywhere. Decisions nowhere.» y luego activa un gran interruptor naranja con el nombre Driftnote: los fragmentos vuelan a una tarjeta de resumen con tres decisiones. Muestra tres tareas que se marcan con sus responsables, corta «Listens. Sorts. Follows up.» al ritmo y cierra con el interruptor y el logotipo, «Meetings, minus the mess.» y «Out today».',
    },
    ru: {
      title: 'Ролик запуска продукта',
      prompt: 'Сделай 20-секундный ролик запуска Driftnote — вымышленного приложения, которое превращает хаотичные встречи в решения. Тёплый бумажный фон, чёрный текст, один оранжевый акцент. Начни с крупной кинетической типографики: «Every meeting ends with a mess.» Разбросай обрывки заметок вокруг «Notes everywhere. Decisions nowhere.», затем включи большой оранжевый переключатель с надписью Driftnote: обрывки слетаются в одну карточку-сводку с тремя решениями. Покажи три задачи, которые отмечаются с ответственными, смонтируй «Listens. Sorts. Follows up.» в такт и закончи логотипом с переключателем и подписями «Meetings, minus the mess.» и «Out today».',
    },
    fa: {
      title: 'ویدیوی معرفی محصول',
      prompt: 'یک ویدیوی معرفی ۲۰ ثانیه‌ای برای Driftnote بساز، اپی خیالی که جلسه‌های شلوغ را به تصمیم تبدیل می‌کند. پس‌زمینهٔ کاغذی گرم، متن مشکی، یک رنگ تأکیدی نارنجی. با تایپوگرافی جنبشی بزرگ شروع کن: «Every meeting ends with a mess.» تکه‌یادداشت‌ها را دور «Notes everywhere. Decisions nowhere.» پراکنده کن، سپس کلید نارنجی بزرگی با نام Driftnote را روشن کن: تکه‌ها در یک کارت خلاصه با سه تصمیم جمع می‌شوند. سه کار را با مسئولشان تیک بزن، «Listens. Sorts. Follows up.» را روی ضرب برش بزن و با لوگوی کلید و نام برند همراه «Meetings, minus the mess.» و «Out today» تمام کن.',
    },
    ar: {
      title: 'فيلم إطلاق منتج',
      prompt: 'اصنع فيلم إطلاق مدته 20 ثانية لتطبيق Driftnote، وهو تطبيق خيالي يحوّل الاجتماعات الفوضوية إلى قرارات. خلفية ورقية دافئة، ونص أسود، ولون تمييز برتقالي واحد. ابدأ بطباعة حركية كبيرة: «Every meeting ends with a mess.» بعثر قصاصات الملاحظات حول «Notes everywhere. Decisions nowhere.»، ثم شغّل مفتاحًا برتقاليًا كبيرًا مكتوبًا عليه Driftnote: فتطير القصاصات إلى بطاقة ملخص واحدة فيها ثلاثة قرارات. اعرض ثلاث مهام تُعلَّم مع أصحابها، وقطّع «Listens. Sorts. Follows up.» على الإيقاع، واختم بالمفتاح مع اسم العلامة و«Meetings, minus the mess.» و«Out today».',
    },
    ja: {
      title: 'プロダクトローンチ動画',
      prompt: '雑然とした会議を決定事項に変える架空のアプリ「Driftnote」の 20 秒ローンチ動画を作って。温かい紙色の背景、黒い文字、アクセントはオレンジ 1 色。冒頭は大きなキネティックタイポで「Every meeting ends with a mess.」。続いて「Notes everywhere. Decisions nowhere.」の周りにメモの断片を散らし、Driftnote と書かれた大きなオレンジのスイッチをオンにすると、断片が 3 つの決定事項をまとめた要約カードに飛び込む。担当者つきのタスク 3 件がチェックされていく様子を見せ、「Listens. Sorts. Follows up.」をビートに合わせて切り替え、最後はスイッチとロゴ、「Meetings, minus the mess.」と「Out today」で締める。',
    },
    ko: {
      title: '제품 출시 영상',
      prompt: '어수선한 회의를 결정으로 바꿔 주는 가상의 앱 Driftnote의 20초 출시 영상을 만들어 줘. 따뜻한 종이색 배경, 검은 글자, 주황색 강조색 하나. 큰 키네틱 타이포 "Every meeting ends with a mess."로 시작해. "Notes everywhere. Decisions nowhere." 주변에 메모 조각을 흩뿌린 뒤, Driftnote라고 적힌 큰 주황색 토글을 켜면 조각들이 세 가지 결정이 담긴 요약 카드로 날아가. 담당자가 붙은 할 일 세 개가 차례로 체크되고, "Listens. Sorts. Follows up."을 비트에 맞춰 컷한 뒤, 토글과 워드마크, "Meetings, minus the mess.", "Out today"로 마무리해.',
    },
    pl: {
      title: 'Film premierowy produktu',
      prompt: 'Stwórz 20-sekundowy film premierowy Driftnote — fikcyjnej aplikacji, która zamienia chaotyczne spotkania w decyzje. Ciepłe papierowe tło, czarny tekst, jeden pomarańczowy akcent. Zacznij od dużej typografii kinetycznej: „Every meeting ends with a mess.” Rozrzuć skrawki notatek wokół „Notes everywhere. Decisions nowhere.”, a potem przełącz duży pomarańczowy przełącznik z napisem Driftnote: skrawki wlatują do jednej karty podsumowania z trzema decyzjami. Pokaż trzy zadania odhaczane wraz z osobami odpowiedzialnymi, wytnij „Listens. Sorts. Follows up.” w rytm i zakończ logo z przełącznikiem oraz hasłami „Meetings, minus the mess.” i „Out today”.',
    },
    hu: {
      title: 'Termékbemutató film',
      prompt: 'Készíts egy 20 másodperces bemutatófilmet a Driftnote nevű kitalált apphoz, amely a kaotikus értekezletekből döntéseket csinál. Meleg papírszínű háttér, fekete szöveg, egy narancs kiemelőszín. Nyiss nagy kinetikus tipográfiával: „Every meeting ends with a mess.” Szórj jegyzetfoszlányokat a „Notes everywhere. Decisions nowhere.” köré, majd kapcsolj be egy nagy narancs, Driftnote feliratú kapcsolót: a foszlányok egyetlen, három döntést tartalmazó összefoglaló kártyába repülnek. Mutass három teendőt, amelyek felelőssel együtt kipipálódnak, vágd ütemre a „Listens. Sorts. Follows up.” szavakat, és zárj a kapcsoló és a logó párosával, „Meetings, minus the mess.” és „Out today” felirattal.',
    },
    fr: {
      title: 'Film de lancement produit',
      prompt: 'Crée un film de lancement de 20 secondes pour Driftnote, une app fictive qui transforme les réunions chaotiques en décisions. Fond papier chaleureux, texte noir, un seul accent orange. Ouvre sur une grande typographie cinétique : « Every meeting ends with a mess. » Éparpille des fragments de notes autour de « Notes everywhere. Decisions nowhere. », puis active un grand interrupteur orange marqué Driftnote : les fragments s’envolent dans une carte de résumé avec trois décisions. Montre trois tâches cochées avec leurs responsables, coupe « Listens. Sorts. Follows up. » sur le temps et termine sur l’interrupteur et le logotype avec « Meetings, minus the mess. » et « Out today ».',
    },
    uk: {
      title: 'Ролик запуску продукту',
      prompt: 'Створи 20-секундний ролик запуску Driftnote — вигаданого застосунку, що перетворює хаотичні зустрічі на рішення. Теплий паперовий фон, чорний текст, один помаранчевий акцент. Почни з великої кінетичної типографіки: «Every meeting ends with a mess.» Розкидай уривки нотаток навколо «Notes everywhere. Decisions nowhere.», потім увімкни великий помаранчевий перемикач із написом Driftnote: уривки злітаються в одну картку-підсумок із трьома рішеннями. Покажи три завдання, які позначаються з відповідальними, змонтуй «Listens. Sorts. Follows up.» у такт і заверши логотипом із перемикачем та написами «Meetings, minus the mess.» і «Out today».',
    },
    tr: {
      title: 'Ürün lansman filmi',
      prompt: 'Dağınık toplantıları kararlara dönüştüren hayali uygulama Driftnote için 20 saniyelik bir lansman filmi yap. Sıcak kâğıt arka plan, siyah yazı, tek bir turuncu vurgu. Büyük kinetik tipografiyle aç: "Every meeting ends with a mess." "Notes everywhere. Decisions nowhere." çevresine not parçaları saç, sonra üzerinde Driftnote yazan büyük turuncu anahtarı aç: parçalar üç karar içeren tek bir özet kartına uçar. Sorumlularıyla birlikte işaretlenen üç görev göster, "Listens. Sorts. Follows up." kelimelerini ritme göre kes ve anahtar ile marka adıyla, "Meetings, minus the mess." ve "Out today" yazılarıyla bitir.',
    },
    th: {
      title: 'วิดีโอเปิดตัวสินค้า',
      prompt: 'สร้างวิดีโอเปิดตัว 20 วินาทีให้ Driftnote แอปสมมติที่เปลี่ยนการประชุมยุ่งเหยิงให้เป็นการตัดสินใจ พื้นหลังสีกระดาษอบอุ่น ตัวอักษรสีดำ และสีเน้นสีส้มเพียงสีเดียว เปิดด้วยตัวอักษรเคลื่อนไหวขนาดใหญ่ "Every meeting ends with a mess." กระจายเศษโน้ตรอบคำว่า "Notes everywhere. Decisions nowhere." แล้วเปิดสวิตช์สีส้มขนาดใหญ่ที่เขียนว่า Driftnote เศษโน้ตจะลอยเข้าไปรวมในการ์ดสรุปที่มีสามการตัดสินใจ แสดงรายการงานสามข้อที่ถูกติ๊กพร้อมผู้รับผิดชอบ ตัด "Listens. Sorts. Follows up." ตามจังหวะ และปิดท้ายด้วยสวิตช์คู่กับชื่อแบรนด์ "Meetings, minus the mess." และ "Out today"',
    },
    it: {
      title: 'Video di lancio prodotto',
      prompt: 'Crea un video di lancio di 20 secondi per Driftnote, un’app fittizia che trasforma riunioni caotiche in decisioni. Sfondo color carta caldo, testo nero, un solo accento arancione. Apri con una grande tipografia cinetica: «Every meeting ends with a mess.» Sparpaglia frammenti di appunti attorno a «Notes everywhere. Decisions nowhere.», poi attiva un grande interruttore arancione con la scritta Driftnote: i frammenti volano in un’unica card di riepilogo con tre decisioni. Mostra tre attività spuntate con i rispettivi responsabili, taglia «Listens. Sorts. Follows up.» a tempo e chiudi con interruttore e logotipo, «Meetings, minus the mess.» e «Out today».',
    },
  },
  'example-motion-3d-scene': {
    'zh-CN': {
      title: '3D 程序化海岛',
      prompt: '用 Three.js 做一段 15 秒的 3D 场景：黄金时刻的一座低多边形小海岛，全部用代码生成，不用任何模型。海浪起伏，岸边浪花随浪呼吸，棕榈树摇摆，小屋带一个小码头，一艘帆船绕岛航行，云慢慢飘，几只鸟飞过。整段只用一个连续镜头：从海面高空出发，下降并绕岛转向太阳，最后稳住。开场标题“A little escape.”，结尾标题“Stay a little longer.”。暖色日落天空、青绿浅海、地平线处柔和的雾。',
    },
    'zh-TW': {
      title: '3D 程序化海島',
      prompt: '用 Three.js 做一段 15 秒的 3D 場景：黃金時刻的一座低多邊形小海島，全部用程式碼生成，不用任何模型。海浪起伏，岸邊浪花隨浪呼吸，棕櫚樹搖擺，小屋帶一個小碼頭，一艘帆船繞島航行，雲慢慢飄，幾隻鳥飛過。整段只用一個連續鏡頭：從海面高空出發，下降並繞島轉向太陽，最後穩住。開場標題「A little escape.」，結尾標題「Stay a little longer.」。暖色日落天空、青綠淺海、地平線處柔和的霧。',
    },
    en: {
      title: 'Procedural 3D Island',
      prompt: 'Make a 15-second 3D scene in Three.js: a small procedural low-poly island at golden hour, built entirely in code with no models. Animated waves with breathing foam on the shore, swaying palm trees, a hut with a little dock, a sailboat circling, drifting clouds and a few birds. One continuous camera move: start high above the sea, glide down and arc around the island toward the sun, then settle. Open with "A little escape." and close with "Stay a little longer." Warm sunset sky, turquoise shallows, soft fog at the horizon.',
    },
    id: {
      title: 'Pulau 3D Prosedural',
      prompt: 'Buat adegan 3D 15 detik dengan Three.js: pulau kecil low-poly prosedural saat golden hour, dibuat sepenuhnya dengan kode tanpa model. Ombak bergerak dengan buih yang bernapas di tepi pantai, pohon palem bergoyang, pondok dengan dermaga kecil, perahu layar mengitari pulau, awan melayang, dan beberapa burung. Satu gerakan kamera kontinu: mulai tinggi di atas laut, meluncur turun dan melengkung mengitari pulau ke arah matahari, lalu berhenti. Buka dengan "A little escape." dan tutup dengan "Stay a little longer." Langit senja hangat, perairan dangkal pirus, kabut lembut di cakrawala.',
    },
    de: {
      title: 'Prozedurale 3D-Insel',
      prompt: 'Erstelle eine 15-sekündige 3D-Szene in Three.js: eine kleine prozedurale Low-Poly-Insel zur goldenen Stunde, komplett aus Code, ohne Modelle. Animierte Wellen mit atmender Gischt am Ufer, wiegende Palmen, eine Hütte mit kleinem Steg, ein kreisendes Segelboot, ziehende Wolken und ein paar Vögel. Eine durchgehende Kamerafahrt: hoch über dem Meer beginnen, hinabgleiten, im Bogen um die Insel zur Sonne schwenken, dann zur Ruhe kommen. Eröffne mit „A little escape.“ und schließe mit „Stay a little longer.“. Warmer Sonnenuntergangshimmel, türkisfarbene Flachwasser, weicher Dunst am Horizont.',
    },
    'pt-BR': {
      title: 'Ilha 3D procedural',
      prompt: 'Crie uma cena 3D de 15 segundos em Three.js: uma pequena ilha low-poly procedural na hora dourada, feita só com código, sem modelos. Ondas animadas com espuma que respira na margem, coqueiros balançando, uma cabana com um pequeno píer, um veleiro circulando, nuvens passando e alguns pássaros. Um único movimento de câmera contínuo: começa bem alto sobre o mar, desce planando e faz um arco ao redor da ilha em direção ao sol, depois se estabiliza. Abra com "A little escape." e feche com "Stay a little longer." Céu quente de pôr do sol, águas rasas turquesa, névoa suave no horizonte.',
    },
    'es-ES': {
      title: 'Isla 3D procedural',
      prompt: 'Crea una escena 3D de 15 segundos en Three.js: una pequeña isla low-poly procedural en la hora dorada, hecha solo con código, sin modelos. Olas animadas con espuma que respira en la orilla, palmeras que se mecen, una cabaña con un pequeño muelle, un velero que da vueltas, nubes que pasan y algunos pájaros. Un único movimiento de cámara continuo: empieza muy alto sobre el mar, desciende planeando y traza un arco alrededor de la isla hacia el sol, y luego se asienta. Abre con «A little escape.» y cierra con «Stay a little longer.». Cielo cálido de atardecer, aguas turquesa poco profundas, bruma suave en el horizonte.',
    },
    ru: {
      title: 'Процедурный 3D-остров',
      prompt: 'Сделай 15-секундную 3D-сцену на Three.js: маленький процедурный низкополигональный остров в золотой час, целиком из кода, без моделей. Анимированные волны с «дышащей» пеной у берега, качающиеся пальмы, хижина с небольшим причалом, кружащий парусник, плывущие облака и несколько птиц. Один непрерывный пролёт камеры: высоко над морем, плавный спуск, дуга вокруг острова к солнцу, затем остановка. Открой надписью «A little escape.» и закрой «Stay a little longer.». Тёплое закатное небо, бирюзовое мелководье, мягкая дымка на горизонте.',
    },
    fa: {
      title: 'جزیرهٔ سه‌بعدی رویه‌ای',
      prompt: 'با Three.js یک صحنهٔ سه‌بعدی ۱۵ ثانیه‌ای بساز: جزیرهٔ کوچک کم‌چندضلعی رویه‌ای در ساعت طلایی، کاملاً با کد و بدون مدل. موج‌های متحرک با کف ساحلی که نفس می‌کشد، نخل‌های در حال تاب‌خوردن، کلبه‌ای با اسکلهٔ کوچک، قایق بادبانی که دور جزیره می‌چرخد، ابرهای روان و چند پرنده. یک حرکت پیوستهٔ دوربین: از بالای دریا شروع کن، پایین بیا، در کمانی دور جزیره به سمت خورشید بچرخ و سپس آرام بگیر. با «A little escape.» شروع کن و با «Stay a little longer.» تمام کن. آسمان گرم غروب، آب‌های کم‌عمق فیروزه‌ای، مه ملایم در افق.',
    },
    ar: {
      title: 'جزيرة ثلاثية الأبعاد إجرائية',
      prompt: 'اصنع مشهدًا ثلاثي الأبعاد مدته 15 ثانية باستخدام Three.js: جزيرة صغيرة إجرائية منخفضة المضلعات في الساعة الذهبية، مبنية بالكامل بالكود دون نماذج. أمواج متحركة مع زبد يتنفس عند الشاطئ، ونخيل يتمايل، وكوخ برصيف صغير، ومركب شراعي يدور حول الجزيرة، وسحب تنجرف، وبضعة طيور. حركة كاميرا واحدة متصلة: تبدأ عاليًا فوق البحر، وتنزلق نزولًا وتدور حول الجزيرة نحو الشمس، ثم تستقر. افتتح بـ«A little escape.» واختم بـ«Stay a little longer.». سماء غروب دافئة، ومياه ضحلة فيروزية، وضباب خفيف عند الأفق.',
    },
    ja: {
      title: 'プロシージャル 3D アイランド',
      prompt: 'Three.js で 15 秒の 3D シーンを作って。夕暮れの小さなローポリの島を、モデルを使わずすべてコードで生成する。波が動き、岸辺の泡が呼吸するように寄せては返し、ヤシが揺れ、小屋と小さな桟橋、島を回る帆船、流れる雲、数羽の鳥。カメラはひと続きの動き：海の上高くから始まり、降下しながら島を回り込んで太陽の方へ向き、最後に落ち着く。冒頭は「A little escape.」、最後は「Stay a little longer.」。暖かな夕焼け空、ターコイズの浅瀬、水平線のやわらかな霞。',
    },
    ko: {
      title: '절차적 3D 섬',
      prompt: 'Three.js로 15초 3D 장면을 만들어 줘: 노을 지는 작은 절차적 로폴리 섬을 모델 없이 전부 코드로 생성해. 움직이는 파도와 해안에서 숨 쉬듯 밀려드는 포말, 흔들리는 야자수, 작은 부두가 딸린 오두막, 섬을 도는 범선, 흘러가는 구름과 새 몇 마리. 카메라는 끊김 없는 한 번의 움직임: 바다 위 높은 곳에서 시작해 내려오며 섬을 돌아 해 쪽으로 향한 뒤 멈춰. 시작 문구는 "A little escape.", 마지막 문구는 "Stay a little longer.". 따뜻한 노을 하늘, 청록색 얕은 바다, 수평선의 부드러운 안개.',
    },
    pl: {
      title: 'Proceduralna wyspa 3D',
      prompt: 'Stwórz 15-sekundową scenę 3D w Three.js: małą proceduralną wyspę low-poly o złotej godzinie, zbudowaną w całości kodem, bez modeli. Animowane fale z „oddychającą” pianą przy brzegu, kołyszące się palmy, chatka z małym pomostem, krążąca żaglówka, sunące chmury i kilka ptaków. Jeden ciągły ruch kamery: start wysoko nad morzem, płynne obniżenie i łuk wokół wyspy w stronę słońca, potem uspokojenie. Otwórz napisem „A little escape.”, a zamknij „Stay a little longer.”. Ciepłe niebo o zachodzie, turkusowe płycizny, miękka mgiełka na horyzoncie.',
    },
    hu: {
      title: 'Procedurális 3D-sziget',
      prompt: 'Készíts egy 15 másodperces 3D-jelenetet Three.js-ben: egy kis procedurális low-poly sziget az aranyórában, teljesen kódból, modellek nélkül. Mozgó hullámok, a parton „lélegző” tajték, ringó pálmák, kunyhó kis stéggel, a sziget körül haladó vitorlás, sodródó felhők és néhány madár. Egyetlen folyamatos kameramozgás: magasan a tenger fölött indul, lesiklik, ívben megkerüli a szigetet a nap felé, majd megnyugszik. Nyiss az „A little escape.”, zárj a „Stay a little longer.” felirattal. Meleg naplementés ég, türkiz sekélyvíz, lágy pára a horizonton.',
    },
    fr: {
      title: 'Île 3D procédurale',
      prompt: 'Crée une scène 3D de 15 secondes en Three.js : une petite île low-poly procédurale à l’heure dorée, entièrement générée par le code, sans modèles. Des vagues animées avec une écume qui respire sur le rivage, des palmiers qui se balancent, une cabane avec un petit ponton, un voilier qui tourne autour, des nuages qui dérivent et quelques oiseaux. Un seul mouvement de caméra continu : partir très haut au-dessus de la mer, descendre en glissant, décrire un arc autour de l’île vers le soleil, puis se poser. Ouvre sur « A little escape. » et termine sur « Stay a little longer. ». Ciel chaud de coucher de soleil, hauts-fonds turquoise, brume douce à l’horizon.',
    },
    uk: {
      title: 'Процедурний 3D-острів',
      prompt: 'Створи 15-секундну 3D-сцену на Three.js: маленький процедурний низькополігональний острів у золоту годину, повністю з коду, без моделей. Анімовані хвилі з «дихаючою» піною біля берега, пальми, що гойдаються, хатина з невеликим причалом, вітрильник, що кружляє, хмари, що пливуть, і кілька птахів. Один безперервний проліт камери: високо над морем, плавний спуск, дуга навколо острова до сонця, потім зупинка. Відкрий написом «A little escape.» і закрий «Stay a little longer.». Тепле західне небо, бірюзове мілководдя, м’який серпанок на обрії.',
    },
    tr: {
      title: 'Prosedürel 3D ada',
      prompt: 'Three.js ile 15 saniyelik bir 3D sahne yap: altın saatte küçük, prosedürel low-poly bir ada; tamamen kodla, model kullanmadan. Kıyıda nefes alan köpüklerle hareketli dalgalar, sallanan palmiyeler, küçük iskeleli bir kulübe, adanın etrafında dönen bir yelkenli, süzülen bulutlar ve birkaç kuş. Tek ve kesintisiz kamera hareketi: denizin çok üstünden başla, süzülerek alçal, adanın etrafında güneşe doğru kavis çiz ve dur. "A little escape." ile aç, "Stay a little longer." ile kapat. Sıcak gün batımı göğü, turkuaz sığ sular, ufukta yumuşak bir pus.',
    },
    th: {
      title: 'เกาะ 3D แบบโพรซีเดอรัล',
      prompt: 'สร้างฉาก 3D 15 วินาทีด้วย Three.js: เกาะโลว์โพลีเล็ก ๆ แบบโพรซีเดอรัลยามแสงทอง สร้างด้วยโค้ดทั้งหมดโดยไม่ใช้โมเดล คลื่นเคลื่อนไหวพร้อมฟองคลื่นริมฝั่งที่ขึ้นลงเหมือนหายใจ ต้นมะพร้าวโยกไหว กระท่อมกับท่าเรือเล็ก เรือใบแล่นวนรอบเกาะ เมฆลอยช้า ๆ และนกไม่กี่ตัว กล้องเคลื่อนต่อเนื่องช็อตเดียว: เริ่มสูงเหนือทะเล ร่อนลงและโค้งรอบเกาะไปทางดวงอาทิตย์ แล้วนิ่ง เปิดด้วย "A little escape." และปิดด้วย "Stay a little longer." ท้องฟ้ายามเย็นโทนอุ่น น้ำตื้นสีเทอร์ควอยซ์ หมอกบาง ๆ ที่ขอบฟ้า',
    },
    it: {
      title: 'Isola 3D procedurale',
      prompt: 'Crea una scena 3D di 15 secondi in Three.js: una piccola isola low-poly procedurale all’ora d’oro, interamente generata dal codice, senza modelli. Onde animate con schiuma che respira sulla riva, palme che ondeggiano, una capanna con un piccolo pontile, una barca a vela che gira attorno, nuvole che scorrono e qualche uccello. Un unico movimento di camera continuo: parte molto in alto sopra il mare, scende planando e gira ad arco attorno all’isola verso il sole, poi si ferma. Apri con «A little escape.» e chiudi con «Stay a little longer.». Cielo caldo al tramonto, bassi fondali turchesi, foschia morbida all’orizzonte.',
    },
  },
  'example-motion-kinetic-type': {
    'zh-CN': {
      title: '动态文字',
      prompt: '做一段 15 秒、120 BPM 的动态文字片，画面里只有文字。先抛出问题 "WHAT DAY IS IT?"，三个词跟着节拍从遮罩里升起。接着星期几像老虎机一样带着动态模糊飞速滚动，最后停在 FRIDAY；黄色铺满画面，字母依次弹跳。然后每拍硬切一个词、占满全屏、每次换一种颜色：ALMOST / THE / WEEK— / END.。翻牌计数器从 08:00:00 倒数到零并闪红，结尾 FRIDAY 先描边、再填色，最后落下一个蓝色句号。瑞士海报配色：暖白纸色、黑、蓝、黄、红；粗体无衬线大字，细等宽字体的画框和走动的时间码。',
    },
    'zh-TW': {
      title: '動態文字',
      prompt: '做一段 15 秒、120 BPM 的動態文字片，畫面裡只有文字。先拋出問題 "WHAT DAY IS IT?"，三個詞跟著節拍從遮罩裡升起。接著星期幾像拉霸機一樣帶著動態模糊飛速滾動，最後停在 FRIDAY；黃色鋪滿畫面，字母依序彈跳。然後每拍硬切一個詞、佔滿全螢幕、每次換一種顏色：ALMOST / THE / WEEK— / END.。翻牌計數器從 08:00:00 倒數到零並閃紅，結尾 FRIDAY 先描邊、再填色，最後落下一個藍色句號。瑞士海報配色：暖白紙色、黑、藍、黃、紅；粗體無襯線大字，細等寬字體的畫框和走動的時間碼。',
    },
    en: {
      title: 'Kinetic Typography',
      prompt: 'Make a 15-second kinetic typography film at 120 BPM where type is the only visual. Ask "WHAT DAY IS IT?": the three words rise out of masks on the beat. A slot-machine reel spins through the weekdays with motion blur and settles on FRIDAY; a yellow flood fills the frame as its letters bounce in turn. Then cut one word per beat, full frame, a new colour each time: ALMOST / THE / WEEK— / END. An odometer counts 08:00:00 down to zero and flashes red, and the film signs off with FRIDAY drawn in outline, filled, and closed by a blue full stop. Swiss poster palette of warm paper, black ink, blue, yellow and red; bold grotesk display type and a thin monospace frame with a running timecode.',
    },
    id: {
      title: 'Tipografi Kinetik',
      prompt: 'Buat film tipografi kinetik 15 detik pada 120 BPM dengan teks sebagai satu-satunya visual. Ajukan "WHAT DAY IS IT?": tiga kata itu muncul dari masker mengikuti ketukan. Gulungan ala mesin slot memutar nama-nama hari dengan motion blur dan berhenti di FRIDAY; warna kuning membanjiri layar sementara hurufnya memantul bergantian. Lalu potong satu kata per ketukan, memenuhi layar, dengan warna baru setiap kali: ALMOST / THE / WEEK— / END. Odometer menghitung mundur 08:00:00 ke nol lalu berkedip merah, dan film ditutup dengan FRIDAY digambar sebagai garis luar, diisi, lalu diakhiri titik biru. Palet poster Swiss: kertas hangat, tinta hitam, biru, kuning, dan merah; huruf grotesk tebal dan bingkai monospace tipis dengan timecode berjalan.',
    },
    de: {
      title: 'Kinetische Typografie',
      prompt: 'Erstelle einen 15-sekündigen Film in kinetischer Typografie bei 120 BPM, in dem Schrift das einzige Bild ist. Stelle die Frage "WHAT DAY IS IT?": Die drei Wörter steigen im Takt aus Masken auf. Eine Slotmaschinen-Walze dreht die Wochentage mit Bewegungsunschärfe durch und bleibt bei FRIDAY stehen; Gelb flutet das Bild, während die Buchstaben nacheinander hüpfen. Dann pro Beat ein Wort, bildfüllend, jedes Mal in neuer Farbe: ALMOST / THE / WEEK— / END. Ein Zählwerk läuft von 08:00:00 auf null und blitzt rot, und der Film endet mit FRIDAY, erst als Kontur gezeichnet, dann gefüllt und mit einem blauen Punkt abgeschlossen. Schweizer Plakatpalette aus warmem Papier, schwarzer Tinte, Blau, Gelb und Rot; fette Grotesk und ein dünner Monospace-Rahmen mit laufendem Timecode.',
    },
    'pt-BR': {
      title: 'Tipografia cinética',
      prompt: 'Crie um filme de tipografia cinética de 15 segundos a 120 BPM em que o texto é o único elemento visual. Pergunte "WHAT DAY IS IT?": as três palavras surgem de máscaras no ritmo. Um rolo de caça-níquel gira pelos dias da semana com motion blur e para em FRIDAY; o amarelo inunda o quadro enquanto as letras pulam uma a uma. Depois corte uma palavra por batida, em tela cheia, com uma cor nova a cada vez: ALMOST / THE / WEEK— / END. Um contador vai de 08:00:00 a zero e pisca em vermelho, e o filme termina com FRIDAY desenhado em contorno, preenchido e fechado por um ponto final azul. Paleta de pôster suíço com papel quente, tinta preta, azul, amarelo e vermelho; grotesca em negrito e uma moldura monoespaçada fina com timecode correndo.',
    },
    'es-ES': {
      title: 'Tipografía cinética',
      prompt: 'Crea una pieza de tipografía cinética de 15 segundos a 120 BPM en la que el texto es lo único que se ve. Pregunta "WHAT DAY IS IT?": las tres palabras surgen de máscaras al ritmo. Un rodillo de tragaperras recorre los días de la semana con desenfoque de movimiento y se detiene en FRIDAY; el amarillo inunda el encuadre mientras sus letras rebotan una tras otra. Después corta una palabra por tiempo, a pantalla completa y con un color nuevo cada vez: ALMOST / THE / WEEK— / END. Un contador baja de 08:00:00 a cero y parpadea en rojo, y la pieza cierra con FRIDAY dibujado en contorno, rellenado y rematado con un punto azul. Paleta de cartel suizo con papel cálido, tinta negra, azul, amarillo y rojo; grotesca en negrita y un marco monoespaciado fino con código de tiempo en marcha.',
    },
    ru: {
      title: 'Кинетическая типографика',
      prompt: 'Сделай 15-секундный ролик кинетической типографики в темпе 120 BPM, где текст — единственный визуальный элемент. Задай вопрос "WHAT DAY IS IT?": три слова поднимаются из масок в такт. Барабан, как в игровом автомате, прокручивает дни недели с размытием в движении и останавливается на FRIDAY; кадр заливает жёлтым, а буквы по очереди подпрыгивают. Затем по одному слову на долю, во весь кадр и каждый раз новым цветом: ALMOST / THE / WEEK— / END. Счётчик отсчитывает от 08:00:00 до нуля и вспыхивает красным, а финал — FRIDAY, сначала контуром, затем заливкой, с синей точкой в конце. Палитра швейцарского плаката: тёплая бумага, чёрный, синий, жёлтый и красный; жирный гротеск и тонкая моноширинная рамка с бегущим таймкодом.',
    },
    fa: {
      title: 'تایپوگرافی متحرک',
      prompt: 'یک فیلم تایپوگرافی متحرک ۱۵ ثانیه‌ای با ضرب ۱۲۰ BPM بساز که تنها تصویرش متن باشد. بپرس "WHAT DAY IS IT?": سه کلمه روی ضرب از دل ماسک‌ها بالا می‌آیند. چرخه‌ای مثل دستگاه اسلات روزهای هفته را با تاری حرکت می‌چرخاند و روی FRIDAY می‌ایستد؛ زرد کل قاب را پر می‌کند و حروف یکی‌یکی بالا و پایین می‌پرند. بعد روی هر ضرب یک کلمه، تمام‌قاب و هر بار با رنگی تازه: ALMOST / THE / WEEK— / END. یک شمارنده از 08:00:00 تا صفر پایین می‌آید و قرمز چشمک می‌زند، و فیلم با FRIDAY تمام می‌شود که اول خط‌دور کشیده، بعد پر و با یک نقطهٔ آبی بسته می‌شود. پالت پوستر سوئیسی: کاغذ گرم، جوهر سیاه، آبی، زرد و قرمز؛ حروف گروتسک ضخیم و قابی نازک با فونت تک‌فاصله و تایم‌کد در حال حرکت.',
    },
    ar: {
      title: 'طباعة حركية',
      prompt: 'اصنع فيلم طباعة حركية مدته 15 ثانية على إيقاع 120 BPM يكون فيه النص هو العنصر المرئي الوحيد. اطرح السؤال "WHAT DAY IS IT?": ترتفع الكلمات الثلاث من الأقنعة على الإيقاع. تدور بكرة كآلة القمار عبر أيام الأسبوع مع ضبابية الحركة وتستقر على FRIDAY؛ يغمر الأصفر الإطار بينما تقفز الحروف واحدًا تلو الآخر. ثم كلمة واحدة لكل نبضة، بملء الإطار وبلون جديد كل مرة: ALMOST / THE / WEEK— / END. يعدّ عدّاد تنازليًا من 08:00:00 إلى الصفر ويومض بالأحمر، ويختتم الفيلم بكلمة FRIDAY مرسومة كخط خارجي ثم مملوءة ومختومة بنقطة زرقاء. لوحة ألوان الملصق السويسري: ورق دافئ وحبر أسود وأزرق وأصفر وأحمر؛ خط غروتسك عريض وإطار رفيع بخط أحادي المسافة مع رمز زمني متحرك.',
    },
    ja: {
      title: 'キネティック・タイポグラフィ',
      prompt: '文字だけで見せる、120 BPM・15 秒のキネティック・タイポグラフィを作って。"WHAT DAY IS IT?" と問いかけ、3 つの単語がビートに合わせてマスクから立ち上がる。スロットのようなリールがモーションブラーをかけて曜日を回し、FRIDAY で止まる。画面が黄色に染まり、文字が順番に弾む。続いて 1 拍ごとに 1 単語、画面いっぱいに、毎回色を変えて切り替える：ALMOST / THE / WEEK— / END.。カウンターが 08:00:00 からゼロまで数えて赤く光り、最後は FRIDAY をアウトラインで描いてから塗り、青いピリオドで締める。温かい紙色・黒・青・黄・赤のスイスポスター配色、太いグロテスク体、細い等幅フォントのフレームと進むタイムコード。',
    },
    ko: {
      title: '키네틱 타이포그래피',
      prompt: '글자만으로 보여 주는 120 BPM, 15초 키네틱 타이포그래피를 만들어 줘. "WHAT DAY IS IT?"라고 묻고, 세 단어가 비트에 맞춰 마스크에서 솟아올라. 슬롯머신 같은 릴이 모션 블러와 함께 요일을 돌리다가 FRIDAY에서 멈추고, 노란색이 화면을 채우며 글자가 하나씩 튀어 올라. 이어서 한 박에 한 단어씩, 화면 가득, 매번 새로운 색으로 컷해: ALMOST / THE / WEEK— / END.. 카운터가 08:00:00에서 0까지 세고 빨갛게 번쩍인 뒤, FRIDAY를 윤곽선으로 그리고 채운 다음 파란 마침표로 마무리해. 따뜻한 종이색, 검정, 파랑, 노랑, 빨강의 스위스 포스터 팔레트, 굵은 그로테스크 서체, 가는 고정폭 글꼴 프레임과 흐르는 타임코드.',
    },
    pl: {
      title: 'Typografia kinetyczna',
      prompt: 'Stwórz 15-sekundowy film w typografii kinetycznej w tempie 120 BPM, w którym jedynym obrazem jest tekst. Zadaj pytanie "WHAT DAY IS IT?": trzy słowa wyłaniają się z masek w rytm. Bęben jak w automacie przewija dni tygodnia z rozmyciem ruchu i zatrzymuje się na FRIDAY; żółć zalewa kadr, a litery po kolei podskakują. Potem jedno słowo na takt, na cały kadr, za każdym razem w nowym kolorze: ALMOST / THE / WEEK— / END. Licznik odlicza od 08:00:00 do zera i błyska na czerwono, a film kończy się słowem FRIDAY narysowanym konturem, wypełnionym i zamkniętym niebieską kropką. Paleta szwajcarskiego plakatu: ciepły papier, czarny tusz, niebieski, żółty i czerwony; pogrubiony grotesk i cienka ramka w kroju monospace z biegnącym kodem czasowym.',
    },
    hu: {
      title: 'Kinetikus tipográfia',
      prompt: 'Készíts egy 15 másodperces, 120 BPM-es kinetikus tipográfiai filmet, amelyben a szöveg az egyetlen kép. Tedd fel a kérdést: "WHAT DAY IS IT?" – a három szó ütemre emelkedik ki a maszkokból. Egy nyerőgép-tárcsa mozgási elmosódással pörgeti végig a hét napjait, és megáll a FRIDAY-nél; sárga árasztja el a képet, a betűk sorban ugranak. Ezután ütemenként egy szó, teljes képen, mindig új színnel: ALMOST / THE / WEEK— / END. Egy számláló 08:00:00-tól nulláig pörög le, és pirosan villan, a film pedig a FRIDAY szóval zárul: előbb körvonal, aztán kitöltés, végül egy kék pont. Svájci plakátpaletta: meleg papír, fekete tinta, kék, sárga és piros; vastag groteszk betű és vékony monospace keret futó időkóddal.',
    },
    fr: {
      title: 'Typographie cinétique',
      prompt: 'Crée un film de typographie cinétique de 15 secondes à 120 BPM où le texte est la seule image. Pose la question "WHAT DAY IS IT?" : les trois mots surgissent de masques sur le temps. Un rouleau de machine à sous fait défiler les jours de la semaine avec un flou de mouvement et s’arrête sur FRIDAY ; le jaune envahit le cadre pendant que ses lettres rebondissent tour à tour. Coupe ensuite un mot par temps, plein cadre, avec une nouvelle couleur à chaque fois : ALMOST / THE / WEEK— / END. Un compteur descend de 08:00:00 à zéro et clignote en rouge, et le film se termine sur FRIDAY tracé en contour, rempli, puis clos par un point bleu. Palette d’affiche suisse : papier chaud, encre noire, bleu, jaune et rouge ; linéale grasse et fin cadre en chasse fixe avec un timecode qui défile.',
    },
    uk: {
      title: 'Кінетична типографіка',
      prompt: 'Створи 15-секундний ролик кінетичної типографіки в темпі 120 BPM, де текст — єдиний візуальний елемент. Постав запитання "WHAT DAY IS IT?": три слова підіймаються з масок у такт. Барабан, як в ігровому автоматі, прокручує дні тижня з розмиттям у русі й зупиняється на FRIDAY; кадр заливає жовтим, а літери по черзі підстрибують. Далі по одному слову на долю, на весь кадр і щоразу новим кольором: ALMOST / THE / WEEK— / END. Лічильник рахує від 08:00:00 до нуля й спалахує червоним, а фінал — FRIDAY, спершу контуром, потім заливкою, із синьою крапкою в кінці. Палітра швейцарського плаката: тепла бумага, чорний, синій, жовтий і червоний; жирний гротеск і тонка моноширинна рамка з біжучим таймкодом.',
    },
    tr: {
      title: 'Kinetik tipografi',
      prompt: 'Görsel olarak yalnızca yazının olduğu, 120 BPM’de 15 saniyelik bir kinetik tipografi filmi yap. "WHAT DAY IS IT?" diye sor: üç kelime ritimle maskelerin içinden yükselsin. Slot makinesi gibi bir makara haftanın günlerini hareket bulanıklığıyla döndürüp FRIDAY’de dursun; sarı kareyi doldururken harfler sırayla zıplasın. Ardından her vuruşta bir kelime, tam ekran ve her seferinde yeni bir renkle: ALMOST / THE / WEEK— / END. Bir sayaç 08:00:00’dan sıfıra insin ve kırmızı yanıp sönsün; film, önce kontur olarak çizilen, sonra doldurulan ve mavi bir noktayla kapanan FRIDAY ile bitsin. Sıcak kâğıt, siyah mürekkep, mavi, sarı ve kırmızıdan oluşan İsviçre afişi paleti; kalın grotesk yazı ve akan zaman koduyla ince bir monospace çerçeve.',
    },
    th: {
      title: 'คิเนติกไทโปกราฟี',
      prompt: 'สร้างหนังคิเนติกไทโปกราฟียาว 15 วินาทีที่ 120 BPM โดยมีแต่ตัวอักษรบนจอ เริ่มด้วยคำถาม "WHAT DAY IS IT?" ให้สามคำโผล่ขึ้นจากมาสก์ตามจังหวะ วงล้อแบบสล็อตแมชชีนหมุนผ่านวันในสัปดาห์พร้อมโมชันเบลอแล้วหยุดที่ FRIDAY สีเหลืองท่วมเต็มเฟรมขณะที่ตัวอักษรเด้งทีละตัว จากนั้นตัดหนึ่งคำต่อหนึ่งจังหวะ เต็มจอ เปลี่ยนสีทุกครั้ง: ALMOST / THE / WEEK— / END. ตัวนับนับถอยหลังจาก 08:00:00 ถึงศูนย์แล้วกะพริบสีแดง และปิดท้ายด้วย FRIDAY ที่วาดเป็นเส้นขอบ เติมสี แล้วปิดด้วยจุดสีน้ำเงิน ใช้พาเลตต์โปสเตอร์สวิส กระดาษโทนอุ่น หมึกดำ น้ำเงิน เหลือง และแดง ตัวอักษรกรอเทสก์หนา และกรอบบางด้วยฟอนต์โมโนสเปซพร้อมไทม์โค้ดที่เดินอยู่',
    },
    it: {
      title: 'Tipografia cinetica',
      prompt: 'Crea un film di tipografia cinetica di 15 secondi a 120 BPM in cui il testo è l’unica immagine. Fai la domanda "WHAT DAY IS IT?": le tre parole emergono da maschere a tempo. Un rullo da slot machine fa scorrere i giorni della settimana con motion blur e si ferma su FRIDAY; il giallo invade l’inquadratura mentre le lettere rimbalzano una dopo l’altra. Poi taglia una parola per battuta, a tutto schermo, con un colore nuovo ogni volta: ALMOST / THE / WEEK— / END. Un contatore scende da 08:00:00 a zero e lampeggia di rosso, e il film si chiude con FRIDAY disegnato in contorno, riempito e chiuso da un punto blu. Palette da manifesto svizzero con carta calda, inchiostro nero, blu, giallo e rosso; grottesco in neretto e una sottile cornice monospazio con timecode che scorre.',
    },
  },
};

export function homePresetCopy(pluginId: string, locale: string): HomePresetCopy | undefined {
  const copy: Partial<Record<string, HomePresetCopy>> | undefined = HOME_PRESET_COPY[pluginId];
  return copy?.[locale];
}
