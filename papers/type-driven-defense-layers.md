# 型駆動開発における多重防衛線モデル：CHL対応からAATおよび動的検証への階層的統合

## 要旨

本稿は、現代の型駆動開発（Type-Driven Development）を、単一の変数の型から分散システム全体に至るまで、数学的構造（型論・圏論・代数学）を用いて不正な状態と論理的矛盾を段階的に遮断する「多重防衛線」として体系化する。具体的には、（1）Curry-Howard-Lambek対応（CHL対応）に基づくミクロ論理層、（2）ドメイン・状態エンコーディングによる型表現力拡張層、（3）代数的アーキテクチャ理論（Algebraic Architecture Theory, AAT）によるマクロ構造層、（4）Property-Based Testingおよび契約テストによる動的・意味検証層という4階層からなるモデルを提示する。各層は独立した学術的系譜を持ちながら、静的証明・構造設計・動的実証という一貫した秩序のもとで相互補完的に機能する。本稿ではこのモデルの階層構造、各層の保証メカニズムと限界、データが型を通じて信頼性を獲得していく時系列（②→①→④）、および第3層をデータの後段ではなく構造診断として分離して示す。メモリ安全性は本稿4層の層外前提とし、情報フロー制御（IFC）は隣接領域としてサーベイ側に委ねる。注文ドメインの最小デモと AAT 語彙の教育的写像を同梱するが、ArchSig / FieldSig / Lean の実行や公式スキーマ適合は主張しない。第3層の AAT は iroha1203 による Lean 形式化を伴う研究プロジェクトを典拠とし、局所–大域の能力証明については Nakahata (2026) の SAGA 比較定理プレプリント（https://doi.org/10.5281/zenodo.21605207）を公開典拠とする。

**キーワード**：型駆動開発、Curry-Howard-Lambek対応、Typestate、代数的設計、Property-Based Testing、Algebraic Architecture Theory

---

## 1. はじめに

型駆動開発は、しばしば「TypeScriptなどの言語で型注釈を書くこと」に矮小化されて理解される。しかし、その理論的射程は関数単体の健全性検証から、ドメインモデルの不変量表現、モジュール間結合の代数的整合性、さらにはコンパイル時には到達し得ないネットワーク境界や時間的性質の検証にまで及ぶ。本稿は、これらを応用圏論（Applied Category Theory）および型論理学における主要な研究成果を分野横断的に統合・再構成することで、「4つの防衛線」として整理する。この整理は特定の単一論文に依拠するものではなく、複数の学術的系譜を実践的な設計原則として束ねたものである。本稿の4層は「正しさ／表現可能性」の軸で整理する。メモリ安全性（メモリ安全言語＝MSL 等）は言語実行基盤としての**層外前提**であり、層番号には対応しない。情報フロー制御（IFC）は機密・完全性のラベル伝播を扱う**隣接領域**であり、本稿のコア層には含めない。言語ベースのセキュリティ（LBS）、LangSec、IFC、メモリ安全言語政策など、従来の Defense-in-Depth を型システム側へ対応付ける隣接サーベイは [lbs-defense-in-depth-survey.md](lbs-defense-in-depth-survey.md) に分離して収録する。当該サーベイの5層は本稿の4層を置換せず、正本は本稿のままである。

## 2. 概念の階層マップ：4つの防衛線

