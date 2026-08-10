# 型駆動型多層防御の理論的補強：言語ベース・セキュリティと Defense-in-Depth の5層対応

## 位置づけ

本稿は、言語ベースのセキュリティ（LBS）、LangSec、情報フロー制御（IFC）、メモリ安全言語政策などの隣接分野から、型駆動型多層防御を補強する**サーベイ**である。

- 本リポジトリの**正本モデル**は [type-driven-defense-layers.md](type-driven-defense-layers.md) の4層（CHL / Domain & State / AAT / 動的検証）である。
- 本稿の5層は、従来の Defense-in-Depth（多層防御）を型システム側へ対応付けた整理であり、正本4層の**置換ではない**。
- 本稿の本文は外部調査要約（Deep Research 系）をリポジトリ向けに整理したものであり、Google Research 等の**公式一次論文ではない**。

## 主張境界（非主張）

- 本稿はサーベイであり、正本4層の定理・デモ保証を拡張しない。
- 「根絶」「完全遮断」「証明された」などの強い修辞は、原典または調査要約側の表現の転記であり、本リポジトリの保証主張ではない。
- Android の脆弱性比率、CISA のロードマップ期限などの経験的数値・政策記述は**未再検証の転記**である。
- 引用文献リストは提出された調査要約のリストをほぼそのまま収録しており、一次典拠の網羅的再検証は行っていない。

## 正本との重複について

本稿 §2–4（Parse, don't validate / Typestate / Refinement Types 等）は、正本の第2層（Domain & State Encoding）および第1層（CHL）と内容が重なる。サーベイとしての自己完結のため重複を許容する。定義・デモ保証の正本は [type-driven-defense-layers.md](type-driven-defense-layers.md) および [examples/order-pipeline](../examples/order-pipeline/) とする。

## 正本4層との短い対応地図

| 本稿5層（DiD対応） | 正本4層での主な接点 |
|---|---|
| 1 メモリ安全 | 正本の前提（言語基盤）。正本層番号には直接対応しない |
| 2 入力境界 | 正本② Parse, don't validate |
| 3 プロトコル・状態 | 正本② Typestate（セッション型は補強） |
| 4 不変条件・ロジック | 正本② Refinement / Brand；正本①の網羅とも関連 |
| 5 情報フロー | 正本に未収録の隣接領域（IFC） |
| （本稿に薄い）形式検証・動的保証 | 正本③ AAT / ④ PBT 側の接点 |

---

## 要旨

現代のサイバーセキュリティおよびソフトウェアエンジニアリングの交差点において、ソフトウェアの構造そのものに防御機構を埋め込む「セキュア・バイ・デザイン（Secure by Design）」の重要性がかつてなく高まっている。「型駆動型多層防御（Type-Driven Defense Layers）」の理論は、インフラストラクチャやネットワーク層に依存してきた従来の多層防御（Defense-in-Depth）の概念を、プログラミング言語理論（PLT）および言語ベースのセキュリティ（LBS: Language-Based Security）の次元へと昇華させるパラダイムである。

本稿は、サイバーセキュリティ、プログラミング言語の型システム、形式検証、および国家レベルのセキュリティ要件（CISA、NSA 等のガイドライン）に関する学術研究と業界動向を統合し、型駆動型多層防御を補強する。物理層からデータ層に至る従来の防御モデルを、型システムが提供する5つの論理的な防壁へと再定義し、それぞれの層がどのように相互作用してソフトウェアアーキテクチャを形成するかを整理する。

**キーワード**：Language-Based Security、LangSec、Parse don't validate、Typestate、Session Types、Refinement Types、Information Flow Control、Memory Safe Languages

---

## 1. 多層防御の進化と言語ベースのセキュリティ（LBS）の台頭

従来の多層防御は、軍事戦略に端を発する情報保証の概念であり、単一の障害点（Single Point of Failure）に依存せず、独立した複数のセキュリティ制御を重ねることで攻撃を遅延させ、被害を封じ込めることを目的としてきた[1]。このアーキテクチャは歴史的に、物理セキュリティ、ネットワーク境界、内部ネットワーク制御、エンドポイント、アプリケーション、そしてデータセキュリティという複数の運用・インフラ層によって構成されてきた[1]。

