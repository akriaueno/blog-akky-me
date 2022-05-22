---
title: Growiのパスワードを手動で変更する
description: 
published: true
date: 2022-03-28T07:55:57.191Z
tags: [growi, パスワード]
editor: markdown
dateCreated: 2022-03-06T12:48:20.925Z
---

## 概要
Growiのログインパスワードを忘れてしまい、パスワードを変更しようとしたが自身が管理者だったためログインしてユーザのパスワードを変更することができない状況に陥った。
MongoDBに保存されているパスワードのハッシュ値を手動で書き換えることで解決した。

## 手順
1. 環境変数`PASSWORD_SEED`を確認
docker-composeを用いている場合は`docker-compse.yml`に書かれているので、その値を使う。
ここでは`changeme`とする。

2. 設定したいパスワードを決める
ここでは`password024`とする。

3. パスワードのハッシュ値を計算する
[growiのコード](https://github.com/weseek/growi/blob/60b9769b3a8081ce0567eba54223771f13028450/packages/app/src/server/models/user.js#L131)を参考に計算する。
```js
node
> const hasher = crypto.createHash('sha256');
undefined
> hasher.update('changeme' + 'password024');  // 'PASSWORD_SEEDの値' + '設定したいパスワード'
Hash {
  _options: undefined,
  [Symbol(kHandle)]: BaseObject {},
  [Symbol(kState)]: { [Symbol(kFinalized)]: false }
}
> hasher.digest('hex');
'f2206eee5a5669a1028b4e4cf2c511056f6d5b576b7c05524b7750199bd64ce4' // パスワードのハッシュ値
```

4. MongoDBのパスワードのハッシュ値を書き換える
growiデータベースのusersコレクションの当該ドキュメントを書き換える。
```js
mongo growi
> db.users.find({email: "admin@akky.me"});  // パスワードを変更したいユーザのメールアドレスを指定
{ "_id" : ObjectId(...略
> db.users.update({email: "admin@akky.me"}, {$set: {password: "f2206eee5a5669a1028b4e4cf2c511056f6d5b576b7c05524b7750199bd64ce4"}});  // 変更する
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

```
updateの際に`$set`を指定しないと元のドキュメントのpassword以外のフィールドが全て削除されてしまうので注意。
docker-composeを用いている場合は`docker-compose exec mongo mongo growi`とかでMongoDBへログイン出来るかと思う。

以上の手順を踏むとパスワード`password024`でログインできるはずだ。
