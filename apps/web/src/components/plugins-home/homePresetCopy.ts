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
  'example-motion-3d-scene': {
    'zh-CN': {
      title: '3D 程序化海岛',
      prompt: '制作一段 15 秒的浏览器 3D 旅行海报短片，开场大标题“A little escape.”。展示黄昏的热带小岛、棕榈树、小木屋、沙滩伞、着色器海浪和缓缓飘动的云。以近距离俯视镜头和大号奶油白字体开场，标题退场后镜头滑落并环绕小岛。水深颜色连续过渡，日落反光克制柔和。结尾停在“Stay a little longer.”。所有动画由时间轴驱动，任意时刻都能精确重放。',
    },
    'zh-TW': {
      title: '3D 程序化海島',
      prompt: '用 Three.js 在瀏覽器裡製作一段 15 秒的 3D 動效：黃昏時分一座程序生成的熱帶小島。用著色器讓海浪起伏，棕櫚樹隨風搖擺，雲朵緩緩飄動。鏡頭從海面高空出發，滑落後繞小島轉一道弧線，最後停在平靜的遠景上，標題「Stay a little longer.」漸顯並停留兩秒。風格化而非寫實：柔和漸層、輕卡通光影、溫暖的日落色調。所有運動都由時間軸驅動，任意時刻都能精確重播。',
    },
    en: {
      title: 'Procedural 3D Island',
      prompt: 'Create a 15-second browser-rendered 3D travel-poster film, “A little escape.” Show a stylized tropical island at golden hour with palms, a tiny cabin, a beach umbrella, shader waves and softly drifting clouds. Open with a close aerial and large cream typography, then clear the title as the camera glides down and orbits the island. Use continuous water-depth shading and restrained sunset reflections. Close on “Stay a little longer.” Keep all animation deterministic and driven by timeline time.',
    },
    id: {
      title: 'Pulau 3D Prosedural',
      prompt: 'Buat karya motion 3D 15 detik yang dirender di browser dengan Three.js: sebuah pulau tropis prosedural kecil saat golden hour. Animasikan ombak laut dengan shader, pohon palem yang bergoyang tertiup angin, dan awan yang bergerak pelan. Kamera mulai tinggi di atas laut, meluncur turun dan melengkung mengitari pulau, lalu berhenti pada bidikan lebar yang tenang saat judul "Stay a little longer." muncul perlahan dan bertahan dua detik. Bergaya, bukan fotorealistis: gradasi lembut, toon shading halus, dan palet senja yang hangat. Gerakkan semuanya dari waktu timeline agar setiap momen dapat diputar ulang dengan tepat.',
    },
    de: {
      title: 'Prozedurale 3D-Insel',
      prompt: 'Erstelle ein 15-sekündiges 3D-Motion-Stück, das mit Three.js im Browser gerendert wird: eine kleine prozedurale Tropeninsel zur goldenen Stunde. Animiere Meereswellen per Shader, Palmen, die sich im Wind wiegen, und langsam ziehende Wolken. Die Kamera startet hoch über dem Meer, gleitet hinab, zieht einen Bogen um die Insel und kommt in einer ruhigen Totale zum Stehen, während der Titel „Stay a little longer.“ einblendet und zwei Sekunden stehen bleibt. Stilisiert statt fotorealistisch: weiche Verläufe, sanftes Toon-Shading, warme Sonnenuntergangsfarben. Steuere jede Bewegung über die Timeline-Zeit, damit jeder Moment exakt wiederholbar ist.',
    },
    'pt-BR': {
      title: 'Ilha 3D procedural',
      prompt: 'Crie uma peça de motion 3D de 15 segundos renderizada no navegador com Three.js: uma pequena ilha tropical procedural na hora dourada. Anime as ondas do mar com um shader, coqueiros balançando com a brisa e nuvens se movendo devagar. A câmera começa bem acima do mar, desce deslizando e faz um arco ao redor da ilha, depois para em um plano geral tranquilo enquanto o título "Stay a little longer." surge e permanece por dois segundos. Estilizado em vez de fotorrealista: gradientes suaves, toon shading leve e uma paleta quente de pôr do sol. Controle cada movimento pelo tempo da timeline para que qualquer momento possa ser reproduzido com exatidão.',
    },
    'es-ES': {
      title: 'Isla 3D procedural',
      prompt: 'Crea una pieza de motion 3D de 15 segundos renderizada en el navegador con Three.js: una pequeña isla tropical procedural en la hora dorada. Anima las olas con un shader, palmeras que se mecen con la brisa y nubes que avanzan despacio. La cámara empieza muy por encima del mar, desciende planeando y traza un arco alrededor de la isla, y termina en un plano general tranquilo mientras aparece el título «Stay a little longer.» durante dos segundos. Estilizado en lugar de fotorrealista: degradados suaves, toon shading sutil y una paleta cálida de atardecer. Controla cada movimiento con el tiempo de la línea temporal para que cualquier momento se reproduzca con exactitud.',
    },
    ru: {
      title: 'Процедурный 3D-остров',
      prompt: 'Сделай 15-секундную 3D-анимацию, которая рендерится в браузере на Three.js: небольшой процедурный тропический остров в золотой час. Анимируй морские волны шейдером, пальмы, качающиеся на ветру, и медленно плывущие облака. Камера стартует высоко над морем, плавно опускается, огибает остров по дуге и останавливается на спокойном общем плане, где появляется заголовок «Stay a little longer.» и держится две секунды. Стилизация вместо фотореализма: мягкие градиенты, лёгкий тун-шейдинг, тёплая закатная палитра. Управляй каждым движением временем таймлайна, чтобы любой момент воспроизводился точно.',
    },
    fa: {
      title: 'جزیرهٔ سه‌بعدی رویه‌ای',
      prompt: 'یک قطعهٔ موشن سه‌بعدی ۱۵ ثانیه‌ای بساز که با Three.js در مرورگر رندر شود: جزیرهٔ گرمسیری کوچک و رویه‌ای در ساعت طلایی. موج‌های دریا را با شیدر، درختان نخل را در حال تکان خوردن در نسیم و ابرها را در حال حرکت آرام متحرک کن. دوربین از ارتفاع زیاد بالای دریا شروع می‌کند، پایین می‌لغزد و قوسی دور جزیره می‌زند، سپس روی نمایی باز و آرام می‌ایستد و عنوان «Stay a little longer.» آرام ظاهر می‌شود و دو ثانیه می‌ماند. سبک‌پردازی‌شده و نه واقع‌گرایانه: گرادیان‌های نرم، سایه‌زنی کارتونی ملایم و رنگ‌های گرم غروب. هر حرکت را با زمان تایم‌لاین هدایت کن تا هر لحظه دقیقاً قابل بازپخش باشد.',
    },
    ar: {
      title: 'جزيرة ثلاثية الأبعاد إجرائية',
      prompt: 'أنشئ عملًا حركيًا ثلاثي الأبعاد مدته 15 ثانية يُعرض في المتصفح باستخدام Three.js: جزيرة استوائية صغيرة مُولَّدة إجرائيًا في الساعة الذهبية. حرّك أمواج البحر بمظلّل، وأشجار النخيل تتمايل مع النسيم، والغيوم تنساب ببطء. تبدأ الكاميرا عاليًا فوق البحر، ثم تنزلق نزولًا وتدور في قوس حول الجزيرة، وتستقر على لقطة واسعة هادئة بينما يظهر العنوان "Stay a little longer." ويبقى لثانيتين. أسلوب فني لا واقعي: تدرجات ناعمة وتظليل كرتوني خفيف وألوان غروب دافئة. اجعل كل حركة مرتبطة بزمن الخط الزمني حتى يمكن إعادة تشغيل أي لحظة بدقة.',
    },
    ja: {
      title: 'プロシージャル 3D アイランド',
      prompt: 'Three.js でブラウザ上にレンダリングする 15 秒の 3D モーション作品を作ってください。題材は、夕暮れのゴールデンアワーに浮かぶプロシージャル生成の小さな熱帯の島です。シェーダーで波を動かし、ヤシの木をそよ風に揺らし、雲をゆっくり流します。カメラは海の上空から始まり、滑るように降りて島の周りを弧を描いて回り、静かな引きのショットで止まります。そこでタイトル「Stay a little longer.」がフェードインし、2 秒間表示されます。写実ではなく様式化：柔らかなグラデーション、控えめなトゥーンシェーディング、暖かな夕焼けの配色。どの瞬間も正確に再生できるよう、すべての動きをタイムラインの時間で制御してください。',
    },
    ko: {
      title: '절차적 3D 섬',
      prompt: 'Three.js로 브라우저에서 렌더링하는 15초 3D 모션을 만들어 줘. 황금빛 시간대에 절차적으로 생성된 작은 열대 섬이야. 셰이더로 바다 물결을 움직이고, 야자수가 바람에 흔들리고, 구름이 천천히 흘러가게 해 줘. 카메라는 바다 위 높은 곳에서 시작해 미끄러지듯 내려와 섬 주위를 호를 그리며 돌고, 잔잔한 와이드 숏에서 멈춰. 그때 "Stay a little longer." 제목이 서서히 나타나 2초간 유지돼. 사실적이기보다 스타일리시하게: 부드러운 그라디언트, 은은한 툰 셰이딩, 따뜻한 노을 색감. 모든 움직임을 타임라인 시간으로 제어해서 어느 순간이든 정확히 다시 재생되게 해 줘.',
    },
    pl: {
      title: 'Proceduralna wyspa 3D',
      prompt: 'Stwórz 15-sekundową animację 3D renderowaną w przeglądarce za pomocą Three.js: małą proceduralną wyspę tropikalną o złotej godzinie. Animuj fale shaderem, palmy kołyszące się na wietrze i powoli płynące chmury. Kamera zaczyna wysoko nad morzem, zjeżdża w dół, okrąża wyspę łukiem i zatrzymuje się na spokojnym planie ogólnym, gdy pojawia się tytuł „Stay a little longer.” i pozostaje przez dwie sekundy. Stylizacja zamiast fotorealizmu: miękkie gradienty, delikatny toon shading i ciepła paleta zachodu słońca. Steruj każdym ruchem czasem osi czasu, aby każdy moment dało się dokładnie odtworzyć.',
    },
    hu: {
      title: 'Procedurális 3D-sziget',
      prompt: 'Készíts egy 15 másodperces, böngészőben Three.js-szel renderelt 3D mozgóképet: egy kis, procedurálisan generált trópusi szigetet az aranyórában. Animáld shaderrel a tenger hullámait, a szellőben ringó pálmafákat és a lassan sodródó felhőket. A kamera magasan a tenger fölül indul, lesiklik, ívben megkerüli a szigetet, majd egy nyugodt totálban megáll, miközben megjelenik a „Stay a little longer.” cím, és két másodpercig látható marad. Stilizált, nem fotórealisztikus: lágy színátmenetek, finom toon shading, meleg naplementés színek. Minden mozgást az idővonal ideje vezéreljen, hogy bármely pillanat pontosan visszajátszható legyen.',
    },
    fr: {
      title: 'Île 3D procédurale',
      prompt: 'Crée une pièce de motion 3D de 15 secondes rendue dans le navigateur avec Three.js : une petite île tropicale procédurale à l’heure dorée. Anime les vagues avec un shader, des palmiers qui se balancent dans la brise et des nuages qui dérivent lentement. La caméra part très haut au-dessus de la mer, descend en glissant, décrit un arc autour de l’île, puis s’arrête sur un plan large apaisé tandis que le titre « Stay a little longer. » apparaît et reste deux secondes. Stylisé plutôt que photoréaliste : dégradés doux, toon shading léger et palette chaude de coucher de soleil. Pilote chaque mouvement par le temps de la timeline pour que chaque instant se rejoue à l’identique.',
    },
    uk: {
      title: 'Процедурний 3D-острів',
      prompt: 'Створи 15-секундну 3D-анімацію, що рендериться в браузері на Three.js: невеликий процедурний тропічний острів у золоту годину. Анімуй морські хвилі шейдером, пальми, що гойдаються на вітрі, і хмари, які повільно пливуть. Камера стартує високо над морем, плавно опускається, огинає острів по дузі й зупиняється на спокійному загальному плані, де з’являється заголовок «Stay a little longer.» і тримається дві секунди. Стилізація замість фотореалізму: м’які градієнти, легкий тун-шейдинг, тепла палітра заходу сонця. Керуй кожним рухом часом таймлайну, щоб будь-яку мить можна було точно відтворити.',
    },
    tr: {
      title: 'Prosedürel 3D ada',
      prompt: 'Three.js ile tarayıcıda işlenen 15 saniyelik bir 3D hareketli çalışma oluştur: altın saatte prosedürel olarak üretilmiş küçük bir tropik ada. Deniz dalgalarını bir shader ile, esintide sallanan palmiyeleri ve yavaşça süzülen bulutları canlandır. Kamera denizin yükseklerinden başlasın, süzülerek alçalsın ve adanın etrafında bir yay çizsin; ardından sakin bir geniş planda dursun, "Stay a little longer." başlığı belirip iki saniye kalsın. Fotogerçekçi değil, stilize: yumuşak geçişler, hafif toon shading ve sıcak gün batımı renkleri. Her hareketi zaman çizelgesinin zamanıyla yönet ki her an birebir yeniden oynatılabilsin.',
    },
    th: {
      title: 'เกาะ 3D แบบโพรซีเดอรัล',
      prompt: 'สร้างงานโมชัน 3D ความยาว 15 วินาทีที่เรนเดอร์ในเบราว์เซอร์ด้วย Three.js: เกาะเขตร้อนเล็ก ๆ ที่สร้างแบบโพรซีเดอรัลในช่วงแสงทองยามเย็น ใช้เชดเดอร์ทำให้คลื่นทะเลเคลื่อนไหว ต้นมะพร้าวโยกตามลม และเมฆลอยไปช้า ๆ กล้องเริ่มจากมุมสูงเหนือทะเล ร่อนลงมาแล้ววนเป็นวงโค้งรอบเกาะ ก่อนหยุดที่ภาพมุมกว้างอันสงบ พร้อมชื่อเรื่อง "Stay a little longer." ค่อย ๆ ปรากฏและค้างไว้สองวินาที เน้นสไตล์มากกว่าความสมจริง: ไล่สีนุ่มนวล แสงเงาแบบการ์ตูนเบา ๆ และโทนสีพระอาทิตย์ตกที่อบอุ่น ควบคุมทุกการเคลื่อนไหวด้วยเวลาของไทม์ไลน์ เพื่อให้เล่นซ้ำได้ตรงทุกช่วงเวลา',
    },
    it: {
      title: 'Isola 3D procedurale',
      prompt: 'Crea un pezzo di motion 3D di 15 secondi renderizzato nel browser con Three.js: una piccola isola tropicale procedurale all’ora d’oro. Anima le onde del mare con uno shader, le palme che ondeggiano nella brezza e le nuvole che scorrono lente. La camera parte molto in alto sopra il mare, scende planando, descrive un arco attorno all’isola e si ferma su un campo lungo tranquillo mentre compare il titolo «Stay a little longer.», che resta per due secondi. Stilizzato anziché fotorealistico: sfumature morbide, toon shading leggero e una palette calda da tramonto. Guida ogni movimento con il tempo della timeline, così ogni istante si riproduce esattamente.',
    },
  },
  'example-motion-explainer': {
    'zh-CN': {
      title: '原理讲解动画',
      prompt: '制作一段 20 秒的降噪原理动画。开头用大标题“How do you hear nothing?”和醒目的矢量耳机插画吸引注意。为三个因果步骤分别设计特写分镜：麦克风采集噪音；系统生成等幅反相声波；两波发生干涉，理想化的叠加结果变为平线。结尾“Silence is engineered.”。深蓝、白、青色，大字号和清楚的宽幅波形图。注明这是理想化相位抵消，现实系统降低噪音而非消除所有声音。波形由时间轴计算，导出任意帧都能精确重现。',
    },
    'zh-TW': {
      title: '原理講解動畫',
      prompt: '製作一段 20 秒的原理講解動畫：降噪耳機是怎麼運作的。展示一段嘈雜的聲波傳向耳朵，微型麥克風採集它，晶片產生一段反相聲波，兩段聲波相遇後抵消成一條平線，變得安靜。讓聲波作為貫穿每個段落的主角，並在各部分出現時標註：噪音、麥克風、反向聲波、安靜。簡潔的技術示意圖風格：深石墨灰背景，青色和白色線條。結尾停在「安靜，是被設計出來的。」',
    },
    en: {
      title: 'How-It-Works Explainer',
      prompt: 'Create a 20-second noise-cancellation explainer. Open with the large question “How do you hear nothing?” and an oversized vector headphone illustration. Use separate close-up compositions for three causal steps: a microphone samples the noise; the system creates an equal-and-opposite wave; the waves interfere and their idealized sum flattens. Close on “Silence is engineered.” Deep blue, white and cyan, large typography and clear wide wave plots. Label this as idealized phase cancellation: real systems reduce noise rather than erase all sound. Draw all procedural waves from timeline time so export seeks reproduce the same frames.',
    },
    id: {
      title: 'Animasi Penjelas Cara Kerja',
      prompt: 'Buat animasi penjelas 20 detik: cara kerja headphone peredam bising. Tunjukkan gelombang suara bising yang bergerak menuju telinga, mikrofon kecil yang menangkapnya, chip yang menghasilkan gelombang terbalik, lalu kedua gelombang bertemu dan merata menjadi hening. Jadikan gelombang sebagai objek berulang di setiap bagian, dan beri label setiap bagian saat muncul: Bising, Mikrofon, Anti-bising, Hening. Gaya diagram teknis yang bersih: latar grafit gelap, garis sian dan putih. Akhiri dengan "Keheningan itu direkayasa."',
    },
    de: {
      title: 'Erklärfilm: So funktioniert es',
      prompt: 'Erstelle eine 20-sekündige Erklär-Animation: So funktionieren Noise-Cancelling-Kopfhörer. Zeige eine laute Schallwelle, die sich auf ein Ohr zubewegt, ein winziges Mikrofon, das sie aufnimmt, den Chip, der die invertierte Welle erzeugt, und wie beide Wellen aufeinandertreffen und zu Stille verflachen. Halte die Welle als durchgehendes Objekt in jedem Abschnitt und beschrifte jedes Teil, sobald es erscheint: Lärm, Mikrofon, Gegenschall, Stille. Klarer technischer Diagrammstil: dunkler Graphithintergrund, cyanfarbene und weiße Linien. Ende mit „Stille ist konstruiert.“',
    },
    'pt-BR': {
      title: 'Animação explicativa: como funciona',
      prompt: 'Crie uma animação explicativa de 20 segundos: como funcionam os fones com cancelamento de ruído. Mostre uma onda sonora ruidosa indo em direção ao ouvido, um microfone minúsculo captando-a, o chip gerando a onda invertida e as duas ondas se encontrando e se anulando em silêncio. Mantenha a onda como o objeto recorrente em cada etapa e rotule cada parte quando ela aparecer: Ruído, Microfone, Antirruído, Silêncio. Estilo limpo de diagrama técnico: fundo grafite escuro, linhas ciano e brancas. Termine com "O silêncio é projetado."',
    },
    'es-ES': {
      title: 'Animación explicativa: cómo funciona',
      prompt: 'Crea una animación explicativa de 20 segundos: cómo funcionan los auriculares con cancelación de ruido. Muestra una onda sonora ruidosa que viaja hacia el oído, un micrófono diminuto que la capta, el chip que genera la onda invertida y las dos ondas que se encuentran y se aplanan en silencio. Mantén la onda como objeto recurrente en cada paso y etiqueta cada parte cuando aparezca: Ruido, Micrófono, Antirruido, Silencio. Estilo limpio de diagrama técnico: fondo grafito oscuro, líneas cian y blancas. Termina con «El silencio se diseña».',
    },
    ru: {
      title: 'Анимация «Как это работает»',
      prompt: 'Сделай 20-секундную анимацию-объяснение: как работают наушники с шумоподавлением. Покажи шумную звуковую волну, которая движется к уху, крошечный микрофон, улавливающий её, чип, создающий инвертированную волну, и как две волны встречаются и сглаживаются в тишину. Пусть волна будет сквозным объектом в каждом шаге; подписывай каждую часть, когда она появляется: Шум, Микрофон, Антишум, Тишина. Чистый стиль технической схемы: тёмный графитовый фон, голубые и белые линии. Заверши фразой «Тишина — это инженерия».',
    },
    fa: {
      title: 'انیمیشن توضیحی «چگونه کار می‌کند»',
      prompt: 'یک انیمیشن توضیحی ۲۰ ثانیه‌ای بساز: هدفون‌های حذف نویز چگونه کار می‌کنند. موج صوتی پرنویزی را نشان بده که به سمت گوش می‌رود، میکروفون کوچکی که آن را دریافت می‌کند، تراشه‌ای که موج معکوس می‌سازد، و دو موج که به هم می‌رسند و به سکوت صاف می‌شوند. موج را عنصر تکرارشوندهٔ همهٔ بخش‌ها قرار بده و هر بخش را هنگام ظاهر شدن برچسب بزن: نویز، میکروفون، ضدنویز، سکوت. سبک نمودار فنی تمیز: پس‌زمینهٔ گرافیتی تیره، خطوط فیروزه‌ای و سفید. با جملهٔ «سکوت مهندسی می‌شود.» تمام کن.',
    },
    ar: {
      title: 'رسوم توضيحية: كيف يعمل',
      prompt: 'أنشئ رسومًا توضيحية مدتها 20 ثانية: كيف تعمل سماعات إلغاء الضوضاء. اعرض موجة صوتية صاخبة تتجه نحو الأذن، وميكروفونًا صغيرًا يلتقطها، وشريحة تولّد الموجة المعكوسة، ثم تلتقي الموجتان وتتسطّحان إلى صمت. اجعل الموجة العنصر المتكرر في كل مرحلة، وضع تسمية لكل جزء عند ظهوره: ضوضاء، ميكروفون، ضوضاء مضادة، صمت. أسلوب مخطط تقني نظيف: خلفية رمادية غرافيتية داكنة وخطوط سماوية وبيضاء. اختم بعبارة "الصمت يُصمَّم هندسيًا."',
    },
    ja: {
      title: 'しくみ解説アニメーション',
      prompt: 'ノイズキャンセリングヘッドホンのしくみを解説する 20 秒のアニメーションを作ってください。騒がしい音波が耳へ向かい、小さなマイクがそれを拾い、チップが逆位相の波を作り、2 つの波が出会って打ち消し合い、静かな平らな線になる様子を見せます。音波を全段を通じて登場するモチーフにし、各パーツが現れたら「ノイズ」「マイク」「逆位相の音」「静寂」とラベルを付けてください。すっきりした技術図解スタイル：濃いグラファイトの背景にシアンと白の線。最後は「静けさは、設計できる。」で締めます。',
    },
    ko: {
      title: '작동 원리 설명 애니메이션',
      prompt: '노이즈 캔슬링 헤드폰의 작동 원리를 설명하는 20초 애니메이션을 만들어 줘. 시끄러운 음파가 귀로 향하고, 작은 마이크가 그 소리를 받고, 칩이 반대 위상의 파형을 만들고, 두 파형이 만나 평평한 선으로 상쇄되며 조용해지는 과정을 보여 줘. 음파를 모든 단계를 잇는 반복 요소로 쓰고, 각 부분이 나타날 때 라벨을 붙여 줘: 소음, 마이크, 반대 파형, 고요. 깔끔한 기술 도식 스타일로, 짙은 그래파이트 배경에 시안과 흰색 선. 마지막은 "고요는 설계된다."로 마무리해 줘.',
    },
    pl: {
      title: 'Animacja: jak to działa',
      prompt: 'Stwórz 20-sekundową animację objaśniającą: jak działają słuchawki z redukcją szumów. Pokaż hałaśliwą falę dźwiękową płynącą w stronę ucha, maleńki mikrofon, który ją wychwytuje, układ generujący odwróconą falę oraz spotkanie obu fal, które wygaszają się do ciszy. Niech fala będzie powracającym motywem w każdym etapie, a każda część dostaje etykietę, gdy się pojawia: Hałas, Mikrofon, Antyhałas, Cisza. Czysty styl schematu technicznego: ciemnografitowe tło, cyjanowe i białe linie. Zakończ hasłem „Cisza jest zaprojektowana.”',
    },
    hu: {
      title: 'Magyarázó animáció: hogyan működik',
      prompt: 'Készíts egy 20 másodperces magyarázó animációt arról, hogyan működik a zajszűrős fejhallgató. Mutasd meg, ahogy egy zajos hanghullám a fül felé halad, egy apró mikrofon felveszi, a chip előállítja az ellentétes fázisú hullámot, majd a két hullám találkozik, és csenddé simul. A hullám legyen minden szakaszon végigvonuló elem, és minden részt lássunk el felirattal, amikor megjelenik: Zaj, Mikrofon, Ellenzaj, Csend. Letisztult műszaki ábra stílus: sötét grafit háttér, cián és fehér vonalak. Zárd ezzel: „A csend tervezés kérdése.”',
    },
    fr: {
      title: 'Animation explicative : comment ça marche',
      prompt: 'Crée une animation explicative de 20 secondes : comment fonctionne un casque à réduction de bruit. Montre une onde sonore bruyante qui se dirige vers l’oreille, un minuscule micro qui la capte, la puce qui génère l’onde inversée, puis les deux ondes qui se rencontrent et s’aplatissent en silence. Garde l’onde comme objet récurrent à chaque étape et étiquette chaque élément quand il apparaît : Bruit, Micro, Anti-bruit, Silence. Style épuré de schéma technique : fond graphite foncé, lignes cyan et blanches. Termine sur « Le silence se conçoit. »',
    },
    uk: {
      title: 'Анімація «Як це працює»',
      prompt: 'Створи 20-секундну анімацію-пояснення: як працюють навушники з шумозаглушенням. Покажи гучну звукову хвилю, що рухається до вуха, крихітний мікрофон, який її вловлює, чип, що створює інвертовану хвилю, і як дві хвилі зустрічаються та згладжуються в тишу. Нехай хвиля буде наскрізним об’єктом на кожному кроці; підписуй кожну частину, коли вона з’являється: Шум, Мікрофон, Антишум, Тиша. Чистий стиль технічної схеми: темний графітовий фон, блакитні й білі лінії. Заверши фразою «Тиша — це інженерія».',
    },
    tr: {
      title: 'Nasıl çalışır açıklama animasyonu',
      prompt: '20 saniyelik bir açıklama animasyonu oluştur: gürültü önleyici kulaklıklar nasıl çalışır. Kulağa doğru ilerleyen gürültülü bir ses dalgasını, onu algılayan minik bir mikrofonu, ters dalgayı üreten çipi ve iki dalganın buluşup sessizliğe düzleşmesini göster. Dalgayı her aşamada tekrar eden ana nesne yap ve her parçayı göründüğünde etiketle: Gürültü, Mikrofon, Karşı gürültü, Sessizlik. Sade teknik diyagram stili: koyu grafit arka plan, camgöbeği ve beyaz çizgiler. "Sessizlik tasarlanır." cümlesiyle bitir.',
    },
    th: {
      title: 'แอนิเมชันอธิบายหลักการทำงาน',
      prompt: 'สร้างแอนิเมชันอธิบาย 20 วินาที: หูฟังตัดเสียงรบกวนทำงานอย่างไร แสดงคลื่นเสียงที่มีเสียงรบกวนเคลื่อนเข้าหาหู ไมโครโฟนจิ๋วรับเสียงนั้น ชิปสร้างคลื่นที่กลับเฟส แล้วคลื่นทั้งสองมาเจอกันและหักล้างจนกลายเป็นเส้นเรียบที่เงียบสงบ ให้คลื่นเสียงเป็นองค์ประกอบหลักที่อยู่ในทุกช่วง และติดป้ายกำกับแต่ละส่วนเมื่อปรากฏ: เสียงรบกวน ไมโครโฟน คลื่นต้านเสียง ความเงียบ สไตล์แผนภาพเทคนิคที่สะอาดตา พื้นหลังสีกราไฟต์เข้ม เส้นสีฟ้าอมเขียวและสีขาว ปิดท้ายด้วย "ความเงียบ ถูกออกแบบได้"',
    },
    it: {
      title: 'Animazione esplicativa: come funziona',
      prompt: 'Crea un’animazione esplicativa di 20 secondi: come funzionano le cuffie con cancellazione del rumore. Mostra un’onda sonora rumorosa che viaggia verso l’orecchio, un minuscolo microfono che la cattura, il chip che genera l’onda invertita e le due onde che si incontrano e si appiattiscono nel silenzio. Mantieni l’onda come elemento ricorrente in ogni passaggio ed etichetta ogni parte quando appare: Rumore, Microfono, Anti-rumore, Silenzio. Stile pulito da schema tecnico: sfondo grafite scuro, linee ciano e bianche. Chiudi con «Il silenzio si progetta.»',
    },
  },
  'example-motion-product-launch': {
    'zh-CN': {
      title: '产品发布短片',
      prompt: '为虚构会议 App「Driftnote」制作一段 20 秒产品发布短片。开头立即用超大字号亮出“Meetings in. Decisions out.”。接着展示三个清晰可读的会议对话片段，将其整理成一张醒目的决策总结，再用横贯画面的卡片呈现下一步行动，最后品牌落版。炭青色、暖白色、荧光青柠色，Space Grotesk 字体，用箭头贯穿全片。每个分镜都推进故事，缩成模板卡片时仍能看清主要信息。不要编造业务指标、客户证据或价格。',
    },
    'zh-TW': {
      title: '產品發布短片',
      prompt: '為虛構的 App「Driftnote」製作一段 20 秒的產品發布短片。它能把雜亂的會議錄音整理成一頁總結。展示核心變化：散落的對話氣泡和逐字稿片段逐行收攏，變成一張整潔的總結卡片，上面有三條待辦事項。品牌口號：「會議進來，決定出去。」介面只為這支短片簡單設計，不要編造數據、客戶或價格。炭青色背景、暖白色文字、螢光青檸色強調色。結尾停在 Driftnote 字標和口號上，保持兩秒。',
    },
    en: {
      title: 'Product Launch Film',
      prompt: 'Create a 20-second product launch film for fictional meeting app Driftnote. Open immediately with the oversized benefit “Meetings in. Decisions out.” Then show three readable meeting fragments, turn them into a large summary with concrete decisions, reveal full-width next-action cards, and close on the brand. Charcoal-teal, warm white, electric lime, Space Grotesk and a recurring arrow. Every scene advances the story. Make the main message readable at gallery-card size. Do not invent business metrics, customer evidence or pricing.',
    },
    id: {
      title: 'Video Peluncuran Produk',
      prompt: 'Buat video peluncuran 20 detik untuk Driftnote, aplikasi fiktif yang mengubah rekaman rapat yang berantakan menjadi ringkasan satu halaman. Tunjukkan perubahan intinya: gelembung percakapan dan potongan transkrip yang tersebar menyatu baris demi baris menjadi kartu ringkasan rapi dengan tiga tugas tindak lanjut. Slogan merek: "Rapat masuk. Keputusan keluar." Buat UI sederhana khusus untuk video ini — tanpa metrik, pelanggan, atau harga. Latar arang kehijauan, teks putih hangat, satu aksen hijau limau. Tutup dengan wordmark Driftnote dan slogannya, tahan selama dua detik.',
    },
    de: {
      title: 'Produkt-Launchfilm',
      prompt: 'Erstelle einen 20-sekündigen Launchfilm für Driftnote, eine fiktive App, die chaotische Meeting-Aufnahmen in eine einseitige Zusammenfassung verwandelt. Zeige die zentrale Verwandlung: Verstreute Sprechblasen und Transkriptfragmente verdichten sich Zeile für Zeile zu einer aufgeräumten Zusammenfassungskarte mit drei Aufgaben. Markenclaim: „Meetings rein. Entscheidungen raus.“ Gestalte nur eine einfache UI für diesen Film – keine Kennzahlen, Kunden oder Preise. Dunkles Petrol als Hintergrund, warmweiße Schrift, ein Limettengrünakzent. Ende mit der Driftnote-Wortmarke und dem Claim, zwei Sekunden lang gehalten.',
    },
    'pt-BR': {
      title: 'Filme de lançamento de produto',
      prompt: 'Crie um filme de lançamento de 20 segundos para o Driftnote, um app fictício que transforma o áudio bagunçado de reuniões em um resumo de uma página. Mostre a transformação central: balões de fala e trechos de transcrição espalhados se condensam, linha por linha, em um cartão de resumo organizado com três tarefas. Slogan: "Reuniões entram. Decisões saem." Crie apenas uma UI simples para este filme — sem métricas, clientes ou preços. Fundo verde-carvão, texto branco quente, um destaque verde-lima. Termine na marca Driftnote e no slogan, mantidos por dois segundos.',
    },
    'es-ES': {
      title: 'Vídeo de lanzamiento de producto',
      prompt: 'Crea un vídeo de lanzamiento de 20 segundos para Driftnote, una app ficticia que convierte el audio caótico de las reuniones en un resumen de una página. Muestra la transformación clave: bocadillos de diálogo y fragmentos de transcripción dispersos se condensan, línea a línea, en una tarjeta de resumen ordenada con tres tareas. Lema: «Entran reuniones. Salen decisiones.» Diseña solo una UI sencilla para este vídeo, sin métricas, clientes ni precios. Fondo verde carbón, texto blanco cálido y un acento lima. Cierra con el logotipo de Driftnote y el lema, durante dos segundos.',
    },
    ru: {
      title: 'Ролик запуска продукта',
      prompt: 'Сделай 20-секундный ролик запуска для Driftnote — вымышленного приложения, которое превращает сумбурную запись встречи в итог на одну страницу. Покажи главное преображение: разрозненные реплики и фрагменты расшифровки строка за строкой собираются в аккуратную карточку-итог с тремя задачами. Слоган: «На входе встречи. На выходе решения». Интерфейс придумай простой и только для этого ролика — без метрик, клиентов и цен. Тёмный зеленовато-графитовый фон, тёплый белый текст, один лаймовый акцент. Заверши логотипом Driftnote и слоганом, удерживая их две секунды.',
    },
    fa: {
      title: 'ویدیوی معرفی محصول',
      prompt: 'یک ویدیوی معرفی ۲۰ ثانیه‌ای برای Driftnote بساز؛ اپی خیالی که صدای شلوغ جلسه‌ها را به خلاصه‌ای یک‌صفحه‌ای تبدیل می‌کند. تحول اصلی را نشان بده: حباب‌های گفت‌وگو و تکه‌های متن پیاده‌شده که پراکنده‌اند، خط‌به‌خط جمع می‌شوند و به کارت خلاصهٔ مرتبی با سه کار پیگیری تبدیل می‌شوند. شعار برند: «جلسه وارد می‌شود، تصمیم بیرون می‌آید.» رابط کاربری را فقط برای همین ویدیو و ساده طراحی کن — بدون آمار، مشتری یا قیمت. پس‌زمینهٔ زغالی سبز، متن سفید گرم، یک رنگ تأکیدی سبز لیمویی. با لوگوی Driftnote و شعار تمام کن و دو ثانیه نگهش دار.',
    },
    ar: {
      title: 'فيلم إطلاق منتج',
      prompt: 'أنشئ فيلم إطلاق مدته 20 ثانية لتطبيق Driftnote، وهو تطبيق خيالي يحوّل تسجيلات الاجتماعات الفوضوية إلى ملخص من صفحة واحدة. اعرض التحوّل الأساسي: فقاعات حوار ومقتطفات نصية متناثرة تتجمّع سطرًا بعد سطر في بطاقة ملخص مرتبة تتضمن ثلاث مهام. شعار العلامة: "اجتماعات تدخل، وقرارات تخرج." صمّم واجهة بسيطة لهذا الفيلم فقط، من دون أرقام أو عملاء أو أسعار. خلفية كحلية داكنة، ونص أبيض دافئ، ولون إبراز ليموني واحد. اختم بشعار Driftnote المكتوب وعبارته لمدة ثانيتين.',
    },
    ja: {
      title: 'プロダクトローンチ動画',
      prompt: '散らかった会議の録音を 1 ページの要約に変える架空のアプリ「Driftnote」の 20 秒ローンチ動画を作ってください。中心となる変化を見せます。散らばった吹き出しと文字起こしの断片が 1 行ずつまとまり、3 つのアクションアイテムを持つ整った要約カードになります。ブランドライン：「会議が入り、決定が出る。」UI はこの動画用にシンプルに作り、数値・顧客・価格は作らないでください。深いネイビーの背景、温かみのある白の文字、ライムのアクセントを 1 色。最後は Driftnote のワードマークとブランドラインで締め、2 秒間キープします。',
    },
    ko: {
      title: '제품 출시 영상',
      prompt: '지저분한 회의 녹음을 한 페이지 요약으로 바꿔 주는 가상의 앱 "Driftnote"의 20초 출시 영상을 만들어 줘. 핵심 변화를 보여 줘: 흩어진 말풍선과 녹취 조각이 한 줄씩 모여 할 일 세 개가 담긴 깔끔한 요약 카드가 돼. 브랜드 문구: "회의는 들어오고, 결정은 나간다." UI는 이 영상을 위해 간단하게만 만들고, 수치·고객·가격은 지어내지 마. 짙은 네이비 배경, 따뜻한 흰색 글자, 라임 강조색 하나. 마지막은 Driftnote 워드마크와 브랜드 문구로 마무리하고 2초간 유지해 줘.',
    },
    pl: {
      title: 'Film premierowy produktu',
      prompt: 'Stwórz 20-sekundowy film premierowy dla Driftnote — fikcyjnej aplikacji, która zamienia chaotyczne nagrania spotkań w jednostronicowe podsumowanie. Pokaż kluczową przemianę: rozrzucone dymki i fragmenty transkrypcji linia po linii łączą się w schludną kartę podsumowania z trzema zadaniami. Hasło marki: „Spotkania na wejściu. Decyzje na wyjściu.” Zaprojektuj prosty interfejs tylko na potrzeby filmu — bez wskaźników, klientów i cen. Głębokie granatowe tło, ciepły biały tekst, jeden limonkowy akcent. Zakończ logotypem Driftnote i hasłem, utrzymanymi przez dwie sekundy.',
    },
    hu: {
      title: 'Termékbemutató film',
      prompt: 'Készíts egy 20 másodperces bemutatófilmet a Driftnote nevű kitalált alkalmazáshoz, amely a kusza értekezletfelvételekből egyoldalas összefoglalót készít. Mutasd meg a lényegi változást: a szétszórt beszédbuborékok és átiratfoszlányok soronként egy rendezett összefoglaló kártyává állnak össze, három teendővel. Márkaszlogen: „Bemegy a megbeszélés, kijön a döntés.” Csak egyszerű felületet tervezz ehhez a filmhez – ne találj ki mutatókat, ügyfeleket vagy árakat. Mély tengerészkék háttér, meleg fehér szöveg, egy limezöldszínű kiemelés. Zárd a Driftnote logóval és a szlogennel, két másodpercig kitartva.',
    },
    fr: {
      title: 'Film de lancement produit',
      prompt: 'Crée un film de lancement de 20 secondes pour Driftnote, une app fictive qui transforme l’audio désordonné des réunions en un résumé d’une page. Montre la transformation clé : des bulles de dialogue et des fragments de transcription épars se condensent, ligne après ligne, en une carte de résumé nette avec trois actions à mener. Signature : « Les réunions entrent. Les décisions sortent. » Conçois une interface simple pour ce film uniquement — pas de chiffres, de clients ni de prix. Fond bleu marine profond, texte blanc chaud, un accent vert citron. Termine sur le logotype Driftnote et la signature, tenus deux secondes.',
    },
    uk: {
      title: 'Ролик запуску продукту',
      prompt: 'Створи 20-секундний ролик запуску для Driftnote — вигаданого застосунку, що перетворює хаотичний запис зустрічі на підсумок на одну сторінку. Покажи головну зміну: розкидані репліки та фрагменти розшифровки рядок за рядком збираються в охайну картку-підсумок із трьома завданнями. Слоган: «На вході зустрічі. На виході рішення». Інтерфейс придумай простий і лише для цього ролика — без метрик, клієнтів і цін. Темний зеленувато-графітовий фон, теплий білий текст, один лаймовий акцент. Заверши логотипом Driftnote і слоганом, утримуючи їх дві секунди.',
    },
    tr: {
      title: 'Ürün lansman filmi',
      prompt: 'Dağınık toplantı kayıtlarını tek sayfalık bir özete dönüştüren hayali uygulama Driftnote için 20 saniyelik bir lansman filmi oluştur. Temel dönüşümü göster: dağınık konuşma balonları ve transkript parçaları satır satır birleşerek üç görev içeren düzenli bir özet kartına dönüşsün. Marka sloganı: "Toplantılar girer. Kararlar çıkar." Arayüzü yalnızca bu film için basit tasarla — metrik, müşteri ya da fiyat uydurma. Koyu kömür yeşili arka plan, sıcak beyaz yazı, tek bir limon yeşili vurgu rengi. Driftnote logosu ve sloganıyla bitir, iki saniye beklet.',
    },
    th: {
      title: 'วิดีโอเปิดตัวสินค้า',
      prompt: 'สร้างวิดีโอเปิดตัว 20 วินาทีให้ Driftnote แอปสมมติที่เปลี่ยนเสียงประชุมที่ยุ่งเหยิงให้เป็นสรุปหน้าเดียว แสดงการเปลี่ยนแปลงหลัก: บับเบิลบทสนทนาและท่อนถอดความที่กระจัดกระจายค่อย ๆ รวมกันทีละบรรทัดจนกลายเป็นการ์ดสรุปที่เรียบร้อย พร้อมงานที่ต้องทำสามข้อ สโลแกนแบรนด์: "ประชุมเข้ามา การตัดสินใจออกไป" ออกแบบหน้าจอแบบเรียบง่ายสำหรับวิดีโอนี้เท่านั้น ห้ามแต่งตัวเลข ลูกค้า หรือราคา พื้นหลังเขียวถ่านเข้ม ตัวอักษรขาวโทนอุ่น สีเน้นเขียวมะนาวหนึ่งสี ปิดท้ายด้วยโลโก้ตัวอักษร Driftnote และสโลแกน ค้างไว้สองวินาที',
    },
    it: {
      title: 'Video di lancio prodotto',
      prompt: 'Crea un video di lancio di 20 secondi per Driftnote, un’app immaginaria che trasforma l’audio disordinato delle riunioni in un riepilogo di una pagina. Mostra la trasformazione chiave: fumetti di dialogo e frammenti di trascrizione sparsi si condensano, riga dopo riga, in una scheda di riepilogo ordinata con tre attività. Claim: «Entrano riunioni. Escono decisioni.» Progetta solo una UI semplice per questo video, senza metriche, clienti o prezzi. Sfondo verde carbone, testo bianco caldo, un accento verde lime. Chiudi sul logotipo Driftnote e sul claim, tenuti per due secondi.',
    },
  },
  'example-motion-showreel': {
    'zh-CN': {
      title: '动效设计师作品集快剪',
      prompt: '制作一段 15 秒的动效设计作品集快剪，展示你是一流的动效设计师。融入几种不同的手法：大字号动态排版、一个变形成新物体的图形、一段界面动效和一个简短的数据动画；但整体保持同一种视觉风格，并用一个反复出现的元素串起每一次切换。米白背景、墨黑文字，只用一种鲜明的强调色。结尾是一张自信的署名卡，署名为虚构工作室“Studio Kinetik”，停留两秒。',
    },
    'zh-TW': {
      title: '動效設計師作品集快剪',
      prompt: '製作一段 15 秒的動效設計作品集快剪，展示你是一流的動效設計師。融入幾種不同的手法：大字級動態排版、一個變形成新物體的圖形、一段介面動效和一個簡短的數據動畫；但整體保持同一種視覺風格，並用一個反覆出現的元素串起每一次切換。米白背景、墨黑文字，只用一種鮮明的強調色。結尾是一張自信的署名卡，署名為虛構工作室「Studio Kinetik」，停留兩秒。',
    },
    en: {
      title: 'Motion Designer Showreel',
      prompt: 'Make a 15-second motion design showreel that proves you are a world-class motion designer. Pack in several distinct techniques — bold kinetic typography, a shape that morphs into something new, an animated interface moment and a quick data flourish — but keep one visual identity and one recurring motif that links every cut. Off-white canvas, ink-black type, a single vivid accent color. End on a confident signature card for the fictional studio "Studio Kinetik", held for two seconds.',
    },
    id: {
      title: 'Showreel Desainer Motion',
      prompt: 'Buat showreel motion design berdurasi 15 detik yang membuktikan kamu desainer motion kelas dunia. Masukkan beberapa teknik berbeda — tipografi kinetik yang tegas, bentuk yang berubah menjadi sesuatu yang baru, momen animasi antarmuka, dan sentuhan data singkat — tetapi pertahankan satu identitas visual dan satu motif berulang yang menghubungkan setiap potongan. Latar putih gading, teks hitam tinta, satu warna aksen yang mencolok. Akhiri dengan kartu tanda tangan yang percaya diri untuk studio fiktif "Studio Kinetik", tahan selama dua detik.',
    },
    de: {
      title: 'Motion-Designer-Showreel',
      prompt: 'Erstelle ein 15-sekündiges Motion-Design-Showreel, das beweist, dass du ein Motion Designer der Weltklasse bist. Kombiniere mehrere Techniken – kräftige kinetische Typografie, eine Form, die sich in etwas Neues verwandelt, einen animierten Interface-Moment und eine kurze Datenanimation –, aber halte eine visuelle Identität und ein wiederkehrendes Motiv, das jeden Schnitt verbindet. Gebrochen weißer Hintergrund, tiefschwarze Schrift, eine einzige kräftige Akzentfarbe. Ende mit einer selbstbewussten Signaturkarte für das fiktive Studio „Studio Kinetik“, zwei Sekunden lang gehalten.',
    },
    'pt-BR': {
      title: 'Showreel de motion designer',
      prompt: 'Crie um showreel de motion design de 15 segundos que prove que você é um motion designer de nível mundial. Reúna várias técnicas diferentes — tipografia cinética marcante, uma forma que se transforma em algo novo, um momento de interface animada e um toque rápido de dados —, mas mantenha uma única identidade visual e um motivo recorrente que conecte cada corte. Fundo off-white, texto preto, uma única cor de destaque vibrante. Termine com um cartão de assinatura confiante do estúdio fictício "Studio Kinetik", mantido por dois segundos.',
    },
    'es-ES': {
      title: 'Showreel de motion designer',
      prompt: 'Crea un showreel de motion design de 15 segundos que demuestre que eres un motion designer de primer nivel. Incluye varias técnicas distintas —tipografía cinética contundente, una forma que se transforma en algo nuevo, un momento de interfaz animada y un toque rápido de datos—, pero mantén una sola identidad visual y un motivo recurrente que enlace cada corte. Fondo blanco roto, texto negro tinta y un único color de acento vivo. Termina con una tarjeta de firma segura del estudio ficticio «Studio Kinetik», que se mantenga dos segundos.',
    },
    ru: {
      title: 'Шоурил моушн-дизайнера',
      prompt: 'Сделай 15-секундный шоурил по моушн-дизайну, который докажет, что ты моушн-дизайнер мирового уровня. Объедини несколько приёмов — выразительную кинетическую типографику, форму, превращающуюся во что-то новое, анимированный момент интерфейса и короткий акцент с данными, — но сохрани единый визуальный стиль и повторяющийся мотив, который связывает каждую склейку. Молочно-белый фон, чёрный текст, один яркий акцентный цвет. Заверши уверенной финальной карточкой с подписью вымышленной студии «Studio Kinetik» и удержи её две секунды.',
    },
    fa: {
      title: 'شوریل طراح موشن',
      prompt: 'یک شوریل موشن دیزاین ۱۵ ثانیه‌ای بساز که ثابت کند طراح موشن درجه‌یکی هستی. چند تکنیک متفاوت را کنار هم بیاور — تایپوگرافی پویای پررنگ، شکلی که به چیزی تازه تبدیل می‌شود، یک لحظهٔ انیمیشن رابط کاربری و یک جلوهٔ کوتاه داده‌ای — اما یک هویت بصری واحد و یک نقش‌مایهٔ تکرارشونده داشته باش که همهٔ برش‌ها را به هم وصل کند. پس‌زمینهٔ سفید شیری، متن مشکی، فقط یک رنگ تأکیدی پررنگ. با یک کارت امضای مطمئن برای استودیوی خیالی «Studio Kinetik» تمام کن و دو ثانیه نگهش دار.',
    },
    ar: {
      title: 'عرض أعمال مصمم الحركة',
      prompt: 'أنشئ عرض أعمال موشن ديزاين مدته 15 ثانية يُثبت أنك مصمم حركة من الطراز العالمي. اجمع عدة تقنيات مختلفة — طباعة حركية جريئة، وشكلًا يتحوّل إلى شيء جديد، ولحظة واجهة متحركة، ولمسة بيانات سريعة — مع الحفاظ على هوية بصرية واحدة وعنصر متكرر يربط كل انتقال. خلفية بيضاء مائلة إلى العاجي، ونص أسود، ولون إبراز واحد زاهٍ. اختم ببطاقة توقيع واثقة للاستوديو الخيالي "Studio Kinetik" تبقى لثانيتين.',
    },
    ja: {
      title: 'モーションデザイナーのショーリール',
      prompt: '一流のモーションデザイナーであることを証明する 15 秒のモーションデザイン・ショーリールを作ってください。力強いキネティックタイポグラフィ、別の形へ変わるシェイプ、アニメーションする UI の一場面、短いデータ演出など複数の手法を盛り込みつつ、ビジュアルは一貫させ、各カットをつなぐ繰り返しのモチーフを置いてください。オフホワイトの背景、墨黒の文字、鮮やかなアクセントカラーを 1 色だけ使用。最後は架空のスタジオ「Studio Kinetik」の自信あるサインカードで締め、2 秒間キープします。',
    },
    ko: {
      title: '모션 디자이너 쇼릴',
      prompt: '세계적인 수준의 모션 디자이너임을 보여 주는 15초 모션 디자인 쇼릴을 만들어 줘. 굵직한 키네틱 타이포그래피, 새로운 무언가로 변하는 도형, 움직이는 인터페이스 장면, 짧은 데이터 연출 등 여러 기법을 담되, 하나의 비주얼 아이덴티티와 모든 컷을 잇는 반복 모티프를 유지해 줘. 오프화이트 배경, 먹색 글자, 선명한 강조색은 하나만. 마지막은 가상의 스튜디오 "Studio Kinetik"의 자신감 있는 서명 카드로 마무리하고 2초간 유지해 줘.',
    },
    pl: {
      title: 'Showreel motion designera',
      prompt: 'Stwórz 15-sekundowy showreel motion designu, który udowodni, że jesteś motion designerem światowej klasy. Połącz kilka różnych technik — wyrazistą typografię kinetyczną, kształt zmieniający się w coś nowego, animowany moment interfejsu i krótki akcent z danymi — ale zachowaj jedną identyfikację wizualną i powracający motyw łączący każde cięcie. Złamana biel w tle, atramentowo czarny tekst, jeden wyrazisty kolor akcentu. Zakończ pewną siebie kartą z podpisem fikcyjnego studia „Studio Kinetik”, utrzymaną przez dwie sekundy.',
    },
    hu: {
      title: 'Motion designer bemutatófilm',
      prompt: 'Készíts egy 15 másodperces motion design bemutatófilmet, amely bizonyítja, hogy világszínvonalú motion designer vagy. Tegyél bele több különböző technikát – erőteljes kinetikus tipográfiát, valami újjá alakuló formát, egy animált felületi pillanatot és egy rövid adatvizualizációt –, de tarts meg egyetlen vizuális arculatot és egy visszatérő motívumot, amely minden vágást összeköt. Törtfehér háttér, tintafekete szöveg, egyetlen élénk kiemelőszín. Zárd egy magabiztos szignókártyával a kitalált „Studio Kinetik” stúdió nevével, és tartsd két másodpercig.',
    },
    fr: {
      title: 'Showreel de motion designer',
      prompt: 'Crée un showreel de motion design de 15 secondes qui prouve que tu es un motion designer de classe mondiale. Réunis plusieurs techniques — une typographie cinétique affirmée, une forme qui se transforme en autre chose, un moment d’interface animée et une touche de données rapide —, mais garde une seule identité visuelle et un motif récurrent qui relie chaque coupe. Fond blanc cassé, texte noir encre, une seule couleur d’accent vive. Termine sur une carte de signature assurée pour le studio fictif « Studio Kinetik », tenue pendant deux secondes.',
    },
    uk: {
      title: 'Шоурил моушн-дизайнера',
      prompt: 'Створи 15-секундний шоурил з моушн-дизайну, який доведе, що ти моушн-дизайнер світового рівня. Поєднай кілька прийомів — виразну кінетичну типографіку, форму, що перетворюється на щось нове, анімований момент інтерфейсу та короткий акцент із даними, — але збережи єдиний візуальний стиль і повторюваний мотив, що поєднує кожну склейку. Молочно-білий фон, чорний текст, один яскравий акцентний колір. Заверши впевненою фінальною карткою з підписом вигаданої студії «Studio Kinetik» і втримай її дві секунди.',
    },
    tr: {
      title: 'Hareket tasarımcısı showreel',
      prompt: 'Dünya çapında bir hareket tasarımcısı olduğunu kanıtlayan 15 saniyelik bir motion design showreel\'i oluştur. Birkaç farklı tekniği bir araya getir — güçlü kinetik tipografi, yeni bir şeye dönüşen bir şekil, animasyonlu bir arayüz anı ve kısa bir veri dokunuşu — ama tek bir görsel kimlik ve her kesmeyi birbirine bağlayan tekrar eden bir motif koru. Kırık beyaz arka plan, mürekkep siyahı yazı, tek bir canlı vurgu rengi. Hayali "Studio Kinetik" stüdyosu için kendinden emin bir imza kartıyla bitir ve iki saniye beklet.',
    },
    th: {
      title: 'โชว์รีลนักออกแบบโมชัน',
      prompt: 'สร้างโชว์รีลโมชันดีไซน์ความยาว 15 วินาทีที่พิสูจน์ว่าคุณเป็นนักออกแบบโมชันระดับโลก ใส่หลายเทคนิค ทั้งตัวอักษรเคลื่อนไหวที่หนักแน่น รูปทรงที่แปลงเป็นสิ่งใหม่ ช่วงแอนิเมชันหน้าจอ และลูกเล่นข้อมูลสั้น ๆ แต่คงสไตล์ภาพเดียวกัน และมีองค์ประกอบที่วนกลับมาเชื่อมทุกช็อต พื้นหลังสีขาวนวล ตัวอักษรสีดำหมึก ใช้สีเน้นสดเพียงสีเดียว ปิดท้ายด้วยการ์ดลายเซ็นอย่างมั่นใจของสตูดิโอสมมติ "Studio Kinetik" ค้างไว้สองวินาที',
    },
    it: {
      title: 'Showreel da motion designer',
      prompt: 'Crea uno showreel di motion design di 15 secondi che dimostri che sei un motion designer di livello mondiale. Inserisci diverse tecniche — tipografia cinetica decisa, una forma che si trasforma in qualcosa di nuovo, un momento di interfaccia animata e un rapido tocco di dati — ma mantieni un’unica identità visiva e un motivo ricorrente che colleghi ogni stacco. Sfondo bianco sporco, testo nero inchiostro, un solo colore d’accento vivace. Chiudi con una sicura card firma dello studio immaginario «Studio Kinetik», tenuta per due secondi.',
    },
  },
  'example-motion-data-story': {
    'zh-CN': {
      title: '数据故事动画',
      prompt: '制作 20 秒数据故事「一百万与十亿」。用大数字对比一百万秒约 11.6 天、十亿秒约 31.7 年，再用 1000 个圆点展示 1000 倍差距，每点代表一百万秒。结尾两张卡片：约 12 天与约 32 年。暖纸白、近黑、朱红，大字和明确分镜。按每天 86400 秒、每年 365.25 天换算，标明近似值。',
    },
    'zh-TW': {
      title: '數據故事動畫',
      prompt: '製作 20 秒數據故事「一百萬與十億」。用大數字對比一百萬秒約 11.6 天、十億秒約 31.7 年，再用 1000 個圓點展示 1000 倍差距，每點代表一百萬秒。結尾兩張卡片：約 12 天與約 32 年。暖紙白、近黑、朱紅，大字和明確分鏡。按每天 86400 秒、每年 365.25 天換算，標明近似值。',
    },
    en: {
      title: 'Animated Data Story',
      prompt: 'Create a 20-second data story, “A million vs a billion.” Compare one million seconds (about 11.6 days) with one billion seconds (about 31.7 years), then fill 1,000 dots, each representing one million seconds. End with two big cards: approximately 12 days versus 32 years. Warm paper, near-black, vermilion and bold typography. Use 86,400 seconds/day and 365.25 days/year; label rounded values.',
    },
    id: {
      title: 'Cerita Data Animasi',
      prompt: 'Buat cerita data 20 detik, “Satu juta vs satu miliar”. Bandingkan satu juta detik (sekitar 11,6 hari) dan satu miliar detik (sekitar 31,7 tahun), lalu isi 1000 titik; setiap titik mewakili satu juta detik. Akhiri dengan kartu sekitar 12 hari vs 32 tahun. Putih kertas hangat, hitam, merah terang, angka besar. Gunakan 86400 detik/hari dan 365,25 hari/tahun; tandai pembulatan.',
    },
    de: {
      title: 'Animierte Datengeschichte',
      prompt: 'Erstelle eine 20-sekündige Datengeschichte „Eine Million gegen eine Milliarde“. Vergleiche eine Million Sekunden (etwa 11,6 Tage) mit einer Milliarde Sekunden (etwa 31,7 Jahre). Fülle 1000 Punkte, jeder für eine Million Sekunden. Ende: etwa 12 Tage gegen 32 Jahre. Warmes Papierweiß, Schwarz, Zinnoberrot, große Zahlen. Rechne mit 86400 Sekunden/Tag und 365,25 Tagen/Jahr; kennzeichne Rundungen.',
    },
    'pt-BR': {
      title: 'História de dados animada',
      prompt: 'Crie uma história de dados de 20 segundos: “Um milhão vs um bilhão”. Compare um milhão de segundos (cerca de 11,6 dias) com um bilhão (cerca de 31,7 anos). Preencha 1000 pontos, cada um representando um milhão de segundos. Termine com cartões: aproximadamente 12 dias vs 32 anos. Papel branco quente, preto, vermelho e números grandes. Use 86400 segundos/dia e 365,25 dias/ano; indique os arredondamentos.',
    },
    'es-ES': {
      title: 'Historia de datos animada',
      prompt: 'Crea una historia de datos de 20 segundos: «Un millón frente a mil millones». Compara un millón de segundos (unos 11,6 días) con mil millones (unos 31,7 años). Llena 1000 puntos, cada uno equivalente a un millón de segundos. Termina con tarjetas: aproximadamente 12 días frente a 32 años. Papel cálido, negro, rojo y números grandes. Usa 86400 segundos/día y 365,25 días/año; indica los redondeos.',
    },
    ru: {
      title: 'Анимированная история в данных',
      prompt: 'Создай 20-секундную историю «Миллион против миллиарда». Сравни миллион секунд (около 11,6 дня) с миллиардом (около 31,7 года). Заполни 1000 точек, каждая — миллион секунд. Финал: две крупные карточки, примерно 12 дней против 32 лет. Тёплый бумажный фон, чёрный, красный, крупные числа. Расчёт: 86400 секунд в дне, 365,25 дня в году; обозначь округления.',
    },
    fa: {
      title: 'داستان داده‌ای متحرک',
      prompt: 'داستان داده‌ای ۲۰ ثانیه‌ای «یک میلیون در برابر یک میلیارد» بساز. یک میلیون ثانیه، حدود 11.6 روز، را با یک میلیارد ثانیه، حدود 31.7 سال، مقایسه کن. 1000 نقطه را پر کن؛ هر نقطه یک میلیون ثانیه است. پایان: حدود 12 روز در برابر 32 سال. کاغذ سفید گرم، مشکی، قرمز و اعداد درشت. مبنا: 86400 ثانیه در روز و 365.25 روز در سال؛ مقادیر گرد‌شده را مشخص کن.',
    },
    ar: {
      title: 'قصة بيانات متحركة',
      prompt: 'أنشئ قصة بيانات مدتها 20 ثانية: «مليون مقابل مليار». قارن مليون ثانية (نحو 11.6 يومًا) بمليار ثانية (نحو 31.7 سنة). املأ 1000 نقطة، كل نقطة تمثل مليون ثانية. اختم ببطاقتين كبيرتين: نحو 12 يومًا مقابل 32 سنة. خلفية ورقية دافئة وأسود وأحمر وأرقام كبيرة. احسب على أساس 86400 ثانية في اليوم و365.25 يومًا في السنة، ووضّح القيم التقريبية.',
    },
    ja: {
      title: 'データストーリーアニメーション',
      prompt: '「100 万と 10 億」を比べる 20 秒のデータアニメーションを作成。100 万秒は約 11.6 日、10 億秒は約 31.7 年。1 点が 100 万秒を表す 1000 個の点を埋め、最後は約 12 日と約 32 年の大きなカードで対比。暖かい紙白、黒、朱赤、大きな数字。1 日 86400 秒、1 年 365.25 日で計算し、概数を明記してください。',
    },
    ko: {
      title: '데이터 스토리 애니메이션',
      prompt: '“백만과 십억”을 비교하는 20초 데이터 애니메이션을 만들어 줘. 백만 초는 약 11.6일, 십억 초는 약 31.7년이야. 점 하나가 백만 초를 나타내는 1000개의 점을 채우고, 마지막은 약 12일과 약 32년의 큰 카드로 비교해 줘. 따뜻한 종이색, 검정, 주홍, 큰 숫자. 하루 86400초, 1년 365.25일로 계산하고 근삿값을 표시해 줘.',
    },
    pl: {
      title: 'Animowana historia w danych',
      prompt: 'Stwórz 20-sekundową historię „Milion kontra miliard”. Porównaj milion sekund (około 11,6 dnia) z miliardem (około 31,7 roku). Wypełnij 1000 punktów, każdy oznacza milion sekund. Finał: duże karty, około 12 dni kontra 32 lata. Ciepła biel papieru, czerń, czerwień i duże liczby. Przyjmij 86400 sekund/dzień i 365,25 dnia/rok; oznacz zaokrąglenia.',
    },
    hu: {
      title: 'Animált adattörténet',
      prompt: 'Készíts 20 másodperces adattörténetet „Egymillió és egymilliárd” címmel. Egymillió másodperc körülbelül 11,6 nap; egymilliárd körülbelül 31,7 év. Tölts fel 1000 pontot, mindegyik egymillió másodperc. Zárásként két nagy kártya: körülbelül 12 nap és 32 év. Meleg papírfehér, fekete, vörös és nagy számok. Számolj napi 86400 másodperccel, évi 365,25 nappal; jelöld a kerekítést.',
    },
    fr: {
      title: 'Récit de données animé',
      prompt: 'Crée une animation de données de 20 secondes : « Un million contre un milliard ». Compare un million de secondes (environ 11,6 jours) à un milliard (environ 31,7 ans). Remplis 1000 points, chacun représentant un million de secondes. Termine sur deux grandes cartes : environ 12 jours contre 32 ans. Papier chaud, noir, rouge et grands chiffres. Base : 86400 secondes/jour, 365,25 jours/an ; indique les arrondis.',
    },
    uk: {
      title: 'Анімована історія в даних',
      prompt: 'Створи 20-секундну історію «Мільйон проти мільярда». Порівняй мільйон секунд (приблизно 11,6 дня) з мільярдом (приблизно 31,7 року). Заповни 1000 крапок, кожна — мільйон секунд. Фінал: дві великі картки, приблизно 12 днів проти 32 років. Тепле паперове тло, чорний, червоний, великі числа. Розрахунок: 86400 секунд на день, 365,25 дня на рік; познач округлення.',
    },
    tr: {
      title: 'Animasyonlu veri hikâyesi',
      prompt: '“Bir milyon ve bir milyar” başlıklı 20 saniyelik veri animasyonu oluştur. Bir milyon saniyeyi (yaklaşık 11,6 gün) bir milyar saniyeyle (yaklaşık 31,7 yıl) karşılaştır. Her biri bir milyon saniyeyi temsil eden 1000 noktayı doldur. İki büyük kartla bitir: yaklaşık 12 gün ve 32 yıl. Sıcak kâğıt beyazı, siyah, kırmızı, büyük sayılar. Günde 86400 saniye, yılda 365,25 gün kullan; yuvarlamaları belirt.',
    },
    th: {
      title: 'แอนิเมชันเล่าเรื่องด้วยข้อมูล',
      prompt: 'สร้างแอนิเมชันข้อมูล 20 วินาที “หนึ่งล้านกับหนึ่งพันล้าน” เปรียบเทียบหนึ่งล้านวินาที (ประมาณ 11.6 วัน) กับหนึ่งพันล้านวินาที (ประมาณ 31.7 ปี) เติมจุด 1000 จุด โดยแต่ละจุดแทนหนึ่งล้านวินาที ปิดท้ายด้วยการ์ดใหญ่ประมาณ 12 วันกับ 32 ปี ใช้พื้นกระดาษโทนอุ่น สีดำ สีแดง และตัวเลขใหญ่ คำนวณจาก 86400 วินาทีต่อวันและ 365.25 วันต่อปี ระบุค่าที่ปัดเศษ',
    },
    it: {
      title: 'Storia di dati animata',
      prompt: 'Crea una storia di dati di 20 secondi: «Un milione contro un miliardo». Confronta un milione di secondi (circa 11,6 giorni) con un miliardo (circa 31,7 anni). Riempi 1000 punti, ciascuno pari a un milione di secondi. Chiudi con due grandi schede: circa 12 giorni contro 32 anni. Carta calda, nero, rosso e numeri grandi. Usa 86400 secondi/giorno e 365,25 giorni/anno; indica gli arrotondamenti.',
    },
  },
};

export function homePresetCopy(pluginId: string, locale: string): HomePresetCopy | undefined {
  const copy: Partial<Record<string, HomePresetCopy>> | undefined = HOME_PRESET_COPY[pluginId];
  return copy?.[locale];
}