しかし、クラウドコンピューティングやマイクロサービスアーキテクチャの普及、そしてゼロトラスト・モデルへの移行に伴い、ファイアウォールなどの境界防御のみに依存するアプローチの限界が露呈している[1]。設定のドリフト（Configuration Drift）や権限の過剰付与により、一度境界を突破された攻撃者（例えばランサムウェアのキルチェーンなど）は容易にラテラルムーブメント（横展開）を実行し、重要なデータを暗号化・窃取することが可能となっている[1]。

この課題に対する根本的な解決策として注目されているのが、「言語ベースのセキュリティ（LBS: Language-Based Security）」である。LBS は、コンパイラ、自動プログラム解析、型検査（Type Checking）、およびプログラムの書き換えといったプログラミング言語の技術を活用し、アプリケーションのソースコードレベルでセキュリティポリシーを強制するアプローチである[4]。LBS の最大の利点は、高レベルのセキュリティポリシーのセマンティクスと、コンピュータシステムの低レベルな実行セマンティクスの間に存在する「意味的なギャップ（Semantic Gap）」を、型システムを通じて数学的に架橋できる点にある[6]。型駆動型多層防御は、この LBS の概念を拡張し、アプリケーションの入力境界から内部状態の遷移、そして最終的なデータの出力に至るまでの全プロセスを、型システムによって多層的に保護する理論体系として位置づけられる。

## 2. 第一層：メモリ安全性の強制（ソフトウェアの物理的基盤）

従来の多層防御における「物理セキュリティ」や「エンドポイントのハードウェア保護」に相当するのが、ソフトウェアにおけるメモリ安全性の保証である。型駆動型防御の最下層にして最大の基盤となるのが、このメモリと実行環境を保護する型システムである。

### 国家安全保障レベルでのメモリ安全性の要求

2024年から2025年にかけて、米国ホワイトハウス国家サイバー長官室（ONCD）、サイバーセキュリティ・社会基盤安全保障庁（CISA）、および国家安全保障局（NSA）は、深刻なサイバー脅威に対抗するための「セキュア・バイ・デザイン」原則の一環として、C や C++ のようなメモリ非安全な言語から、Rust、Go、Java、C# などのメモリ安全な言語（MSL: Memory Safe Languages）への移行を強く要求するロードマップを相次いで発表した[8]。これらの指針は、メモリ安全性の欠如がもたらすリスクが単なる技術的課題を超え、国家の安全保障および経済安全保障に対する重大な脅威となっていることを示している[9]。

データが示す現実は極めて明白である。Microsoft や Google による過去の報告でも一貫して示されている通り、重大なセキュリティ脆弱性（CVE）の約70%が、バッファオーバーフローや Use-After-Free、ダングリングポインタといったメモリ管理のミスに起因している[3]。以下の表は、メモリ安全な言語の導入がもたらす具体的な効果と業界動向を要約したものである。

| 組織・プロジェクト | メモリ安全性に関する取り組みと成果 | 関連する技術的指標と影響 |
|---|---|---|
| Google Android | Rust の段階的統合により、Android OS におけるメモリ安全性の脆弱性が5年間で76%から24%へと劇的に減少した。 | 脆弱性の根本原因の撲滅、パッチ適用コストの大幅な削減[11] |
| Cloudflare | C 言語ベースの Nginx から、Rust ベースの Pingora プロキシへ移行。メモリ安全性を確保しつつ、劇的なパフォーマンス向上を達成。 | CPU 消費量を70%削減。Green IT コンプライアンス（SCI スコア）への貢献[11] |
| CISA / NSA | 「ソフトウェアのメモリ安全性」に関するガイダンスを発行。2026年1月1日までにメモリ安全性ロードマップを公開しないベンダーのリスクを警告。 | 新規プロジェクトにおける C/C++ の使用を「悪しき慣行（Bad Practice）」と明言[9] |

### 型システムによる未定義動作の排除

Rust に代表される先進的な型システムは、「所有権（Ownership）」と「借用（Borrowing）」という概念を型理論に組み込むことで、リソースのライフサイクルをコンパイル時に完全に追跡する[13]。これにより、実行時のガベージコレクションによるオーバーヘッドを伴わずに、メモリの二重解放やデータ競合（Data Race）を数学的に排除する。

