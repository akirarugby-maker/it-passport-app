# 引継書：ITパスポート学習アプリ スライド追加作業

作成日：2026-05-23  
作業ブランチ：`claude/laughing-gates-C2Ydv`  
リポジトリ：`akirarugby-maker/it-passport-app`  
公開URL：`https://akirarugby-maker.github.io/it-passport-app/`

---

## 1. プロジェクト概要

ITパスポート試験合格のための学習アプリ（SPA）。  
技術スタック：React 19 + TypeScript + Vite + Tailwind CSS + Zustand + React Router（HashRouter）+ Recharts + date-fns  
GitHub Pages 公開（`base: '/it-passport-app/'`、HashRouter使用）

---

## 2. 現状

| 項目 | 現状 |
|------|------|
| 問題数 | 240問（基本43問 + 追加217問） |
| スライド数 | **10枚のみ**（基本43問をカバー） |
| 追加217問のスライド | **ゼロ** |
| クロスリンク | 基本問題のみ設定済み |

---

## 3. 今回の作業内容（未着手）

### タスク：`src/data/slides_extra.ts` を新規作成する

240問すべてに対応するスライドを作るため、追加問題217問をカバーする **23枚のスライド** を新規作成する。

作成後、`src/data/slides.ts` の末尾で import して `slides` 配列に連結する。

---

## 4. ファイル構成

```
src/data/
  slides.ts          ← 既存（10枚）。末尾でslidesExtraをimport・連結する
  slides_extra.ts    ← ★今回新規作成するファイル（23枚）
  questions.ts       ← 基本43問 + 3ファイルをimport
  questions_strategy_extra.ts   ← q-str-014〜q-str-070（57問）
  questions_management_extra.ts ← q-mng-011〜q-mng-070（60問）
  questions_technology_extra.ts ← q-tech-021〜q-tech-100（80問）
  glossary.ts        ← 37用語（クロスリンク用IDはセクション6参照）
```

### slides.ts への追記（slides_extra.ts 作成後）

`slides.ts` の先頭 import に以下を追加：
```ts
import { slidesExtra } from './slides_extra';
```

`slides.ts` の `export const slides: Slide[] = [` の配列末尾 `];` を：
```ts
export const slides: Slide[] = [...baseSlides, ...slidesExtra];
```
に変更する（または `slides.ts` の配列を `baseSlides` と改名して結合する）。

**注意：** `slides.ts` には既に末尾に以下のユーティリティ関数がある。これは維持する：
```ts
export const getSlideById = (id: string) => slides.find((s) => s.id === id);
export const getSlidesByDomain = (domain: string) => slides.filter((s) => s.domain === domain);
export const getAllSections = () => slides.flatMap((s) => s.sections.map((sec) => ({ ...sec, slideId: s.id, slideTitle: s.title, domain: s.domain })));
```

---

## 5. Slide型の構造（src/types/index.ts より）

```ts
interface Slide {
  id: string;
  domain: 'strategy' | 'management' | 'technology';
  category: string;
  title: string;
  sections: SlideSection[];
  quizQuestionIds: string[];  // このスライドに関連する問題ID一覧
  order: number;
}

interface SlideSection {
  id: string;
  title: string;
  content: string;       // 本文（markdown風テキスト）
  keyPoints: string[];   // ポイント3〜4個
  keywords: string[];    // キーワード（クロスリンクの判定に使用）
  relatedQuestionIds?: string[];   // 同キーワードを持つ問題IDのみリンク
  relatedGlossaryIds?: string[];   // 同キーワードを持つ用語IDのみリンク
}
```

### 既存スライドの例（参考）

