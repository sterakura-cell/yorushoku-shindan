# 夜職タイプ診断（よるしょく）

12問に答えると、あなたが夜の世界に入ったら何タイプかを16分類するネタ診断サイト。
本番: **https://yorushoku.soter-info.com**

※ローカルフォルダ名は歴史的経緯で `yashoku-shindan` だが、リポジトリ名・ドメインは **`yorushoku`**（夜職=よるしょく）。

「16タイプ診断」シリーズの1つ（[わんこ](https://wanko.soter-info.com) / [にゃんこ](https://neko.soter-info.com) / [ヤンキー](https://yankee.soter-info.com) / 夜職）。全て同じエンジン。

---

## 技術スタック / 特徴

- **ビルド不要の静的サイト**。`index.html` 1ファイルに HTML/CSS/JS 全部入り。
- ホスティングは **GitHub Pages**（`main` 配信）。`git push` で自動デプロイ。
- イラストは `img/<CODE>.png` を表示、失敗時は JS内蔵SVG（`castSVG()`）にフォールバック。**現状のimg/はSVGを512pxにラスタライズしたPNG**（AI画像への差し替え候補）。
- テーマはネオン紫×ピンク×金。GA4は未設置（TODO）。

## ファイル構成

```
index.html            サイト本体（診断ロジック・16タイプ・SVGイラスト・シェア機能）
CNAME                 独自ドメイン（yorushoku.soter-info.com）
sitemap.xml           サイトマップ
og.png                トップOGP画像 ※自動生成物
img/<CODE>.png        タイプ別イラスト16枚（現状はcastSVGのラスタライズ）
card/<CODE>.png       タイプ別シェアカード16枚 ※自動生成物
t/<CODE>.html         タイプ別シェアページ ※自動生成物
tools/build-assets.js og.png/card/t を img/ から再生成するスクリプト
```

## 診断の仕組み

**4軸 × 2極 = 16タイプ**。各タイプは4文字コード。

| 軸 | 左極 | 右極 |
|----|------|------|
| 1 ノリ | **A** アゲ | **S** しっとり |
| 2 武器 | **T** トーク | **V** ビジュ |
| 3 営業 | **R** 色恋 | **F** 友営 |
| 4 財布 | **C** 散財 | **K** 堅実 |

例: `ATRC` = アゲ・トーク・色恋・散財 =「永久シャンパンコール女王」。
12問→軸ごとに多数決→`TYPES[code]` を表示。ロジックは `index.html` の `AXES`/`QUESTIONS`/`TYPES`/`finish()`。

## コンセプト

ホスト/キャバ嬢テーマ。各タイプに **`mic`（シャンパンコール/ラスソン風の決め台詞）** を持たせている。エンタメ全振り、特定店舗・人物を貶めない。フッターに「飲酒は20歳から・適量で」注記。

## よくある編集

すべて `index.html` 内。
- **決め台詞や説明** → `TYPES` の `mic`/`desc`/`catch`。
- **質問** → `QUESTIONS`（`axis`0〜3、`p`は極キー）。
- **タイプ名** → `TYPES[code].name` と `tools/build-assets.js` の `CONFIG.names` の**両方**。

## イラストの差し替え（AI画像化）

現状はSVGのラスタライズPNG。AI画像に上げる手順:
1. 新しい `img/<CODE>.png`（透過PNG）を配置。2. `cd tools && npm install && node build-assets.js`。3. push。※無くても `castSVG()` にフォールバック。

## デプロイ

```
git add -A && git commit -m "説明" && git push
gh api repos/sterakura-cell/yorushoku-shindan/pages/builds/latest --jq .status  # "built"
```

### ドメイン / DNS / HTTPS（設定済み・通常触らない）
- `CNAME` に `yorushoku.soter-info.com`。DNSは **Squarespace Domains**（CNAME yorushoku→sterakura-cell.github.io）。HTTPS強制済み。旧 `yashoku` レコードが残っているが未使用（実害なし）。

## TODO
- GA4計測タグ未設置。イラストのAI画像化。

## リポジトリ
`sterakura-cell/yorushoku-shindan`（public）。