メモリ安全性が言語仕様として保証される環境では、開発者は「未定義動作（Undefined Behavior）」という最下層の不確実性から解放される[13]。これにより、後述する上位レイヤー（パーサー、状態遷移、情報フロー）の防御機構が、下位のメモリ破壊攻撃（バッファオーバーランを利用した制御フローのハイジャックなど）によって無効化されるリスクが根本的に排除される。型駆動型防御において、この第一層はすべての防壁が依拠する絶対的な地盤である。

## 3. 第二層：入力境界防御層（LangSec と "Parse, don't validate"）

ネットワーク防御におけるファイアウォールや境界防御（Perimeter Security）に相当するのが、外部からの未検証の入力を受け取る境界部分の型レベルの防壁である。ここでは、言語理論的セキュリティ（LangSec）と「Parse, don't validate」の原則が交差する。

### ショットガン・パーシング（Shotgun Parsing）の脅威と LangSec

言語理論的セキュリティ（LangSec: Language-Theoretic Security）は、プログラムの入力を形式言語として扱い、それを厳密に認識（Recognize）することの重要性を説く学問領域である[14]。LangSec の研究において最も危険なアンチパターンとして特定されているのが「ショットガン・パーシング（Shotgun Parsing）」である。

ショットガン・パーシングとは、データの「構文解析（Parsing）」と「入力検証（Validation）」、そして「ビジネスロジックの処理（Processing）」がコードベース全体に散在し、混然一体となっている設計の欠陥を指す[14]。この状態では、システムの一部が「入力は部分的に検証されている」と誤認し、別のコンポーネントが「完全に検証されている」と仮定して処理を進めることで、実装間の認識のズレ（Mismorphisms）が生じる[15]。攻撃者はこの入力検証の隙間を突き、不正な形式のデータ（細工された PDF、悪意のある Flash ファイル、不正な SQL 文字列など）を送り込むことで、システムを予期せぬ状態に陥れ、「ウィアード・マシン（Weird Machine：攻撃者がプログラムの制御を乗っ取るための予期せぬ計算モデル）」として悪用する[16]。

### "Parse, don't validate" パラダイムによる境界防御

ショットガン・パーシングを排除し、強固な境界防御を構築するための型駆動型アプローチが、Alexis King によって提唱された「Parse, don't validate（検証するな、構文解析せよ）」という設計原則である[17]。

この原則の核心は、情報がどのように保持されるかという点にある。「検証（Validation）」は、条件をチェックした後にその証拠を破棄してしまう（例：文字列が正しいメールアドレスかチェックし、単なる `String` として返し続ける）[17]。これでは、下流の関数はデータが検証済みであるかを知る術がなく、再び検証を行うか、暗黙の前提に依存するしかない[18]。

一方で「構文解析（Parsing）」は、構造化されていないデータ（例：JSON や生の文字列）を消費し、システムの制約を満たした「豊かで構造化された型（More-structured output）」へと変換するプロセスである[17]。型システムを用いた境界防御では、データがシステムに進入した境界で即座にパースを行い、不当な状態を「表現不可能（Make illegal states unrepresentable）」なデータ構造（代数的データ型など）へとマッピングする[21]。

たとえば、Python における型ヒントや Pydantic、あるいは Haskell の `NonEmpty` リストを用いた実装では、未検証の `String` を境界でパースし、失敗した場合はその場で処理を中断（副作用の発生を防止）し、成功した場合は `ValidatedEmail` や `PersonAge` といった専用の型（NewType 等）を返す[17]。ビジネスロジック層のすべての関数は、生の `String` ではなくこの専用型を引数として要求するようにシグネチャを設計する[23]。これにより、コンパイラや静的解析ツールがデータの安全性を証明し、SQL インジェクションやクロスサイトスクリプティング（XSS）といったインジェクション攻撃や転送時の欠陥（Forwarding Flaws）を型レベルで水際で防ぐことが可能となる[17]。

## 4. 第三層：プロトコルと状態の防御層（Typestate とセッション型）

境界を越えて内部に進入したデータが、正しい順序と状態で処理されることを保証する層である。これは、ネットワーク内部におけるトラフィックフロー制御、マイクロセグメンテーション、および状態監視（Stateful Inspection）に相当する[1]。

### Typestate パターンによる状態遷移の強制

