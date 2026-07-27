# type-driven-defense-layers

型駆動開発（Type-Driven Development）を、単一の変数の型からネットワークを跨ぐ分散システム全体まで、数学的構造（型論・圏論・代数学）によって不正な状態や論理的矛盾を段階的に遮断する「多重防衛線」として体系化した研究ノート。

## 概要

型と代数を用いた防衛線を、対象範囲の異なる4つの層として整理する。

1. **ミクロ論理層（CHL対応）** — Curry-Howard-Lambek対応。「型＝命題」「プログラム＝証明」に基づき、Discriminated UnionsとExhaustiveness Checkingで論理的矛盾を排除する。
2. **型表現力拡張層（Domain & State Encoding）** — Parse, don't validate、Typestate、Refinement Types / Branded Typesにより、ドメインの不変量そのものを型にエンコードする。
3. **マクロ構造層（AAT: Algebraic Architecture Theory）** — モジュールやアーキテクチャの結合を代数幾何的構造（AATサイト・層・法則代数・障害イデアル層など）として捉え、結合の不変量を診断する。[iroha1203/AlgebraicArchitectureTheoryV2](https://github.com/iroha1203/AlgebraicArchitectureTheoryV2) の理論に基づく。
4. **動的・意味検証層** — Property-Based Testingや契約テストにより、型システムが届かない実行時・時間・分散境界の性質を動的に補強する。

## 検証方法論

本文の改訂には Multi-Agent Debate 研究の知見を応用した多角的レビューを用いている。役割・指摘・改訂経緯（引用訂正や Red Team の偽陰性を含む）は [papers/multi-agent-review.md](papers/multi-agent-review.md) を参照。

## 構成

```
papers/
  type-driven-defense-layers.md   4層構造の本文
  multi-agent-review.md           多角的レビューの方法論と検証記録
```

最新の本文はリポジトリ tip の [papers/type-driven-defense-layers.md](papers/type-driven-defense-layers.md)。版の変遷は git 履歴を参照。

## 参考文献（抜粋）

- Wadler, P. (2015). *Propositions as Types*. Communications of the ACM.
- Lambek, J. (1986). *Introduction to Higher Order Categorical Logic*.
- King, A. (2019). *Parse, don't validate*.
- Strom, R. E., & Yemini, S. (1986). *Typestate: A programming language mechanism for enhancing software reliability*.
- Brady, E. (2017). *Type-Driven Development with Idris*.
- iroha1203 (2026). *Algebraic Architecture Theory & Software Field Theory*. GitHub.
- Claessen, K., & Hughes, J. (2000). *QuickCheck*. ICFP.
- Du, Y., et al. (2023). *Improving Factuality and Reasoning in Language Models through Multiagent Debate*.
- Perez, E., et al. (2022). *Red Teaming Language Models with Language Models*. EMNLP.

完全な参考文献リストは本文およびレビュー文書の末尾を参照。
