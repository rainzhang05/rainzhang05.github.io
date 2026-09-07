import type { ResumeCopy } from '../types';

/**
 * The Japanese resume, transcribed from public/rain-zhang-resume-ja.pdf.
 *
 * Verbatim, exactly as resume.en.ts is. The two PDFs were written separately
 * rather than translated from one another, so the two files match in structure
 * but not always in line count — the Japanese education block runs to six
 * lines where the English runs to five, and the skills groups list different
 * numbers of items. tests/unit/resume.test.ts checks the structure they do
 * share and deliberately does not check the counts they do not.
 */
export const resumeJa: ResumeCopy = {
  locale: 'ja',
  meta: {
    title: '履歴書 — Rain Zhang',
    description:
      'バンクーバー在住のフルスタックエンジニア、Rain Zhang の履歴書。このページでそのまま読めます。PDF のダウンロードもできます。',
  },
  tagline: 'フルスタックエンジニア · コンピュータサイエンス学士 · サイモンフレーザー大学',
  contact: [
    [{ text: 'バンクーバー、BC州、カナダ' }],
    [
      { text: '+1 (236) 333-7191', href: 'tel:+12363337191' },
      { text: 'rainzhang.zty@gmail.com', href: 'mailto:rainzhang.zty@gmail.com' },
    ],
    [
      { text: 'rainzhang.me', href: 'https://rainzhang.me' },
      { text: 'github.com/rainzhang05', href: 'https://github.com/rainzhang05' },
    ],
    [
      {
        text: 'linkedin.com/in/rainzhang05',
        href: 'https://www.linkedin.com/in/rainzhang05',
      },
    ],
  ],
  download: 'PDF をダウンロード',
  headings: {
    experience: '経歴',
    projects: '主な制作物',
    skills: '技術',
    education: '学歴',
  },
  experience: [
    {
      id: 'resume-mnt',
      title: 'ソフトウェア・IT システム担当',
      meta: [{ text: 'MNT Realty' }, { text: 'バンクーバー、BC州、カナダ' }],
      dates: '2026年8月 – 現在',
      bullets: [
        '不動産・ストラータ管理会社で唯一のエンジニアとして、設計からホスティング、デプロイ、保守まで社内システムを一貫して担当しています。',
        'MNT Realty のプラットフォームを一から作り直し、公開ウェブサイト、居住者向けのオーナーポータル、社内向けの管理コンソールを1つのアプリケーションで提供しています。',
        '社内に散らばっていたツールを一つにまとめる社内プラットフォーム「MNT Control Center」を Next.js・Node.js・PostgreSQL で設計・開発しました。',
        'Microsoft Entra ID・Graph API・OAuth 2.0 を使い、組織アカウントでのサインインと権限管理を整えました。',
        '繰り返しの事務作業を自動化しました。受信メールの振り分け、所有者情報の照会、社内文書をもとに社員の質問へ答える社内アシスタントなどです。',
      ],
    },
    {
      id: 'resume-feitian',
      title: 'フルスタックエンジニア（インターン）',
      meta: [{ text: '飛天（FEITIAN Technologies）' }, { text: '国際部' }, { text: '北京、中国' }],
      dates: '2025年9月 – 12月',
      bullets: [
        '耐量子計算機暗号（PQC）対応の FIDO2 に向けて、公開用の WebAuthn 開発者向けプラットフォーム、Rust によるソフトウェアセキュリティキー、顧客向けデモサイトの3つを開発から運用まで担当しました。',
        'Rust で CTAP2 認証器を実装し、Linux 上で仮想 USB セキュリティキーとして見えるようにしました。ハードウェアが完成する前から ML-DSA の資格情報を試せます。',
        'Linux サーバーと Google Cloud Run 上に Docker でデプロイし、テスト・ビルド・FIDO メタデータの日次更新を GitHub Actions で自動化しました。',
        '社内のハードウェアエンジニアやセキュリティエンジニアと相談しながら実機に合う形に仕上げ、インターン終了後も3つとも保守を続けています。',
      ],
    },
  ],
  projects: [
    {
      id: 'resume-mnt-platform',
      title: 'MNT Realty Platform（不動産管理プラットフォーム）',
      meta: [
        { text: 'Next.js' },
        { text: 'TypeScript' },
        { text: 'Node.js' },
        { text: 'PostgreSQL' },
        { text: 'Vercel' },
        { text: 'mntrealty.vercel.app', href: 'https://mntrealty.vercel.app' },
      ],
      dates: '2026年8月 – 現在',
      bullets: [
        '公開ウェブサイト、居住者向けのオーナーポータル、社内向けの管理コンソールという3つの画面を、3つのサブドメイン・1つのビルドで提供しています。',
        'プロキシがホスト名で振り分け、画面ごとに独自のクロームとホスト限定のセッション Cookie を持ちます。読み書きはすべて1つのデータストア契約を通ります。',
        'ナビゲーション、ページのガード、ファイル配信はすべて同じ表を読み、権限外のセクションは「禁止」ではなく「存在しない」として扱います。',
      ],
    },
    {
      id: 'resume-webauthn',
      title: 'WebAuthn 開発者向けプラットフォーム',
      meta: [
        { text: 'Python' },
        { text: 'Flask' },
        { text: 'Docker' },
        { text: 'liboqs' },
        { text: 'webauthnlab.tech', href: 'https://webauthnlab.tech' },
        {
          text: 'リポジトリ',
          href: 'https://github.com/feitiantech/postquantum-webauthn-platform',
        },
      ],
      dates: '2025年9月 – 現在',
      bullets: [
        'FIDO2 を使って開発する人のための公開ツール。実機または仮想の認証器で登録・サインインし、返ってきたデータを読み解き、FIDO Alliance のメタデータを調べられます。',
        'Yubico の python-fido2 に手を入れ、liboqs 経由で ML-DSA-44・-65・-87 を追加しました。従来の経路は壊さずに対応しています。',
        'サーバー側の約120のテストファイルに加え、フロントエンドと PQC のテストが CI で動きます。日次の GitHub Action がメタデータを再検証しています。',
      ],
    },
  ],
  skills: [
    {
      id: 'languages',
      label: '言語',
      items: 'Python, TypeScript, JavaScript, Rust, C, C++, Java',
    },
    {
      id: 'web',
      label: 'Web',
      items: 'React, Next.js, Node.js, Flask, Tailwind CSS, HTML, CSS, REST API',
    },
    {
      id: 'data',
      label: '基盤・ツール',
      items: 'PostgreSQL, Docker, Google Cloud, Vercel, GitHub Actions, Git, Linux',
    },
    {
      id: 'security',
      label: '認証・セキュリティ',
      items:
        'WebAuthn / FIDO2, CTAP2.1, OAuth 2.0, Microsoft Entra ID, 耐量子計算機暗号（ML-DSA, liboqs）',
    },
    {
      id: 'testing',
      label: 'テスト',
      items: 'pytest, Vitest, Playwright, GitHub Actions での CI',
    },
  ],
  education: [
    'サイモンフレーザー大学',
    'コンピュータサイエンス学士',
    'バンクーバー、BC州、カナダ',
    '2023年9月 – 2027年4月卒業見込み',
    'CGPA 3.44 / 4.33',
    '2024年秋学期と2025年夏学期に Dean’s Honour Roll',
  ],
};
