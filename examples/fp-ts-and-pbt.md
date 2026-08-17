# fp-ts と PBT の位置づけと使い方

[examples/README.md](./README.md) の Claim boundary が「カタログは Zod / fp-ts / PBT / AAT JSON を足さない」と書く理由と、本番や正本デモでそれらをいつ足すかを整理する。

**制御の正本は [envelopes-and-control.md](./envelopes-and-control.md)。** 封筒の選び方、throw の可否、early return か局所 `bind` かはそちらで決める。このノートは、そのあと **ライブラリや PBT を足すか** だけの二段目である。

4層モデルの正本は [papers/type-driven-defense-layers.md](../papers/type-driven-defense-layers.md)、主張等級は [papers/aat-bridge.md](../papers/aat-bridge.md)。ライブラリの API リファレンスではない。ArchSig / Lean / FieldSig の実行も扱わない。

## 1. 先に結論

判断は二段。一段目を飛ばして「複数段だから fp-ts」とはしない。

1. [envelopes-and-control.md](./envelopes-and-control.md) — Result 合成をするか。early return か局所 `bind` か。throw するか。
2. このノート — `bind` を選んだあと、自前 `bind` で足りるか、本番で fp-ts / neverthrow を足すか。PBT を足すか。

| 道具 | このリポでの層 | カタログ3パッケージ | 正本 `order-pipeline` | 本番で足すとき |
| --- | --- | --- | --- | --- |
| fp-ts | L1 の結果型、L2 のパース合成。L3 のモナド近似の入口にはなるが AAT 本体ではない | **足さない**。制御は `{ ok }` / `T \| ParseError` + early return | **足さない** | envelopes が局所 `bind` を選び、自前 helper では読みにくいとき |
| PBT（fast-check） | L4。型が届かない法則の動的補強 | **足さない**。L4 カタログは時間型・再利用キー・受理後 no-throw | **足す**（`test/properties.test.ts`） | パースの冪等、往復、演算の代数法則など「任意の入力で成り立つ性質」を書き下せるとき |

どちらも **証明ではない**。fp-ts は合成の型付け、PBT は有限サンプルの確率的実証である。Brand を付けただけでは uniqueness も冪等性も証明されない。

## 2. カタログが足さない理由

カタログ（`always-valid-pipeline` / `state-and-result` / `effects-at-boundary`）の目的は、型の形だけを見せることである。依存を足すと「ライブラリの使い方」に見え、遮断範囲がぼける。

同じ文に並ぶ残り二つも、同じ理由でカタログには入れない。

| 足さないもの | 役割 | 代わりにカタログ / 正本が見せるもの |
| --- | --- | --- |
| Zod | 実行時スキーマ（L2 パースや L4 契約の実装手段） | `ParsedInput` への自前パース、`order-pipeline` の JSON Schema 成果物 |
| AAT JSON | L3 の教育的写像 | 正本 `order-pipeline/aat/` のみ。カタログは構造診断を扱わない |

正本 [order-pipeline](./order-pipeline/) は論文 §5 の一本の糸なので、L4 として PBT と境界スキーマを持つ。それでも fp-ts と Zod は入れない。

## 3. fp-ts

### 3.1 何か

TypeScript に、Haskell / Scala 寄りの代数的データ型と合成を載せるライブラリである。代表的な型は次のとおり。

- `Option` — 値がある / ない
- `Either<E, A>` — 失敗 `E` または成功 `A`
- `TaskEither` — 非同期の `Either`
- `pipe` / `flow` — 小さな関数の合成
- Semigroup / Monoid / Functor / Monad — 結合律などを型クラスとして書く入口

カタログの `{ ok: true } | { ok: false }` と正本の `T | ParseError` は、どちらも `Either` をライブラリなしで書いた形である。成否の二系統を潰さないこと、ドメインの `{ kind }` と混ぜないことは [envelopes-and-control.md](./envelopes-and-control.md) を正本とする。

### 3.2 4層のどこに効くか

