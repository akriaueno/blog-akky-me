---
title: "Hugo に OpenTelemetry を追加してみる"
date: 2025-12-11T23:53:00+09:00
draft: false
---

この記事は [OpenTelemetry Advent Calendar 2025](https://qiita.com/advent-calendar/2025/otel) 11日目の記事です。

## 背景

このサイトは[Hugo](https://gohugo.io/) を利用しており、OpenTelemetry を利用して計装してみたかったので、追加してみました。
トレースは [Hoenycomb](https://www.honeycomb.io/) に送信します。
ただし、フロントエンドに Honeycomb の API Key を設定するわけには行かないため、Cloudflare Workers をバックエンドとして利用してトレースを転送します。

## 構成
1. フロントエンド(Hugo)に OpenTelemetry のスクリプトを追加する
2. バックエンド(Cloudflare Workers)にトレースを送信して Honeycomb に転送する
3. Honeycomb でトレースを確認する

## 手順
### 1. フロントエンド(Hugo)に OpenTelemetry のスクリプトを追加する。
Hugoの[JS.Build](https://gohugo.io/functions/js/build/)という機能を利用して、OpenTelemetryの計装スクリプトをフロントエンドに追加します。
バンドラはesbuildが兼ね備えているので、TypeScriptをそのまま記述してもビルドができます。
TypescriptとOpenTelemetryの依存関係を追加します。
```bash
npm i -D -E typescript
npm i -E @opentelemetry/api \
    @opentelemetry/context-zone \
    @opentelemetry/exporter-trace-otlp-http \
    @opentelemetry/instrumentation-document-load
    @opentelemetry/instrumentation-user-interaction \
    @opentelemetry/instrumentation-xml-http-request \
    @opentelemetry/resources \
    @opentelemetry/sdk-trace-web \
    @opentelemetry/semantic-conventions
```

TypeScriptの設定ファイルを作成します。
```bash
npx tsc --init
```

Otel計装用のスクリプト document-load.ts を作成します。
```bash
mkdir -p assets/js
touch assets/js/document-load.ts
```

document-load.ts は以下のようになります。
```typescript
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';


const exporter = new OTLPTraceExporter({
  url: 'https://akky-me-honeycomb-worker.akky.workers.dev/v1/traces',
});

const provider = new WebTracerProvider({
  spanProcessors: [new SimpleSpanProcessor(exporter)],
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'blog-akky-me',
  }),
});

provider.register({
  contextManager: new ZoneContextManager(),
});

registerInstrumentations({
  instrumentations: [
    new DocumentLoadInstrumentation(),
    new UserInteractionInstrumentation(),
    new XMLHttpRequestInstrumentation(),
  ],
});
```
ほぼ雛形そのままです。OpenTelemetryの[Getting Started](https://opentelemetry.io/docs/instrumentation/js/getting-started/)と[Example](https://github.com/open-telemetry/opentelemetry-js/blob/main/examples/opentelemetry-web/examples/fetch/index.js)を参考にして作成しました。

次に、layouts/partials/otel.html を作成します。hugoのJS.Buildを利用して、OpenTelemetryの計装スクリプトをフロントエンドに追加します。
```html
{{ $opts := dict "target" "es2020" "format" "esm" "minify" (not hugo.IsServer) }}
{{ with resources.Get "js/document-load.ts" | js.Build $opts | fingerprint "sha384" }}
<script type="module" src="{{ .RelPermalink }}" integrity="{{ .Data.Integrity }}" crossorigin="anonymous"></script>
{{ end }}
```

layouts/_default/baseof.html に以下を追加します。
```html
{{ partial "otel.html" . }}
```

これでフロントエンドに OpenTelemetry の計装スクリプトが追加されます。


### 2. バックエンド(Cloudflare Workers)でトレースを送信して Honeycomb に転送する。
Cloudflare Workers でトレースを Honeycomb に転送するコードを作成します。
LLMに作ってもらいました。 
[コードはこちら](https://github.com/akriaueno/blog-akky-me/tree/master/akky-me-honeycomb-worker)。
ホストが異なる場合はCORSの設定が必要です。
本来はサンプリングやフィルタリングを行うべきですが、今回は過疎サイトなので全て集計します。


### 3. Honeycomb でトレースを確認する。
Honeycomb でトレースを確認します。
自動的にリクエストのトレースが収集されています。
![honeycomb-trace.png](/img/honeycomb-trace.png)


## まとめ
OpenTelemetry の計装を Hugo に追加してみました。
Hugo の JS.Build と Cloudflare Workers を利用して、簡単に OpenTelemetry を追加することができました。
本番環境では考慮すべき点が多そうですが、今回は趣味のサイトなのでシンプルに実装しました。

## PR
* https://github.com/akriaueno/blog-akky-me/pull/3
* https://github.com/akriaueno/blog-akky-me/pull/4

## 参考文献
* [OpenTelemetryでフロントエンドのトレースを取得する](https://zenn.dev/lapi/articles/2025-07-20-otel-frontend)
* [OpenTelemetry Getting Started](https://opentelemetry.io/docs/languages/js/getting-started/browser/)
* [Hugo JS.Build](https://gohugo.io/functions/js/build/)