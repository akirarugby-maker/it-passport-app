import type { GlossaryTerm } from '@/types';

export const glossaryTerms: GlossaryTerm[] = [
  // ストラテジ系
  { id: 'g-swot', term: 'SWOT分析', reading: 'スウォットぶんせき', domain: 'strategy', category: '経営戦略', definition: '企業の強み(Strengths)・弱み(Weaknesses)・機会(Opportunities)・脅威(Threats)を整理して戦略を立案するフレームワーク。', example: 'SO戦略：強みを活かして機会を捉える積極戦略', relatedTermIds: ['g-bsc'], relatedSlideId: 'slide-strategy-01', relatedQuestionIds: ['q-str-001'] },
  { id: 'g-bsc', term: 'バランスト・スコアカード（BSC）', reading: 'バランストスコアカード', domain: 'strategy', category: '経営戦略', definition: '財務・顧客・内部プロセス・学習と成長の4視点から企業戦略の達成度を評価・管理するフレームワーク。', relatedTermIds: ['g-swot', 'g-kpi'], relatedSlideId: 'slide-strategy-01', relatedQuestionIds: ['q-str-002'] },
  { id: 'g-core-competence', term: 'コアコンピタンス', reading: 'コアコンピタンス', domain: 'strategy', category: '経営戦略', definition: '競合他社には容易に真似できない、企業独自の中核的な能力・強み。顧客に特別な価値を提供できる源泉となる。', relatedSlideId: 'slide-strategy-01', relatedQuestionIds: ['q-str-003'] },
  { id: 'g-kpi', term: 'KPI', reading: 'ケーピーアイ', domain: 'strategy', category: '経営戦略', definition: 'Key Performance Indicator（重要業績評価指標）。目標達成度を測定するための定量的な指標。KGI（重要目標達成指標）を達成するための中間指標。', relatedTermIds: ['g-bsc'] },
  { id: 'g-copyright', term: '著作権', reading: 'ちょさくけん', domain: 'strategy', category: '法務', definition: '文章・プログラム・音楽・映像などの創作物に対して、創作した時点で自動的に発生する権利。登録は不要。保護期間は著作者の死後70年。', relatedSlideId: 'slide-strategy-02', relatedQuestionIds: ['q-str-007'] },
  { id: 'g-personal-info', term: '個人情報', reading: 'こじんじょうほう', domain: 'strategy', category: '法務', definition: '生存する個人に関する情報で、氏名・生年月日等により特定の個人を識別できるもの。個人情報保護法によって適切な取り扱いが義務付けられる。', relatedSlideId: 'slide-strategy-02', relatedQuestionIds: ['q-str-009'] },
  { id: 'g-oss', term: 'OSS（オープンソースソフトウェア）', reading: 'オープンソースソフトウェア', domain: 'strategy', category: '法務', definition: 'ソースコードが公開され、無償で使用・改変・配布が許可されたソフトウェア。GPL・MIT・Apache等のライセンスで配布される。', relatedSlideId: 'slide-strategy-02', relatedQuestionIds: ['q-str-010'] },
  { id: 'g-4p', term: '4P（マーケティングミックス）', reading: 'フォーピー', domain: 'strategy', category: 'マーケティング', definition: 'マーケティング戦略の4要素：Product（製品）・Price（価格）・Place（流通）・Promotion（販促）。これらを組み合わせてマーケティング戦略を立案する。', relatedSlideId: 'slide-strategy-03', relatedQuestionIds: ['q-str-011'] },
  { id: 'g-bep', term: '損益分岐点（BEP）', reading: 'そんえきぶんきてん', domain: 'strategy', category: '財務', definition: '売上高と総費用（固定費＋変動費）が等しくなり、利益がゼロになる売上高。計算式：固定費÷（1－変動費率）。この点を超えると黒字。', relatedSlideId: 'slide-strategy-03', relatedQuestionIds: ['q-str-012'] },
  { id: 'g-roi', term: 'ROI（投資対効果）', reading: 'アールオーアイ', domain: 'strategy', category: '財務', definition: 'Return On Investment。投資に対する利益の割合。計算式：（利益÷投資額）×100。値が高いほど投資効率が良い。', relatedSlideId: 'slide-strategy-03', relatedQuestionIds: ['q-str-013'] },

  // マネジメント系
  { id: 'g-wbs', term: 'WBS', reading: 'ダブリューびーエス', domain: 'management', category: 'プロジェクト管理', definition: 'Work Breakdown Structure。プロジェクトの作業全体を管理可能な単位に階層的に分解した構造図。スコープ管理の基本ツール。', relatedSlideId: 'slide-management-01', relatedQuestionIds: ['q-mng-001'] },
  { id: 'g-critical-path', term: 'クリティカルパス', reading: 'クリティカルパス', domain: 'management', category: 'プロジェクト管理', definition: 'プロジェクトのネットワーク図において開始から終了までの最長経路。この経路上の作業が遅延するとプロジェクト全体が遅延する。フロートはゼロ。', relatedSlideId: 'slide-management-01', relatedQuestionIds: ['q-mng-002'] },
  { id: 'g-evm', term: 'EVM（アーンドバリュー管理）', reading: 'アーンドバリューかんり', domain: 'management', category: 'プロジェクト管理', definition: '進捗をコストで定量測定する手法。PV（計画価値）・EV（出来高）・AC（実績コスト）で進捗とコストを管理。CPI=EV/AC、SPI=EV/PV。', relatedSlideId: 'slide-management-01', relatedQuestionIds: ['q-mng-003'] },
  { id: 'g-scrum', term: 'スクラム', reading: 'スクラム', domain: 'management', category: '開発手法', definition: 'アジャイル開発のフレームワーク。スプリント（1〜4週間）を反復単位として開発を進める。プロダクトオーナー・スクラムマスター・開発チームの3役割で構成。', relatedSlideId: 'slide-management-02', relatedQuestionIds: ['q-mng-005'] },
  { id: 'g-waterfall', term: 'ウォーターフォールモデル', reading: 'ウォーターフォールモデル', domain: 'management', category: '開発手法', definition: '要件定義→設計→実装→テスト→運用の順に段階的に進める開発手法。前工程への手戻りを原則として行わない。工程が明確だが変更対応が難しい。', relatedSlideId: 'slide-management-02', relatedQuestionIds: ['q-mng-006'] },
  { id: 'g-devops', term: 'DevOps', reading: 'デブオプス', domain: 'management', category: '開発手法', definition: 'DevelopmentとOperationsを組み合わせた言葉。開発チームと運用チームが連携して継続的なシステム改善を実現する文化・手法。CI/CDが中心的な実践。', relatedSlideId: 'slide-management-02', relatedQuestionIds: ['q-mng-007'] },
  { id: 'g-itil', term: 'ITIL', reading: 'アイティル', domain: 'management', category: 'サービス管理', definition: 'IT Infrastructure Library。ITサービスマネジメントのベストプラクティスをまとめたフレームワーク。インシデント管理・問題管理・変更管理などのプロセスを定義。', relatedSlideId: 'slide-management-03', relatedQuestionIds: ['q-mng-008'] },
  { id: 'g-sla', term: 'SLA', reading: 'エスエルエー', domain: 'management', category: 'サービス管理', definition: 'Service Level Agreement（サービスレベル合意書）。サービス提供者と利用者の間で、稼働率・応答時間・サポート範囲などのサービス品質水準を合意した契約文書。', relatedSlideId: 'slide-management-03', relatedQuestionIds: ['q-mng-009'] },
  { id: 'g-availability', term: '稼働率', reading: 'かどうりつ', domain: 'management', category: 'サービス管理', definition: 'システムが正常に動作している時間の割合。計算式：MTBF÷(MTBF+MTTR)。MTBFは平均故障間隔、MTTRは平均修復時間。', relatedSlideId: 'slide-management-03', relatedQuestionIds: ['q-mng-010'] },

  // テクノロジ系
  { id: 'g-cpu', term: 'CPU', reading: 'シーピーユー', domain: 'technology', category: 'ハードウェア', definition: 'Central Processing Unit（中央処理装置）。演算装置と制御装置から構成され、プログラムの命令を実行する装置。性能指標はクロック周波数・コア数・キャッシュ容量。', relatedSlideId: 'slide-technology-01', relatedQuestionIds: ['q-tech-001'] },
  { id: 'g-os', term: 'OS（オペレーティングシステム）', reading: 'オーエス', domain: 'technology', category: 'ソフトウェア', definition: 'コンピュータを動作させるための基本ソフトウェア。プロセス管理・メモリ管理・ファイル管理・デバイス管理・UIを提供。', relatedSlideId: 'slide-technology-01', relatedQuestionIds: ['q-tech-002'] },
  { id: 'g-raid', term: 'RAID', reading: 'レイド', domain: 'technology', category: 'ハードウェア', definition: 'Redundant Array of Independent Disks。複数のディスクを組み合わせる技術。RAID0=ストライピング（高速）、RAID1=ミラーリング（冗長）、RAID5=パリティ分散（バランス）。', relatedSlideId: 'slide-technology-01', relatedQuestionIds: ['q-tech-004'] },
  { id: 'g-iaas', term: 'IaaS', reading: 'イアース', domain: 'technology', category: 'クラウド', definition: 'Infrastructure as a Service。サーバー・ストレージ・ネットワークなどのインフラをインターネット経由で提供するクラウドサービス形態。例：AWS EC2、Azure VM。', relatedSlideId: 'slide-technology-01', relatedQuestionIds: ['q-tech-020'] },
  { id: 'g-tcpip', term: 'TCP/IP', reading: 'ティーシーピーアイピー', domain: 'technology', category: 'ネットワーク', definition: 'インターネットの基本プロトコル群。4階層（アプリ・トランスポート・インターネット・NIF）で構成。HTTPはアプリ層、TCPはトランスポート層、IPはインターネット層。', relatedSlideId: 'slide-technology-02', relatedQuestionIds: ['q-tech-007'] },
  { id: 'g-subnet', term: 'サブネットマスク', reading: 'サブネットマスク', domain: 'technology', category: 'ネットワーク', definition: 'IPアドレスのネットワーク部とホスト部を区別するための値。/24はCIDR表記で255.255.255.0に対応し、254台のホストが使用可能。', relatedSlideId: 'slide-technology-02', relatedQuestionIds: ['q-tech-005'] },
  { id: 'g-dns', term: 'DNS', reading: 'ディーエヌエス', domain: 'technology', category: 'ネットワーク', definition: 'Domain Name System。ドメイン名（www.example.com）をIPアドレス（192.168.1.1）に変換するシステム。ポート番号53を使用。', relatedSlideId: 'slide-technology-02', relatedQuestionIds: ['q-tech-006'] },
  { id: 'g-router', term: 'ルータ', reading: 'ルータ', domain: 'technology', category: 'ネットワーク', definition: 'IPアドレスを基に異なるネットワーク間でパケットを転送するネットワーク機器。OSI参照モデルのネットワーク層（Layer3）で動作。', relatedSlideId: 'slide-technology-02', relatedQuestionIds: ['q-tech-008'] },
  { id: 'g-vpn', term: 'VPN', reading: 'ブイピーエン', domain: 'technology', category: 'ネットワーク', definition: 'Virtual Private Network。公衆回線をトンネリングと暗号化で仮想的な専用回線として利用する技術。テレワークや拠点間接続に使用。', relatedSlideId: 'slide-technology-02', relatedQuestionIds: ['q-tech-018'] },
  { id: 'g-phishing', term: 'フィッシング', reading: 'フィッシング', domain: 'technology', category: 'セキュリティ', definition: '正規サービスを装ったメール・偽サイトでIDやパスワード・クレジットカード情報を騙し取るソーシャルエンジニアリング攻撃。', relatedSlideId: 'slide-technology-03', relatedQuestionIds: ['q-tech-009'] },
  { id: 'g-firewall', term: 'ファイアウォール', reading: 'ファイアウォール', domain: 'technology', category: 'セキュリティ', definition: '設定したルールに基づき、許可されていない通信を遮断してネットワークを保護するセキュリティ機器・ソフトウェア。', relatedSlideId: 'slide-technology-03', relatedQuestionIds: ['q-tech-010'] },
  { id: 'g-pki', term: 'PKI（公開鍵基盤）', reading: 'ピーケーアイ', domain: 'technology', category: 'セキュリティ', definition: 'Public Key Infrastructure。デジタル証明書を使って公開鍵の正当性を保証する仕組み。認証局（CA）がデジタル証明書を発行。', relatedSlideId: 'slide-technology-03', relatedQuestionIds: ['q-tech-011'] },
  { id: 'g-sql-injection', term: 'SQLインジェクション', reading: 'SQLインジェクション', domain: 'technology', category: 'セキュリティ', definition: 'Webアプリの入力フィールドにSQL文を埋め込んでデータベースを不正操作する攻撃。対策はプリペアドステートメントや入力値のサニタイズ。', relatedSlideId: 'slide-technology-03', relatedQuestionIds: ['q-tech-012'] },
  { id: 'g-mfa', term: '多要素認証（MFA）', reading: 'たようそにんしょう', domain: 'technology', category: 'セキュリティ', definition: '知識要素（パスワード）・所持要素（スマートフォン）・生体要素（指紋・顔）のうち2つ以上を組み合わせて認証する方式。', relatedSlideId: 'slide-technology-03', relatedQuestionIds: ['q-tech-013'] },
  { id: 'g-aes', term: 'AES', reading: 'エーイーエス', domain: 'technology', category: 'セキュリティ', definition: 'Advanced Encryption Standard。共通鍵暗号方式の標準アルゴリズム。DESの後継として採用。128/192/256ビットの鍵長をサポート。', relatedSlideId: 'slide-technology-03', relatedQuestionIds: ['q-tech-019'] },
  { id: 'g-normalization', term: '正規化', reading: 'せいきか', domain: 'technology', category: 'データベース', definition: 'データベース設計においてデータの冗長性を排除し、更新時の異常（アノマリー）を防ぐための設計手法。第1〜第3正規形が基本。', relatedSlideId: 'slide-technology-04', relatedQuestionIds: ['q-tech-014'] },
  { id: 'g-acid', term: 'ACID特性', reading: 'エーシッドとくせい', domain: 'technology', category: 'データベース', definition: 'トランザクションの4特性：Atomicity（原子性）・Consistency（一貫性）・Isolation（独立性）・Durability（永続性）。', relatedSlideId: 'slide-technology-04', relatedQuestionIds: ['q-tech-015'] },
  { id: 'g-binary-search', term: '二分探索', reading: 'にぶんたんさく', domain: 'technology', category: 'アルゴリズム', definition: 'ソート済みデータを対象に、探索範囲を半分ずつ絞り込んで目的の値を探す探索アルゴリズム。計算量O(log n)。事前ソートが必要。', relatedSlideId: 'slide-technology-04', relatedQuestionIds: ['q-tech-016'] },
  { id: 'g-queue', term: 'キュー（Queue）', reading: 'キュー', domain: 'technology', category: 'アルゴリズム', definition: 'FIFO（First In First Out：先入れ先出し）でデータを管理するデータ構造。プリントスプール・メッセージキューに活用。スタックはLIFO（後入れ先出し）。', relatedSlideId: 'slide-technology-04', relatedQuestionIds: ['q-tech-017'] },
];

export const getTermById = (id: string) => glossaryTerms.find((t) => t.id === id);
export const getTermsByDomain = (domain: string) => glossaryTerms.filter((t) => t.domain === domain);
export const getTermsByIds = (ids: string[]) => glossaryTerms.filter((t) => ids.includes(t.id));
export const searchTerms = (query: string) => {
  const q = query.toLowerCase();
  return glossaryTerms.filter(
    (t) =>
      t.term.toLowerCase().includes(q) ||
      (t.reading?.toLowerCase().includes(q) ?? false) ||
      t.definition.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
  );
};
