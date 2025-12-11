---
title: 正規表現でマッチしたグループを複数抽出する
description: 
date: 2021-07-23T19:14:19.648Z
tags: [linux, shell, regex, sed]
editor: markdown
dateCreated: 2021-06-30T17:54:11.412Z
---

## 概要
正規表現でマッチしたグループを複数抽出する場合はsedを使うと良い．グループが1つの場合はgrepでも`-oP`と`\K`で抽出できるが，グループが複数あるとできない．

## コード
i番目のグループ(`()`で囲まれた部分)を\iで置換する．

```shell
sed -r 's/<正規表現>/\i/g
```

## 例
vncのポート番号とpidを抽出する例
### sed
```shell
$ ss -ltp | grep vnc 
LISTEN    0         5                  0.0.0.0:5901             0.0.0.0:*        users:(("Xtigervnc",pid=3193,fd=7))                                            
LISTEN    0         5                  0.0.0.0:5902             0.0.0.0:*        users:(("Xtigervnc",pid=4404,fd=7))                                            
LISTEN    0         5                  0.0.0.0:5903             0.0.0.0:*        users:(("Xtigervnc",pid=4453,fd=7))                                            
LISTEN    0         5                     [::]:5901                [::]:*        users:(("Xtigervnc",pid=3193,fd=8))                                            
LISTEN    0         5                     [::]:5902                [::]:*        users:(("Xtigervnc",pid=4404,fd=8))                                            
LISTEN    0         5                     [::]:5903                [::]:*        users:(("Xtigervnc",pid=4453,fd=8))
$ ss -ltp | grep vnc | sed -r 's/^.*:([0-9]+).*pid=([0-9]+).*$/\1 \2/' | sort -u
5901 3193
5902 4404
5903 4453
```
うまくいく．

### grep
```shell
$ ss -ltp | grep vnc | grep -oP ':\K(\d+).*pid=\K(\d+)' | sort -u
3193
4404
4453
```
最後にマッチした部分のみが抽出されてしまう．

## 参考
- https://unix.stackexchange.com/questions/13466/can-grep-output-only-specified-groupings-that-match
- https://qiita.com/koara-local/items/2911bd81df2420a420ad