型駆動開発が不正な状態・論理的矛盾を遮断する仕組みは、対象範囲の異なる4つの層として捉えることができる。

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. ミクロ論理層：CHL対応（理論的基礎）                              │
│    - 「型 ＝ 命題」「プログラム ＝ 証明」                          │
│    - Discriminated Unions / Exhaustiveness Checking              │
├─────────────────────────────────────────────────────────────────┤
│ 2. 型表現力拡張層：Domain & State Encoding                        │
│    - Parse, don't validate（証明手形の発行）                      │
│    - Typestate Pattern（状態遷移の型エンコード）                  │
│    - Refinement Types / Branded Types                            │
├─────────────────────────────────────────────────────────────────┤
│ 3. マクロ構造層：AAT（Algebraic Architecture Theory）              │
│    - iroha1203によるLean形式化研究およびSAGAプレプリントに基づく（§6.3参照） │
│    - アーキテクチャ原子（atom）・AATサイト・層（sheaf）・法則代数   │
│      （law algebra）・障害イデアル層（obstruction ideal sheaf）・  │
│      合法軌跡（lawful locus）・アーキテクチャスキームによる代数幾何的記述 │
├─────────────────────────────────────────────────────────────────┤
│ 4. 動的・意味検証層：Dynamic & Semantic Verification               │
│    - Property-Based Testing（代数法則の自動ランダム検証）          │
│    - Mapping契約テスト / Schema First                             │
│    - 冪等Brand / 時間型                                           │
└─────────────────────────────────────────────────────────────────┘
```

第1層から第4層に向かうにつれ、検証対象は「単一の式」から「システム全体・分散境界」へと拡大し、保証の様式も静的証明から動的実証へと移行する。第3層を「モノイド・関手・モナドによるモジュール結合」とのみ説明することは、実際の AAT が用いる代数幾何的な語彙（サイト・層・障害イデアル層など）の近似に過ぎない。本稿では出典に合わせて記述する。近似と AAT 本体の差の正本は [aat-bridge.md](aat-bridge.md) §3 を参照する。

## 3. 各レイヤーの役割とメカニズム

| レイヤー | 対象範囲 | 保証メカニズム | 代表的な技術・手法 | 各層の限界 |
|---|---|---|---|---|
| ① CHL対応 | 単体の関数・型 | 論理的矛盾の排除。「型が存在しない＝偽」「分岐の網羅＝証明完了」 | Discriminated Unions、`never`型による全称性検証（`assertNever`） | `any`・型アサーション等の逃げ道があり、CH対応は理想化されたモデルである |
| ② 型表現の拡張 | ドメイン境界・状態 | 不正状態・無効操作の排除。データの正当性を型へと変換して証明 | Parse, don't validate、Typestate（遷移不能操作の型エラー化）、Branded Types | 設計・保守コストを伴い、費用対効果が見合わない場合がある |
| ③ AAT | モジュール間・アーキテクチャ | アーキテクチャの不変量維持を代数幾何的構造（層・障害イデアル層）として診断 | AATサイト、法則代数、障害イデアル層、合法軌跡、Čech降下 | SAGA 比較定理は Zenodo プレプリントとして公開済みだが査読誌未掲載。AAT 全体（特に SFT 側）はなお進行中の形式化研究である。「証明済み」の範囲は論文／Lean が示す範囲に限られ、実行時メトリクスや経験的予測（SFT側の`ForecastCone`等）は理論の帰結として同一視すべきではない、と原著自身が明記している。選んだ観測だけでは整合する変更を見分けられない例があり、詳細は [aat-bridge.md](aat-bridge.md) §8 |
| ④ 動的・意味検証 | 型システムの外側・分散境界 | 代数法則と境界の動的補強。コンパイル時証明が届かない時間・実行・通信をアサート | Property-Based Testing（fast-check）、Pact / OpenAPI契約テスト、IdempotencyKeyの状態検証 | 有限サンプルによる確率的な信頼性向上であり、証明ではない |

### 3.1 レイヤー1：ミクロ論理層（CHL対応）

Curry-Howard-Lambek対応は、「型」と「論理命題」、「プログラム」と「証明」、さらに「圏（Category）」を三位一体として結びつける理論的基盤である。Discriminated Unionsとexhaustiveness checkingにより、コンパイラは「あらゆる分岐が尽くされていること」を証明として要求し、未処理の状態を型エラーとして拒絶する。

### 3.2 レイヤー2：型表現力拡張層（Domain & State Encoding）

第2層は、ドメインの不変量そのものを型に刻み込む設計技法群である。「Parse, don't validate」は、真偽値を返す検証ではなく、より狭い型への変換（パース）を通じて「有効なデータである」という証明手形を発行する考え方である。Typestateパターンはオブジェクトの状態遷移を型システムに反映し、許されない操作をコンパイル時に排除する。Refinement Types・Branded Typesは値の制約や意味的な領域をさらに精緻化する。

隣接分野からの薄い補強として、入力を形式言語として厳密に認識する LangSec、通信プロトコルの順序を振る舞い型で縛るセッション型・マルチパーティ・セッション型（MPST）、実行時検証の証拠を型で持ち回る Ghost of Departed Proofs（GoDP）がある。LangSec は「Parse, don't validate」と親和し、セッション型・MPST は Typestate の通信側拡張、GoDP は Brand／証明手形の近縁であるが Brand と同一視しない。詳細と文献は [lbs-defense-in-depth-survey.md](lbs-defense-in-depth-survey.md) §3–5 を参照する（本稿 §2 地図・§3 表のコア技術は変えない）。

### 3.3 レイヤー3：マクロ構造層（AAT）

第3層は、モジュールやアーキテクチャ全体を代数幾何的な対象として捉える。第3層の**直接典拠**は二層からなる。（1）iroha1203 による Algebraic Architecture Theory（[AlgebraicArchitectureTheoryV2](https://github.com/iroha1203/AlgebraicArchitectureTheoryV2)）の理論・ツール全体、および（2）局所–大域の能力証明としての Nakahata (2026) *SAGA* プレプリント（https://doi.org/10.5281/zenodo.21605207）。アーキテクチャ原子、AATサイト、層（sheaf）、法則代数、障害イデアル層（obstruction ideal sheaf）、合法軌跡（lawful locus）、アーキテクチャスキーム、Čech降下といった語彙によって、結合における不変量の維持や構造的衝突を診断する。AAT 自体は査読付き学術誌への掲載物ではなく、Lean 形式化を伴う独立研究である。SAGA 比較定理は Zenodo プレプリントとして公開済み（証明・Lean 形式化 status・ArchSig 計測の三層を同一 release identity に固定）だが、査読誌論文ではない。その一方、サイト・層・降下による局所–大域整合の定式化自体は、Goguen (1992) の層意味論や Mac Lane & Moerdijk (1992) に代表される層論、および古典的な代数的仕様の研究に遡る**確立した査読付き系譜**に位置づけられる。障害イデアル層・合法軌跡など SAGA 外の構成や Architecture scheme / SFT といった展望は、その系譜の上に置かれた形式化研究・研究展望であり、査読公開物と同一視しない。

実務接続の語彙として、同プロジェクトは **ArchSig**（供給された ArchMap・LawPolicy 等から境界付きの構造診断・測定パケットを生成する）と **FieldSig**（ArchSig の handoff とワークフロー証拠を SFT 寄りの進化測定へ写す）を提供する。本稿および同梱デモはこれらのツールを**実行しない**。語彙対応・主張等級・非主張および教育的ピンの正本は [aat-bridge.md](aat-bridge.md) と [AAT_PIN.md](../examples/order-pipeline/aat/AAT_PIN.md) を参照する。ツール出力を Lean 上の形式定理と同一視しない。

隣接のプログラム検証として、F*・Verus・Kani 等はプログラムの正当性証明を扱うが、本稿の第3層（AAT によるアーキテクチャ構造診断）と**同一視しない**。AAT／SAGA の主張等級は引き続き [aat-bridge.md](aat-bridge.md) を正本とし、サーベイ側の形式検証整理は [lbs-defense-in-depth-survey.md](lbs-defense-in-depth-survey.md) §7 を参照する。

### 3.4 レイヤー4：動的・意味検証層

第4層は、型システムが物理的に到達できない領域——実行時の振る舞い、時間的性質、ネットワークを跨ぐ通信——を動的テストによって補強する。Property-Based Testingは代数法則をランダム入力によって機械的に検証し、契約テスト（Pact / OpenAPI）はサービス境界を跨いだスキーマの同型性を維持する。冪等性を保証するBrandや時間型は、副作用の整合性を実証する。

## 4. データ流と構造診断

システムを通過する**データ**の信頼性は、主に次の時系列で段階的に引き上げられる。

```
[ 外部の不確実なデータ (string / JSON) ]
         │
         ▼  【レイヤー2: Parse, don't validate】