ソフトウェアの脆弱性の多くは、リソースの誤った使用順序（例：初期化前の変数の使用、認証前の特権 API の呼び出し、クローズ済みのファイルハンドルの操作）に起因する。Typestate パターンは、オブジェクトやシステムが現在どのような「状態」にあるかを型としてエンコードし、その状態において許可される操作（メソッド）のみを静的型チェックによって許可する設計手法である[25]。

Rust のようにアフィン型（Affine Types）や線形型（Linear Types）をサポートする言語では、特定の状態を持つオブジェクトを「消費（Consume）」し、新しい状態のオブジェクトを返すことで、状態の逆行や無効な状態での操作をコンパイル時に禁止できる[25]。例えば、ユーザー認証フローにおいて、未認証の要求を `UnauthenticatedRequest` 型で受け取り、MFA（多要素認証）等のロジックを通過した結果としてのみ `AuthenticatedSession` 型を生成する。機密データにアクセスする関数は `AuthenticatedSession` のみを要求するため、コードのどのパスを通っても認証プロセスをバイパスすることは型システム上不可能となる[28]。

### セッション型（Session Types）による並行処理と通信の保証

分散システムやマイクロサービス間、あるいは並行プロセスの通信においては、「セッション型（Session Types）」が通信プロトコルの安全性を担保する[26]。セッション型は、チャンネル上でのメッセージ送受信の順序とデータ型を規定する振る舞いの型（Behavioral Typing）である[27]。たとえば、あるチャンネルが `!Int.?Bool.End` というセッション型を持つ場合、コンパイラは「必ず整数を送信（`!Int`）し、次にブール値を受信（`?Bool`）し、最後にチャンネルを閉じる（`End`）」というシーケンスが両方のエンドポイントで厳密に守られているかを検証する[27]。

さらに、マルチパーティ・セッション型（MPST: Multiparty Session Types）の理論は、3つ以上のノードが参加する複雑なプロトコルにおいて、プロセスが事前に定義されたグローバルな通信プロトコルに従うことを保証し、通信エラー、型の不一致、そして分散システム特有のデッドロックを静的に排除する[29]。これにより、攻撃者がプロトコルの順序を意図的に狂わせてシステムを不正な状態に陥れる攻撃を完全に無効化する。

## 5. 第四層：不変条件とビジネスロジックの防御層（細分型と GoDP）

第4の層は、アプリケーション固有のビジネス要件や、数学的な境界条件を防御レイヤーとして組み込む層である。単純な型（`Int` や `String`）では表現しきれない詳細な制約を、細分型（Refinement Types）や「Ghost of Departed Proofs (GoDP)」という高度な型技法によって保証する。

### 細分型（Refinement Types）による値の境界制御

細分型は、基本型に対して論理的な述語（Predicate）を付与することで、型の取り得る値の範囲を制限し、インバリアント（不変条件）を表現するアプローチである[31]。LiquidHaskell などの検証ツールは、Haskell の型システムを拡張し、背後で SMT（Satisfiability Modulo Theories）ソルバを駆動させることで、これらの制約がプログラム全体で満たされているかをコンパイル時に自動的に証明する[31]。

たとえば、バッファや配列へのアクセスを行う際、インデックス変数の型を以下のように細分型で定義できる。

```haskell
{-@ i :: {v:Int | 0 <= v && v < len a} @-}
i :: Int
```

この型宣言は、「変数 `i` は、0以上かつ配列 `a` の長さ未満の整数である」という論理的証明を要求する[13]。これにより、従来の実行時境界チェック（Bounds Check）によるパニックや例外に頼ることなく、論理バグやインデックス境界外アクセスといった深刻な脆弱性をコンパイル時に完全に予防できる[13]。細分型は、LLM を用いた自動アノテーション生成（Neurosymbolic Agent 等）の研究も進んでおり、大規模なコードベースに対する導入の障壁も下がりつつある[35]。

### Ghost of Departed Proofs (GoDP) による証明の持ち回り

ビジネスロジックの要件（例えば「利用規約に同意済みであること」「リスクスコアリングでブロック対象でないと判定されたこと」など）を、すべて細分型や依存型（Dependent Types）で表現することは、コンパイル時間の増大や開発者の認知負荷（証明を記述する難易度）を引き上げるため、現実的でない場合がある[36]。

この問題に対する実践的かつ強力な解決策が、Haskell コミュニティ等で提唱されている「Ghost of Departed Proofs (GoDP)」である[36]。GoDP は、動的な実行時チェック（契約やバリデーション）の結果を、特定の一意な型変数（Rank-N 型や存在型）を持つ「証明オブジェクト（Proof Object）」としてカプセル化する手法である[36]。