```ts
{
  id: 'slide-strategy-04',
  domain: 'strategy',
  category: 'ビジネス環境分析',
  title: 'ビジネス環境分析',
  order: 11,
  quizQuestionIds: ['q-str-014', 'q-str-015', 'q-str-016', 'q-str-017'],
  sections: [
    {
      id: 'slide-strategy-04-s1',
      title: 'PEST分析',
      content: `...本文...`,
      keyPoints: ['...', '...', '...'],
      keywords: ['PEST分析', '外部環境分析', 'マクロ環境'],
      relatedQuestionIds: ['q-str-014'],
      relatedGlossaryIds: [],   // 同キーワードの用語がなければ空配列
    },
  ],
},
```

---

## 6. クロスリンクのルール（重要）

**ユーザー指示：** 「スライド・用語・問題の中に含まれるキーワードが同じ用語になること。同じ用語が含まれないなら無理にリンクせずにボタンを作成しないでください。」

- `relatedQuestionIds`：そのセクションの `keywords` と問題の `keywords` に **共通するキーワードがある場合のみ** リンクする
- `relatedGlossaryIds`：そのセクションの `keywords` と用語の `term`（または定義中のキーワード）が **一致する場合のみ** リンクする
- 共通キーワードがない場合は **空配列 `[]`** にする

### 既存用語集のID一覧（glossary.ts より）

| ID | 用語 | キーワード |
|----|------|-----------|
| g-swot | SWOT分析 | SWOT分析 |
| g-bsc | バランスト・スコアカード（BSC） | BSC |
| g-core-competence | コアコンピタンス | コアコンピタンス |
| g-kpi | KPI | KPI |
| g-copyright | 著作権 | 著作権 |
| g-personal-info | 個人情報 | 個人情報, 個人情報保護法 |
| g-oss | OSS | OSS, GPL |
| g-4p | 4P（マーケティングミックス） | 4P, マーケティング |
| g-bep | 損益分岐点（BEP） | 損益分岐点, BEP |
| g-roi | ROI | ROI |
| g-wbs | WBS | WBS |
| g-critical-path | クリティカルパス | クリティカルパス |
| g-evm | EVM | EVM, CPI, SPI |
| g-scrum | スクラム | スクラム |
| g-waterfall | ウォーターフォールモデル | ウォーターフォール |
| g-devops | DevOps | DevOps |
| g-itil | ITIL | ITIL |
| g-sla | SLA | SLA |
| g-availability | 稼働率 | 稼働率, MTBF, MTTR |
| g-cpu | CPU | CPU |
| g-os | OS | OS |
| g-raid | RAID | RAID |
| g-iaas | IaaS | IaaS, クラウド |
| g-tcpip | TCP/IP | TCP/IP |
| g-subnet | サブネットマスク | サブネット |
| g-dns | DNS | DNS |
| g-router | ルータ | ルータ |
| g-vpn | VPN | VPN |
| g-phishing | フィッシング | フィッシング |
| g-firewall | ファイアウォール | ファイアウォール |
| g-pki | PKI（公開鍵基盤） | PKI, デジタル証明書, 認証局 |
| g-sql-injection | SQLインジェクション | SQLインジェクション |
| g-mfa | 多要素認証（MFA） | MFA, 多要素認証 |
| g-aes | AES | AES, 暗号 |
| g-normalization | 正規化 | 正規化 |
| g-acid | ACID特性 | ACID, トランザクション |
| g-binary-search | 二分探索 | 二分探索 |
| g-queue | キュー（Queue） | キュー |

---

## 7. 作成するスライド一覧（23枚）

### ストラテジ系（7枚）

| スライドID | order | タイトル | カバーする問題ID |
|-----------|-------|---------|----------------|
| slide-strategy-04 | 11 | ビジネス環境分析 | q-str-014〜017 |
| slide-strategy-05 | 12 | 経営管理手法 | q-str-018〜023, 058, 059, 064, 067 |
| slide-strategy-06 | 13 | 法務詳細 | q-str-024〜029 |
| slide-strategy-07 | 14 | 財務・マーケティング応用 | q-str-030〜035, 050〜053, 060, 065, 068 |
| slide-strategy-08 | 15 | DX・システム戦略 | q-str-036〜040, 048, 049, 057, 063, 069 |
| slide-strategy-09 | 16 | e-ビジネス・新ビジネスモデル | q-str-041, 042, 046, 047, 054, 055, 056, 061 |
| slide-strategy-10 | 17 | IoT・AI・デジタルトレンド | q-str-043〜045, 062, 066, 070 |

