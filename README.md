# git-study
## 1. Gitのインストール
手始めにGitをインストールしましょう。

MacやLinuxの場合は（バージョンはちょっと古いですが）デフォルトで入っているので、バージョンを気にしないのであれば、何も準備せずに始められます。

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
  │└ feature/task_name
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
 ! [rejected]  develop -> develop (fetch first)
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
e82594b..a919f3f  develop -> origin/develop
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

### git log - 変更履歴を確認する
これまでどんなコミットがされてきたのか、ログを確認したい場合に実行します。

```bash
$ git log
commit ed0af582cb6987b9d827090e89d1fff180ea22d0 (HEAD -> develop, origin/develop)
Merge: 70387b1 7294d2a
Author: Yu shoji <p-shoji@sbs.shimadzu.co.jp>
Date:Wed Dec 6 13:12:05 2017 +0900

 Merge branch 'feature/edit-testfile' into develop

commit 7294d2ac2e4b1a709c290df106c48c9005f68944 (feature/edit-testfile)
Author: Yu shoji <p-shoji@sbs.shimadzu.co.jp>
Date:Wed Dec 6 13:08:30 2017 +0900

 テストファイルの修正

 rebaseコマンドのチェックのために修正を追加しました。

commit 70387b10b9abaa6aadf10814bd840fd00bc567d2
 ・
 ・
 ・
```

ログがずらずらと出ます。

#### 便利なオプションたち
ただ、`git log`だけだと「何のファイルに変更があったのか」「どんな変更があったのか」がわかりません。

そこで、オプションを使って、そこら辺も確認できるようにしましょう。

```bash
$ git log --stat #変更のあったファイル名が出る
commit 7294d2ac2e4b1a709c290df106c48c9005f68944 (feature/edit-testfile)
Author: Yu shoji <p-shoji@sbs.shimadzu.co.jp>
Date:Wed Dec 6 13:08:30 2017 +0900

 テストファイルの修正

 rebaseコマンドのチェックのために修正を追加しました。

 testfile | 3 +++
 1 file changed, 3 insertions(+)
 ・
 ・
 ・
commit 13dd56390f33aad9391e3dbaabee6f3c2f2435d8
Author: db-tec-shoji <shoji@db-tec.com>
Date:Wed Dec 6 13:06:05 2017 +0900

 リモートブランチのマージ方法を追加

 リモートの変更履歴をローカルに反映するための手順を追加しました。

 README.md | 80 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 80 insertions(+)
 ・
 ・
 ・
```

```bash
$ git log -p #差分が確認できる
commit 13dd56390f33aad9391e3dbaabee6f3c2f2435d8
Author: db-tec-shoji <shoji@db-tec.com>
Date:Wed Dec 6 13:06:05 2017 +0900  

 リモートブランチのマージ方法を追加

 リモートの変更履歴をローカルに反映するための手順を追加しました。

diff --git a/README.md b/README.md  
index 1ce356d..2a25c59 100644
--- a/README.md
+++ b/README.md
@@ -156,3 +156,83 @@ $ git commit
 $ git checkout develop
 $ git merge --no-ff feature/task_name
+  
+そのあと、リモートリポジトリに反映すればOKです。
+  
+$ git push
+また、`push`する際も、自分の手元よりもリモートが進んでいる場合は、まずリモートの変更内容を持ってこなくてはいけません。
 ・
 ・
 ・
```

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

### git cherry-pick - 特定の変更のみ持ってくる
`rebase`や`merge`のように、ブランチの変更内容全部持ってくる必要はないけど、ある特定のコミットのみほしいなんてときは、`cherry-pick`で解消しましょう。

まずは、ログを確認して持って来たいコミットのハッシュ値を確認しましょう。ハッシュ値はGitオブジェクトのIDのようなものです。

```bash
$ git log
 ・
 ・
 ・
commit b2414f3ae9a26aca9b138f39a16a1a8b2c95f612 #<-これがハッシュ値
Author: db-tec-shoji <shoji@db-tec.com>
Date:   Wed Dec 6 13:30:58 2017 +0900

    git logコマンドの説明追加

    Gitの履歴確認のためのコマンド説明を追記しました。
 ・
 ・
 ・
```

その後、先程コピーしたハッシュ値を元に`cherry-pick`します。

```bash
$ git cherry-pick b2414f3ae9a26aca9b138f39a16a1a8b2c95f612
```

### git reset - 間違った操作を取り消したい
誤ってコミットしてしまったり、マージしてしまった際は`reset`してしまいましょう。

`reset`にはおおむね2種類あるので、使い方とともに見ていきます。

```bash
$ touch dummyfile
$ echo "hogehoge" >> dummyfile
$ git add dummyfile
$ git commit -m "add dummyfile"
```

上記のように要らないファイルをコミットしてしまったとします。

まず、ファイル自体はそのままにしたいけど、コミット自体は取り消したいとき。作業が中途半端なのにコミットしてしまった場合などはこちらですね。

```bash
$ git reset --soft HEAD^
=== もしくは ===
$ git reset --soft b2414f3ae9a26aca9b138f39a16a1a8b2c95f612
$ git status
On branch feature/test
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        new file:   dummyfile
$ git reset
$ git status
On branch feature/test
Untracked files:
  (use "git add <file>..." to include in what will be committed)

        dummyfile

nothing added to commit but untracked files present (use "git add" to track)
```

