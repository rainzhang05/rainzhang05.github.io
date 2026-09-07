import type { Copy } from '../types';

/**
 * Japanese copy for /ja. Same facts and structure as en.ts.
 * Translated from the English; worth a native read before launch.
 */
export const ja: Copy = {
  locale: 'ja',
  meta: {
    title: 'Rain Zhang — ソフトウェアエンジニア（バンクーバー）',
    description:
      'サイモンフレーザー大学でコンピュータサイエンスを学ぶ3年生。Python・TypeScript・Rust で、Web システムの設計から本番運用までを一貫して担当しています。',
  },
  nav: [
    {
      id: 'experience',
      label: '経歴',
      href: '#experience',
    },
    {
      id: 'work',
      label: '制作物',
      href: '#work',
    },
    {
      id: 'contact',
      label: '連絡先',
      href: '#contact',
    },
    {
      id: 'resume',
      label: '履歴書',
      href: '/rain-zhang-resume.pdf',
      external: true,
    },
  ],
  intro: {
    eyebrow: 'コンピュータサイエンス · サイモンフレーザー大学 · バンクーバー（BC州）',
    heading: 'Web システムの設計から本番運用まで、一貫して担当しています。',
    body: 'Rain Zhang です。サイモンフレーザー大学でコンピュータサイエンスを学ぶ3年生です。この1年は、セキュリティキーの会社と不動産管理会社で実際に運用されるシステムを、主に Python・TypeScript・Rust で開発し、運用してきました。',
    availability: 'ソフトウェアエンジニアのインターンシップおよび新卒採用を探しています。',
    resume: '履歴書をダウンロード',
    copyEmail: 'メールアドレスをコピー',
    portraitAlt: 'Rain Zhang',
  },
  sections: {
    experience: '経歴',
    work: '主な制作物',
    otherWork: 'その他の制作物',
    background: '学歴と技術',
    contact: '連絡先',
  },
  labels: {
    technologies: '使用技術',
    relatedWork: '関連する制作物',
    stack: '技術構成',
    status: '現在の状況',
    expand: '詳細を表示',
    collapse: '詳細を閉じる',
  },
  experiences: [
    {
      id: 'exp-mnt',
      dates: '2026年8月 – 現在',
      role: 'ソフトウェア・IT システム担当',
      org: 'MNT Realty',
      orgLine: 'MNT Realty · バンクーバー（BC州）',
      mark: {
        src: '/logos/mnt-realty.svg',
        width: 28,
        height: 28,
      },
      summary:
        '不動産・ストラータ管理会社で唯一のエンジニアです。社内業務の基盤となるシステムを開発・運用し、Microsoft 365 のアカウントやデータと連携させています。',
      groups: [
        {
          label: '担当した仕事',
          items: [
            '社内に散らばっていたツールを一つにまとめる社内プラットフォーム「MNT Control Center」を設計・開発しました。',
            'Microsoft Entra ID・Graph API・OAuth 2.0 を使い、組織アカウントでのサインインと権限管理を整えました。',
            'その土台となる社内 Web アプリケーションを Next.js・Node.js・PostgreSQL で構築しました。',
            '繰り返しの事務作業を自動化しました。受信メールの振り分け、所有者情報の照会、社内文書をもとに社員の質問へ答える社内アシスタントなどです。',
          ],
        },
        {
          label: '運用',
          items: [
            'ホスティング、デプロイ、ドメインと DNS、Vercel と GitHub Actions でのリリース手順を管理しています。',
            'いずれ引き継げるように、テスト・保守・ドキュメントもすべて自分で行っています。',
          ],
        },
      ],
      tech: [
        'Python',
        'TypeScript',
        'Next.js',
        'React',
        'Node.js',
        'Tailwind CSS',
        'PostgreSQL',
        'Microsoft 365',
        'Microsoft Entra ID',
        'Microsoft Graph API',
        'OAuth 2.0',
        'Docker',
        'Vercel',
        'GitHub Actions',
      ],
      related: [],
    },
    {
      id: 'exp-feitian',
      dates: '2025年9月 – 12月',
      role: 'フルスタックエンジニア（インターン）',
      org: 'FEITIAN Technologies',
      orgLine: 'FEITIAN Technologies · 国際部 · 北京',
      mark: {
        src: '/logos/feitian.svg',
        width: 88,
        height: 22,
      },
      summary:
        '耐量子計算機暗号（PQC）対応の FIDO2 に向けて、3つのシステムを開発から運用まで担当しました。公開用の WebAuthn 開発者向けプラットフォーム、Rust によるソフトウェアセキュリティキー、顧客向けデモサイトです。',
      groups: [
        {
          label: '担当した仕事',
          items: [
            '社内初となる WebAuthn/FIDO2 開発者向けプラットフォームを設計・開発しました。散らばっていた外部ツールを置き換え、登録・認証・確認・デバッグを一か所でできるようにしました。',
            'Rust で CTAP2 認証器を実装し、Linux 上で仮想 USB セキュリティキーとして見えるようにしました。ハードウェアが完成する前から、ブラウザや libfido2 で ML-DSA の資格情報を試せます。',
            'サポート窓口を通さずにパスワードレス認証とセキュリティキーを試せるデモサイトを作りました。',
          ],
        },
        {
          label: '構築と運用',
          items: [
            'Linux サーバーと Google Cloud Run 上に Docker でデプロイし、テスト・ビルド・FIDO メタデータの日次更新を GitHub Actions で自動化しました。',
            '社内のハードウェアエンジニアやセキュリティエンジニアと相談しながら、実機と必要なデータに合う形に仕上げました。',
            'インターン終了後も、3つとも自分で保守を続けています。',
          ],
        },
      ],
      tech: [
        'Python',
        'Flask',
        'JavaScript',
        'HTML',
        'Rust',
        'TypeScript',
        'React',
        'Tailwind CSS',
        'Docker',
        'Google Cloud',
        'GitHub Actions',
        'WebAuthn / FIDO2',
        'CTAP2.1',
        'ML-DSA',
        'liboqs',
      ],
      related: ['work-webauthn', 'work-authenticator', 'work-demo'],
    },
  ],
  featured: [
    {
      id: 'work-webauthn',
      dates: '2025年9月 – 10月',
      title: 'WebAuthn 開発者向けプラットフォーム',
      summary:
        'FIDO2/WebAuthn の動作を試すための公開ツール。耐量子計算機暗号 ML-DSA の資格情報にも対応しています。',
      primary: ['Python', 'Flask', 'JavaScript'],
      quiet: {
        label: 'webauthnlab.tech',
        href: 'https://webauthnlab.tech',
      },
      sections: [
        {
          label: '概要',
          text: 'FIDO2 を使って開発する人のための Flask アプリケーションです。実機または仮想の認証器で登録・サインインし、WebAuthn のリクエストを JSON のまま編集し、返ってきたデータを読み解き、FIDO Alliance のメタデータから任意の認証器を調べられます。FEITIAN でのインターン中に作り、今も保守しています。',
        },
        {
          label: '仕組み',
          text: 'タブは4つです。簡易サインイン、リクエストを直接編集できる詳細モード、attestation オブジェクトや CBOR/CTAP 構造のコーデック、ルート証明書を検証するメタデータ検索です。サーバーは Yubico の python-fido2 に手を入れたもので、liboqs 経由で ML-DSA-44・-65・-87 を追加しています。訪問者ごとにセッション用の保存領域（ローカルディスクまたは Google Cloud Storage）を分け、14日間使われなければ削除します。',
        },
        {
          label: '難しかったところ',
          text: 'ライブラリが知らないアルゴリズムを、従来の経路を壊さずに教えること。新しい COSE 識別子、鍵の扱い、attestation の検証です。liboqs を同梱したまま Cloud Run のコールドスタートを短く保つために、起動時の準備を遅らせ、gunicorn を1ワーカー構成にしました。メタデータを人手なしで最新に保つため、日次の GitHub Action が再検証してコミットしています。',
        },
      ],
      image: {
        src: '/projects/webauthn-platform.png',
        alt: 'WebAuthn 開発者向けプラットフォームの詳細モード。リクエストの編集と応答の解読',
        width: 1600,
        height: 800,
      },
      stack: [
        'Python',
        'Flask',
        'JavaScript',
        'Docker',
        'Google Cloud',
        'GitHub Actions',
        'python-fido2',
        'liboqs',
        'Jinja',
        'pytest',
        'Vitest',
      ],
      status:
        'webauthnlab.tech で公開中。FeitianTech のもとで保守しています。サーバー側の約120のテストファイルに加え、フロントエンドと PQC のテストが CI で動きます。',
      links: [
        {
          label: 'リポジトリ',
          href: 'https://github.com/feitiantech/postquantum-webauthn-platform',
        },
        {
          label: '公開サイト',
          href: 'https://webauthnlab.tech',
        },
      ],
    },
    {
      id: 'work-authenticator',
      dates: '2025年10月 – 11月',
      title: 'FIDO2 ソフトウェア認証器',
      summary:
        'ソフトウェアで動く CTAP2 セキュリティキー。Linux が USB 機器として見せるため、ハードウェアなしで耐量子計算機暗号の資格情報を試せます。',
      primary: ['Rust', 'Linux'],
      quiet: {
        label: 'リポジトリ',
        href: 'https://github.com/feitiantech/fidosoftwareauthenticator',
      },
      sections: [
        {
          label: '概要',
          text: '鍵の実機を使わずに FIDO2 セキュリティキーとして振る舞う Rust のワークスペースです。ハードウェアが揃う前から、社内のエンジニアや取引先が ML-DSA の資格情報に対して開発できるようにするために作りました。自分のリポジトリから始まり、現在は FeitianTech のもとで保守されています。',
        },
        {
          label: '仕組み',
          text: '認証器の中核は Trussed フレームワークと littlefs2 上に CTAP2.1 を実装しています。資格情報の管理、PIN/UV プロトコル1と2、リセットに対応します。ランナーが Linux の uhid で仮想 USB HID デバイスを登録し CTAPHID を話すため、Chrome・Firefox・libfido2 からは普通のキーとして見えます。ES256 と ML-DSA-44・-65・-87 を提示し、attach・detach・status・reset・pin を備えた小さなコマンドラインツール（常駐も可能）が付きます。',
        },
        {
          label: '難しかったところ',
          text: '実際のブラウザが受け入れる水準まで、HID 転送と CTAP のステートマシンを正しくすること。従来の暗号のために作られた CTAP と COSE の構造に、耐量子計算機暗号の鍵を収めること。最初の版は C の FFI 経由で liboqs を呼んでいましたが、のちに純 Rust の fips204 に移し、秘密鍵は破棄時に消去しています。',
        },
      ],
      stack: ['Rust', 'Linux UHID', 'Trussed', 'littlefs2', 'CTAP2.1', 'fips204', 'liboqs', 'clap'],
      status:
        'Linux 上で動作し、開発者向けプラットフォームと合わせて使われています。CI では rustfmt・clippy・テストを実行しています。',
      links: [
        {
          label: 'リポジトリ',
          href: 'https://github.com/feitiantech/fidosoftwareauthenticator',
        },
      ],
    },
    {
      id: 'work-demo',
      dates: '2025年11月 – 12月',
      title: '認証デモプラットフォーム',
      summary: 'FEITIAN のパスワードレス認証と耐量子計算機暗号を試せる、顧客向けのサイトです。',
      primary: ['React', 'Python'],
      quiet: {
        label: 'demo.ftsafe.com',
        href: 'https://demo.ftsafe.com',
      },
      sections: [
        {
          label: '概要',
          text: 'FEITIAN の顧客と営業チームのためのデモです。開発者向けプラットフォームがエンジニア向けなのに対し、こちらは製品を検討している人向けです。仕様書を読まなくても、セキュリティキーを登録し、サインインし、耐量子計算機暗号の資格情報が動く様子を確かめられます。',
        },
        {
          label: '仕組み',
          text: '開発者向けプラットフォームと同じ認証の仕組みと ML-DSA 対応の上に、React のフロントエンドを載せています。生のリクエストや応答の代わりに、手順に沿った画面を用意しました。',
        },
      ],
      image: {
        src: '/projects/security-demo.png',
        alt: '認証デモプラットフォームのサインイン画面',
        width: 1600,
        height: 800,
      },
      stack: ['React', 'JavaScript', 'Python', 'Flask', 'WebAuthn / FIDO2', 'ML-DSA', 'liboqs'],
      status: 'demo.ftsafe.com で公開中。ソースコードは FEITIAN のもので、公開されていません。',
      links: [
        {
          label: '公開サイト',
          href: 'https://demo.ftsafe.com',
        },
      ],
    },
  ],
  other: [
    {
      id: 'work-travel',
      dates: '2025年1月 – 4月',
      title: 'Travel Advisor（旅行プランナー）',
      summary:
        '同級生3人との授業課題。パスポートとビザから行き先を選び、ホテル・レストラン・日程まで組み立てる旅行プランナーです。',
      primary: ['React', 'Tailwind CSS'],
      quiet: {
        label: '公開サイト',
        href: 'https://travel-advisor-project.vercel.app',
      },
      sections: [
        {
          label: '概要',
          text: 'CMPT 276 のグループ課題です。簡単な質問に答えるか行き先を選び、日付を決めると、ホテル・レストラン・観光地と日ごとの計画が出てきます。追加の質問に答えるチャットも付いています。',
        },
        {
          label: '担当した部分',
          text: 'React と Tailwind のフロントエンド、OpenAI に行き先を尋ねるパスポート・ビザの質問フォーム、日付の入力とその検証、チャット機能を担当しました。Tripadvisor API を仲介する Express のサービスはチームメイトが書きました。',
        },
        {
          label: '振り返り',
          text: 'OpenAI の API キーをブラウザから呼んでいます。今ならバックエンド側に置きます。',
        },
      ],
      image: {
        src: '/projects/travel-advisor.png',
        alt: 'Travel Advisor の結果画面。ホテル・レストラン・観光地の一覧',
        width: 1600,
        height: 800,
      },
      stack: [
        'React',
        'JavaScript',
        'Tailwind CSS',
        'Vite',
        'OpenAI API',
        'Tripadvisor API',
        'Cypress',
        'Vercel',
      ],
      status: '2025年4月に完成し、現在も公開されています。',
      links: [
        {
          label: '公開サイト',
          href: 'https://travel-advisor-project.vercel.app',
        },
        {
          label: 'リポジトリ',
          href: 'https://github.com/f4ncy1zach/travel-advisor',
        },
      ],
    },
    {
      id: 'work-site',
      dates: '2025年2月 – 現在',
      title: 'Personal Portfolio Website（個人ポートフォリオサイト）',
      summary:
        '英語と日本語の2言語で静的生成しているポートフォリオ。履歴書やカバーレターと共通の、小さなデザインシステムの上に作っています。',
      primary: ['Next.js', 'TypeScript'],
      quiet: {
        label: 'rainzhang.me',
        href: 'https://rainzhang.me',
      },
      sections: [
        {
          label: '概要',
          text: 'rainzhang.me で公開しているポートフォリオです。1ページを2言語で、専用のデザインシステムの上に作っています。書体は1つ、生成りの紙色、アクセント色は1色、枠線と影は使いません。履歴書とカバーレターも同じシステムなので、採用担当者が目にするものすべてが同じ手ざわりになります。',
        },
        {
          label: '仕組み',
          text: 'Next.js App Router が、型付けした1つのコンテンツモデルから両言語をビルド時に静的生成します。/en と /ja は構造が完全に同じで、異なるのは文章だけです。Tailwind は生の値ではなくデザインシステムのトークンを読み、Albert Sans は next/font で自前配信し、ミドルウェアが日本からの初回訪問者を日本語ルートへ送ります（本人が選び直した場合を除きます）。',
        },
        {
          label: '主な機能',
          text: '経歴と制作物の行はその場で開き、言語スイッチのピルは英語と日本語のあいだを滑り、最初の画面は CSS だけで立ち上がります。問い合わせフォームは honeypot とタイムアウトを備えて Formspree に送信し、メールアドレスはワンクリックでコピーできます。すべて JavaScript なしで描画され、動きはすべて prefers-reduced-motion に従います。',
        },
      ],
      stack: [
        'Next.js',
        'TypeScript',
        'React',
        'Tailwind CSS',
        'Playwright',
        'Vitest',
        'Vercel',
        'GitHub Actions',
      ],
      status:
        'rainzhang.me で公開中。Vitest のユニットテストと、Chromium・Firefox・Safari・モバイルを横断する Playwright の E2E テストを CI で実行しています。',
      links: [
        {
          label: '公開サイト',
          href: 'https://rainzhang.me',
        },
        {
          label: 'リポジトリ',
          href: 'https://github.com/rainzhang05/rainzhang05.github.io',
        },
      ],
    },
  ],
  education: {
    dates: '2023年9月 – 2027年4月',
    school: 'サイモンフレーザー大学',
    meta: 'コンピュータサイエンス学士 · バーナビー（BC州）· 2027年4月卒業見込み',
    detail: 'CGPA 3.43 / 4.33。2024年秋学期と2025年夏学期に Dean’s Honour Roll。',
  },
  skills: [
    {
      label: '言語',
      items: ['Python', 'TypeScript', 'JavaScript', 'Rust', 'C', 'C++', 'Java'],
    },
    {
      label: 'Web',
      items: ['React', 'Next.js', 'Node.js', 'Flask', 'Tailwind CSS', 'HTML', 'CSS', 'PostgreSQL'],
    },
    {
      label: '基盤・ツール',
      items: [
        'Docker',
        'Google Cloud',
        'Vercel',
        'GitHub Actions',
        'Git',
        'GitHub',
        'Linux',
        'WebAuthn / FIDO2',
        'Microsoft 365',
        'Microsoft Entra ID',
      ],
    },
  ],
  contact: {
    lead: '採用のご連絡でも、ここにある仕事の話でも、お気軽にご連絡ください。',
    copy: 'コピー',
    copied: 'メールアドレスをコピーしました',
    channels: {
      email: 'メール',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    },
    form: {
      name: 'お名前',
      email: 'メールアドレス',
      message: 'ご用件',
      submit: '送信',
      sending: '送信中',
      sentTitle: '送信しました。',
      sentBody: 'ありがとうございます。できるだけ早く返信します。',
      another: 'もう一度送る',
      required: '必須です',
      invalidEmail: 'メールアドレスの形式が違うようです。',
      failed: 'サーバーに接続できませんでした。直接メールをお送りください。',
    },
  },
  footer: {
    tagline: 'バンクーバー在住。フルスタックエンジニア、コンピュータサイエンス専攻の学生。',
    navigate: 'ページ内',
    elsewhere: 'その他',
    backToTop: 'ページ上部へ',
    credit: '設計・制作 Rain Zhang',
    links: [
      {
        id: 'github',
        label: 'GitHub',
        href: 'https://github.com/rainzhang05',
        external: true,
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/rainzhang05',
        external: true,
      },
      {
        id: 'email',
        label: 'rainzhang.zty@gmail.com',
        href: 'mailto:rainzhang.zty@gmail.com',
      },
      {
        id: 'resume',
        label: '履歴書（PDF）',
        href: '/rain-zhang-resume.pdf',
        external: true,
      },
    ],
  },
};
