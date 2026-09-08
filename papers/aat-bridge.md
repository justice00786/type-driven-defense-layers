# 防衛線モデルと AAT の橋渡し

本稿は [type-driven-defense-layers.md](type-driven-defense-layers.md) 第3層と、
iroha1203 による Algebraic Architecture Theory（AAT）および関連ツール語彙との
対応を、**主張の等級を分けて**記録する。対応表の正本はここであり、本文事例節は
要約とリンクに留める。

デモ実装: [examples/order-pipeline](../examples/order-pipeline/)  
カタログ（観測面と対応面）: [examples/observation-blind-change](../examples/observation-blind-change/)  
ピンの正本: [examples/order-pipeline/aat/AAT_PIN.md](../examples/order-pipeline/aat/AAT_PIN.md)（教育的ピン `d481b4e9f76b107b54e6d58fc7551416821bd701`。既存 `archmap.*` / `law_policy.json` は SAGA 当時の `89396ac…` を保持）

---

## 1. 主張の等級（AAT 原著の区分に合わせる）

| 等級 | 意味 | 本リポでの扱い |
| --- | --- | --- |
| Formal theorem | Lean で証明された命題 | **扱わない**（再現も実行もしない） |
| Certified bounded inference | 明示仮定のもとでの境界付き推論 | **扱わない** |
| Analytic reading | 既に構成された対象の読み方 | デモ JSON・本ノートの主領域 |
| 実装上の静的保証 | TypeScript の型検査 | L1 / L2 デモ |
| 確率的実証 | 有限サンプルの PBT・契約スキーマ | L4 デモ |

ツール出力（ArchSig measurement packet 等）を Lean 定理と同一視しない、という
原著の境界を本リポでも維持する。

---

## 2. 対応表（2等級）

### 2.1 直接写像（artifact mapping）

デモのモジュール／制約と、教育的写像 JSON のフィールドとの対応。

| 防衛線・デモ側 | AAT 側の語彙（読み） | 本リポの実体 |
| --- | --- | --- |
| `OrderDomain` / `PaymentPort` / `Persistence` | 選択された atom 候補 | `aat/archmap.*.json` の `selectedAtomCandidates` |
| モジュール文脈 | 局所 context | `selectedContexts` |
| 依存方向・境界 DTO 制約 | 選択された law の具体提示 | `aat/law_policy.json` |
| 合法結合 | composition が法則を満たす読み | `archmap.lawful.json` |
| 局所 OK・結合 NG | gluing / descent 問題意識への**分析的読みの素材** | `archmap.violating.json` の `compositionReading` |
| 選んだ観測面（件数・各側の局所テスト） | 観測読み | `change.follow.json` / `change.no-follow.json` の同一 `observationReading` |
| 表示セントと請求セントの等式 | 対応読み | 同双子の `correspondenceReading`（追随の有無だけが違う） |

### 2.2 教育的類比（analogy）

型技法と層論・代数幾何の語を**同一視しない**。理解のための類比に留める。

| 防衛線側 | 類比として読むもの | 同一視しないもの |
| --- | --- | --- |
| Branded parse / Typestate | 「正当化された局所データ」「状態制約の提示」 | structure sheaf の断面そのもの |
| Exhaustiveness / `assertNever` | 局所場合分けの完了 | 大域的な descent の証明 |
| PBT / 境界スキーマ | 有限観測・measurement に近い姿勢 | Part VIII の measurement theorem |
| 違反エッジのリスト | obstruction の**素材** | obstruction ideal sheaf / H¹ |
| カタログの `Observation` 型 | 「選んだ観測面」 | AAT の measurement / ArchSig packet |
| `toTicket` の境界整形 | 「正規化は設計対象」 | 比較の分解に現れる因子 E |

---

## 3. モノイド・関手・モナド近似とその限界

本文 §2 が注意するように、第3層を「モノイド・関手・モナドによるモジュール結合」とのみ
説明することは、AAT が用いる代数幾何的語彙の**近似**である。本節は合成代数の直観と
幾何診断の差を述べる。§2.2 の類比表は再掲しない。

### 3.1 問いの違い