`HEAD^`で、今の一つ前のコミットを表せます。また、ハッシュ値をしていして、そこまでのコミットを全部戻すことも可能です。ただ、「特定のコミットのみを戻す」操作ではないので、そこまでのコミットが一旦すべてなかったことになるので、注意してください。

`--soft`の場合は、ファイルがステージされた状態に戻るので、その状態も必要なければ、さらに`git reset`するとステージ状態も解除されます。

```bash
$ git reset --hard HEAD^
=== もしくは ===
$ git reset --hard b2414f3ae9a26aca9b138f39a16a1a8b2c95f612
$ git status
On branch feature/test
nothing to commit, working tree clean
$ ls
assets/  gulpfile.js  package.json  README.md  testfile
```

一方、`--hard`の場合は、そもそも全てなかったことになるので、使用する際はお気をつけください。

本来不必要だったのに混ざってしまったゴミファイルなんかを排除するときに使ったりします。

### git clean - ステージされていないファイルのお掃除
いらないファイルなのに混ざっていてリポジトリが汚いとき、お掃除したくなりますよね？

そういうときは`git clean`でかいけつしましょう。

例えば、

```bash
$ touch hoge #不要なファイルの作成
$ touch fuga #不要なファイルの作成
$ mkdir moga #不要なディレクトリの作成
```

このようにゴミファイルを作成し、

```bash
$ git status
On branch feature/test                                                       
Untracked files:                                                             
  (use "git add <file>..." to include in what will be committed)             

        fuga                                                                 
        hoge                                                                 

nothing added to commit but untracked files present (use "git add" to track)
```

ステータスを確認すると、ステージされていないファイルの存在が確認できます。ただし、Gitは「空のディレクトリ」を管理対象としない（設定の変更で管理するようにもできるようです）ので、「moga」ディレクトリはここでは確認できません。

そこで、まずドライランモードで`git clean`を実行します。

```bash
$ git clean -n
Would remove fuga
Would remove hoge
$ git clean -nd
Would remove fuga
Would remove hoge
Would remove moga/
```

こうすることで、お掃除対象のファイルがわかりますね。

ドライランモードのオプションが`-n`、ディレクトリも対象にするオプションが`-d`です。

何の気なしに`git clean`してしまうと、「本当は必要だったのに！！！」というファイルなんかも消されてしまうので、必ずドライランモードで確認してから実行するほうが身のためです。

ステージされていないファイルは、Git管理下にすらないため、もとに戻すことはできません。永遠に闇の中です・・・。

ドライランモードで列挙されたファイルが自分の意図通りであれば、実際に実行します。

```bash
$ git clean -fd
Removing fuga
Removing hoge
Removing moga/
```

### git rm --cached と .gitignoreの話
実ファイルとして手元には必要だけど、Gitの管理対象にはしたくない。そんなファイルありますよね？

例えば、設定ファイル。例えば、環境に依存するパッケージ類。例えば、コンパイル後の成果物。

今回のプロジェクトの中では、`node_modules/`と`dest/`がそれに当たります。

こちらのファイル群はすでに`.gitignore`に記載されているので、Gitで管理されていません。

```bash
$ cat .gitignore
node_modules/
dest/
```

では、すでにコミットしちゃっていて、あとからGit管理対象外にしたい場合、どうしたら良いでしょう？

`git rm`でファイルもGit上からも消せますが、手元にはおいておきたい場合、

```bash
$ touch hoge #不要なファイルの作成
$ git add hoge
$ git commit -m "add hoge"
$ echo "hogehoge" >> hoge
$ git status
On branch feature/test
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:  hoge

no changes added to commit (use "git add" and/or "git commit -a")
$ git add hoge
$ git commit -m "modify hoge"
$ git rm --cached hoge
rm 'hoge'
$ git status
On branch feature/test
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        deleted:    hoge

Untracked files:
  (use "git add <file>..." to include in what will be committed)

        hoge
$ git commit -m "remove hoge"
$ ls
assets/  hoge  gulpfile.js  package.json  README.md  testfile
$ echo "hoge" >> .gitignore #hogeをGit管理対象外にする
```

このようにすることによって、実ファイルは保持したまま、Gitの管理対象外にすることができます。

### git stash - 編集が中途半端なときに別ブランチに移る必要が出てきた
こっちの作業しているのに別ブランチで修正しなきゃいけないけど、コミットはしたくない・・・。そんなときありますよね？

そういうときは`stash`で編集内容を一時的に保持しちゃいましょう。

```bash
$ git stash
$ git status
On branch feature/test
nothing to commit, working tree clean
$ git stash list
stash@{0}: WIP on feature/test: b2a7efc delete hoge
```

取り出すときは、

```bash
$ git stash apply
```

でOKです。

ただし、直近のものから取り出され、また取り出しても`stash`内に残り続けるため、定期的にお掃除して、`stash`内に残っているものが把握できないことがないようにしましょう。

```bash
$ git stash drop
```

このコマンドで`stash`内からオブジェクトを消すことができます。
