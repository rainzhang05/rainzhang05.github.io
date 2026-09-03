import type {
  EducationItem,
  Experience,
  FooterElsewhereLink,
  NavItem,
  Project,
  SkillGroup,
} from "@/lib/types";
import type { SiteContent } from "@/lib/i18n/types";

/**
 * Japanese content. Structural fields (`id`, `stack`, `links`, `cryptoNote`,
 * `image`, `tagType`, `related`) are intentionally identical to the English
 * data in `lib/data/*` — only prose, dates, and place names are localized.
 * Tech names, company names, and school names stay in their official form.
 */

const JA_NAV_ITEMS: NavItem[] = [
  { id: "intro", label: "トップ" },
  { id: "about", label: "自己紹介" },
  { id: "experience", label: "経験" },
  { id: "projects", label: "プロジェクト" },
  { id: "skills", label: "スキル" },
  { id: "education", label: "学歴" },
  { id: "contact", label: "連絡先" },
];

const JA_FOOTER_NAV: NavItem[] = JA_NAV_ITEMS.slice(1);

const JA_FOOTER_ELSEWHERE: FooterElsewhereLink[] = [
  { href: "https://github.com/rainzhang05", label: "GitHub", icon: "github" },
  { href: "https://www.linkedin.com/in/rainzhang05/", label: "LinkedIn", icon: "linkedin" },
  { href: "mailto:rainzhang.zty@gmail.com", label: "メール", icon: "mail" },
  { href: "/rain-zhang-resume.pdf", label: "レジュメ", icon: "file" },
];

const JA_EXPERIENCES: Experience[] = [
  {
    id: "mnt-realty",
    role: "ソフトウェア・IT システムスペシャリスト",
    org: "MNT Realty Inc.",
    dept: "社内ソフトウェア・IT システム",
    location: "カナダ・バンクーバー",
    period: "2026年8月 — 現在",
    logo: "/mnt-realty-logo.svg",
    logoAlt: "MNT Realty",
    // Square mark; needs more height than a wordmark to read at the same size.
    logoHeight: "h-9",
    summary:
      "不動産・ストラータ管理を手がける MNT Realty Inc. で、社内に開発チームがない環境のもと、ソフトウェアと IT システムを一手に担当しています。業務上の要件を保守しやすい社内システムへと自分で落とし込み、システム設計、フルスタック開発、認証と外部サービス連携、デプロイ基盤、業務自動化、AI を活用した社内システムまで、技術的な判断から実装・運用までを一貫して担当しています。",
    outcomes: [
      "社内ツールを1つのアプリケーションに集約する社内基盤「MNT Control Center」を設計・開発しています。",
      "社内アプリケーションが個別の認証情報ではなく会社の ID 基盤で認証されるよう、Microsoft 365 による組織認証と権限管理を実装しています。",
      "対象となる業務課題に応じてアーキテクチャ・データ設計・連携方式を選定し、社内向けの Web アプリケーションをフルスタックで開発しています。",
      "メール対応や所有者情報の参照を支援する業務自動化と AI 活用システムを開発し、社内の AI アシスタントが社内情報を検索できる仕組みも整備しています。",
      "ホスティング、デプロイ、ドメイン、アプリケーション基盤を管理し、社内システムのリリース手順や環境設定も担当しています。",
      "自分が構築したシステムのテスト・保守・ドキュメント整備を行い、一人でも維持できる状態を保っています。",
    ],
    stack: [
      "Python",
      "TypeScript",
      "Next.js",
      "React.js",
      "Node.js",
      "Tailwind CSS",
      "PostgreSQL",
      "REST APIs",
      "Microsoft 365",
      "Microsoft Entra ID",
      "Microsoft Graph API",
      "OAuth 2.0",
      "Docker",
      "Vercel",
      "GitHub Actions",
      "DNS / Domains",
    ],
    related: [],
  },
  {
    id: "feitian",
    role: "フルスタックエンジニア インターン",
    org: "FEITIAN Technologies Co., Ltd.",
    dept: "国際部門",
    location: "中国・北京",
    period: "2025年9月 — 12月",
    tagType: "Internship",
    logo: "/feitian-logo.svg",
    logoAlt: "FEITIAN",
    summary:
      "FEITIAN のポスト量子暗号(PQC)関連の取り組みとして、3つのシステムの開発を設計から実装・デプロイまで一貫して担当しました。ユーザー向けの認証デモプラットフォーム、一般公開の Web Authentication 開発者向けツール、Rust で実装した FIDO2 ソフトウェア認証器の3件です。アーキテクチャ設計、フルスタック実装、クラウド・サーバーへのデプロイ、CI/CD パイプラインの構築に加え、ハードウェアエンジニアとの連携も担当しました。",
    outcomes: [
      "社内で初となる開発者向けツールのプラットフォームを構築し、それまで分散していた外部ツールを置き換えて、認証のテスト・検証・デバッグを1つのシステムにまとめました。",
      "WebAuthn・FIDO2・CTAP2 に加え、ポスト量子暗号(ML-DSA)を用いたフローにも対応する、認証製品のテスト用 Web システムを開発しました。",
      "量産前のハードウェアが利用できない段階でも開発を進められるよう、ML-DSA をテスト用プラットフォームと仮想認証器に組み込みました。",
      "Docker と CI パイプラインを用いて Linux サーバーへのデプロイを整備し、テストやデモを安定して再現できるようにしました。",
      "セキュリティエンジニアや製品チームと密に連携し、実際の製品開発で必要とされる形に、プラットフォームの挙動・出力データ・テストフローを調整しました。",
      "ユーザー自身が試せる認証デモプラットフォームを用意することで、サポート対応の負担を軽減しました。",
      "インターン期間の終了後も、担当したプロジェクトの保守と改善を自主的に続けています。",
    ],
    stack: [
      "Python",
      "Rust",
      "TypeScript",
      "React.js",
      "Flask",
      "JavaScript",
      "HTML",
      "ML-DSA / ML-KEM",
      "liboqs",
      "WebAuthn / FIDO2",
      "CTAP2",
      "Docker",
      "Google Cloud",
      "GitHub Actions",
      "Tailwind CSS",
    ],
    related: ["webauthn-platform", "mldsa-authenticator", "security-demo"],
  },
];