たとえば、パスワードリセットの監査フローにおいて、コード内で多数の `boolean isAudited` や `boolean blockWithdrawals` のようなフラグを引き回すことは、セキュリティチェックの抜け漏れ（防御的プログラミングの失敗）を誘発する[28]。GoDP のアプローチでは、監査やリスク判定のモジュールを通過した際にのみ `UserWithResetCode` といった証明を内包するプライベートコンストラクタを持つオブジェクトを生成する[28]。上位のモジュールは、単なるデータだけでなく、この「証明オブジェクト」が引数として提示されない限りコンパイルを通さない。これにより、証明の完全な正当性を型システムに依存せずとも、「バリデーションロジックが確実に実行された」という事実を型の力でモジュール境界を越えて安全に保証できる[28]。

## 6. 第五層：データと情報フローの防御層（セキュリティ型システム）

多層防御の最も内側に位置し、守るべき最大の資産である「データそのもの」を保護するのが情報フロー制御層である[1]。ここでは、言語ベースのセキュリティ（LBS）の一環として、「情報フロー制御（IFC: Information Flow Control）」を型システムに直接組み込んだセキュリティ型システム（Security-Typed Languages）が中核的な役割を担う[6]。

### セキュリティラベルと非干渉性（Noninterference）

サイバー攻撃の最終目標の多くは、機密データの窃取（Confidentiality の侵害）や、重要設定の改ざん（Integrity の侵害）である[40]。Jif (Java Information Flow) や FlowCaml といったセキュリティ型言語は、プログラム内の変数や式に対して「セキュリティラベル」を付与することで、情報の流れを静的解析によって追跡・制御する[7]。

例えば、Jif における変数宣言は以下のように記述される[42]。

```java
int{Alice→Bob} x;
```

これは、「変数 `x` の情報は Alice によって管理されており、Bob に対してのみ情報の流れ（読み取り）を許可する」という分散ラベルモデルのポリシーを表す。コンパイラは、コードのすべてのパスを解析し、高機密なデータが低機密な変数に代入されたり、パブリックなネットワーク出力に直接・間接（制御構造を通じた暗黙のフロー）を問わず流出したりする経路を検出する。これにより、情報が一切漏洩しないことを示す「非干渉性（Noninterference）」という数学的性質をコンパイル時に保証する[4]。

### 堅牢な機密解除（Robust Declassification）

現実のアプリケーションでは、パスワードのハッシュ照合結果や、統計データなど、機密情報の一部を意図的に公開するプロセス（Declassification：機密解除）が不可欠である[43]。しかし、機密解除のメカニズムを攻撃者が制御できてしまうと、任意のデータを引き出す深刻な脆弱性となる。

先進的な LBS の理論では、この問題に対して「堅牢な機密解除（Robust Declassification）」の概念を導入する。これは、機密解除を行うためのトリガーや条件式が、攻撃者などの信頼できないソースからの影響（Integrity の欠如）を受けていないことを型システムが検証する仕組みである[42]。これにより、ダウングレード攻撃を防ぎつつ、柔軟かつ安全なデータフロー制御をプログラム全体で維持することができる。

## 7. 高度な保証：形式検証と型システムの融合

これらの多層防御をさらに強固にするため、最前線の研究では、型システムに加えて証明支援系やモデルチェッカーを用いた「形式検証（Formal Verification）」が統合されつつある[46]。

例えば、F*（F-star）は、依存型（Dependent Types）とモナドを用いた形式検証言語であり、Microsoft の「Project Everest」において、TLS 1.3 の暗号ライブラリ（HACL*）などのセキュアなインフラストラクチャを証明付きで実装するために使用されている[49]。また、Rust に対する自動検証ツールである Verus や、モデルチェッカーの Kani、そして Rocq（Coq）へのトランスパイラなどは、メモリ安全性の上に構築されたビジネスロジックの完全性を数学的に証明する道を開いている[53]。型システムは単なるバグチェッカーから、プログラムの正当性を証明する「定理証明機」へと進化しており、ソフトウェアの信頼性を軍事・航空宇宙レベルにまで引き上げている[33]。

## 8. 結論：型システムは究極のゼロトラスト・インフラストラクチャである

