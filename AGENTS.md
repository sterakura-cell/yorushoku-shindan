# AGENTS.md — 夜職タイプ診断（よるしょく）

AIコーディングエージェント（Codex 等）向けガイド。まず `README.md` を読むこと。ここは要点と注意点のみ。

## これは何か
- 夜職デビューしたら何タイプかを16分類する**静的ネタ診断サイト**。本番 https://yorushoku.soter-info.com
- **ビルド工程なし**。`index.html` 1枚に全部入り。GitHub Pages（`main` push で自動デプロイ）。
- ⚠️ **ローカルフォルダ名は `yashoku-shindan`** だが、リポジトリ・ドメインは **`yorushoku`**（夜職=よるしょく）。混同しないこと。

## 触っていい / 触らない
- 編集対象は **`index.html`**（診断ロジック・16タイプ・決め台詞・SVGイラスト・シェア機能）。
- `og.png` / `card/*.png` / `t/*.html` は**自動生成物**。手編集せず `tools/build-assets.js` で再生成。
- `CNAME`・DNS・HTTPSは設定済み、理由なく変更しない。旧 `yashoku` DNSレコードは未使用（触らなくてよい）。

## 16タイプのコード体系
4軸2極。軸1 `A`/`S`（アゲ/しっとり）、軸2 `T`/`V`（トーク/ビジュ）、軸3 `R`/`F`（色恋/友営）、軸4 `C`/`K`（散財/堅実）。
16コード: ATRC ATRK ATFC ATFK AVRC AVRK AVFC AVFK STRC STRK STFC STFK SVRC SVRK SVFC SVFK

## 重要な整合ルール
- **タイプ名を変えたら** `index.html` の `TYPES[code].name` と `tools/build-assets.js` の `CONFIG.names` の**両方**を更新（不一致だとカード画像タイトルがズレる）。
- 各タイプは `mic`（コール/ラスソン風の決め台詞）を必ず持つ。エンタメ全振り、特定店舗・人物を貶めない。飲酒配慮のフッター注記は残す。
- 相性文 `match` は `（CODE）名前` 形式。参照名は実在タイプ名と一致。追加/削除は不可（16固定）。

## イラスト（現状SVG→AI画像化候補）
`img/<CODE>.png` は現状 `castSVG()` を512pxラスタライズしたもの。AI画像に差し替えるなら:
1. `img/<CODE>.png`（透過PNG）を差し替え。2. `cd tools && npm install && node build-assets.js`。3. push。※無くても `castSVG()` にフォールバック。

## デプロイ / 確認
```
git add -A && git commit -m "..." && git push
gh api repos/sterakura-cell/yorushoku-shindan/pages/builds/latest --jq .status   # "built"
curl -s https://yorushoku.soter-info.com/ | grep -o '<title>[^<]*</title>'
```
ローカル確認は `index.html` をブラウザで直接開くだけ。

## 姉妹サイト
わんこ/にゃんこ/ヤンキーが同構造（コード体系のみ別）。全サイトの結果画面から相互リンクしている。