| 近似（モノイド・関手・モナド） | AAT |
| --- | --- |
| 部品をどう代数的に繋ぐか | 固定した atom / law / 被覆のもとで合法に貼り付くか |
| 結合律・関手性・副作用の合成 | サイト上の層・法則切断・降下 |
| Moggi・代数駆動設計などに近い直観 | Mac Lane–Moerdijk / Goguen (1992) の系譜＋ AAT 固有構成 |

近似は「合成がある」という入口には使える。AAT の核は合成ツール箱ではなく、
相対幾何（atom 語彙・法則宇宙・被覆位相など）のもとでの**局所–大域診断**である。

### 3.2 局所 OK・大域 NG

近似では見えにくい第3層固有の失敗様式が、違反写像に現れる。

- デモ: [archmap.violating.json](../examples/order-pipeline/aat/archmap.violating.json)
- 読み方: [READING.md](../examples/order-pipeline/aat/READING.md)（The gluing-failure story）

各 `context` は `locally-ok` でも、Domain が Persistence 内部に依存すると
`compositionReading` は `globally-ng` になる。Typestate やモナド合成だけでは、
この様式を第一級の対象にできない（§5・§2.1 も参照）。

### 3.3 障害の身分

近似では障害が「合成失敗」「依存不正」といったフラグに潰れがちである。AAT では
障害は obstruction ideal sheaf として集まり、合法軌跡はその零点集合として定義される。
本リポの違反エッジリストは §2.2 どおり obstruction の**素材**に過ぎず、
障害イデアル層や H¹ の計算・数値化は行わない（§6）。

### 3.4 写るもの・写らないもの

| 近似・デモ側の直観 | 写る読み（§2.1） | 写らない／同一視しないもの（§2.2・§6） |
| --- | --- | --- |
| モジュールを繋ぐ | atom 候補・選択された law・合法／違反の composition 読み | サイト・層・降下そのもの |
| 結合の失敗 | gluing / descent への**分析的読みの素材** | obstruction ideal sheaf / Čech / H¹ |
| モノイド的合成 | 「部品を繋ぐ」感覚 | Lean 定理・ArchSig measurement |

---

## 4. ArchSig と FieldSig（参照境界）

| ツール | 役割（ピンした guideline に基づく要約） | 本リポ |
| --- | --- | --- |
| ArchSig | 供給された ArchMap + LawPolicy（および関連 surface / profile）から境界付き診断・測定パケットを出す | **実行しない**。語彙と責任分界の参照のみ |
| FieldSig | ArchSig の handoff とワークフロー証拠から SFT 寄りの進化測定へ写す | **実行しない**。予測・Forecast も扱わない |
| Lean `Formal/` | 構造的命題の形式証明 | **実行しない** |

公開理論テキスト: https://iroha1203.dev/aat/  
上流リポジトリ: https://github.com/iroha1203/AlgebraicArchitectureTheoryV2

SAGA 比較定理プレプリント（局所–大域の能力証明; 本リポは再現しない）:

- 版 DOI: https://doi.org/10.5281/zenodo.21605207
- 概念 DOI（最新版へのポインタ）: https://doi.org/10.5281/zenodo.21603761
- Release tag: `saga-paper-v1.0.0`
- 日本語解説（非一次）: https://zenn.dev/iroha1203/articles/084d26f42dde32

---

## 5. データ流と構造診断の分離

本文のレイヤー番号（対象範囲の広がり）と、データの時系列は一致しない。

- **データ流（デモの実行パス）**: 外部 JSON → L2 parse / typestate → L1 網羅分岐 → L4 PBT・境界スキーマ
- **構造診断（メタ）**: 上記モジュール群を atom / law の教育的写像として読む（L3）。データの「後段」ではない

違反写像が示すのは、「各 context は locally-ok でも、結合で law が破れる」という
第3層固有の失敗様式である。Typestate だけではこの様式を表現できない。§3 の近似批判と
同じ失敗様式を、データ流との軸の違いとして再確認する。

---

## 6. 非主張リスト

本リポおよび `examples/order-pipeline/aat/` は、次を主張しない。

