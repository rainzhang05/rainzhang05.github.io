import type { Copy } from '../types';

/**
 * Japanese copy for /ja. Same facts and structure as en.ts.
 * Translated from the English; worth a native read before launch.
 */
export const ja: Copy = {
  locale: 'ja',
  meta: {
    title: 'Rain Zhang — フルスタックデベロッパー（バンクーバー）',
    description:
      'サイモンフレーザー大学でコンピュータサイエンスを学ぶ4年生です。主に Python・TypeScript・Rust で、Web アプリケーションと開発者向けツールを開発・保守しています。',
    ogAlt:
      'Rain Zhang のポートフォリオカード。バンクーバー（BC州）のソフトウェアエンジニアで、Python・TypeScript・Rust・Next.js・React を使って Web システムを作っています。',
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
      href: '/ja/resume',
    },
  ],
  intro: {
    eyebrow: 'フルスタックデベロッパー · サイモンフレーザー大学 · バンクーバー、BC州、カナダ',
    heading: 'はじめまして、\nRain Zhang と申します。',
    body: 'サイモンフレーザー大学でコンピュータサイエンスを学ぶ4年生です。この1年は、セキュリティキーの会社と不動産管理会社でソフトウェアを開発し、保守してきました。主に Python・TypeScript・Rust を使っています。',
    resume: '履歴書',
    copyEmail: 'メールアドレスをコピー',
    github: 'GitHub',
    linkedin: 'LinkedIn',
  },
  sections: {
    intro: '自己紹介',
    experience: '経歴',
    work: '主な制作物',
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
    skipToContent: '本文へスキップ',
    sectionNav: 'このページの内容',
    theme: { group: 'テーマ', system: 'システム', light: 'ライト', dark: 'ダーク' },
    navigation: {
      primary: 'メインナビゲーション',
      menu: 'メニュー',
      closeMenu: 'メニューを閉じる',
    },
  },
  experiences: [
    {
      id: 'exp-mnt',
      dates: '2026年8月 – 現在',
      role: 'ソフトウェア・IT システム担当',
      org: 'MNT Realty',
      orgLine: 'MNT Realty · バンクーバー、BC州、カナダ',
      mark: {
        src: '/logos/mnt-realty.svg',
        width: 28,
        height: 28,
        scale: 1.45,
      },
      summary:
        '不動産・ストラータ管理会社で、ソフトウェアと IT を担当しています。社員と話し合って事務所に必要なものを把握し、社員が使う社内システムを開発・保守しています。システムは会社の Microsoft 365 のアカウントやデータと連携しています。',
      groups: [
        {
          label: '担当した仕事',
          items: [
            'MNT Realty のプラットフォームを計画し、一から作り直しました。公開ウェブサイト・居住者向けオーナーポータル・社内向け管理コンソールの3つのサイトを、1つのアプリケーションにまとめています。',
            '社内プラットフォーム「MNT Control Center」を Next.js・Node.js・PostgreSQL で設計・開発し、それまで別々に使っていたツールを置き換えました。',
            'Microsoft Entra ID・Graph API・OAuth 2.0 を使い、組織アカウントでのサインインと権限管理を整えました。',
            '社員が最も時間を取られていた繰り返しの事務作業を自動化しました。受信メールの振り分け、所有者情報の照会、社内文書をもとに社員の質問へ答える社内アシスタントです。',
          ],
        },
        {
          label: '運用',
          items: [
            'ホスティング、デプロイ、ドメインと DNS、リリースの手順を、Vercel と GitHub Actions で管理しています。',
            'ほかの人が引き継げるように、テストとドキュメントを書いています。',
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
      related: ['work-mnt-platform'],
    },
    {
      id: 'exp-feitian',
      dates: '2025年9月 – 12月',
      role: 'フルスタックエンジニア（インターン）',
      org: '飛天ジャパン',
      orgLine: '飛天ジャパン · 国際部 · 北京、中国',
      mark: {
        src: '/logos/feitian.png',
        width: 1748,
        height: 428,
      },
      summary:
        '耐量子計算機暗号（PQC）対応の FIDO2 に向けて、3つのシステムを計画・開発し、運用しました。公開用の WebAuthn 開発者向けプラットフォーム、Rust によるソフトウェアセキュリティキー、顧客向けデモサイトです。',
      groups: [
        {
          label: '担当した仕事',
          items: [
            'チームが使っていた外部ツールでは PQC の資格情報を表示できなかったため、社内初の WebAuthn/FIDO2 開発者向けプラットフォームを開発しました。登録・サインイン・確認・デバッグを一か所で行えます。',
            'Rust で CTAP2 認証器を実装し、Linux 上で仮想 USB セキュリティキーとして見えるようにしました。ハードウェアが完成する前から、ブラウザや libfido2 で ML-DSA の資格情報を試せます。',
            'サポート窓口を通さずにパスワードレス認証とセキュリティキーを試せるデモサイトを作りました。',
            '社内のハードウェアエンジニアやセキュリティエンジニアと連携し、実機とその返すデータに合う形に仕上げました。',
          ],
        },
        {
          label: '運用',
          items: [
            'Linux サーバーと Google Cloud Run 上に Docker でデプロイし、テスト・ビルド・FIDO メタデータの日次更新は GitHub Actions で実行しています。',
            'インターンは2025年12月に終わりましたが、3つとも今も保守しています。',
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
      related: ['work-authenticator', 'work-webauthn', 'work-demo'],
    },
  ],
  projects: [
    {
      id: 'work-mnt-platform',
      dates: '2026年8月 – 現在',
      title: 'MNT Realty Platform（不動産管理プラットフォーム）',
      summary:
        '不動産管理会社の3つのサイトを、1つの Next.js アプリケーションで提供しています。公開ウェブサイト、居住者向けのオーナーポータル、スタッフ向けの管理コンソールです。',
      primary: ['Next.js', 'TypeScript', 'React'],
      sections: [
        {
          label: '概要',
          text: 'MNT Realty のウェブサイトとオンラインサービスです。見込み客は公開ウェブサイトを見ます。同社が管理するストラータの居住者は、オーナーポータルにサインインしてお知らせを読み、共用設備を予約し、書類をダウンロードします。スタッフはそのすべてを管理コンソールから管理します。',
        },
        {
          label: '仕組み',
          text: '3つのサイトは1つのビルドから作られ、それぞれ別のサブドメインで動いています。プロキシがサブドメインごとにページを振り分け（admin はコンソールへ、owners はポータルへ）、公開サイトではそれらのパスに not-found を返します。各サイトは独自のレイアウトと、ホスト限定のセッション Cookie を持ちます。公開ページは事前生成し、コンソールとポータルはリクエストごとに描画します。読み書きはすべて1つのデータストアのインターフェースを通るため、スタッフが変更した内容はすぐに居住者に反映されます。データストアは、画面を変えずに設計済みの PostgreSQL スキーマへ切り替えられます。',
        },
        {
          label: '技術的な課題',
          text: 'アクセス権限は1つの表で定義し、ナビゲーション、ページのガード、ファイル配信がすべて同じ表を読みます。権限外のセクションは「禁止」ではなく「存在しない」として返すので、ポータルが他の権限で見られる内容を明かすことはありません。ストラータごとにデータを分けており、あるストラータを開いている間は、別のストラータの情報にはアクセスできません。会社情報、ストラータ書類の手数料表、共用設備の予約枠のテンプレートといった MNT の業務情報は、コードに書き込まず、管理者が設定画面で編集できるバージョン管理付きのデータとして持っています。保存したどの版にも戻せます。',
        },
      ],
      image: {
        src: '/projects/mnt-platform.webp',
        alt: 'MNT Realty のホーム画面。上部に「Owner portal」と「Request a proposal」のボタン、その下にバンクーバーの街並みの写真',
        width: 1600,
        height: 800,
      },
      stack: [
        'Next.js',
        'React',
        'TypeScript',
        'Tailwind CSS',
        'Node.js',
        'PostgreSQL',
        'Vitest',
        'Vercel',
        'GitHub Actions',
      ],
      status:
        '3つのサイトはすべて構築・デプロイ済みです。次の段階は、クラウドでのデータ保存とバックエンドのワークフローです。ソースコードは MNT Realty のもので、公開されていません。',
      links: [
        {
          label: 'mntrealty.vercel.app',
          href: 'https://mntrealty.vercel.app',
        },
      ],
    },
    {
      id: 'work-authenticator',
      dates: '2025年10月 – 現在',
      title: 'FIDO2 ソフトウェア認証器',
      summary:
        'ソフトウェアで動く CTAP2 セキュリティキー。Linux が USB 機器として見せるため、ハードウェアなしで耐量子計算機暗号の資格情報を試せます。',
      primary: ['Rust', 'Linux'],
      sections: [
        {
          label: '概要',
          text: 'ソフトウェアで FIDO2 セキュリティキーとして動く Rust のワークスペースです。社内のエンジニアや取引先が、ハードウェアが揃う前から ML-DSA の資格情報を使うソフトウェアを開発・テストできるように作りました。自分のリポジトリから始まり、現在は FeitianTech の GitHub に移って、引き続き自分が保守しています。',
        },
        {
          label: '仕組み',
          text: '認証器の中核は、Trussed フレームワークと littlefs2 のストレージの上に CTAP2.1 を実装しています。資格情報の管理、PIN/UV プロトコル1と2、リセットに対応しています。ランナーが Linux の uhid で仮想 USB HID デバイスを作り、CTAPHID プロトコルでやり取りするため、Chrome・Firefox・libfido2 からは普通のセキュリティキーとして扱われます。ES256 と ML-DSA-44・-65・-87 に対応し、attach・detach・status・reset・pin を備えた小さなコマンドラインツール（バックグラウンドでの常駐も可能）が付いています。',
        },
        {
          label: '技術的な課題',
          text: 'ブラウザはプロトコルに厳密に従う機器しか受け付けないため、Chrome や Firefox で使えるようになるまで、HID 転送と CTAP のステートマシンを正確に作る必要がありました。CTAP と COSE の構造は従来の鍵を前提に作られていて、耐量子計算機暗号の鍵はそのままでは収まりません。最初の版は C の FFI 経由で liboqs を呼んでいましたが、のちに純 Rust の fips204 クレートに移し、秘密鍵は破棄時にゼロで消去しています。',
        },
      ],
      stack: ['Rust', 'Linux UHID', 'Trussed', 'littlefs2', 'CTAP2.1', 'fips204', 'liboqs', 'clap'],
      status:
        'Linux 上で動作し、開発者向けプラットフォームと合わせて使われています。現在も開発を続けており、CI では rustfmt・clippy・テストを実行しています。',
      links: [
        {
          label: 'リポジトリ',
          href: 'https://github.com/feitiantech/fidosoftwareauthenticator',
        },
      ],
    },
    {
      id: 'work-webauthn',
      dates: '2025年9月 – 現在',
      title: 'WebAuthn 開発者向けプラットフォーム',
      summary:
        'FIDO2/WebAuthn の動作を試すための公開ツール。耐量子計算機暗号 ML-DSA の資格情報にも対応しています。',
      primary: ['Python', 'Flask', 'JavaScript'],
      sections: [
        {
          label: '概要',
          text: 'FIDO2 を使って開発する人のための Flask アプリケーションです。チームが使っていた外部ツールでは PQC の資格情報を表示できなかったため、自分で作りました。実機または仮想の認証器で登録・サインインし、WebAuthn のリクエストを JSON のまま編集し、返ってきたデータを読み解き、FIDO Alliance のメタデータから任意の認証器を調べられます。飛天ジャパンでのインターン中に作り始め、今も保守しています。',
        },
        {
          label: '仕組み',
          text: 'タブは4つです。簡易サインイン、リクエストを直接編集できる詳細モード、attestation オブジェクトや CBOR/CTAP 構造のコーデック、ルート証明書を検証するメタデータ検索です。サーバーは Yubico の python-fido2 ライブラリに手を入れたものを使い、liboqs 経由で ML-DSA-44・-65・-87 を追加しています。訪問者ごとにセッション用の保存領域（ローカルディスクまたは Google Cloud Storage）を分け、14日間使われなかった領域は削除します。',
        },
        {
          label: '技術的な課題',
          text: 'python-fido2 には耐量子計算機暗号の対応がなかったため、従来のアルゴリズムが動くようにしたまま、ML-DSA の COSE 識別子・鍵の扱い・attestation の検証を追加しました。liboqs をコンテナイメージに同梱すると Cloud Run の起動が遅くなるので、起動時の準備を必要になるまで遅らせ、gunicorn を1ワーカー構成にしました。FIDO のメタデータは時間がたつと古くなるため、日次の GitHub Action がスナップショットを再検証し、自動でコミットします。',
        },
      ],
      image: {
        src: '/projects/webauthn-platform.webp',
        alt: 'WebAuthn 開発者向けプラットフォームの「Advanced Authentication」タブ。登録の設定項目と、credential 作成オプションを編集する JSON エディター',
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
        'webauthnlab.tech で公開中で、FeitianTech の GitHub で保守しています。CI では、サーバー側の約120のテストファイルに加え、フロントエンドと PQC のテストを実行しています。',
      links: [
        {
          label: 'webauthnlab.tech',
          href: 'https://webauthnlab.tech',
        },
        {
          label: 'リポジトリ',
          href: 'https://github.com/feitiantech/postquantum-webauthn-platform',
        },
      ],
    },
    {
      id: 'work-demo',
      dates: '2025年11月 – 12月',
      title: '認証デモプラットフォーム',
      summary:
        '飛天ジャパンの顧客が、パスワードレス認証と耐量子計算機暗号によるサインインを試せるデモサイトです。',
      primary: ['React', 'Python'],
      sections: [
        {
          label: '概要',
          text: '飛天ジャパンの顧客と営業チームのためのデモです。開発者向けプラットフォームはエンジニア向け、こちらは製品を検討している人向けです。仕様書を読まなくても、セキュリティキーを登録し、サインインし、耐量子計算機暗号の資格情報が動く様子を確かめられます。',
        },
        {
          label: '仕組み',
          text: '開発者向けプラットフォームと同じ認証サービスと ML-DSA 対応の上に、React のフロントエンドを載せています。生のリクエストや応答の代わりに、手順に沿った画面を用意しました。',
        },
      ],
      image: {
        src: '/projects/security-demo.webp',
        alt: '認証デモプラットフォームの「Info」ページ。パスワードの項目と「Add Security Key」ボタン',
        width: 1600,
        height: 800,
      },
      stack: ['React', 'JavaScript', 'Python', 'Flask', 'WebAuthn / FIDO2', 'ML-DSA', 'liboqs'],
      status: 'demo.ftsafe.com で公開中。ソースコードは飛天ジャパンのもので、公開されていません。',
      links: [
        {
          label: 'demo.ftsafe.com',
          href: 'https://demo.ftsafe.com',
        },
      ],
    },
    {
      id: 'work-site',
      dates: '2025年2月 – 現在',
      title: '個人ポートフォリオサイト',
      summary:
        '英語と日本語で静的生成しているポートフォリオサイトです。履歴書やカバーレターと、小さなデザインシステムを共有しています。',
      primary: ['Next.js', 'TypeScript'],
      sections: [
        {
          label: '概要',
          text: 'rainzhang.me で公開しているポートフォリオです。ホームページと履歴書ページがあり、どちらも英語と日本語で読めます。専用の小さなデザインシステムを使っていて、書体は1つ、アクセント色は1色、枠線と影は使わず、ライトとダークの2つのテーマがあります。履歴書とカバーレターも同じデザインなので、3つがひとそろいに見えます。',
        },
        {
          label: '仕組み',
          text: 'Next.js App Router が、型付けした1つのコンテンツモデルから両言語をビルド時に静的生成します。英語版と日本語版のホームページは構造が同じで、異なるのは文章だけです。Tailwind は生の値ではなくデザインシステムのトークンを読み、Albert Sans は next/font で自前配信しています。ミドルウェアが日本からの初めての訪問者に日本語版を表示し、その後は最後に読んだ言語を覚えています。',
        },
        {
          label: '主な機能',
          text: '経歴と制作物の行はその場で開きます。ほかに、言語スイッチ、テーマの切り替え（システム・ライト・ダーク）、CSS だけで作った短い表示アニメーション、honeypot とタイムアウトを備えて Formspree に送信する問い合わせフォーム、メールアドレスをコピーするボタンがあります。JavaScript がなくてもページは表示され、リンクも使えます。アニメーションはすべて、閲覧者の「動きを減らす」設定に従います。',
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
        'rainzhang.me で公開中です。CI では、Vitest のユニットテストと、Chromium・Firefox・WebKit と iPhone のエミュレーションで Playwright の E2E テストを実行しています。',
      links: [
        {
          label: 'rainzhang.me',
          href: 'https://rainzhang.me',
        },
        {
          label: 'リポジトリ',
          href: 'https://github.com/rainzhang05/rainzhang05.github.io',
        },
      ],
    },
    {
      id: 'work-travel',
      dates: '2025年1月 – 4月',
      title: 'Travel Advisor（旅行プランナー）',
      summary:
        '同級生3人と作った授業課題です。パスポートとビザをもとに行き先を提案し、ホテル・レストラン・日程まで組み立てる旅行プランナーです。',
      primary: ['React', 'Tailwind CSS'],
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
          text: 'OpenAI の API をブラウザから直接呼び出しています。今作り直すなら、その呼び出しをバックエンド側に移します。',
        },
      ],
      image: {
        src: '/projects/travel-advisor.webp',
        alt: 'Travel Advisor のスタート画面。短い紹介文と「Start Your Journey」ボタン',
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
          label: 'travel-advisor-project.vercel.app',
          href: 'https://travel-advisor-project.vercel.app',
        },
        {
          label: 'リポジトリ',
          href: 'https://github.com/f4ncy1zach/travel-advisor',
        },
      ],
    },
  ],
  education: {
    dates: '2023年9月 – 2027年12月',
    school: 'サイモンフレーザー大学',
    mark: {
      src: '/logos/sfu.png',
      width: 2560,
      height: 1280,
    },
    meta: 'コンピュータサイエンス学士 · バンクーバー、BC州、カナダ · 2027年12月卒業見込み',
    detail: 'CGPA 3.44 / 4.33。2024年秋学期と2025年夏学期に Dean’s Honour Roll。',
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
    lead: '採用のご相談や、ここで紹介した仕事についてのお話など、ご連絡をいただけるとうれしいです。',
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
    tagline: 'フルスタックデベロッパー。バンクーバーでコンピュータサイエンスを学んでいます。',
    navigate: 'ページ内',
    elsewhere: 'その他',
    backToTop: 'ページ上部へ',
    credit: 'デザイン・開発：Rain Zhang',
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
        id: 'resume',
        label: '履歴書',
        href: '/ja/resume',
      },
    ],
  },
};
