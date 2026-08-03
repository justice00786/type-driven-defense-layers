# 多重防衛線モデルに対する多角的レビュー記録

本稿は、[type-driven-defense-layers.md](type-driven-defense-layers.md)（以下「本文」）の改訂に用いた Multi-Agent Debate 由来の検証プロセスと、そこで得られた指摘・判断の記録である。本文自体はモデル論文として読めるよう、方法論のメタ叙述をここに分離している。

**キーワード**：Multi-Agent Debate、Devil's Advocate、Red Team、Judge、事実性検証

---

## 1. 方法論

改訂プロセスは、次の役割による検証を経ている。

| 役割 | 機能 | 出典 |
|---|---|---|
| Debater（議論者） | 複数の立場から初版の主張を検討し、根拠の弱い箇所を指摘する | Du et al. (2023) |
| Devil's Advocate（あまのじゃく） | 章立てや用語選択に対して意図的に反対の立場を取り、同調による見落としを防ぐ | Liang et al. (2023) |
| Red Team（敵対的検証） | 引用文献・固有名詞の事実性を能動的に検証し、虚偽や不正確な記述を暴く | Perez et al. (2022) |
| Judge / Moderator（統合） | 上記の指摘を評価し、根拠のある指摘のみを採用して過剰修正を防ぎながら統合する | Liang et al. (2023) の議論収束メカニズムに準拠 |

この設計により、単に批判を並べるだけでなく、「議論の収束」と「過度の妥協の防止」を両立することを目指す。加えて、Red Team の判断自体を再検証する「二次検証（第三者による一次情報提供）」が有効に機能した事例を §4 に記録する。

## 2. 初版に対する検証結果（本文への反映）

### 2.1 Devil's Advocateによる指摘

初版が「静的証明→構造設計→動的実証」という一貫した秩序を強調するあまり、各層の限界（型システムの逃げ道、テストの確率的性質、設計コスト）を明示していない、という指摘があった。本文 §3 の表に「各層の限界」列として反映した。

### 2.2 Red Teamによる事実性検証

1. **AATという名称について（後に撤回）**：Web検索により、「Algebraic Architecture Theory」という名称を持つ確立した学術分野・学派は確認できなかった。当時は「AAT」を本文独自の造語と判断し、本文に「本稿独自の統合的呼称」と注記した。この判断は §4 で訂正する。
2. **Goguenの引用について**：初版の「Goguen, J. (1992). *An Algebraic Approach to Software Architecture*」は実在の文献として確認できなかった。関連研究として *Parameterized Programming and Software Architecture*（ICSR 1996）に訂正した。この点は現時点でも有効である。
3. **ACT関連の出典について**：出典不明であった「Bartholomew et al.」は、実在が確認できる Spivak & Vicary (ACT2020, arXiv:2101.12046) に置き換えた。AAT の直接典拠が判明したのち、本文第3層の文献リストからは外し、経緯の記録としてここに残す。

階層構造そのものについては、各層が実在する独立した学術的系譜に裏付けられており、骨格を覆すほどの欠陥は見つからなかったため維持した。

### 2.3 Judge（統合）による判断

根拠が明確な指摘（引用の誤り、用語の出自の不明確さ、各層の限界の欠落）のみを採用し、階層モデルの骨格や各層のメカニズムに関する記述は妥当と判断して維持する方針は、その後の訂正後も継続する。

## 3. 改訂履歴