**各スライドのセクション内容ガイド：**

- **slide-strategy-04**（ビジネス環境分析）
  - s1: PEST分析（Political/Economic/Social/Technological の4要素）→ q-str-014
  - s2: ファイブフォース分析（ポーター：既存競合・新規参入・代替品・買い手・売り手）→ q-str-015
  - s3: ベンチマーキングとアンゾフ成長マトリクス（市場浸透/製品開発/市場開拓/多角化）→ q-str-016, 017

- **slide-strategy-05**（経営管理手法）
  - s1: CRM・SCM（顧客関係管理・サプライチェーン管理）→ q-str-018, 019
  - s2: MBO・KGI・OODA（目標管理・重要目標達成指標・意思決定ループ）→ q-str-021, 022, 023
  - s3: 持株会社・バリューチェーン・CSR・ステークホルダー →q-str-020, 058, 059, 064, 067

- **slide-strategy-06**（法務詳細）
  - s1: 商標権・職務発明・不正競争防止法（営業秘密の3要件）→ q-str-024, 025, 026
  - s2: プロバイダ責任制限法・電子署名法・クリエイティブ・コモンズ → q-str-027, 028, 029

- **slide-strategy-07**（財務・マーケティング応用）
  - s1: ROE・流動比率・ABC分析・LTV（財務指標計算）→ q-str-033, 034, 035, 051
  - s2: 損益分岐点計算・粗利益率（計算問題対策）→ q-str-031, 053, 052
  - s3: 貸借対照表・NPV・コモディティ化・プロダクトライフサイクル・NPS・SEO → q-str-030, 032, 050, 060, 065, 068

- **slide-strategy-08**（DX・システム戦略）
  - s1: EA・BPR・DX（エンタープライズアーキテクチャ・業務改革・デジタル変革）→ q-str-036, 037, 040
  - s2: SoE/SoR・レガシーシステム・オープンイノベーション → q-str-048, 049, 057
  - s3: BYOD・ITポートフォリオ・グリーンIT・スマートシティ → q-str-038, 039, 063, 069

- **slide-strategy-09**（e-ビジネス・新ビジネスモデル）
  - s1: フリーミアム・サブスクリプション・ロングテール → q-str-041, 054, 055
  - s2: FinTech・ブロックチェーン・APIエコノミー・シェアリングエコノミー → q-str-042, 046, 047, 061
  - s3: RPA（ロボティック・プロセス・オートメーション）→ q-str-056

- **slide-strategy-10**（IoT・AI・デジタルトレンド）
  - s1: IoT・エッジコンピューティング → q-str-043, 066
  - s2: ビッグデータ（3V）・機械学習（教師あり/なし/強化学習） → q-str-044, 045
  - s3: NLP・Society 5.0 → q-str-062, 070

---

### マネジメント系（6枚）

| スライドID | order | タイトル | カバーする問題ID |
|-----------|-------|---------|----------------|
| slide-management-04 | 18 | プロジェクト管理詳細 | q-mng-011〜018, 053〜055, 068 |
| slide-management-05 | 19 | ソフトウェアテスト・品質 | q-mng-020, 021, 023, 025, 044〜046, 056, 057, 060, 065, 066 |
| slide-management-06 | 20 | 開発手法・品質モデル | q-mng-019, 022, 024, 040〜043, 067 |
| slide-management-07 | 21 | ITサービス管理 | q-mng-026〜033, 050, 058, 059, 062, 069 |
| slide-management-08 | 22 | システム監査・ガバナンス | q-mng-034〜039, 063, 064, 070 |
| slide-management-09 | 23 | 調達・契約 | q-mng-047〜049, 051, 052, 061 |

