import type { Slide } from '@/types';
import { slidesExtra } from './slides_extra';

const baseSlides: Slide[] = [
  // ========== ストラテジ系 ==========
  {
    id: 'slide-strategy-01',
    domain: 'strategy',
    category: '経営戦略・企業活動',
    title: '経営戦略・企業活動',
    order: 1,
    quizQuestionIds: ['q-str-001', 'q-str-002', 'q-str-003', 'q-str-004', 'q-str-005'],
    sections: [
      {
        id: 'slide-strategy-01-s1',
        title: '経営戦略の基本',
        content: `経営戦略とは、企業が目標を達成するための基本的な方針・計画です。外部環境と内部資源を分析し、競争優位を確立するための意思決定プロセスです。

ITパスポート試験では、経営に関するフレームワークや分析手法の理解が問われます。`,
        keyPoints: [
          '経営戦略は企業の方向性を決める最重要意思決定',
          '外部環境分析（PEST、ファイブフォース）と内部分析（SWOT）が基本',
          'コアコンピタンスを軸に競争優位を確立する',
        ],
        keywords: ['経営戦略', 'コアコンピタンス', '競争優位'],
        relatedQuestionIds: ['q-str-001', 'q-str-003'],
        relatedGlossaryIds: ['g-swot', 'g-core-competence'],
      },
      {
        id: 'slide-strategy-01-s2',
        title: 'SWOT分析',
        content: `SWOT分析は企業の現状を「強み（Strengths）」「弱み（Weaknesses）」「機会（Opportunities）」「脅威（Threats）」の4つの視点で分析するフレームワークです。

■ クロスSWOT分析（戦略オプション）
・SO戦略：強み×機会 → 積極的拡大戦略
・WO戦略：弱み×機会 → 弱点克服戦略
・ST戦略：強み×脅威 → 差別化戦略
・WT戦略：弱み×脅威 → 撤退・縮小戦略`,
        keyPoints: [
          'S(強み)・W(弱み)は内部環境、O(機会)・T(脅威)は外部環境',
          'クロスSWOTで具体的な戦略オプションを導く',
          'SO戦略が最も積極的・成長志向の戦略',
        ],
        keywords: ['SWOT分析', 'SO戦略', 'クロスSWOT'],
        relatedQuestionIds: ['q-str-001'],
        relatedGlossaryIds: ['g-swot'],
      },
      {
        id: 'slide-strategy-01-s3',
        title: 'PPMとBSC',
        content: `■ PPM（プロダクト・ポートフォリオ・マネジメント）
市場成長率と相対的市場シェアで事業・製品を分類します。
・花形（スター）：高成長率×高シェア → 投資継続
・金のなる木：低成長率×高シェア → 収益確保
・問題児：高成長率×低シェア → 選択投資
・負け犬：低成長率×低シェア → 撤退検討

■ BSC（バランスト・スコアカード）
財務・顧客・内部プロセス・学習と成長の4視点でKPIを設定し、戦略の達成度を管理します。`,
        keyPoints: [
          'PPMの4象限：花形・金のなる木・問題児・負け犬',
          'BSCは4視点で戦略を評価・管理するフレームワーク',
          'BSCのKGI（重要目標達成指標）とKPI（重要業績評価指標）を区別する',
        ],
        keywords: ['PPM', 'BSC', 'バランスト・スコアカード', 'KPI'],
        relatedQuestionIds: ['q-str-002', 'q-str-004'],
        relatedGlossaryIds: ['g-bsc'],
      },
    ],
  },
  {
    id: 'slide-strategy-02',
    domain: 'strategy',
    category: '法務・知的財産権',
    title: '法務・知的財産権',
    order: 2,
    quizQuestionIds: ['q-str-007', 'q-str-008', 'q-str-009', 'q-str-010'],
    sections: [
      {
        id: 'slide-strategy-02-s1',
        title: '知的財産権の種類',
        content: `知的財産権は人の知的創造活動の成果に与えられる権利です。

■ 産業財産権（特許庁への登録が必要）
・特許権：発明（技術的アイデア）を保護。保護期間：出願から20年
・実用新案権：物品の形状・構造の考案を保護。保護期間：出願から10年
・意匠権：物品のデザインを保護。保護期間：登録から25年
・商標権：ブランド名・ロゴを保護。保護期間：登録から10年（更新可能）

■ 著作権（登録不要、創作と同時に発生）
・著作権：文章・プログラム・音楽・映像など創作物を保護
・保護期間：著作者の死後70年`,
        keyPoints: [
          '産業財産権は登録が必要、著作権は登録不要',
          'プログラム（ソースコード）は著作権で保護',
          '特許権の保護期間は出願から20年',
        ],
        keywords: ['著作権', '特許権', '知的財産権', '産業財産権'],
        relatedQuestionIds: ['q-str-007', 'q-str-008'],
        relatedGlossaryIds: ['g-copyright'],
      },
      {
        id: 'slide-strategy-02-s2',
        title: '個人情報保護法とセキュリティ関連法規',
        content: `■ 個人情報保護法
生存する個人に関する情報で、特定の個人を識別できる情報（氏名、生年月日等）を個人情報と定義。個人情報取扱事業者は適切な取り扱いと保護が義務付けられます。

■ 不正競争防止法
営業秘密（秘密管理性・有用性・非公知性の3要件を満たす情報）を保護します。

■ 労働者派遣法
IT業務における偽装請負を規制。

■ 電子契約法
電子契約の法的有効性を認める法律。電子署名が紙の署名と同等の効力を持ちます。`,
        keyPoints: [
          '個人情報は「生存する個人」を識別できる情報',
          '営業秘密の3要件：秘密管理性・有用性・非公知性',
          '電子署名は紙の署名と同等の法的効力',
        ],
        keywords: ['個人情報保護法', '個人情報', '営業秘密', '電子署名'],
        relatedQuestionIds: ['q-str-009'],
        relatedGlossaryIds: ['g-personal-info'],
      },
      {
        id: 'slide-strategy-02-s3',
        title: 'OSSライセンスと標準化',
        content: `■ オープンソースソフトウェア（OSS）のライセンス
・GPL：コピーレフト条項あり。改変・配布時に同じライセンスを適用義務
・LGPL：ライブラリ向け。リンクするだけならGPL適用不要
・MIT/BSD：コピーレフトなし。商用利用・改変・配布が自由
・Apache License：特許権に関する明示的な許諾あり

■ 国際標準化機関
・ISO：国際標準化機構（品質管理、セキュリティ等）
・IEC：国際電気標準会議
・IEEE：電気電子技術者協会（ネットワーク規格等）
・W3C：Web技術の標準化団体`,
        keyPoints: [
          'GPLはコピーレフト（改変・配布に同ライセンス適用義務）',
          'MIT/BSDライセンスは商用含め自由度が高い',
          'ISO 27001は情報セキュリティマネジメントの国際規格',
        ],
        keywords: ['OSS', 'GPL', 'MIT License', 'ISO', '標準化'],
        relatedQuestionIds: ['q-str-010'],
        relatedGlossaryIds: ['g-oss'],
      },
    ],
  },
  {
    id: 'slide-strategy-03',
    domain: 'strategy',
    category: 'マーケティング・財務',
    title: 'マーケティング・財務',
    order: 3,
    quizQuestionIds: ['q-str-011', 'q-str-012', 'q-str-013'],
    sections: [
      {
        id: 'slide-strategy-03-s1',
        title: 'マーケティングの基本',
        content: `■ マーケティングミックス 4P
・Product（製品）：何を売るか
・Price（価格）：いくらで売るか
・Place（流通・チャネル）：どこで売るか
・Promotion（プロモーション）：どうやって売るか

■ 顧客視点の4C（4Pに対応）
・Customer Value（顧客価値）← Product
・Cost（顧客コスト）← Price
・Convenience（利便性）← Place
・Communication（コミュニケーション）← Promotion

■ STP分析
・Segmentation（市場細分化）
・Targeting（標的市場の選択）
・Positioning（ポジショニング）`,
        keyPoints: [
          '4PはProduct・Price・Place・Promotion',
          'STPで市場を絞り込んでターゲットを明確にする',
          'CRM（顧客関係管理）で顧客との長期的関係を構築',
        ],
        keywords: ['4P', 'マーケティングミックス', 'STP', 'CRM'],
        relatedQuestionIds: ['q-str-011'],
        relatedGlossaryIds: ['g-4p'],
      },
      {
        id: 'slide-strategy-03-s2',
        title: '財務会計の基本',
        content: `■ 損益計算書（P/L：Profit and Loss Statement）
売上高 - 売上原価 = 売上総利益（粗利）
売上総利益 - 販売費・一般管理費 = 営業利益
営業利益 + 営業外収益 - 営業外費用 = 経常利益

■ 損益分岐点（BEP：Break Even Point）
損益分岐点売上高 = 固定費 ÷（1 - 変動費率）
変動費率 = 変動費 ÷ 売上高

■ 財務指標
・ROI（投資対効果）= 利益 ÷ 投資額 × 100
・ROE（自己資本利益率）= 当期純利益 ÷ 自己資本 × 100
・流動比率 = 流動資産 ÷ 流動負債 × 100`,
        keyPoints: [
          '損益分岐点：売上高と総費用が等しくなる点',
          'ROI = 利益÷投資額×100（高いほど投資効率が良い）',
          '流動比率は短期的な支払い能力を示す（200%以上が理想）',
        ],
        keywords: ['損益分岐点', 'BEP', 'ROI', '損益計算書'],
        relatedQuestionIds: ['q-str-012', 'q-str-013'],
        relatedGlossaryIds: ['g-bep', 'g-roi'],
      },
    ],
  },

  // ========== マネジメント系 ==========
  {
    id: 'slide-management-01',
    domain: 'management',
    category: 'プロジェクトマネジメント',
    title: 'プロジェクトマネジメント',
    order: 4,
    quizQuestionIds: ['q-mng-001', 'q-mng-002', 'q-mng-003', 'q-mng-004'],
    sections: [
      {
        id: 'slide-management-01-s1',
        title: 'プロジェクト管理の基本',
        content: `プロジェクトとは、明確な開始・終了時期を持つ、独自の成果物を生み出す一時的な取り組みです。

■ プロジェクトの3大制約（トリプルコンストレイント）
・スコープ（範囲）：何を作るか
・タイム（時間）：いつまでに
・コスト（費用）：いくらで

■ PMBOK（Project Management Body of Knowledge）
PMIが策定したプロジェクトマネジメントの知識体系。10の知識エリアで構成。

■ WBS（Work Breakdown Structure）
プロジェクトの作業を管理可能な単位に階層的に分解した構造図。スコープ管理の基本ツール。`,
        keyPoints: [
          'プロジェクトの3大制約：スコープ・タイム・コスト',
          'WBSで作業を階層的に分解して管理',
          'PMBOKはPMIが策定したプロジェクト管理の知識体系',
        ],
        keywords: ['WBS', 'PMBOK', 'プロジェクト管理', 'スコープ'],
        relatedQuestionIds: ['q-mng-001'],
        relatedGlossaryIds: ['g-wbs'],
      },
      {
        id: 'slide-management-01-s2',
        title: 'スケジュール管理',
        content: `■ ガントチャート
横軸に時間、縦軸に作業を並べた棒グラフ型の工程表。作業の開始・終了・進捗を視覚的に把握できます。

■ PERT図（ネットワーク図）
作業間の依存関係を矢印で表したネットワーク図。クリティカルパスの特定に使用。

■ クリティカルパス
プロジェクトのネットワーク図において、開始から終了までの最長経路。この経路の作業が遅延するとプロジェクト全体が遅延します。

■ フロート（余裕時間）
クリティカルパス上にない作業が持つ遅延可能な余裕時間。クリティカルパス上の作業のフロートは0。`,
        keyPoints: [
          'クリティカルパスは開始から終了までの最長経路',
          'クリティカルパス上の作業のフロートは0',
          'ガントチャートは進捗管理に、PERT図は依存関係把握に有効',
        ],
        keywords: ['クリティカルパス', 'ガントチャート', 'PERT', 'フロート'],
        relatedQuestionIds: ['q-mng-002'],
        relatedGlossaryIds: ['g-critical-path'],
      },
      {
        id: 'slide-management-01-s3',
        title: 'コスト管理とリスク管理',
        content: `■ EVM（アーンドバリュー管理）
進捗をコストで測定する手法。
・PV（計画価値）：計画上の完成予定コスト
・EV（出来高）：実際に完成した作業のコスト計画値
・AC（実績コスト）：実際にかかったコスト

主要指標：
・CPI（コスト効率指数）= EV÷AC（1.0未満でコスト超過）
・SPI（スケジュール効率指数）= EV÷PV（1.0未満で遅延）

■ リスク管理の対応戦略
・回避：リスク原因を除去
・軽減：発生確率や影響を低減
・転嫁：保険や外注でリスクを移転
・受容：リスクを認識して対策しない`,
        keyPoints: [
          'CPI=EV÷AC（1.0未満=コスト超過、1.0超=予算内）',
          'SPI=EV÷PV（1.0未満=遅延、1.0超=前倒し）',
          'リスク対応：回避・軽減・転嫁・受容の4種類',
        ],
        keywords: ['EVM', 'CPI', 'SPI', 'リスク管理'],
        relatedQuestionIds: ['q-mng-003', 'q-mng-004'],
        relatedGlossaryIds: ['g-evm'],
      },
    ],
  },
  {
    id: 'slide-management-02',
    domain: 'management',
    category: 'システム開発手法',
    title: 'システム開発手法',
    order: 5,
    quizQuestionIds: ['q-mng-005', 'q-mng-006', 'q-mng-007'],
    sections: [
      {
        id: 'slide-management-02-s1',
        title: 'ウォーターフォールとスパイラル',
        content: `■ ウォーターフォールモデル
要件定義→基本設計→詳細設計→実装→テスト→運用の順に段階的に進める手法。
・メリット：工程が明確、管理しやすい
・デメリット：前工程への手戻りが困難、要件変更に弱い

■ スパイラルモデル
小さなサイクルを繰り返しながら段階的に開発を進める手法。各サイクルでリスク分析を行います。

■ プロトタイプモデル
試作品（プロトタイプ）を早期に作成してユーザーに確認してもらい、要件を明確にしながら開発する手法。`,
        keyPoints: [
          'ウォーターフォールは工程が明確だが変更に弱い',
          'スパイラルモデルはリスク分析を重視した反復型',
          'プロトタイプで早期にユーザーの合意を得る',
        ],
        keywords: ['ウォーターフォール', 'スパイラルモデル', 'プロトタイプ'],
        relatedQuestionIds: ['q-mng-006'],
        relatedGlossaryIds: ['g-waterfall'],
      },
      {
        id: 'slide-management-02-s2',
        title: 'アジャイル開発',
        content: `アジャイル開発はソフトウェアを短い反復サイクルで継続的に開発・リリースする手法の総称です。

■ スクラム（最も普及したアジャイルフレームワーク）
・スプリント：1〜4週間の反復開発単位
・プロダクトバックログ：開発する機能の優先順位付きリスト
・スプリントバックログ：スプリント内で実施するタスクリスト
・スクラムマスター：チームの障害を除去するファシリテーター
・プロダクトオーナー：プロダクトバックログを管理する責任者

■ XP（エクストリームプログラミング）
ペアプログラミング、テスト駆動開発（TDD）、継続的インテグレーション（CI）などのプラクティスを実践。`,
        keyPoints: [
          'スクラムのスプリントは1〜4週間の固定反復期間',
          'プロダクトバックログは優先順位付きの機能一覧',
          'XPのコアプラクティス：ペアプログラミング・TDD・CI',
        ],
        keywords: ['アジャイル', 'スクラム', 'スプリント', 'XP'],
        relatedQuestionIds: ['q-mng-005'],
        relatedGlossaryIds: ['g-scrum'],
      },
      {
        id: 'slide-management-02-s3',
        title: 'DevOpsとCI/CD',
        content: `■ DevOps
Development（開発）とOperations（運用）を組み合わせた考え方・文化。開発チームと運用チームが連携し、継続的にシステムを改善します。

■ CI/CD（継続的インテグレーション/継続的デリバリー）
・CI（Continuous Integration）：コード変更のたびにビルド・テストを自動実行
・CD（Continuous Delivery/Deployment）：テスト合格後に自動的にデプロイ

■ コンテナ・仮想化技術
・Docker：コンテナ型仮想化技術（軽量・高速）
・Kubernetes：コンテナのオーケストレーション（管理・自動化）

■ テストの種類
・単体テスト（ユニットテスト）：モジュール単位
・結合テスト：複数モジュールの連携
・システムテスト：システム全体
・受け入れテスト（UAT）：ユーザー視点の検証`,
        keyPoints: [
          'DevOpsは開発と運用の連携文化・手法',
          'CIはコード変更のたびにビルド・テストを自動実行',
          'テストの粒度：単体→結合→システム→受け入れ',
        ],
        keywords: ['DevOps', 'CI/CD', 'Docker', 'テスト'],
        relatedQuestionIds: ['q-mng-007'],
        relatedGlossaryIds: ['g-devops'],
      },
    ],
  },
  {
    id: 'slide-management-03',
    domain: 'management',
    category: 'サービスマネジメント',
    title: 'サービスマネジメント',
    order: 6,
    quizQuestionIds: ['q-mng-008', 'q-mng-009', 'q-mng-010'],
    sections: [
      {
        id: 'slide-management-03-s1',
        title: 'ITサービスマネジメントとITIL',
        content: `■ ITIL（IT Infrastructure Library）
ITサービスマネジメントのベストプラクティス集。英国政府が開発。

■ インシデント管理
ITサービスを中断させるイベント（インシデント）を迅速に解決し、サービスを復旧させるプロセス。

■ 問題管理
インシデントの根本原因を特定・除去するプロセス。再発防止が目的。

■ 変更管理
ITインフラやシステムへの変更をコントロールするプロセス。CAB（変更諮問委員会）が承認。

■ 構成管理
IT資産（CI：構成アイテム）の情報をCMDB（構成管理データベース）で管理。`,
        keyPoints: [
          'インシデント管理：迅速なサービス復旧が目的',
          '問題管理：根本原因の特定・除去が目的',
          '変更管理：計画的・安全な変更の実施',
        ],
        keywords: ['ITIL', 'インシデント管理', '問題管理', '変更管理'],
        relatedQuestionIds: ['q-mng-008'],
        relatedGlossaryIds: ['g-itil'],
      },
      {
        id: 'slide-management-03-s2',
        title: 'SLAと稼働率',
        content: `■ SLA（Service Level Agreement）
サービス提供者と利用者間のサービス品質に関する合意文書。稼働率・応答時間・サポート時間などを規定。

■ 稼働率の計算
稼働率 = MTBF ÷（MTBF + MTTR）
・MTBF（Mean Time Between Failures）：平均故障間隔
・MTTR（Mean Time To Repair）：平均修復時間

例：MTBF = 990時間、MTTR = 10時間
稼働率 = 990 ÷（990 + 10）= 0.99（99%）

■ システム構成と稼働率
・直列接続：稼働率 = A × B（両方稼働が必要）
・並列接続：稼働率 = 1 - (1-A)(1-B)（どちらか1つでOK）`,
        keyPoints: [
          '稼働率 = MTBF ÷（MTBF + MTTR）',
          '直列接続は掛け算、並列接続は1-(1-A)(1-B)',
          'SLAでサービス品質水準を事前に合意する',
        ],
        keywords: ['SLA', '稼働率', 'MTBF', 'MTTR'],
        relatedQuestionIds: ['q-mng-009', 'q-mng-010'],
        relatedGlossaryIds: ['g-sla', 'g-availability'],
      },
    ],
  },

  // ========== テクノロジ系 ==========
  {
    id: 'slide-technology-01',
    domain: 'technology',
    category: 'ハードウェア・ソフトウェア',
    title: 'ハードウェア・ソフトウェア',
    order: 7,
    quizQuestionIds: ['q-tech-001', 'q-tech-002', 'q-tech-003', 'q-tech-004', 'q-tech-020'],
    sections: [
      {
        id: 'slide-technology-01-s1',
        title: 'コンピュータの構成',
        content: `■ コンピュータの5大装置
・演算装置（ALU）：計算処理
・制御装置：命令の解釈・実行制御
・記憶装置：データの記憶（主記憶・補助記憶）
・入力装置：データの入力
・出力装置：データの出力

CPU（中央処理装置）= 演算装置 + 制御装置

■ 記憶装置の階層
キャッシュメモリ > 主記憶（RAM）> 補助記憶（HDD/SSD）
上位ほど高速・小容量・高価格

■ CPU性能指標
・クロック周波数：1秒間の処理サイクル数（GHz）
・コア数：処理ユニットの数
・キャッシュ容量：高速バッファの大きさ`,
        keyPoints: [
          'CPU=演算装置+制御装置',
          '記憶の速度：キャッシュ > RAM > HDD/SSD',
          'クロック周波数は高いほど処理が速い（他の要因にも依存）',
        ],
        keywords: ['CPU', 'RAM', 'キャッシュ', '5大装置'],
        relatedQuestionIds: ['q-tech-001'],
        relatedGlossaryIds: ['g-cpu'],
      },
      {
        id: 'slide-technology-01-s2',
        title: 'OSとソフトウェア',
        content: `■ OS（Operating System）の役割
・プロセス管理：CPUの割り当て制御
・メモリ管理：メモリ領域の割り当て・解放
・ファイル管理：ファイルの作成・読み書き・削除
・デバイス管理：周辺機器の制御
・ユーザーインターフェース：GUI/CUI提供

■ ソフトウェアの分類
・システムソフトウェア：OS、デバイスドライバ、ミドルウェア
・応用ソフトウェア（アプリ）：業務ソフト、パッケージソフト

■ クラウドサービスモデル
・SaaS：ソフトウェアをサービスとして提供（例：Gmail）
・PaaS：開発プラットフォームを提供（例：Heroku）
・IaaS：インフラを提供（例：AWS EC2）`,
        keyPoints: [
          'OSの主要機能：プロセス・メモリ・ファイル・デバイス管理',
          'ウイルス検出はOSの機能ではない',
          'IaaS→PaaS→SaaSの順にユーザーの管理範囲が狭まる',
        ],
        keywords: ['OS', 'SaaS', 'PaaS', 'IaaS', 'クラウド'],
        relatedQuestionIds: ['q-tech-002', 'q-tech-020'],
        relatedGlossaryIds: ['g-os', 'g-iaas'],
      },
      {
        id: 'slide-technology-01-s3',
        title: 'ストレージとRAID',
        content: `■ ストレージの種類比較
|項目|HDD|SSD|
|速度|低速|高速|
|耐衝撃性|弱い|強い|
|消費電力|大きい|小さい|
|容量単価|安価|高価（改善中）|

■ RAID（Redundant Array of Independent Disks）
複数のディスクを組み合わせる技術。

・RAID 0（ストライピング）：データを分散→高速化。冗長性なし
・RAID 1（ミラーリング）：同じデータを2台に書込→冗長性高。容量半分
・RAID 5：パリティ分散→冗長性と性能のバランス。1台故障まで対応
・RAID 6：パリティ2重→2台故障まで対応`,
        keyPoints: [
          'SSDはHDDより高速・耐衝撃・低消費電力',
          'RAID 0は高速化のみ（冗長性なし）',
          'RAID 1はミラーリングで1台故障時もデータ保全',
        ],
        keywords: ['SSD', 'HDD', 'RAID', 'ストレージ'],
        relatedQuestionIds: ['q-tech-003', 'q-tech-004'],
        relatedGlossaryIds: ['g-raid'],
      },
    ],
  },
  {
    id: 'slide-technology-02',
    domain: 'technology',
    category: 'ネットワーク基礎',
    title: 'ネットワーク基礎',
    order: 8,
    quizQuestionIds: ['q-tech-005', 'q-tech-006', 'q-tech-007', 'q-tech-008', 'q-tech-018'],
    sections: [
      {
        id: 'slide-technology-02-s1',
        title: 'TCP/IPとプロトコル',
        content: `■ TCP/IP 4階層モデル
4. アプリケーション層：HTTP, HTTPS, FTP, SMTP, POP3, DNS, DHCP
3. トランスポート層：TCP（信頼性重視）, UDP（速度重視）
2. インターネット層：IP, ICMP, ARP
1. ネットワークインターフェース層：Ethernet, Wi-Fi

■ 主要なポート番号
・HTTP：80  ・HTTPS：443  ・FTP：21
・SMTP：25  ・POP3：110  ・DNS：53

■ TCP vs UDP
・TCP：コネクション型、確認応答あり、信頼性高、低速（Webブラウジング等）
・UDP：コネクションレス型、確認応答なし、高速（動画ストリーミング、DNS等）`,
        keyPoints: [
          'HTTPはアプリケーション層、TCPはトランスポート層',
          'HTTPS（HTTP+TLS）はポート443を使用',
          'TCPは信頼性重視、UDPは速度重視',
        ],
        keywords: ['TCP/IP', 'HTTP', 'HTTPS', 'TCP', 'UDP'],
        relatedQuestionIds: ['q-tech-007'],
        relatedGlossaryIds: ['g-tcpip'],
      },
      {
        id: 'slide-technology-02-s2',
        title: 'IPアドレスとサブネット',
        content: `■ IPアドレス（IPv4）
32ビットのアドレス（例：192.168.1.1）
・クラスA：10.0.0.0〜10.255.255.255（プライベート）
・クラスB：172.16.0.0〜172.31.255.255（プライベート）
・クラスC：192.168.0.0〜192.168.255.255（プライベート）

■ CIDR記法
192.168.1.0/24 → サブネットマスク：255.255.255.0
/24 = 上位24ビットがネットワーク部
使用可能ホスト数：2^8 - 2 = 254台

■ 特殊なIPアドレス
・ループバック：127.0.0.1（自分自身）
・ブロードキャスト：ネットワーク末尾.255

■ DNS
ドメイン名→IPアドレスへの変換（名前解決）`,
        keyPoints: [
          '/24のサブネットマスクは255.255.255.0',
          'プライベートIPアドレスはインターネットへ直接送信不可',
          'DNSはドメイン名をIPアドレスに変換する',
        ],
        keywords: ['IPアドレス', 'サブネットマスク', 'CIDR', 'DNS'],
        relatedQuestionIds: ['q-tech-005', 'q-tech-006'],
        relatedGlossaryIds: ['g-subnet', 'g-dns'],
      },
      {
        id: 'slide-technology-02-s3',
        title: 'ネットワーク機器とVPN',
        content: `■ ネットワーク機器
・ハブ（リピーター）：Layer1。すべてのポートに信号転送
・スイッチ（L2スイッチ）：Layer2。MACアドレスで同一NW内転送
・ルータ：Layer3。IPアドレスで異なるNW間を転送
・L3スイッチ：スイッチとルータの機能を統合

■ 無線LAN（Wi-Fi）
・IEEE 802.11規格（802.11ax = Wi-Fi 6が最新世代）
・セキュリティ：WPA3が現在の推奨（WEPは脆弱で廃止）

■ VPN（Virtual Private Network）
公衆回線を暗号化・トンネリングして仮想専用線として利用。
・テレワーク、拠点間接続に活用
・IPsec、TLS（SSL-VPN）がよく使われるプロトコル`,
        keyPoints: [
          'ルータはIPアドレスで異なるNW間のパケット転送',
          'スイッチはMACアドレスで同一NW内のフレーム転送',
          'VPNは暗号化で公衆回線を仮想専用線化',
        ],
        keywords: ['ルータ', 'スイッチ', 'VPN', 'Wi-Fi'],
        relatedQuestionIds: ['q-tech-008', 'q-tech-018'],
        relatedGlossaryIds: ['g-router', 'g-vpn'],
      },
    ],
  },
  {
    id: 'slide-technology-03',
    domain: 'technology',
    category: 'セキュリティ',
    title: 'セキュリティ',
    order: 9,
    quizQuestionIds: ['q-tech-009', 'q-tech-010', 'q-tech-011', 'q-tech-012', 'q-tech-013', 'q-tech-019'],
    sections: [
      {
        id: 'slide-technology-03-s1',
        title: '情報セキュリティの3要素',
        content: `■ CIAトライアド（情報セキュリティの3要素）
・機密性（Confidentiality）：許可された人だけがアクセスできる
・完全性（Integrity）：情報が改ざんされていない正確な状態
・可用性（Availability）：必要なときに利用できる

■ 主な脅威と攻撃手法
・マルウェア：ウイルス・ワーム・トロイの木馬・ランサムウェア
・フィッシング：偽メール・偽サイトで認証情報を騙し取る
・DDoS攻撃：多数のコンピュータから一斉に大量リクエストを送信
・中間者攻撃（MITM）：通信を傍受・改ざん
・SQLインジェクション：DB不正操作
・XSS（クロスサイトスクリプティング）：悪意あるスクリプトを実行`,
        keyPoints: [
          'CIAトライアド：機密性・完全性・可用性',
          'ランサムウェアはファイルを暗号化して身代金を要求',
          'フィッシングはソーシャルエンジニアリングの代表例',
        ],
        keywords: ['CIA', '機密性', '完全性', '可用性', 'フィッシング'],
        relatedQuestionIds: ['q-tech-009'],
        relatedGlossaryIds: ['g-phishing'],
      },
      {
        id: 'slide-technology-03-s2',
        title: '暗号化と認証',
        content: `■ 暗号化方式
・共通鍵暗号（対称鍵）：同じ鍵で暗号化・復号。高速。鍵配送問題あり。
  代表：AES（標準）、DES（古い）
・公開鍵暗号（非対称鍵）：公開鍵で暗号化、秘密鍵で復号。低速。鍵配送問題なし。
  代表：RSA

■ ハッシュ関数
入力データから固定長のハッシュ値を生成。不可逆（元に戻せない）。
代表：SHA-256（現在の標準）、MD5（脆弱、非推奨）

■ デジタル署名
秘密鍵でハッシュ値を署名→公開鍵で検証。なりすましと改ざんを防止。

■ SSL/TLS
Webの通信暗号化プロトコル。HTTPS=HTTP+TLS。
公開鍵暗号で鍵交換→共通鍵で通信暗号化`,
        keyPoints: [
          'AESは共通鍵暗号、RSAは公開鍵暗号',
          'ハッシュ関数は不可逆（復元不可）',
          'デジタル署名は秘密鍵で署名、公開鍵で検証',
        ],
        keywords: ['AES', 'RSA', 'SHA-256', 'デジタル署名', 'SSL/TLS'],
        relatedQuestionIds: ['q-tech-011', 'q-tech-019'],
        relatedGlossaryIds: ['g-pki', 'g-aes'],
      },
      {
        id: 'slide-technology-03-s3',
        title: 'セキュリティ対策',
        content: `■ 認証技術
・多要素認証（MFA）：知識要素（パスワード）＋所持要素（スマホ）＋生体要素（指紋）
・シングルサインオン（SSO）：一度の認証で複数システムにアクセス
・FIDO2/WebAuthn：パスワードレス認証の標準規格

■ セキュリティ対策製品
・ファイアウォール：通信のフィルタリング・遮断
・WAF（Web Application Firewall）：Webアプリへの攻撃を防御
・IDS/IPS：不正侵入検知・防止システム
・EDR：エンドポイントの脅威検出・対応

■ セキュリティ管理
・ISMS（情報セキュリティマネジメントシステム）：ISO27001に準拠
・リスクアセスメント：脅威・脆弱性・影響度の評価
・インシデントレスポンス：セキュリティ事故への対応手順`,
        keyPoints: [
          'MFAの3要素：知識・所持・生体',
          'ファイアウォールは通信フィルタリング、ウイルス駆除ではない',
          'ISMS（ISO27001）は情報セキュリティのマネジメント規格',
        ],
        keywords: ['多要素認証', 'MFA', 'ファイアウォール', 'ISMS'],
        relatedQuestionIds: ['q-tech-010', 'q-tech-012', 'q-tech-013'],
        relatedGlossaryIds: ['g-firewall', 'g-mfa'],
      },
    ],
  },
  {
    id: 'slide-technology-04',
    domain: 'technology',
    category: 'データベース・アルゴリズム',
    title: 'データベース・アルゴリズム',
    order: 10,
    quizQuestionIds: ['q-tech-014', 'q-tech-015', 'q-tech-016', 'q-tech-017'],
    sections: [
      {
        id: 'slide-technology-04-s1',
        title: 'リレーショナルデータベース',
        content: `■ RDB（リレーショナルデータベース）
表（テーブル）形式でデータを管理。SQLで操作。

■ 主なSQL文
・SELECT：データの検索
・INSERT：データの挿入
・UPDATE：データの更新
・DELETE：データの削除
・CREATE TABLE：テーブル作成

■ 正規化
データの冗長性を排除し、更新時の異常を防ぐ設計手法。
・第1正規形：繰り返しグループの排除
・第2正規形：部分関数従属の排除
・第3正規形：推移的関数従属の排除

■ インデックス（索引）
検索の高速化のために設定する補助的なデータ構造。主キーには自動的に設定。`,
        keyPoints: [
          '正規化はデータ重複を排除し更新異常を防ぐ',
          'SQLのCRUD：SELECT/INSERT/UPDATE/DELETE',
          'インデックスは検索を高速化するが更新は遅くなる',
        ],
        keywords: ['SQL', 'RDB', '正規化', 'インデックス'],
        relatedQuestionIds: ['q-tech-014'],
        relatedGlossaryIds: ['g-normalization'],
      },
      {
        id: 'slide-technology-04-s2',
        title: 'トランザクションとACID',
        content: `■ トランザクション
データベースの一連の処理をひとまとまりにした作業単位。
「振込処理」のように複数の操作を一体として扱う。

■ ACID特性
・Atomicity（原子性）：すべて成功かすべて失敗（中途半端な状態を防ぐ）
・Consistency（一貫性）：処理前後でデータの整合性が保たれる
・Isolation（独立性）：複数トランザクションが互いに影響しない
・Durability（永続性）：完了したトランザクションはシステム障害後も保持

■ 排他制御（ロック）
同時に複数の処理が同じデータを更新することを防ぐ仕組み。
デッドロック：複数のトランザクションが互いにロック解放を待ち合う状態。`,
        keyPoints: [
          'A=原子性、C=一貫性、I=独立性、D=永続性',
          '原子性は「すべて成功 or すべて失敗」',
          'デッドロックは互いのロック解放待ちによる膠着状態',
        ],
        keywords: ['ACID', 'トランザクション', '原子性', 'デッドロック'],
        relatedQuestionIds: ['q-tech-015'],
        relatedGlossaryIds: ['g-acid'],
      },
      {
        id: 'slide-technology-04-s3',
        title: 'アルゴリズムとデータ構造',
        content: `■ データ構造
・配列：連続したメモリ領域にデータを格納。インデックスでO(1)アクセス
・スタック（Stack）：LIFO（後入れ先出し）。再帰処理、undo機能に活用
・キュー（Queue）：FIFO（先入れ先出し）。印刷スプール、タスクキューに活用
・木構造（Tree）：階層的なデータ管理。二分探索木で高速検索

■ 代表的な探索アルゴリズム
・線形探索：先頭から順に探す。O(n)
・二分探索：ソート済みデータを半分ずつ絞る。O(log n)

■ 代表的なソートアルゴリズム
・バブルソート：隣接要素を比較・交換。O(n²)
・選択ソート：最小値を選択・配置。O(n²)
・クイックソート：分割統治法。平均O(n log n)`,
        keyPoints: [
          'スタック=LIFO、キュー=FIFO',
          '二分探索はソート済みデータが前提。O(log n)',
          'クイックソートは平均O(n log n)で最も速い部類',
        ],
        keywords: ['スタック', 'キュー', '二分探索', 'ソート', 'アルゴリズム'],
        relatedQuestionIds: ['q-tech-016', 'q-tech-017'],
        relatedGlossaryIds: ['g-queue', 'g-binary-search'],
      },
    ],
  },
];

export const slides: Slide[] = [...baseSlides, ...slidesExtra].sort((a, b) => a.order - b.order);

export const getSlideById = (id: string) => slides.find((s) => s.id === id);
export const getSlidesByDomain = (domain: string) => slides.filter((s) => s.domain === domain);
export const getAllSections = () => slides.flatMap((s) => s.sections.map((sec) => ({ ...sec, slideId: s.id, slideTitle: s.title, domain: s.domain })));