const JA_PROJECTS: Project[] = [
  {
    id: "security-demo",
    title: "認証・セキュリティ デモプラットフォーム",
    summary:
      "パスワードレス認証と FIDO2 セキュリティキーを実際に体験できるプラットフォームです。登録からサインイン、資格情報の管理まで、一連の流れを試せます。",
    image: "/projects/security-demo.png",
    period: "2025年11月 — 12月",
    role: "フルスタック開発",
    tools: "React, Python, Docker, Google Cloud",
    stack: ["Python", "React", "TypeScript", "Tailwind CSS", "Flask", "Docker", "Google Cloud"],
    cryptoNote: "liboqs (ML-DSA)",
    links: { live: "https://demo.ftsafe.com" },
    impact: [
      {
        title: "認証方式の統合",
        body: "従来のパスワード、OTP、ハードウェアセキュリティキーを1つのプラットフォームにまとめ、一貫した操作で使えるようにしました。",
      },
      {
        title: "次世代の暗号方式への対応",
        body: "将来的な計算能力の向上を見据え、ポスト量子暗号をプラットフォームに組み込みました。",
      },
      {
        title: "デプロイの自動化",
        body: "外部ネットワークに接続しなくてもサーバー側でビルドが完結するよう、デプロイ手順を自動化しました。",
      },
    ],
    featured: true,
    tagType: "Internship",
  },
  {
    id: "mldsa-authenticator",
    title: "FIDO2 ソフトウェア認証器",
    summary:
      "物理的な FIDO2 トークンの動作を再現する、Rust 製のソフトウェアセキュリティキーです。ポスト量子暗号 ML-DSA による署名にも対応しています。",
    hideThumbnail: true,
    period: "2025年10月 — 11月",
    role: "バックエンド・システム開発",
    tools: "Rust, Linux, 暗号ライブラリ",
    stack: ["Rust", "C/FFI", "Trussed", "Linux UHID"],
    cryptoNote: "liboqs (ML-DSA)",
    links: { github: "https://github.com/feitiantech/fidosoftwareauthenticator" },
    impact: [
      {
        title: "ハードウェアの動作再現",
        body: "物理トークンの動作をソフトウェアで再現し、Web ブラウザからそのまま認証を試せるようにしました。",
      },
      {
        title: "暗号ライブラリの組み込み",
        body: "Rust 本体に暗号ライブラリを安全に組み込み、ポスト量子暗号に対応させました。",
      },
      {
        title: "標準に沿った資格情報の保存",
        body: "業界の認証標準に準拠した形で、資格情報を保存する仕組みを実装しました。",
      },
    ],
    featured: true,
    tagType: "Internship",
  },
  {
    id: "webauthn-platform",
    title: "Web Authentication 開発者向けプラットフォーム",
    summary:
      "WebAuthn と FIDO2 の認証フローをテストできる開発者向けツールです。耐量子計算機暗号にも対応しており、セレモニーの実行、レスポンスの確認、さまざまな認証器の検証を1か所で行えます。",
    image: "/projects/webauthn-platform.png",
    period: "2025年9月 — 10月",
    role: "フルスタック開発",
    tools: "Python, JavaScript, Google Cloud",
    stack: ["Python", "JavaScript", "HTML", "CSS", "Flask", "Google Cloud"],
    cryptoNote: "python-fido2 · liboqs (ML-DSA)",
    links: {
      live: "https://webauthnlab.tech",
      github: "https://github.com/feitiantech/postquantum-webauthn-platform",
    },
    impact: [
      {
        title: "開発者向けツールの提供",
        body: "複雑な認証データをデコードするツールを実装し、署名の検証やテストをその場で行えるようにしました。",
      },
      {
        title: "認証器メタデータの同期",
        body: "世界共通のメタデータサービスと連携し、400 種類以上の認証器の情報を自動で同期する仕組みを構築しました。",
      },
      {
        title: "セッションの分離",
        body: "セッションを分離する設計にすることで、数百人規模の開発者が同時に利用してもデータが混在しないようにしました。",
      },
    ],
    featured: true,
    tagType: "Internship",
  },
  {
    id: "travel-advisor",
    title: "旅行プラン提案 Web サイト",
    summary:
      "OpenAI と Tripadvisor の API を利用し、希望条件と旅行日程に合わせて旅行先・ホテル・レストラン・観光スポットを提案する Web サイトです。",
    image: "/projects/travel-advisor.png",
    period: "2025年1月 — 4月",
    role: "フロントエンド開発",
    tools: "React, Vite, Tailwind, API 連携(フロントエンド)",
    stack: ["Python", "React", "Tailwind CSS", "JavaScript"],
    cryptoNote: null,
    links: {
      live: "https://travel-advisor-project.vercel.app/",
      github: "https://github.com/f4ncy1zach/travel-advisor",
    },
    impact: [
      {
        title: "AI による提案の実装",
        body: "バックエンドの OpenAI API をフロントエンドと連携させ、AI が生成した提案を見やすい形で表示できるようにしました。",
      },
      {
        title: "入力フローの設計",
        body: "日程・人数・場所を順に入力するフォームを設計し、入力値の検証と一時保存を実装しました。",
      },
      {
        title: "チャット UI の実装",
        body: "バックエンドと連携する対話型ウィジェットの UI コンポーネントと操作フローを設計・実装しました。",
      },
    ],
    tagType: "Academic",
  },
  {
    id: "portfolio",
    title: "個人ポートフォリオサイト",
    summary:
      "Next.js で作り直した個人ポートフォリオサイトです。ライト・ダーク両対応のトークンベースのデザインシステム、型付けされたコンポーネント、コミットごとに実行される Vitest + Playwright のテストで構成しています。",
    hideThumbnail: true,
    period: "2025年2月 — 2026年5月",
    role: "フロントエンド開発",
    tools: "Next.js, TypeScript, Tailwind CSS, Vitest, Playwright, Vercel",
    stack: ["Next.js", "React.js", "TypeScript", "Tailwind CSS"],
    cryptoNote: null,
    links: {
      live: "https://rainzhang.me/",
      github: "https://github.com/rainzhang05/rainzhang05.github.io",
    },
    impact: [
      {
        title: "トークンベースのデザインシステム",
        body: "色・タイポグラフィ・余白・角丸をトークンとして定義し、ポートフォリオ本体と、別途公開しているデザインシステムのページの両方で共通利用しています。",
      },
      {
        title: "型安全な作り直し",
        body: "素の HTML・CSS・JavaScript から、Next.js 15 と React 18 の構成へ移行しました。TypeScript の strict 設定と ESLint で、コンポーネントの境界を保つようにしています。",
      },
      {
        title: "コミットごとの自動テスト",
        body: "Vitest と React Testing Library によるユニットテストと、Playwright による E2E テストを CI で実行し、Chromium・Firefox・モバイル WebKit で検証しています。",
      },
    ],
    tagType: "Personal",
  },
];

