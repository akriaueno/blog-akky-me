---
title: gcloudのフィルタについて
description:
published: true
date: 2022-09-28
lastmod: 2022-09-28
tags: [gcloud, gcp]
editor: markdown
dateCreated: 2022-09-28
---

## フィルタ可能なキーを探す
[ドキュメント](https://cloud.google.com/sdk/gcloud/reference/topic/filters#term-1:~:text=Determine%20which%20fields%20are%20available%20for%20filtering)
```sh
gcloud <サブコマンド> --format=yaml --limit=1
```

## フィルタ
```sh
gcloud <サブコマンド> --filter="<key>=<value>"
```
keyに`.`や`/`が含まれる場合はシングルクオートで囲む。


## 複数フィルタ
[ドキュメント](https://cloud.google.com/sdk/gcloud/reference/topic/filters#term-1:~:text=False%2C%20otherwise%20False.-,term%2D1%20AND%20term%2D2,-True%20if%20both)
```sh
gcloud <サブコマンド> --filter="<key1>=<value1> AND <key2>=<value2>"
```