| 層 | 効くこと | 効かないこと |
| --- | --- | --- |
| L1 | 失敗を例外ではなく値にし、成功枝だけを次へ渡せる | `assertNever` の代わりにはならない。網羅は discriminated union の仕事 |
| L2 | `unknown` → `Either<ParseError, Money>` のように狭い型へ変換する合成 | Brand の uniqueness。`Either` で包んでも stamp は検証ではない |
| L3（近似） | モノイド・関手・モナドで「部品をどう繋ぐか」を語る入口 | AAT のサイト・層・降下・障害イデアル層。[aat-bridge.md](../papers/aat-bridge.md) §3 のとおり同一視しない |
| L4 | しない。実行時のランダム検証でも契約スキーマでもない | PBT や JSON Schema の代替にならない |

### 3.3 使うべきとき（二段目）

一段目で envelopes が **局所 `bind`** を選んでいることが前提である。そのうえで、本番で fp-ts（または同等の `neverthrow` 等）を足してよいのは次が同時に成り立つときである。

1. 自前の `bind` helper では、失敗型の共有や `Task` との合成が読みにくい
2. 成功後の値だけを内側 API に渡したい（L2 の parse once と同じ向き）

向いている作業の例:

- HTTP / DB の失敗を `TaskEither` で運び、ハンドラ末尾で HTTP ステータスに畳む
- 境界パースを `Either<ParseError, Parsed>` にし、成功枝だけをドメイン関数に渡す

early return で足りるうちは足さない。カタログの既定も early return である。

### 3.4 使わない／足さないとき

- カタログや論文デモで「型の形」だけを見せるとき
- envelopes が early return を選んでいるとき
- AAT / 局所–大域の gluing を語りたいとき — モナド合成では第3層にならない
- すべてを `IO` / `Task` で包む「関数型化」— 防衛線が増えるわけではない
- Brand の代わり — `Either` は失敗の形であり、一意性や冪等性の証明ではない

導入するなら、`Either` と `{ ok }` を混在させない。プロジェクト内の失敗型は一つに揃える。throw 規則は envelopes を混ぜない。

## 4. PBT（Property-Based Testing）

### 4.1 何か