const JA_SKILL_GROUPS: SkillGroup[] = [
  { label: "プログラミング言語", items: ["Python", "C", "C++", "Java", "Rust"] },
  {
    label: "Web 開発",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Flask",
    ],
  },
  { label: "OS", items: ["Windows", "macOS", "Linux"] },
  {
    label: "ツール・開発環境",
    items: [
      "VS Code",
      "JetBrains IDEs",
      "GitHub",
      "Git",
      "GitHub Actions",
      "Google Cloud",
      "Docker",
      "WebAuthn / FIDO2",
    ],
  },
];

const JA_EDUCATION: EducationItem[] = [
  {
    school: "Simon Fraser University",
    location: "カナダ・バーナビー",
    period: "2023年9月 — 2027年4月",
    expected: "卒業見込み:2027年4月",
    degree: "コンピュータサイエンス学士(Bachelor of Science in Computer Science)",
    notes: [
      "CGPA:3.43 / 4.33",
      "Dean's Honor Roll(学部長表彰)· 2024年秋学期 · Faculty of Applied Science",
      "Dean's Honor Roll(学部長表彰)· 2025年夏学期 · Faculty of Applied Science",
    ],
  },
  {
    school: "Semiahmoo Secondary",
    location: "カナダ・サリー",
    period: "2018年9月 — 2023年6月",
    expected: null,
    degree: "高校卒業(High School Diploma)",
    notes: ["CGPA:3.9 / 4.0", "プログラミング部 · 2021年9月から"],
  },
];

export const JA_CONTENT: SiteContent = {
  navItems: JA_NAV_ITEMS,
  footerNav: JA_FOOTER_NAV,
  footerElsewhere: JA_FOOTER_ELSEWHERE,
  projects: JA_PROJECTS,
  experiences: JA_EXPERIENCES,
  skillGroups: JA_SKILL_GROUPS,
  education: JA_EDUCATION,
};
