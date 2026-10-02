# 純な全称の証明等級（Bend 2 の Law）

本稿は、閉じた純関数の全称性質を証明義務として検査する読みを、正本の4層の外に記録する。正本は [type-driven-defense-layers.md](type-driven-defense-layers.md)。第4層の有限サンプルは [examples/fp-ts-and-pbt.md](../examples/fp-ts-and-pbt.md)。AAT の法則代数は [aat-bridge.md](aat-bridge.md)。

Bend 2（[bend-lang.com](https://www.bend-lang.com/)、[types as specifications](https://bend2.dev/learn/types-as-specifications/)）の Law を対象にする。2024年の並列言語 Bend（Higher Order Company）ではない。紹介記事は [shi3z「AI時代のプログラミング言語Bend」](https://note.com/shi3zblog/n/n2f7f790b3f6d)。本稿は書き方の手順を含まない。

## 1. 等級

| 等級 | 意味 | 本リポでの扱い |
| --- | --- | --- |
| 具体例 | 渡した値について成否を見る | 例ベーステスト |
| 有限サンプル | 生成した入力の範囲で性質を試す | 第4層の PBT。正本デモが主張するのはここまで |
| 証明義務 | 純な全称について、証明項がその型を inhabit することを検査が要求する | **扱わない**。隣接の読みとしてここに分離する |

第3表の第4層限界「有限サンプルによる確率的な信頼性向上であり、証明ではない」は維持する。本デモを証明済みに格上げしない。層番号は増えない。

## 2. このリポジトリで一文になる性質

正本デモが PBT しているのは、`parseMoney` の冪等と、負の金額の拒否である（[properties.test.ts](../examples/order-pipeline/test/properties.test.ts)）。どちらも有限サンプルであり、全称の証明ではない。

`addMoney` は `(a + b) as Money` である（[money.ts](../examples/order-pipeline/src/money.ts)）。このキャストは証明の外にあり、本稿は実装を変えない。PBT も足さない。

Bend の `cancel` は外部の例である。冪等だけでは、状態を変えない実装も通る。遷移先を固定する要件と組にして、閉じた代数的データ型のコンストラクタを縛る、という読みにだけ使う。このリポジトリの性質ではない。

## 3. 仕様と証明を分ける

仕様者側が要件を持ち、実装者（エージェントを含む）が証明項を出す。要件を削ると、残った証明は通る。要件の差分は実装の差分と分けて見る。これは、ジェネレータを緩めてテストを緑に戻さない、という [fp-ts-and-pbt.md](../examples/fp-ts-and-pbt.md) の注意の双対である。

## 4. 脱出への依存

Bend の証明検査は、`@unsafe` や外部呼び出しに依存する定義を失敗させる。数学的妥当性の再検査は `--verdict`（Lean カーネル）側であり、日常のチェッカー `bend.ts` 自体は未証明である（[Bend2 vs Lean](https://bend2.dev/notes/bend2-vs-lean/)）。`bend.ts` を証明済みカーネルと呼ばない。

このリポジトリの [escapes.ts](../examples/order-pipeline/src/escapes.ts) は、`as` が第1層・第2層を無力化することを示す。パッケージの型検査対象からは外れている。信頼する定義が脱出を呼ばないことは、ここでは証明検査が強制しない。デモは Bend に移植しない。

## 5. 純な要件が語らないもの

純な状態遷移の要件は、リモートの停止、データベース書き込み、所要時間を語らない。そこは別モデルか実行時の検査である。第4層と [effects-at-boundary](../examples/effects-at-boundary/) は残る。

## 6. 非同一視

- Bend の Law はプログラム性質の証明義務である。AAT の法則代数および `law_policy.json` はアーキテクチャの構造診断である（[aat-bridge.md](aat-bridge.md)）。語が同じでも対象は別である。
- サーベイ第4層の細分型・Ghost of Departed Proofs、および §7 の F*・Verus・Kani へ吸収しない。GoDP は実行時検査の証明手形であり、全称の証明義務とは等級が違う。サーベイの層定義は変えない。
- 「バグをマージすることは数学的に不可能」は、書かれた要件・安全な断片・要件を削らない、の三点が揃った範囲の話である。このリポジトリの主張にしない。