[ 厳密な型 / Refinement Type ]  ── 「有効なデータである」証明手形
         │
         ▼  【レイヤー1: CHL対応】
[ 状態遷移 / 計算 (Pure Function) ]  ── 型チェック＝矛盾のない推論・計算
         │
         ▼  【レイヤー4: PBT / Mapping契約】
[ ネットワーク / DB境界 ]  ── Propertyテストと契約テストで境界の同型性を死守
```

第3層（AAT）は、このデータ流の「後段」ではない。モジュールや依存法則を atom / law / obstruction などの語彙で読む**構造診断（メタ）**であり、局所的に正しい文脈が大域で破綻しうる、という失敗様式を扱う。レイヤー番号（①→②→③→④）は対象範囲の広がりによる分類であり、データの時系列（②→①→④）および構造診断（③）とは軸が異なる。詳細な語彙対応は [aat-bridge.md](aat-bridge.md) を参照する。

## 5. 事例：注文ドメイン

同梱デモ [examples/order-pipeline](../examples/order-pipeline/) は、注文（Order）ライフサイクルを一本の糸として、各層が何を遮断し何を遮断しないかを具体化する。

**データ流（②→①→④）**

| 層 | デモ上の実体 | 遮断するもの | 遮断しないもの（限界） |
| --- | --- | --- | --- |
| ② | `src/brands.ts`（`OrderId` / `Money` の parse）、`src/orderTypestate.ts`（`Order<S>` phantom Typestate: Draft→Placed→Paid）、不正遷移の型エラーは `test/typestate-negatives.ts` | 不正な ID・負の金額、許可されない状態遷移 | parse を迂回する型アサーション（`src/escapes.ts`） |
| ① | `describeOrder` と `assertNever` による網羅 | 未処理の状態分岐 | `as` および不完全 switch（`src/escapes.ts` の `incompleteDescribe`）で CHL が無力化されること |
| ④ | `test/properties.test.ts`、`test/schema.test.ts`、`schemas/order-boundary.schema.json` | 有限サンプル内での法則違反・境界スキーマ不整合 | 全入力空間の証明（有限サンプルの限界をテストコメントで注記） |

**構造診断（③）**

| 読み | 実体 | 示すこと |
| --- | --- | --- |
| 合法 | `aat/archmap.lawful.json` | Domain→Port 依存が法則を満たす |
| 違反 | `aat/archmap.violating.json` | 各 context は locally-ok だが、Domain が Persistence 内部に依存すると結合で失敗する（gluing 失敗の**分析的読みの素材**） |
| 法則選択 | `aat/law_policy.json` | 依存方向・境界 DTO の選択された law |
| 観測双子 | `aat/change.follow.json` / `aat/change.no-follow.json` | 選んだ観測は同一で、追随の有無だけが対応を分ける（詳細は [aat-bridge.md](aat-bridge.md) §8） |

これらの JSON は ArchMap / LawPolicy の公式スキーマ適合や ArchSig 実行結果を主張しない。ピンと非主張は `aat/AAT_PIN.md` および [aat-bridge.md](aat-bridge.md) を正本とする。

本デモの対象外は、セッション型・MPST、GoDP、IFC、メモリ安全言語（MSL）政策である。これらは正本の薄い補強・層外前提・隣接ポインタであり、デモ実装には含めない。

## 6. 各層を支える代表的文献

### 6.1 レイヤー1：ミクロ論理層（CHL対応）

- Wadler, P. (2015). *Propositions as Types*. Communications of the ACM. カリー＝ハワード対応の歴史的背景と、型と論理命題が本質的に同型である理由を解説した基礎文献。
- Lambek, J. (1986). *Introduction to Higher Order Categorical Logic*. カリー＝ハワード対応に圏論（Cartesian Closed Category）を統合し、CHL対応（三位一体）として完成させた著作。

### 6.2 レイヤー2：型表現力拡張層

- King, A. (2019). *Parse, don't validate*. 「検証してbooleanを返す」のではなく「パースしてより狭い型へ昇華させる」という設計原則を提唱した論考。
- Strom, R. E., & Yemini, S. (1986). *Typestate: A programming language mechanism for enhancing software reliability*. オブジェクトの状態に応じた操作可能性を型システムにエンコードするTypestate概念の原典。
- Brady, E. (2017). *Type-Driven Development with Idris*. Manning Publications. 依存型言語Idrisの著者による、型を仕様として実装をガイドする開発フローの解説書。

### 6.3 レイヤー3：マクロ構造層（AAT）

- **Nakahata, H. (2026).** *SAGA: A Comparison Theorem for Local-to-Global Software Architecture*. Zenodo. https://doi.org/10.5281/zenodo.21605207 — 局所–大域の能力証明（SAGA 比較定理）の公開典拠。修理の言葉で測った障害と方程式の言葉で測った障害が同じコホモロジー類として一致することを証明し、証明・Lean 形式化 status・ArchSig による実在 OSS 計測の三層を release tag `saga-paper-v1.0.0` の同一スナップショットに固定する。Preprint（CC BY 4.0）。査読付き学術誌への掲載ではない。著者の公開ハンドルは iroha1203。日本語の読解ガイドとして [Zenn 解説](https://zenn.dev/iroha1203/articles/084d26f42dde32) がある（一次典拠ではない）。観測と変更の両立に関する後続の解説（一次典拠ではない）として [アンナプルナ記事](https://zenn.dev/iroha1203/articles/386c09eacbfabc) がある。分析的読みは [aat-bridge.md](aat-bridge.md) §8。
- **iroha1203 (2026).** *Algebraic Architecture Theory & Software Field Theory* (AlgebraicArchitectureTheoryV2) [ソフトウェア・研究リポジトリ]. GitHub. https://github.com/iroha1203/AlgebraicArchitectureTheoryV2 — 本稿の第3層「AAT」の理論・ツール全体の作業スナップショット典拠。アーキテクチャ原子・AATサイト・層・法則代数・障害イデアル層・合法軌跡・アーキテクチャスキーム・Čech降下・導来法則幾何を用いてアーキテクチャを代数幾何的対象として扱う理論、およびソフトウェア進化を計算可能な対象として扱う関連理論 Software Field Theory（SFT）、両者を実務の成果物に接続するツール群 ArchSig / FieldSig からなる。Lean 4 上で構造的命題の形式証明を進めており、`axiom` / `sorry` 等の未証明の抜け道を使わない方針を明記している。査読付き学術誌への掲載物ではなく、SAGA プレプリント公開後も独立研究プロジェクトとして継続している点には留意が必要。教育的写像のピンは [AAT_PIN.md](../examples/order-pipeline/aat/AAT_PIN.md) を正本とする（公開読解面 https://iroha1203.dev/aat/ ）。ArchSig は境界付き診断・測定、FieldSig は進化測定への写像であり、いずれも Lean 定理そのものではない。語彙対応の詳細は [aat-bridge.md](aat-bridge.md)。
- **関連系譜（査読付き／標準的学術書）**：AAT 本体を査読公開物とみなすものではなく、サイト・層・降下および代数的仕様という問題設定の学術的地盤を示す。
  - Goguen, J. (1992). *Sheaf semantics for concurrent interacting objects*. *Mathematical Structures in Computer Science*, 2(2), 159–191. — オブジェクトと相互結合を層で扱う査読付き原典。局所整合が大域で失敗しうるという問題意識の先行研究。
  - Mac Lane, S., & Moerdijk, I. (1992). *Sheaves in Geometry and Logic: A First Introduction to Topos Theory*. Springer. — AATサイト・層・Grothendieck位相の数学的基板。
  - Goguen, J. (1996). *Parameterized Programming and Software Architecture*. Proceedings of ICSR 1996.（代数的仕様・アーキテクチャ合成の系譜）
- Maguire, S. (2021). *Algebra-Driven Design*. Leanpub.（代数的仕様に基づく設計というより広い文脈での関連文献。書籍／Leanpubであり査読論文ではない）

### 6.4 レイヤー4：動的・意味検証層

- Claessen, K., & Hughes, J. (2000). *QuickCheck: a lightweight tool for random testing of Haskell programs*. ICFP. Property-Based Testingの原点論文。結合律や可換性などの代数法則をランダム入力で機械的に自動検証する手法を確立した。
- Moggi, E. (1991). *Notions of computation and monads*. Information and Computation. 計算の副作用（IO、時間、状態変化など）を代数的なモナドとして型システムに取り込む基礎を作った論文。

## 7. 結論

現代の型駆動開発は、単に型注釈を記述する技術ではなく、静的証明・構造設計・動的実証という一貫した数学的秩序によってソフトウェアの健全性を多重に防衛するアプローチである。第一に、CHL対応はコードの矛盾を型チェッカーにとって不可能な状態として排除する。第二に、TypestateおよびParse, don't validateはドメインの不変量を型そのものにエンコードする。第三に、AAT（iroha1203, 2026; Nakahata, 2026）はアーキテクチャの不変量を代数幾何的構造として診断し、局所–大域の能力証明は SAGA プレプリントとして公開されている。選んだ観測だけでは整合する変更を見分けられない例の読みは [aat-bridge.md](aat-bridge.md) §8 に分離する。第四に、Property-Based Testingおよび契約テストは、型システムが物理的に到達し得ない境界や意味的正しさを動的に補強する。レイヤー番号は対象範囲の分類であり、データの時系列や構造診断と同一視してはならない。同梱デモは各層の遮断範囲と限界を具体化するが、AAT ツール実行や SAGA 論文の release identity の再現を主張するものではない。各層には実務上の限界があり、保証の様式を過信すべきではない。この4層構造は、それぞれ独立した学術的系譜を持ちながらも、対象範囲を段階的に拡大しつつ相互補完的に機能する統合的な設計思想として理解されるべきである。語彙対応と非主張の正本は [aat-bridge.md](aat-bridge.md) を参照する。

## 参考文献

1. Wadler, P. (2015). Propositions as Types. *Communications of the ACM*, 58(12), 75–84.
2. Lambek, J. (1986). *Introduction to Higher Order Categorical Logic*. Cambridge University Press.
3. King, A. (2019). Parse, don't validate. Personal essay / functional programming literature.
4. Strom, R. E., & Yemini, S. (1986). Typestate: A programming language mechanism for enhancing software reliability. *IEEE Transactions on Software Engineering*, 12(1), 157–171.
5. Brady, E. (2017). *Type-Driven Development with Idris*. Manning Publications.
6. Nakahata, H. (2026). *SAGA: A Comparison Theorem for Local-to-Global Software Architecture*. Zenodo. https://doi.org/10.5281/zenodo.21605207 （Preprint, CC BY 4.0; release tag `saga-paper-v1.0.0`。著者の公開ハンドルは iroha1203）
7. iroha1203 (2026). *Algebraic Architecture Theory & Software Field Theory* (AlgebraicArchitectureTheoryV2). GitHub. https://github.com/iroha1203/AlgebraicArchitectureTheoryV2 （教育的ピンの正本: [AAT_PIN.md](../examples/order-pipeline/aat/AAT_PIN.md)）
8. Goguen, J. (1992). Sheaf semantics for concurrent interacting objects. *Mathematical Structures in Computer Science*, 2(2), 159–191.
9. Mac Lane, S., & Moerdijk, I. (1992). *Sheaves in Geometry and Logic: A First Introduction to Topos Theory*. Springer.
10. Goguen, J. (1996). Parameterized Programming and Software Architecture. *Proceedings of ICSR 1996*.
11. Maguire, S. (2021). *Algebra-Driven Design*. Leanpub.
12. Claessen, K., & Hughes, J. (2000). QuickCheck: A lightweight tool for random testing of Haskell programs. *Proceedings of ICFP 2000*.
13. Moggi, E. (1991). Notions of computation and monads. *Information and Computation*, 93(1), 55–92.
