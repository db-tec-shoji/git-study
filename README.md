# git-study
## 1. Gitのインストール
手始めにGitをインストールしましょう。

MacやLinuxの場合は（バージョンはちょっと古いですが）デフォルトで入っているので、バージョンを気にしないのであれば、何も気にせず始められます。

Windowsの場合は（10以降ならキメラみたいなUbuntuが入ってますが）、バイナリをダウンロードしてインストールする必要があります。めんどくさいですね。

[Git公式](https://git-scm.com/)

ダウンロードしてきたファイルを展開し、あとはボタンをポチポチしていけばOKです。

## 2. 既存のプロジェクトをGitリポジトリにする
今回の勉強会では扱いませんが、手元にあるプロジェクトをGitリポジトリ化することもできます。リモートリポジトリは必要ないので、個人で開発するときもお手軽ですね。

試しにやってみましょう。

先程インストールしたGitにGitBashというものが付属しているので、そちらを立ち上げてください。

```bash
$ cd ~/
$ pwd # /c/Users/your_username と表示されるはずです
$ mkdir test_project
$ cd test_project
$ touch testfile
$ git init
```

コマンドは`git init`だけです。これで、手元のファイルがバージョン管理できるようになりました。恐ろしいくらい簡単ですね。

作成したファイルをステージに載せるには下記を実行します。

```bash
$ git add testfile
$ git commit
```

エディタが開くのでコミットメッセージを書きましょう。

## 3. Gitリポジトリを持ってくる
すでに開発が進行しているプロジェクトに参画する場合はGitリポジトリを取ってくる必要があります。

今回は今見ていただいているリポジトリを持ってきましょう。

```bash
$ cd ~/
$ git clone https://github.com/db-tec-shoji/git-study.git
```

これで準備完了です。

## 4. 基本的なフロー - 概要
Gitリポジトリ上で開発を行う際の基本的なフローを紹介します。

ややこしいのですが、抑えておいたほうがのちのち役立つので、いきなりブランチを用いた開発フローを見ていきましょう。

[Git Flow](https://danielkummer.github.io/git-flow-cheatsheet/index.ja_JP.html)

上に上げたリンク先はGit flowという古くからあるブランチの運用方針です。

ただ、ここまで複雑になると、余計にややこしくなるため、普段はブランチの粒度を下記の感じにすると幸せになれる気がします。

```
master
  ├ develop
  │   └ feature/task_name
  └ hotfix/task_name
```

- master # 大元のブランチ。公開済みのもののみここにのっかる
    - develop # 開発中のブランチ。ステージング環境に公開されていると幸せになれる。すべての機能開発はここをもとにブランチを切る（`feature/hogehoge`）
      - feature/task_name # 機能開発用のブランチ。一機能ごとにこのブランチを切って、そのブランチ上で作業を行う。開発が終われば`develop`にマージする。※もしくは、リモートに`push`してレビューしてもらう。
    - hotfix/task_name # 緊急で対応が必要なバグ等の改修作業を行う。このブランチのみ直接`master`から切ってOK。対応が終われば、`master`及び`develop`にマージする。

次の項からは実際にコマンドを触りながら見ていきます。

## 5. 基本的なフロー - 実戦
今回のプロジェクトではすでに`develop`ブランチが存在するので、持ってきましょう。

```bash
$ cd ~/git-study
$ git checkout -b develop origin/develop
```

`git checkout`は、ブランチを切り替えるコマンドになります。`-b`オプションは、ブランチの切り替えと同時に、ブランチを作成することができます。

ローカルのリポジトリには、まだ`develop`ブランチは存在しないため、上記コマンドで、

1. ローカルに`develop`ブランチを作成
1. そのブランチは`origin/develop`というリモートのブランチを元にする

という操作を行っています。

では、実際にファイルを触って、変更履歴をgitに追加していきます。

### と、その前に。
今回のプロジェクトでは、gulpを使用しているので、そのための前準備をします。

```bash
$ which node
$ which gulp
```

上記コマンドで何も応答が返ってこなければ、インストールの必要があります。

[Node.js](https://nodejs.org/ja/)

上記リンクから、安定版のバイナリをダウンロードし、インストールしてください。

Nodejsがインストールされたら、次はgulpをインストールします。

```bash
$ npm install -g gulp
```

上記コマンドでgulpがグローバル領域にインストールされます。

ここまでできたら、プロジェクトに必要な依存パッケージをインストールします。

```bash
$ cd ~/git-study
$ npm install
```

ちょっと時間がかかりますが、node関連のモジュールがインストールされていきます。

インストールが終われば、下記のコマンドを実行しましょう。

```bash
$ gulp serve
```

ブラウザが開けばOKです。

### ファイルの変更とGitへの変更履歴追加
それでは実際にHTMLとCSSを変更して、Gitコマンドで変更履歴を追加していきましょう。

まず、ブランチを作成します。

```bash
$ git checkout -b feature/task_name
```

その後、エディタでファイルを開き変更を加えたあと、Gitに登録していきます。

```bash
$ git add your_changed_file
$ git commit
```

エディタが開くので、コミットメッセージを編集します。

終わったら、`develop`にマージしましょう。

```bash
$ git checkout develop
$ git merge --no-ff feature/task_name
```

そのあと、リモートリポジトリに反映すればOKです。

```bash
$ git push
```

## 6. リモートの変更内容を持ってくる
複数名で開発をしていると、リモートのブランチに変更が走っていることはしばしばです。

また、`push`する際も、自分の手元よりもリモートが進んでいる場合は、まずリモートの変更内容を持ってこなくてはいけません。

先程`push`した際に、こんなメッセージが出なかったでしょうか？

```bash
$ git push
To https://github.com/db-tec-shoji/git-study.git
 ! [rejected]        develop -> develop (fetch first)
error: failed to push some refs to 'https://github.com/db-tec-shoji/git-study.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

これは要するに「リモートリポジトリがあなたの手元の歴史より進んでるから、`push`する前に変更内容をローカルに持ってきてね」ということです。

ヒントには、`git pull`が推奨されていますが、様々な宗教的な理由（嘘）によって、このコマンドは使用してはいけません。※簡単に言うと、マージの履歴が場合によっては残らなくなるから。

そこで、リモートの変更履歴を取って来たい場合は、下記の通りの操作をすることになります。

```bash
$ git checkout develop
$ git fetch
remote: Counting objects: 4, done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 4 (delta 1), reused 4 (delta 1), pack-reused 0
Unpacking objects: 100% (4/4), done.
From https://github.com/db-tec-shoji/git-study
   e82594b..a919f3f  develop    -> origin/develop
```

`fetch`は、リモートの変更「情報」のみを取ってきてくれるコマンドです。

さきほどのメッセージからも推測できる通り、リモートの`develop`に変更が走っているみたいですね。なので、リモートの`develop`をマージしちゃいましょう。

```bash
$ git merge --no-ff origin/develop
Merge made by the 'recursive' strategy.
 testfile | 0
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 testfile
```

これで、リモートの`develop`への変更内容がローカルに反映されました。

「`merge`ってブランチを管理するものじゃなかったの？」

はい。ブランチを管理するものです。この場合も「リモートのブランチ」をマージしたという扱い。

慣れるまではややこしいですが、最初は呪文のように覚えてしまいましょう。

ちなみに`--no-ff`オプションはファストフォワードしないよ、ということです。

ファストフォワードとノンファストフォワードの違いは大きくは「マージの際にコミットポイントを作成するかどうか」です。

詳しくはこちらなどをご参照ください。

[図で分かるgit-mergeの--ff, --no-ff, --squashの違い](http://d.hatena.ne.jp/sinsoku/20111025/1319497900)

## 7. Gitの愉快なコマンドたち
ここまでで、基本的なGitの使い方は一通り抑えられました。

しかし、Gitの魅力はこれだけでは語り尽くせません。

大量にあるコマンドの中から、特に覚えておきたい素敵なものをお伝えします。

### git rebase - ブランチ生成元をずらす
`develop`ブランチが自分の開発ブランチより進んでしまったら？

とはいえ、まだ手元の`feature/hogehoge`は開発が終わっていません。かつ、`develop`の変更がないと、開発をすすめようにも進められない。

そんなときに嬉しいのが、`rebase`です。

今いるブランチの生成元のコミットを付け替えてくれます。

[【git】分かりやすく！mergeは「合流」、rebaseは「付け替え」!](http://nullnote.com/web/git/merge_rebase/)

コマンドで見ていきましょう。

```bash
$ git rebase develop
```

コンフリクトが発生した場合は、

```bash
=== コンフリクトを解消させる ===
$ git add target_file
$ git rebase --continue
```

ここで間違って`commit`してしまうと`rebase`が失敗するので、注意が必要です。