**各スライドのセクション内容ガイド：**

- **slide-management-04**（プロジェクト管理詳細）
  - s1: ガントチャート・SPI/CPI・PERT計算（並行作業の最短完了）→ q-mng-011, 012, 013
  - s2: EAC計算・類推見積り・プロジェクト憲章・ステークホルダー管理 → q-mng-015, 016, 017, 018
  - s3: スコープクリープ・PERT三点見積り・ファストトラッキング・コンティンジェンシー予備 → q-mng-053, 054, 055, 068

- **slide-management-05**（ソフトウェアテスト・品質）
  - s1: 同値分割・境界値分析・ブラックボックス/ホワイトボックステスト → q-mng-020, 021, 023
  - s2: TDD・ペアプログラミング・受入テスト・回帰テスト → q-mng-025, 056, 057（※受入テスト=q-mng-025）
  - s3: ウォークスルー・インスペクション・テスト終了基準・保守性（高凝集疎結合）・欠陥修正コスト → q-mng-044, 045, 046, 060, 065, 066

- **slide-management-06**（開発手法・品質モデル）
  - s1: スクラム詳細（バックログリファインメント）・プロトタイプ・スパイラルモデル → q-mng-019, 022, 024
  - s2: ISO/IEC 25010・信頼性成長曲線・CMM/CMMI → q-mng-040, 041, 042
  - s3: ファンクションポイント・CI/継続的インテグレーション → q-mng-043, 067

- **slide-management-07**（ITサービス管理）
  - s1: ITIL各プロセス（インシデント管理・問題管理・変更管理・サービスデスク） → q-mng-026, 029, 032, 059
  - s2: 稼働率計算（直列・並列・MTBF/MTTR）→ q-mng-027, 028, 030, 033, 058
  - s3: SLA・SLM・BCP/RTO/RPO・サービスカタログ → q-mng-031, 050, 062, 069

- **slide-management-08**（システム監査・ガバナンス）
  - s1: システム監査の目的・監査証拠収集技法 → q-mng-034, 036
  - s2: 内部統制4目的・J-SOX・職務分離・IT全般統制 → q-mng-035, 038, 063, 070
  - s3: ITガバナンス・ペネトレーションテスト・監査調書 → q-mng-037, 039, 064

- **slide-management-09**（調達・契約）
  - s1: RFP・RFI・一般競争入札 → q-mng-047, 048, 061
  - s2: 委任契約・請負契約・TCO → q-mng-049, 051
  - s3: 共通フレーム（SLCP） → q-mng-052

---

### テクノロジ系（10枚）

| スライドID | order | タイトル | カバーする問題ID |
|-----------|-------|---------|----------------|
| slide-technology-05 | 24 | 基礎理論・数値表現 | q-tech-021〜028 |
| slide-technology-06 | 25 | アルゴリズム・データ構造 | q-tech-029〜035, 095 |
| slide-technology-07 | 26 | プログラミング基礎・UML | q-tech-036〜040 |
| slide-technology-08 | 27 | ハードウェア・OS詳細 | q-tech-041〜049, 093 |
| slide-technology-09 | 28 | データベース応用 | q-tech-050〜054, 089, 090, 098 |
| slide-technology-10 | 29 | ネットワーク応用 | q-tech-055〜062, 088, 091 |
| slide-technology-11 | 30 | セキュリティ応用 | q-tech-063〜071, 086, 087, 092, 096, 100 |
| slide-technology-12 | 31 | クラウド・仮想化・DevOps | q-tech-072〜075, 094, 099 |
| slide-technology-13 | 32 | IoT・AI・新技術 | q-tech-076〜079, 097 |
| slide-technology-14 | 33 | システム信頼性設計 | q-tech-080〜085 |

**各スライドのセクション内容ガイド：**

