# type-driven-defense-layers

型駆動開発（Type-Driven Development）を、単一の変数の型からネットワークを跨ぐ分散システム全体まで、数学的構造（型論・圏論・代数学）によって不正な状態や論理的矛盾を段階的に遮断する「多重防衛線」として体系化した研究ノート。

## 概要

型と代数を用いた防衛線を、対象範囲の異なる4つの層として整理する。

1. **ミクロ論理層（CHL対応）** — Curry-Howard-Lambek対応。「型＝命題」「プログラム＝証明」に基づき、Discriminated UnionsとExhaustiveness Checkingで論理的矛盾を排除する。
2. **型表現力拡張層（Domain & State Encoding）** — Parse, don't validate、Typestate、Refinement Types / Branded Typesにより、ドメインの不変量そのものを型にエンコードする。
3. **マクロ構造層（AAT: Algebraic Architecture Theory）** — モジュールやアーキテクチャの結合をモノイド・関手・モナドなどの代数的構造として捉え、結合律や可換性を静的に保証する。
4. **動的・意味検証層** — Property-Based Testingや契約テストにより、型システムが届かない実行時・時間・分散境界の性質を動的に補強する。

## 構成

```
papers/
  type-driven-defense-layers.md   4層構造の本文
```

## 参考文献（抜粋）

- Wadler, P. (2015). *Propositions as Types*. Communications of the ACM.
- Lambek, J. (1986). *Introduction to Higher Order Categorical Logic*.
- King, A. (2019). *Parse, don't validate*.
- Strom, R. E., & Yemini, S. (1986). *Typestate: A programming language mechanism for enhancing software reliability*.
- Brady, E. (2017). *Type-Driven Development with Idris*.
- Maguire, S. (2021). *Algebra-Driven Design*. Leanpub.
- Claessen, K., & Hughes, J. (2000). *QuickCheck*. ICFP.

完全な参考文献リストは [papers/type-driven-defense-layers.md](papers/type-driven-defense-layers.md) の末尾を参照。
