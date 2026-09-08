# type-driven-defense-layers

型駆動開発（Type-Driven Development）を、単一の変数の型からネットワークを跨ぐ分散システム全体まで、数学的構造（型論・圏論・代数学）によって不正な状態や論理的矛盾を段階的に遮断する「多重防衛線」として体系化した研究ノート。

## 概要

型と代数を用いた防衛線を、対象範囲の異なる4つの層として整理する。

1. **ミクロ論理層（CHL対応）** — Curry-Howard-Lambek対応。「型＝命題」「プログラム＝証明」に基づき、Discriminated UnionsとExhaustiveness Checkingで論理的矛盾を排除する。
2. **型表現力拡張層（Domain & State Encoding）** — Parse, don't validate、Typestate、Refinement Types / Branded Typesにより、ドメインの不変量そのものを型にエンコードする。
3. **マクロ構造層（AAT: Algebraic Architecture Theory）** — モジュールやアーキテクチャの結合を代数幾何的構造（AATサイト・層・法則代数・障害イデアル層など）として捉え、結合の不変量を診断する。[iroha1203/AlgebraicArchitectureTheoryV2](https://github.com/iroha1203/AlgebraicArchitectureTheoryV2) の理論に基づく。局所–大域の能力証明は Nakahata (2026) *SAGA* プレプリント（[doi:10.5281/zenodo.21605207](https://doi.org/10.5281/zenodo.21605207)）を参照する。
4. **動的・意味検証層** — Property-Based Testingや契約テストにより、型システムが届かない実行時・時間・分散境界の性質を動的に補強する。

## デモ

論文 §5 の正本デモは [examples/order-pipeline](examples/order-pipeline/)（注文ライフサイクルを一本の糸として各層を具体化）。型防衛パターンのカタログは [examples/README.md](examples/README.md) を入口にする。

```bash
cd examples/order-pipeline
npm ci
npm run typecheck
npm test
```

- **データ流**: L2 parse / typestate → L1 exhaustiveness → L4 PBT・境界スキーマ
- **構造診断（L3）**: `aat/` の教育的写像（合法／違反）。ArchSig・Lean・FieldSig は**実行しない**
- **主張境界・語彙対応の正本**: [papers/aat-bridge.md](papers/aat-bridge.md)
- **カタログ利用指針（二枚組）**:
  - 結果封筒と throw / ROP の使い分け: [examples/envelopes-and-control.md](examples/envelopes-and-control.md)
  - fp-ts / PBT の使い分け（カタログが足さない理由と、本番で足す判断）: [examples/fp-ts-and-pbt.md](examples/fp-ts-and-pbt.md)
- **パターンカタログ**（論文は置換しない）:
  - [always-valid-pipeline](examples/always-valid-pipeline/) — L2 Parse once（境界型 ≠ ドメイン型）
  - [state-and-result](examples/state-and-result/) — L1 `{ kind }` / `{ ok }`、Illegal bag、soft-fallback
  - [effects-at-boundary](examples/effects-at-boundary/) — L4 時間型、冪等キーの名目付け、受理後 no-throw
  - [observation-blind-change](examples/observation-blind-change/) — 選んだ観測は一致し、対応関係だけが追随の有無で分かれる

CI は `examples/order-pipeline` に加え、カタログ4パッケージで `npm run typecheck` と `npm test` を実行する。

## 隣接サーベイ

正本の4層モデルを置換しない、LBS / LangSec / IFC / メモリ安全言語政策からの理論的補強サーベイは [papers/lbs-defense-in-depth-survey.md](papers/lbs-defense-in-depth-survey.md) を参照。従来 Defense-in-Depth への5層対応であり、帰属・主張境界・正本との対応地図を冒頭に明記している。

## 検証方法論

本文の改訂には Multi-Agent Debate 研究の知見を応用した多角的レビューを用いている。役割・指摘・改訂経緯（引用訂正や Red Team の偽陰性を含む）は [papers/multi-agent-review.md](papers/multi-agent-review.md) を参照。

## 構成

```
papers/
  type-driven-defense-layers.md   4層構造の本文（正本）
  lbs-defense-in-depth-survey.md  LBS / DiD 5層対応の隣接サーベイ
  aat-bridge.md                   AAT語彙対応・主張等級・非主張・近似と限界
  multi-agent-review.md           多角的レビューの方法論と検証記録
examples/
  README.md                       デモ地図（正本 vs カタログ、throw の可否）
  envelopes-and-control.md        結果封筒と throw / ROP の使い分け
  fp-ts-and-pbt.md                fp-ts / PBT の位置づけと使い分け
  order-pipeline/                 論文§5 の正本（L2→L1→L4 + AAT 写像）
  always-valid-pipeline/          L2 Parse once
  state-and-result/               L1 `{ kind }` / `{ ok }`
  effects-at-boundary/            L4 時間・再利用キー・再送
  observation-blind-change/       観測面と対応面（追随の有無）
```

最新の本文はリポジトリ tip の [papers/type-driven-defense-layers.md](papers/type-driven-defense-layers.md)。版の変遷は git 履歴を参照。

## 参考文献（抜粋）

- Wadler, P. (2015). *Propositions as Types*. Communications of the ACM.
- Lambek, J. (1986). *Introduction to Higher Order Categorical Logic*.
- King, A. (2019). *Parse, don't validate*.
- Strom, R. E., & Yemini, S. (1986). *Typestate: A programming language mechanism for enhancing software reliability*.
- Brady, E. (2017). *Type-Driven Development with Idris*.
- Nakahata, H. (2026). *SAGA: A Comparison Theorem for Local-to-Global Software Architecture*. Zenodo. https://doi.org/10.5281/zenodo.21605207
- iroha1203 (2026). *Algebraic Architecture Theory & Software Field Theory*. GitHub.
- Goguen, J. (1992). *Sheaf semantics for concurrent interacting objects*. MSCS.（AAT関連系譜）
- Mac Lane, S., & Moerdijk, I. (1992). *Sheaves in Geometry and Logic*.（AAT関連系譜）
- Claessen, K., & Hughes, J. (2000). *QuickCheck*. ICFP.
- Du, Y., et al. (2023). *Improving Factuality and Reasoning in Language Models through Multiagent Debate*.
- Perez, E., et al. (2022). *Red Teaming Language Models with Language Models*. EMNLP.

完全な参考文献リストは本文およびレビュー文書の末尾を参照。