- **slide-technology-05**（基礎理論・数値表現）
  - s1: 2進数↔10進数変換・16進数変換（計算手順を明示）→ q-tech-021, 022, 023
  - s2: 論理演算（AND/OR/XOR/NOT）・1バイト最大値 → q-tech-024, 025, 027
  - s3: 浮動小数点数・補数表現（2の補数） → q-tech-026, 028

- **slide-technology-06**（アルゴリズム・データ構造）
  - s1: スタック（LIFO）・キュー（FIFO）→ q-tech-029, 030; glossary: g-queue
  - s2: バブルソート・二分探索（前提条件・O(log n)）→ q-tech-031, 032; glossary: g-binary-search
  - s3: 連結リスト・配列・ハッシュ表 → q-tech-033, 034, 035, 095

- **slide-technology-07**（プログラミング基礎・UML）
  - s1: OOP（カプセル化・ポリモーフィズム・継承・抽象化）→ q-tech-036, 037
  - s2: コンパイラ・インタプリタ・JIT・再帰 → q-tech-038, 039
  - s3: UML（クラス図・シーケンス図・ユースケース図）→ q-tech-040

- **slide-technology-08**（ハードウェア・OS詳細）
  - s1: キャッシュメモリ・SSD・BIOS/UEFI・GPU → q-tech-041, 042, 043, 044; glossary: g-cpu
  - s2: 仮想記憶（ページング・スワップ）・プロセス管理 → q-tech-046, 047; glossary: g-os
  - s3: ミドルウェア・デバイスドライバ・コンテナ型仮想化 → q-tech-048, 049, 093

- **slide-technology-09**（データベース応用）
  - s1: SQL基本（SELECT/WHERE/ORDER BY）・JOIN → q-tech-050, 051
  - s2: GROUP BY・集約関数・ビュー（VIEW） → q-tech-052, 053
  - s3: NoSQL・トランザクション詳細・正規化応用 → q-tech-054, 089, 090, 098; glossary: g-normalization, g-acid

- **slide-technology-10**（ネットワーク応用）
  - s1: NAT・DHCP・UDP vs TCP → q-tech-055, 056, 058
  - s2: MACアドレス・スイッチ・クラスCサブネット計算 → q-tech-059, 060, 061
  - s3: HTTPステータスコード・IPv6・HTTPSプロキシ → q-tech-057, 088, 091; glossary: g-dns, g-subnet

- **slide-technology-11**（セキュリティ応用）
  - s1: SQLインジェクション対策・XSS・CSRF → q-tech-063, 064, 068; glossary: g-sql-injection
  - s2: ランサムウェア・ゼロデイ・WAF・最小権限原則 → q-tech-065, 067, 069, 071
  - s3: デジタル証明書・VPN詳細・標的型攻撃・情報セキュリティ法制度 → q-tech-066, 070, 086, 087, 092, 096, 100; glossary: g-pki, g-vpn, g-firewall, g-mfa

- **slide-technology-12**（クラウド・仮想化・DevOps）
  - s1: IaaS/PaaS/SaaS詳細・SaaS特性 → q-tech-072, 094; glossary: g-iaas
  - s2: コンテナ（Docker）・マイクロサービス → q-tech-073, 074
  - s3: サーバーレス・クラウドセキュリティ（責任共有モデル）→ q-tech-075, 099; glossary: g-devops

- **slide-technology-13**（IoT・AI・新技術）
  - s1: 機械学習のIoT活用・ディープラーニング → q-tech-076, 077
  - s2: 強化学習・AIバイアス（倫理）→ q-tech-078, 079
  - s3: エッジコンピューティング（IoT文脈）→ q-tech-097

- **slide-technology-14**（システム信頼性設計）
  - s1: フェールセーフ・フォールトトレランス → q-tech-080, 081
  - s2: ホットスタンバイ・クラスタリング → q-tech-082, 083
  - s3: 稼働率計算（直列/並列）・MTBF/MTTR計算問題 → q-tech-084, 085; glossary: g-availability

---

## 8. slides_extra.ts のファイル構造テンプレート