| 版 | 変更箇所（本文） | 内容 | 理由 |
|---|---|---|---|
| 初版→第1次改訂 | §2 階層マップ・§3.3・要旨 | AATを「本稿独自の統合的呼称」と明記 | Red Team検証で該当分野名を確認できなかったため（※§4で訂正） |
| 初版→第1次改訂 | 参考文献・Goguen | 誤った題目→*Parameterized Programming and Software Architecture* (ICSR 1996) | 初版の題目が実在の文献と一致しなかったため |
| 初版→第1次改訂 | 参考文献・ACT関連 | 出典不明の「Bartholomew et al.」→Spivak & Vicary, ACT2020 | 実在確認できる文献への置き換え |
| 初版→第1次改訂 | §3 表 | 「各層の限界」列を追加 | Devil's Advocate指摘により各層の限界を明示するため |
| 第1次→第2次改訂 | §2・§3・§3.3・§5.3 | AATを「本稿独自の造語」から iroha1203 (2026) による実在の研究プロジェクトへ訂正。語彙を代数幾何的記述に合わせ、Spivak & Vicary を本文第3層文献から外す | 一次情報（GitHubリポジトリ）の提示により、Red Team判断が偽陰性であったと判明したため |
| 第2次→第3次改訂 | §3.3・§5.3・参考文献 | AATを直接典拠（査読未刊行）としつつ、Goguen (1992)・Mac Lane & Moerdijk (1992) 等を関連系譜として追加し学術的地盤を補強。AAT固有構成と査読公開物の同一視はしない旨を明示 | AAT本体に査読論文はないが、サイト・層・降下の問題設定は査読付き系譜で裏付け可能であるため |
| 第3次→第4次改訂 | §3.3・§4・新§5・文献節は旧§5→§6・`aat-bridge.md`・`examples/order-pipeline` | 注文事例デモ、データ流と構造診断の分離、AAT語彙の教育的写像（合法／違反）、ArchSig/FieldSig非実行と commit ピン。事例追加に伴い代表的文献は §6（AAT は §6.3）へ繰り下げ | 論文深化＋最小デモ＋AAT橋渡し（[#1](https://github.com/justice00786/type-driven-defense-layers/issues/1)）。MAD 全面再実行はせず、`aat-bridge.md` の事実性チェックリストで代替 |
| 第4次→第4次補訂 | デモ（`escapes`・typestate 負例・境界スキーマ解釈）・要旨／結論・README／`READING.md`／参考文献 #6 | 不完全分岐・不正遷移の型エラー・スキーマ起点テストを強化。CI 記述と節番号・主張境界の文書整合を追補 | 計画反映レビューおよび横断整合レビューの残件対応（MAD 再実行なし） |
| 第4次補訂→bridge §3追記 | `aat-bridge.md` 新§3・本文§2リンク・README／`READING.md`・チェックリスト | 第3層の「モノイド・関手・モナド」近似とその限界を bridge 正本に文書化。旧§3–§6を繰り下げ | [#3](https://github.com/justice00786/type-driven-defense-layers/issues/3)。MAD 全面再実行なし（チェックリストで代替） |
| bridge §3追記→第5次改訂 | 本文 §3 / §3.3 / §6.3・参考文献 #6–#7、`aat-bridge.md`、`AAT_PIN.md`、README | Nakahata (2026) SAGA Zenodo プレプリント（版 DOI `10.5281/zenodo.21605207`）を局所–大域能力証明の公開典拠として追加。「査読未刊行」をプレプリント公開済み／査読誌未掲載に更新。教育的ピンと `saga-paper-v1.0.0` を分離記録 | ユーザー提示の一次情報（Zenodo + Zenn）。MAD 全面再実行なし（`aat-bridge.md` チェックリストで代替） |

## 4. AATに関するRed Teamの偽陰性

第1次改訂時の Red Team は、「Algebraic Architecture Theory」という名称の学術分野を Web 検索で発見できなかったことをもって、これを「本稿独自の統合的造語」と断定した。しかしこの判断は誤りであった。ユーザーから直接提示されたリポジトリ URL（https://github.com/iroha1203/AlgebraicArchitectureTheoryV2 ）を確認したところ、AAT は iroha1203 氏による実在の研究プロジェクトであり、Lean 4 による形式化と、代数幾何的な理論体系（アーキテクチャ原子、サイト、層、法則代数、障害イデアル層、合法軌跡、アーキテクチャスキーム、Čech降下）を伴うことが確認できた。初版における「Obstruction（構造的衝突）の代数的検出」という記述は、実際の AAT が持つ obstruction ideal sheaf（障害イデアル層）とおおむね対応しており、単なる思いつきの造語ではなく、実在の理論を（簡略化した形で）反映していたことになる。

この一件は、Red Team による「不在の確認」が本質的に持つ限界を示している。Web 検索で見つからないことは、対象が存在しないことの証明にはならない。特に、査読付き論文のように索引化された媒体を主に検索した場合、GitHub 上で公開されている独立研究プロジェクトのように索引化・言及が少ない一次情報は検出漏れを起こしやすい。Judge 役は「検証できなかった＝誤りである」と即断せず、追加の一次情報が提示された場合には判断を更新する姿勢を保つべきである。

なお、この訂正は AAT という名称・概念そのものの実在性についてのものであり、「AAT が確立された査読付き学術分野であるか」という点については、原著リポジトリ自身が独立した進行中の研究であることを明記しているため、その区別（実在するが査読済み学術分野とは性質が異なる）は維持する。第3次改訂では、この区別を保ったまま、サイト・層・降下および代数的仕様という問題設定の地盤として Goguen (1992) および Mac Lane & Moerdijk (1992) を当時の本文 §5.3（第4次改訂以降は §6.3）の関連系譜に追加した。これは AAT を査読済みと読み替えるものではない。第5次改訂時点では SAGA 比較定理が Zenodo プレプリントとして公開されているが、プレプリント公開は査読誌掲載や確立分野化と同義ではなく、上記の区別は維持する。

## 参考文献

1. Du, Y., Li, S., Torralba, A., Tenenbaum, J. B., & Mordatch, I. (2023). Improving Factuality and Reasoning in Language Models through Multiagent Debate. arXiv:2305.14325.
2. Liang, T., He, Z., Jiao, W., Wang, X., Wang, Y., Wang, R., Yang, Y., Shi, S., & Tu, Z. (2024). Encouraging Divergent Thinking in Large Language Models through Multi-Agent Debate. *Proceedings of EMNLP 2024*, 17889–17904.
3. Perez, E., Huang, S., Song, F., Cai, T., Ring, R., Aslanides, J., Glaese, A., McAleese, N., & Irving, G. (2022). Red Teaming Language Models with Language Models. *Proceedings of EMNLP 2022*.
4. Spivak, D. I., & Vicary, J. (Eds.) (2020). Applied Category Theory 2020 (ACT2020). arXiv:2101.12046.（第1次改訂で「Bartholomew et al.」の代替として本文に入れ、第2次改訂で本文第3層文献からは外した経緯の参照用）