本稿における分析により、「型駆動型多層防御（Type-Driven Defense Layers）」の理論は、従来のインフラストラクチャ中心の防御モデルを、ソフトウェア自身の内部アーキテクチャへとマッピングする体系的なアプローチであることが示された。以下の表に、その構造的な対応関係を総括する。

| 従来の多層防御モデル (Defense in Depth) | 型駆動型多層防御の対応レイヤー | 適用される PLT・型技術 | 排除される主な脅威と実現される防御効果 |
|---|---|---|---|
| 物理・ハードウェア保護 | 第1層：メモリと実行基盤層 | Rust Ownership, 借用チェッカー, MSL の強制 | バッファオーバーフローや UAF 等のメモリ破壊攻撃を根絶し、CISA/NSA の求める絶対的基盤を構築[10] |
| 境界防御 (Perimeter, FW) | 第2層：入力境界防御層 | "Parse, don't validate", ADT (代数的データ型), LangSec | ショットガン・パーシングを排除し、未知のデータを制約付きの専用型に変換することでインジェクションを水際で遮断[19] |
| ネットワークセキュリティ | 第3層：プロトコルと状態防御層 | Typestate パターン, セッション型 (Session Types, MPST) | 通信のデッドロックや順序違反、無効な状態遷移をコンパイル時に禁止し、ロジカルなラテラルムーブメントを防止[25] |
| アプリケーションセキュリティ | 第4層：不変条件とロジック防御層 | 細分型 (LiquidHaskell), Ghost of Departed Proofs (GoDP) | 境界外アクセスやビジネスロジック違反（監査漏れ等）を型の述語や証明オブジェクトとして強制し、冗長な防御的コードを排除[13] |
| データとアクセスの保護 | 第5層：情報フロー制御層 | セキュリティ型言語 (Jif, FlowCaml), IFC, 堅牢な機密解除 | 分散セキュリティラベルにより、機密データの不正漏洩パスや信頼性のないデータによる汚染パスを静的に完全遮断[41] |

「何も信頼せず、常に検証する」というゼロトラスト・アーキテクチャの原則は、インフラストラクチャ層において主流となりつつある[1]。型駆動型多層防御は、このゼロトラストの概念をソフトウェア内部の関数呼び出しやモジュール間通信に適用する「プロセス内ゼロトラスト（In-Process Zero Trust）」の体現に他ならない[55]。各レイヤーは単独で機能するだけでなく、例えば「第2層でパースされた構造化データ」が「第3層の Typestate」に従って遷移し、「第5層のセキュリティラベル」によって情報漏洩を防ぐといった形で、シームレスに連携する。

結論として、型駆動型多層防御は、後付けのセキュリティパッチや外部ツールへの依存（ボルトオン・セキュリティ）の限界を突破し、アプリケーション自体に自己防御能力を持たせるための手法である。サイバーセキュリティのリスクが増大し、国家レベルで「セキュア・バイ・デザイン」が要求される現代において、この理論的枠組みは次世代の安全なソフトウェアインフラストラクチャを構築するための羅針盤となりうる。

ただし、**本リポジトリにおける正本の防衛線モデルは4層**であり、本稿の5層対応は隣接分野からの補強地図である。主張境界は本稿冒頭、正本の定義とデモ保証は [type-driven-defense-layers.md](type-driven-defense-layers.md) を参照すること。

---

## 9. 正本4層との対応（再掲）

冒頭の短い対応地図の詳細版である。主張の統合ではなく、読者向けの地図に留める。

| 本稿5層（DiD対応） | 正本4層での主な接点 | 補足 |
|---|---|---|
| 1 メモリ安全 | 正本の前提（言語基盤） | 正本層番号には直接対応しない。TypeScript デモの前提外の政策・言語選択の議論 |
| 2 入力境界 | 正本② Parse, don't validate | 正本デモの branded parse と直接対応 |
| 3 プロトコル・状態 | 正本② Typestate | セッション型・MPST は正本に薄い補強トピック |
| 4 不変条件・ロジック | 正本② Refinement / Brand、正本① 網羅 | GoDP は正本に薄い補強トピック |
| 5 情報フロー (IFC) | 正本に未収録 | 将来の隣接拡張候補 |
| 形式検証（本稿 §7） | 正本③ AAT の形式化姿勢と部分的に共鳴 | AAT / SAGA の主張等級は [aat-bridge.md](aat-bridge.md) が正本 |
| 動的・境界の実証 | 正本④ PBT / 契約 | 本稿の DiD 5層表には明示層として薄い |