```ts
import type { Slide } from '@/types';

export const slidesExtra: Slide[] = [
  // ========== ストラテジ系（追加）==========
  {
    id: 'slide-strategy-04',
    domain: 'strategy',
    category: 'ビジネス環境分析',
    title: 'ビジネス環境分析',
    order: 11,
    quizQuestionIds: ['q-str-014', 'q-str-015', 'q-str-016', 'q-str-017'],
    sections: [
      {
        id: 'slide-strategy-04-s1',
        title: 'PEST分析',
        content: `...`,
        keyPoints: ['...', '...', '...'],
        keywords: ['PEST分析', '外部環境分析', 'マクロ環境'],
        relatedQuestionIds: ['q-str-014'],
        relatedGlossaryIds: [],
      },
      // ...s2, s3
    ],
  },
  // ... 残り22枚
];
```

---

## 9. slides.ts への統合方法（slides_extra.ts 完成後）

`src/data/slides.ts` を以下のように変更する：

**変更前（先頭）：**
```ts
import type { Slide } from '@/types';

export const slides: Slide[] = [
```

**変更後（先頭）：**
```ts
import type { Slide } from '@/types';
import { slidesExtra } from './slides_extra';

const baseSlides: Slide[] = [
```

**変更前（末尾）：**
```ts
];

export const getSlideById = ...
```

**変更後（末尾）：**
```ts
];

export const slides: Slide[] = [...baseSlides, ...slidesExtra];

export const getSlideById = ...
```

---

## 10. 作業完了後の手順

1. `slides_extra.ts` を作成
2. `slides.ts` を上記の通り修正
3. ビルドテスト：`npm run build`（エラーがないことを確認）
4. コミット：`git add src/data/slides_extra.ts src/data/slides.ts && git commit -m "Add 23 slides covering all 217 extra questions"`
5. プッシュ：`git push -u origin claude/laughing-gates-C2Ydv`
6. GitHub Actions で自動デプロイされることを確認

---

## 11. 参考：問題キーワード一覧（クロスリンク設定用）

各問題ファイルのキーワードは以下のコマンドで確認可能：
```bash
grep -A3 "id: 'q-str-014'" src/data/questions_strategy_extra.ts | grep keywords
```

主要なキーワードと対応する用語集IDのマッピング：
- `PEST分析` → 用語集なし
- `ファイブフォース` → 用語集なし
- `CRM` → 用語集なし（g-4pにCRM記述あるが主キーワードでないためリンク不要）
- `SCM` → 用語集なし
- `KPI` → `g-kpi`
- `BSC` → `g-bsc`
- `商標権` → 用語集なし（g-copyrightは著作権のみ）
- `不正競争防止法` → 用語集なし
- `個人情報保護法` → `g-personal-info`
- `OSS` → `g-oss`
- `損益分岐点` → `g-bep`
- `ROI` → `g-roi`
- `EVM` / `CPI` / `SPI` → `g-evm`
- `クリティカルパス` → `g-critical-path`
- `WBS` → `g-wbs`
- `スクラム` → `g-scrum`
- `DevOps` → `g-devops`
- `ITIL` → `g-itil`
- `SLA` → `g-sla`
- `稼働率` / `MTBF` / `MTTR` → `g-availability`
- `CPU` → `g-cpu`
- `OS` → `g-os`
- `RAID` → `g-raid`
- `IaaS` → `g-iaas`
- `TCP/IP` → `g-tcpip`
- `サブネット` → `g-subnet`
- `DNS` → `g-dns`
- `VPN` → `g-vpn`
- `フィッシング` → `g-phishing`
- `ファイアウォール` → `g-firewall`
- `PKI` / `デジタル証明書` / `認証局` → `g-pki`
- `SQLインジェクション` → `g-sql-injection`
- `MFA` / `多要素認証` → `g-mfa`
- `AES` → `g-aes`
- `正規化` → `g-normalization`
- `ACID` → `g-acid`
- `二分探索` → `g-binary-search`
- `キュー` → `g-queue`