**性質（property）を、生成したランダム入力で何度も試す**テストである。原点は QuickCheck（Claessen & Hughes, 2000）。このリポの TypeScript 実装は [fast-check](https://github.com/dubzzz/fast-check) で、正本は [order-pipeline/test/properties.test.ts](./order-pipeline/test/properties.test.ts) にある。

例ベースのテストは「この入力ならこの出力」を手で書く。PBT は次の形である。

> 生成された任意の入力に対して、この法則が成り立つ。

論文はこれを **第4層（動的・意味検証層）** に置く。コンパイル時証明が届かない実行時の振る舞い・代数法則を、有限サンプルで補強する。保証の様式は [aat-bridge.md](../papers/aat-bridge.md) の「確率的実証」であり、Lean 定理ではない。Result 型の代替でもない。

### 4.2 正本デモが検証している性質

`order-pipeline` は次を `fc.assert(fc.property(...))` で回している。

| 性質 | 意味 | 型だけでは足りない理由 |
| --- | --- | --- |
| `parseMoney` の冪等 | 成功した `Money` をもう一度パースしても同じ値 | Brand は名目。実行時の parse が安定することは型に出ていない |
| 負数は必ず `ParseError` | 無効クラス側の全称に近い主張 | 手書きの数個の例では穴が残る |
| 生成した合法 `ord_…` は受理 | ジェネレータが表す部分集合での受け入れ | Unicode 全体などは尽くしていない（テストコメントが限界を明記） |

境界 JSON Schema との照合は同じ L4 だが、PBT ではなく成果物駆動の契約チェックである（`test/schema.test.ts`）。PBT と契約テストは併用する。どちらか一方が他方を包含しない。

カタログの [effects-at-boundary](./effects-at-boundary/) も L4 だが、対象が違う。時間型の取り違え禁止、再利用キーの名目付け、受理後 no-throw であり、ランダム検証は入れない。

### 4.3 使うべきとき

性質を **一文で書ける** ときだけ足す。入力例を増やすのではなく、法則を増やす。

向いている性質:

- **パースの冪等** — `parse(parse(x)) = parse(x)`（成功枝）
- **往復** — `fromDto(toDto(x)) = x`、またはスキーマを満たす DTO だけが通る
- **無効クラスの全称** — 負の金額は常に失敗、などジェネレータで無効集合を表せるもの
- **演算の代数法則** — 可換・結合・単位元（例: 金額の加算）。正本の `addMoney` は実装があるが、現状 PBT はパース側に限っている
- **副作用の観測可能な約束** — 同じ `ReuseKey` なら副作用は高々一度、など。Brand 名ではなくストア側の性質として書く

ジェネレータはドメインに合わせる。合法 `OrderId` を試すなら `ord_` + `[a-z0-9]{8,32}` を生成し、任意の `string` を流して「だいたい失敗する」では法則にならない。

### 4.4 使わない／過大評価しないとき

- 再現したい具体バグ — 例ベースの回帰テストを先に書く。PBT は縮約（shrinking）で最小入力に近づけるが、既知の1ケースの置き換えではない
- 「全入力を証明した」と言うとき — 有限サンプルである。正本テストも Unicode 全体は主張しない
- Brand や Typestate の代わり — 不正状態の排除は L2 の型の仕事。PBT は型の外側を測る
- カタログで型の形だけを見せるとき — 依存も失敗様式も増えるので足さない
- uniqueness / 分散冪等の証明 — プロセス内の `Set` や PBT の有限試行は、グローバルな一意性証明ではない

失敗したら、縮約された最小入力を例ベーステストに残す。ジェネレータを黙って緩めて緑に戻さない。

### 4.5 Brand との関係

Claim boundary 末尾「Branding is not a uniqueness or idempotency proof」は、PBT を足すかどうかと独立である。

- Brand は名目（L2 の stamp）。コンパイルを通すための区別であり、検証ではない
- 冪等や一意を主張するなら、parse の冪等を PBT する、UNIQUE 制約やストアで二重副作用を止める、など **観測可能な仕組み** が要る
- `effects-at-boundary` の `ReuseKey` は後者を `Set` で示し、Brand 自体は証明しない

## 5. 利用手順（足すと決めたあと）

### fp-ts を足す

一段目（envelopes が `bind` を選んだこと）が済んでいる前提。

1. 失敗型を `{ ok }` か `Either` か `T | ParseError` かに決める。混在させない
2. 境界パースだけ `Either` にし、内側 API は成功型だけを受け取る（[always-valid-pipeline](./always-valid-pipeline/) と同じ向き）
3. throw 規則は [envelopes-and-control.md](./envelopes-and-control.md) に従う
4. モナド合成を L3 の診断だと言わない

### PBT を足す

1. 性質を法則として書く（冪等、往復、無効クラス、代数法則）
2. 合法集合と無効集合を別ジェネレータにする
3. `fast-check` をテスト専用依存にする（実行時バンドルに入れない）
4. 有限サンプルである旨をテスト近傍に残す（正本の `parseOrderId` コメントと同じ）
5. 境界スキーマがあるなら、PBT と成果物照合を並べる。一方で他方を省略しない

## 6. 関連

- 制御（封筒・throw・ROP）: [envelopes-and-control.md](./envelopes-and-control.md)
- カタログ地図・Claim boundary: [README.md](./README.md)
- 正本の PBT: [order-pipeline/test/properties.test.ts](./order-pipeline/test/properties.test.ts)
- `{ ok }` vs `{ kind }`: [state-and-result/README.md](./state-and-result/README.md)
- L4 の別パターン（PBT なし）: [effects-at-boundary/README.md](./effects-at-boundary/README.md)
- L4 の理論: [type-driven-defense-layers.md](../papers/type-driven-defense-layers.md) §3.4
- 確率的実証の等級: [aat-bridge.md](../papers/aat-bridge.md) §1
