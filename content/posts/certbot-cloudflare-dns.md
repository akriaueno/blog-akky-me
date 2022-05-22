---
title: CloudflareのDNSを利用しているドメインの証明書をcertbotで発行する
description: 
published: true
date: 2022-01-09T05:49:06.811Z
tags: [linux, certbot, cloudflare]
editor: markdown
dateCreated: 2021-06-16T18:12:33.581Z
---

## 概要
CloudflareのDNSを利用しているドメインの証明書をcertbotで発行する。
ワイルドカード証明書を発行する場合、certbotを使いDNS認証(DNS-01)でDNSレコードを手で修正していたが、CloudflareのAPIを利用すれば自動化できる。さらに`certbot-dns-cloudflare`というプラグインにより簡単に設定できるので紹介する。

## APIトークンの取得と設定
Cloudflareの`My Profile`の`APIトークン`>`トークンを作成する`>`ゾーン DNS を編集する`を選択しAPIトークンを発行する。
以下は設定例。
![cloudflare-api.png](/cloudflare-api.png)

発行したAPIトークンを含むクレデンシャルファイルを適当な場所に作成する。
```bash
$ sudo mkdir /etc/letsencrypt/cloudflare
$ sudo vim /etc/letsencrypt/cloudflare/akky.me.ini
dns_cloudflare_api_token=<発行したAPIトークン>
$ sudo chmod 700 /etc/letsencrypt/cloudflare
$ sudo chmod 600 /etc/letsencrypt/cloudflare/akky.me.ini
```

## certbotのインストール
[公式](https://certbot.eff.org/instructions/)の手順に従う。
今回はWebサーバがNginx，OSがDebian busterなのでsnapを使ってインストールする手順が表示された。
```bash
sudo apt install snapd # snapが入ってなければ
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

## プラグインのインストール
`certbot-dns-cloudflare`プラグインをインストールする。
```bash
sudo snap set certbot trust-plugin-with-root=ok
sudo snap install certbot-dns-cloudflare
```
1行目の設定を入れずにインストールするとエラーになる。
```bash
$ sudo snap install certbot-dns-cloudflare
error: cannot perform the following tasks:
- Run hook prepare-plug-plugin of snap "certbot" (run hook "prepare-plug-plugin":
-----
Only connect this interface if you trust the plugin author to have root on the system.
Run `snap set certbot trust-plugin-with-root=ok` to acknowledge this and then run this command again to perform the connection.                                                                                   
If that doesn't work, you may need to remove all certbot-dns-* plugins from the system, then try installing the certbot snap again.                                                                               
-----)
```

## 証明書の発行
certbotで証明書を発行する。
``` bash
$ sudo certbot certonly \
     --dns-cloudflare \
     --dns-cloudflare-credentials /etc/letsencrypt/cloudflare/akky.me.ini \
     -d akky.me,*.akky.me \
     -m <メールアドレス> \
     -n

Saving debug log to /var/log/letsencrypt/letsencrypt.log
Requesting a certificate for akky.me and *.akky.me
Waiting 10 seconds for DNS changes to propagate

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/akky.me/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/akky.me/privkey.pem
This certificate expires on 2021-09-14.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

## 参考
- https://certbot-dns-cloudflare.readthedocs.io/en/stable/
- https://icat.hatenablog.com/entry/2019/01/08/221520/
- https://n314.hatenablog.com/entry/2020/09/15/144913/