1. Lean 証明の再現または `sorry` なし証明の完了
2. 障害イデアル層（obstruction ideal sheaf）の計算
3. Čech 降下やコホモロジー類（H⁰ / H¹ / H²）の数値化
4. SFT / FieldSig による将来予測
5. 公式 ArchMap / LawPolicy スキーマへの適合保証
6. ArchSig をこれらの JSON に対して実行した結果の妥当性
7. SAGA 論文の release identity（Lean status・ArchSig 計測・`saga-paper-v1.0.0`）の再現または追認
8. アンナプルナ定理群（上流カード G-101〜G-118、Lean 16本）の再現または完了追認
9. 「観測から分類情報が失われる」ことの証明。示すのは、**選んだ観測面では一致し、対応面では分かれる1組**であること
10. 正規化因子 E、ビュー間輸送、修理トーサー、垂直剛性の計算。これらは §8 の語彙であり、JSON や TypeScript の対象ではない

---

## 7. 事実性チェックリスト

改訂・追記時に確認する項目（MAD 全面再実行の代替）。

- [x] `AAT_PIN.md` の教育的ピンが新規 `change.*` と本ノート §8 で一致している
- [x] 既存 `archmap.*` / `law_policy.json` の `aatPin`（`89396ac…`）を書き換えていない
- [x] ArchSig / FieldSig / Lean の役割記述が「実行しない」と矛盾していない
- [x] 対応表が「直接写像」と「教育的類比」に分かれている
- [x] 違反フィクスチャに局所 OK・結合 NG の説明がある
- [x] 観測双子が同一の `observationReading` を持ち、差は `correspondenceReading` だけである
- [x] 「スキーマ準拠」「定理」「証明済み」などの強い語がデモ成果物に付いていない
- [x] FieldSig / SFT 予測への踏み込みがない
- [x] §3（モノイド・関手・モナド近似）が §2.2 の非同一視と整合し、類比表を再掲していない
- [x] SAGA 版 DOI・査読誌未掲載・SAGA と展望（Architecture scheme / SFT）の区別が本文と一致している
- [x] 本文が Gr4 / 因子 E の術語を限界表に載せておらず、アンナプルナ記事を非一次としている
- [x] `toTicket` を因子 E と同一視していない

（本版作成時点で上記を確認済み。改訂時は該当項目をいったん外し、再確認後に戻す。）

---

## 8. アンナプルナ以降の分析的読み

2026年8–9月の上流作業（カード G-101〜G-118）は、ビュー間の輸送・足場取り替え・比較の分解・観測の限界を分類した。解説は [Zenn アンナプルナ記事](https://zenn.dev/iroha1203/articles/386c09eacbfabc)（非一次）。Lean 本体は上流 `Formal/` にあり、本リポは再現しない。

本リポが**直接写像**として持つのは、第5節の表に対応する1組だけである。

| 固定実例で比べるもの | `change.follow.json` | `change.no-follow.json` |
| --- | --- | --- |
| 変更元に加える変更 | 同じ（表示側の丸めを半偶数へ） | 同じ |
| 相手側の対応 | 請求側が追随する | 何もしない |
| 選んだ観測の結果 | 同一の `observationReading` | 同一の `observationReading` |
| 比較との整合 | 保たれる | 保たれない |

TypeScript 側の同じ分離は [examples/observation-blind-change](../examples/observation-blind-change/) である。`Observation` は `assertFit` に渡せない。これは情報理論的な喪失の証明ではなく、選んだ観測面では一致する1組の展示である。

残る語彙は類比であり、成果物を作らない。

| 語彙 | 本リポでの扱い | 同一視しないもの |
| --- | --- | --- |
| 正規化因子 E | 「観測に見えなくても比較を左右しうる整形がある」 | `toTicket`、コードフォーマッタ、JSON 上の E 対象 |
| ビュー間の輸送 | 解像度を変えても同じ不整合を読める、という問題意識 | サービス／モジュール用の追加 ArchMap |
| 修理のトーサー | 追随変更の自由度を漏れなく書ける、という問題意識 | 群や剰余類の計算 |
| 垂直方向の剛性 | ラベル付け替えは対応の証明に使えない | ブランド付け替えが意味を変えないことの定理 |
| 定義どおりの Gr4 | 足場往復の完全閉鎖は、上流自身が達成しないと記録した | 本リポが Gr4 の成否を判定したこと |

既存の gluing 物語（局所 OK・結合 NG）は置換しない。観測双子は、その次の失敗様式——局所テストも選んだ観測も同じなのに、対応だけが壊れる——を足す。
