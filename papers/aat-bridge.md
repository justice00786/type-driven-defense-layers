# 防衛線モデルと AAT の橋渡し

本稿は [type-driven-defense-layers.md](type-driven-defense-layers.md) 第3層と、
iroha1203 による Algebraic Architecture Theory（AAT）および関連ツール語彙との
対応を、**主張の等級を分けて**記録する。対応表の正本はここであり、本文事例節は
要約とリンクに留める。

デモ実装: [examples/order-pipeline](../examples/order-pipeline/)  
ピン: [examples/order-pipeline/aat/AAT_PIN.md](../examples/order-pipeline/aat/AAT_PIN.md)（commit `89396ac98c84ee332bcb8ae85ee863f13c84e042`）

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

### 2.2 教育的類比（analogy）

型技法と層論・代数幾何の語を**同一視しない**。理解のための類比に留める。

| 防衛線側 | 類比として読むもの | 同一視しないもの |
| --- | --- | --- |
| Branded parse / Typestate | 「正当化された局所データ」「状態制約の提示」 | structure sheaf の断面そのもの |
| Exhaustiveness / `assertNever` | 局所場合分けの完了 | 大域的な descent の証明 |
| PBT / 境界スキーマ | 有限観測・measurement に近い姿勢 | Part VIII の measurement theorem |
| 違反エッジのリスト | obstruction の**素材** | obstruction ideal sheaf / H¹ |

---

## 3. ArchSig と FieldSig（参照境界）

| ツール | 役割（ピンした guideline に基づく要約） | 本リポ |
| --- | --- | --- |
| ArchSig | 供給された ArchMap + LawPolicy（および関連 surface / profile）から境界付き診断・測定パケットを出す | **実行しない**。語彙と責任分界の参照のみ |
| FieldSig | ArchSig の handoff とワークフロー証拠から SFT 寄りの進化測定へ写す | **実行しない**。予測・Forecast も扱わない |
| Lean `Formal/` | 構造的命題の形式証明 | **実行しない** |

公開理論テキスト: https://iroha1203.dev/aat/  
上流リポジトリ: https://github.com/iroha1203/AlgebraicArchitectureTheoryV2

---

## 4. データ流と構造診断の分離

本文のレイヤー番号（対象範囲の広がり）と、データの時系列は一致しない。

- **データ流（デモの実行パス）**: 外部 JSON → L2 parse / typestate → L1 網羅分岐 → L4 PBT・境界スキーマ
- **構造診断（メタ）**: 上記モジュール群を atom / law の教育的写像として読む（L3）。データの「後段」ではない

違反写像が示すのは、「各 context は locally-ok でも、結合で law が破れる」という
第3層固有の失敗様式である。Typestate だけではこの様式を表現できない。

---

## 5. 非主張リスト

本リポおよび `examples/order-pipeline/aat/` は、次を主張しない。

1. Lean 証明の再現または `sorry` なし証明の完了
2. 障害イデアル層（obstruction ideal sheaf）の計算
3. Čech 降下やコホモロジー類（H⁰ / H¹ / H²）の数値化
4. SFT / FieldSig による将来予測
5. 公式 ArchMap / LawPolicy スキーマへの適合保証
6. ArchSig をこれらの JSON に対して実行した結果の妥当性

---

## 6. 事実性チェックリスト

改訂・追記時に確認する項目（MAD 全面再実行の代替）。

- [x] `AAT_PIN.md` の commit SHA が本文・本ノート・デモで一致している
- [x] ArchSig / FieldSig / Lean の役割記述が「実行しない」と矛盾していない
- [x] 対応表が「直接写像」と「教育的類比」に分かれている
- [x] 違反フィクスチャに局所 OK・結合 NG の説明がある
- [x] 「スキーマ準拠」「定理」「証明済み」などの強い語がデモ成果物に付いていない
- [x] FieldSig / SFT 予測への踏み込みがない

（本版作成時点で上記を確認済み。改訂時は該当項目をいったん外し、再確認後に戻す。）