---

## 引用文献

1. What Is Defense-in-Depth?: A Layered Cybersecurity Strategy - Palo Alto Networks, https://www.paloaltonetworks.com/cyberpedia/what-is-defense-in-depth
2. ITSP.50.104 Guidance on defence in depth for cloud-based services - Cyber.gc.ca, https://www.cyber.gc.ca/en/guidance/itsp50104-guidance-defence-depth-cloud-based-services
3. Top Vulnerability Types: How to Identify and Mitigate Today's Most Exploitable Weaknesses, https://www.zafran.io/ctem-academy/top-vulnerability-types-mitigation-guide
4. Language-Based Security | South Asia Commons, https://southasiacommons.net/artifacts/54097462/language-based-security/54995830/
5. A Language-Based Approach to Security - CMU School of Computer Science, https://www.cs.cmu.edu/~rwh/papers/langsec/dagstuhl.pdf
6. Secure systems development using security-typed languages - Semantic Scholar, https://www.semanticscholar.org/paper/1e917f6c97049e79810547bcda2e0f380a1c00fc
7. Type-based Declassification for Free - NSF PAR, https://par.nsf.gov/servlets/purl/10292871
8. 2024 Year in Review - CISA, https://www.cisa.gov/about/2024YIR
9. Memory safety and network security - Tempesta Technologies, https://tempesta-tech.com/blog/memory-safety-and-network-security/
10. Memory Safe Languages: Reducing Vulnerabilities in Modern Software Development, https://media.defense.gov/2025/Jun/23/2003742198/-1/-1/0/CSI_MEMORY_SAFE_LANGUAGES_REDUCING_VULNERABILITIES_IN_MODERN_SOFTWARE_DEVELOPMENT.PDF
11. Why Everyone is Shifting from C/C++ to Rust? - Avidclan Technologies, https://www.avidclan.com/blog/why-everyone-is-shifting-from-c-and-c-plus-to-rust/
12. rust_memory_safety_examples - Rust - Docs.rs, https://docs.rs/rust-memory-safety-examples
13. Compile time techniques for safer firmware - Samir Rashid, https://godsped.com/safe-firmware/
14. In Search Of Shotgun Parsers In Android Applications - LangSec Workshop, http://spw16.langsec.org/papers/underwood-android-shotgun-parsers.pdf
15. Protecting Systems from Exploits Using Language-Theoretic Security - ProQuest, https://search.proquest.com/openview/3257085a04e81336537b2d662af653c5/1?pq-origsite=gscholar&cbl=18750&diss=y
16. Protecting Systems From Exploits Using Language-Theoretic Security, https://digitalcommons.dartmouth.edu/context/dissertations/article/1081/viewcontent/Prashant_s_Thesis.pdf
17. Parse, Don't Validate - in Python - Ricardo Decal's Blog, https://www.ricardodecal.com/opinions/parse-don-t-validate-in-python/
18. Parse, Don't Validate - Elm Radio, https://elm-radio.com/episode/parse-dont-validate/
19. LangSec revisited: input security flaws of the second kind - Institute for Computing and Information Sciences, https://www.cs.ru.nl/~erikpoll/papers/2018_langsec.pdf
20. What "Parse, don't validate" means in Python? : r/programming - Reddit, https://www.reddit.com/r/programming/comments/1m808e1/what_parse_dont_validate_means_in_python/
21. Parse, don't validate - Alexis King, https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/
22. Parsing data is nicer than only validating it - Matias Kinnunen, https://mtsknn.fi/blog/parse-dont-just-validate/
23. Parsix: Parse Don't Validate - Hacker News, https://news.ycombinator.com/item?id=27166162
24. GitHub - jamesdbrock/monadic-parsers-at-input-boundary: presentation, https://github.com/jamesdbrock/monadic-parsers-at-input-boundary
25. Rage Against the State Machine: Type-Stated Hardware Peripherals, https://www.researchgate.net/publication/403013317_Rage_Against_the_State_Machine_Type-Stated_Hardware_Peripherals_for_Increased_Driver_Correctness
26. Polymorphic Typestate for Session Types - arXiv, https://arxiv.org/pdf/2210.17335
27. Session Types in Reference-Passing Style - Universität Freiburg, https://freidok.uni-freiburg.de/files/283665/-ka_RQb2-1LMd0b9/main.pdf
28. Fifteen lessons from one password reset - Dominik Moštěk - Blog, https://dominikmostek.cz/2026-07-09-fifteen-lessons-from-one-password-reset.html
29. Programming Language Implementations with Multiparty Session Types - ResearchGate, https://www.researchgate.net/publication/377770844_Programming_Language_Implementations_with_Multiparty_Session_Types
30. Intrinsically Typed Sessions With Callbacks - arXiv, https://arxiv.org/pdf/2303.01278
31. (PDF) A verified, efficient embedding of a verifiable assembly language - ResearchGate, https://www.researchgate.net/publication/330146579_A_verified_efficient_embedding_of_a_verifiable_assembly_language
32. Flux: Liquid Types for Rust - eScholarship, https://escholarship.org/content/qt2zf4c27d/qt2zf4c27d.pdf
33. Efficient weakest preconditions | Request PDF - ResearchGate, https://www.researchgate.net/publication/222580098_Efficient_weakest_preconditions
34. Functional Programming for Securing Cloud and Embedded Environments - research.chalmers.se, https://research.chalmers.se/publication/540080/file/540080_Fulltext.pdf
35. ICSE 2025 - Research Track - ICSE 2025 - conf.researchr.org, https://conf.researchr.org/track/icse-2025/icse-2025-research-track
36. Techniques like Ghost of Departed Proofs are the most exciting thing to me as a ... - Hacker News, https://news.ycombinator.com/item?id=22094950
37. Not all untyped languages are the same. E.g. Clojure now encourages specifying a... | Hacker News, https://news.ycombinator.com/item?id=22091804
38. Dynamic type systems are not inherently more open - Hacker News, https://news.ycombinator.com/item?id=22090700
39. Parse, Don't Validate - Hacker News, https://news.ycombinator.com/item?id=21476261
40. Formalization of Security - arXiv, https://arxiv.org/html/2607.28551
41. Language-Based Information-Flow Security - Page has been moved, https://www.cse.chalmers.se/~andrei/jsac.pdf
42. Jif - Cornell: Computer Science, https://www.cs.cornell.edu/jif/
43. (PDF) Security Type Systems as Recursive Predicates - ResearchGate, https://www.researchgate.net/publication/255909940_Security_Type_Systems_as_Recursive_Predicates
44. Nonmalleable Information Flow Control - GitHub Pages, https://owenarden.github.io/home/papers/nmifc_ccs17.pdf
45. SIF: Enforcing Confidentiality and Integrity in Web Applications - USENIX, https://www.usenix.org/event/sec07/tech/full_papers/chong/chong.pdf
46. Language-based security - Cornell: Computer Science, https://www.cs.cornell.edu/gries/40brochure/pg14_15.pdf
47. Language-Based Security - Cornell: Computer Science, https://www.cs.cornell.edu/~kozen/Papers/lbs.pdf
48. Computer Aided Verification - OAPEN Library, https://library.oapen.org/bitstream/20.500.12657/23317/1/1006838.pdf
49. F*: A Proof-Oriented Programming Language, https://fstar-lang.org/
50. Research Topics – MSR-IMDEASW Joint Research Center - The IMDEA Software Institute, https://www.software.imdea.org/msr-imdeasw/index.html%3Fp=39.html
51. Formally Verified Cryptographic Web Applications in ... - Microsoft, https://www.microsoft.com/en-us/research/publication/formally-verified-cryptographic-web-applications-in-webassembly/?lang=ja
52. Project Everest - Microsoft Research: Tools, https://www.microsoft.com/en-us/research/project/project-everest-verified-secure-implementations-https-ecosystem/downloads/?lang=ja
53. GitHub - formal-land/rocq-of-rust: Formal verification tool for Rust: check 100% of execution cases of your programs to make safer applications., https://github.com/formal-land/rocq-of-rust
54. KVerus: Scalable and Resilient Formal Verification Proof Generation for Rust Code - arXiv, https://arxiv.org/html/2605.03822v1
55. Building Collaboration Applications That Mix Web Services Hosted, https://www.cs.cornell.edu/~krzys/krzys_icws2009_2.pdf
