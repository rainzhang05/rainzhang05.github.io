import type { Copy } from "@/lib/i18n/types";

export const JA_COPY: Copy = {
  nav: {
    sectionsLabel: "セクション",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
    menuTitle: "メニュー",
  },
  theme: {
    toLight: "ライトモードに切り替える",
    toDark: "ダークモードに切り替える",
  },
  language: {
    groupLabel: "表示言語",
  },
  preloader: {
    loading: "読み込み中",
  },
  hero: {
    photoAlt: "Rain Zhang のプロフィール写真",
    tagField: "コンピュータサイエンス · SFU",
    tagLocation: "カナダ・バンクーバー",
    tagRole: "フルスタックエンジニア",
    intro: {
      parts: [
        { strong: "Simon Fraser University でコンピュータサイエンスを学んでいます" },
        "。カナダ・バンクーバーを拠点に、Python・React・TypeScript を用いたフルスタックの Web アプリケーション開発に取り組んでいます。現在は、ソフトウェアエンジニアのインターンシップおよび新卒採用の機会を探しています。",
      ],
    },
    resume: "レジュメ",
    getInTouch: "お問い合わせ",
    emailCopied: "メールアドレスをコピーしました",
  },
  about: {
    title: "自己紹介",
    kicker: "これまでの経歴と、開発への取り組み方について。",
    paragraphs: [
      {
        parts: [
          { strong: "Simon Fraser University でコンピュータサイエンスを学ぶ学部生です" },
          "。Python・React・TypeScript といったモダンな技術スタックを使い、フルスタックでシステムを開発しています。",
        ],
      },
      {
        parts: [
          "新しいフレームワークを短期間で習得し、API を組み合わせながら、アイデアを実際に動くプロダクトへと形にしてきました。開発では、",
          { strong: "拡張性のあるバックエンド設計、レスポンシブな UI、保守しやすいコード" },
          "を重視しています。",
        ],
      },
      {
        parts: [
          "特に関心があるのは、フルスタックのソフトウェアエンジニアリングと、技術的なプロジェクトを実際に前へ進めることです。変化の速い環境のなかで、拡張性のある機能を自分の担当として引き受け、安定して動くものを届けたいと考えています。",
        ],
      },
    ],
  },
  experience: {
    title: "職務経験",
    kicker: "担当した業務と、開発したシステム。",
    scope: "担当範囲",
    outcomes: "主な成果",
    technologies: "使用技術",
    related: "関連プロジェクト",
  },
  tagLabels: {
    Internship: "インターン",
    Academic: "大学の課題",
    Personal: "個人開発",
  },
  projects: {
    title: "主なプロジェクト",
    kicker: "実際に運用されているシステムと、個人で取り組んだプロジェクト。",
    previewAlt: (title) => `${title} のプレビュー`,
    live: "公開サイト",
    code: "コード",
    readMore: "詳細を見る",
    collapse: "閉じる",
    role: "担当",
    tools: "使用ツール",
    impact: "担当した内容と成果",
    technologies: "使用技術",
  },
  skills: {
    title: "技術スタック",
    kicker: "普段使用している言語・フレームワーク・ツール。",
  },
  education: {
    title: "学歴",
    kicker: "これまでに在籍した学校。",
  },
  contact: {
    title: "お気軽にご連絡ください。",
    intro:
      "インターンシップやプロジェクトのご相談はもちろん、フルスタック開発やポスト量子暗号を使った認証について話すだけでも歓迎です。",
    formLabel: "お問い合わせフォーム",
    nameLabel: "お名前",
    emailLabel: "メールアドレス",
    messageLabel: "メッセージ",
    errors: {
      required: "入力してください",
      invalidEmail: "メールアドレスの形式が正しくありません",
    },
    submit: "送信する",
    sending: "送信中…",
    sentTitle: "送信しました。",
    sentBody: "ありがとうございます。できるだけ早くご返信します。",
    sendFailed: "送信に失敗しました。お手数ですが、直接メールでご連絡ください。",
    emailCopied: "メールアドレスをコピーしました",
    copiedBadge: "コピー完了",
  },
  footer: {
    tagline:
      "モダンな技術スタックで、実際に使われるシステムを設計から実装まで一貫して開発しています。",
    navigateLabel: "ページ内リンク",
    // Deliberately not 連絡先 — the footer nav column already uses that label,
    // and this column is GitHub / LinkedIn / メール / レジュメ.
    contactLabel: "リンク",
    emailCopied: "メールアドレスをコピーしました",
    copiedBadge: "コピー完了",
    credit: "デザイン・開発:Rain Zhang",
    backToTop: "ページ上部へ",
  },
  metadata: {
    title: "Rain Zhang — ポートフォリオ",
    description:
      "Simon Fraser University でコンピュータサイエンスを学ぶ学生。Python・React・TypeScript を使い、フルスタックでシステムを開発しています。ソフトウェアエンジニアのインターンシップ・新卒採用の機会を探しています。",
  },
};
