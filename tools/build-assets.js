/**
 * build-assets.js — img/<CODE>.png から公開アセットを再生成（夜職診断）
 * 生成: og.png(1200x630) / card/<CODE>.png / t/<CODE>.html
 * 使い方: cd tools && npm install && node build-assets.js
 */
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");
const ROOT = path.join(__dirname, "..");

const CONFIG = {
  siteName: "夜職タイプ診断",
  domain: "https://yashoku.soter-info.com",
  hashtag: "#夜職タイプ診断",
  bg: { r: 0x14, g: 0x0f, b: 0x1e },   // --bg
  bar: { r: 0xf0, g: 0x62, b: 0x92 },  // --pink
  faviconCode: "ATRC",
  order: [
    "ATRC", "ATRK", "ATFC", "ATFK", "AVRC", "AVRK", "AVFC", "AVFK",
    "STRC", "STRK", "STFC", "STFK", "SVRC", "SVRK", "SVFC", "SVFK",
  ],
  names: {
    ATRC: "永久シャンパンコール女王", ATRK: "色恋のフリして堅実貯金嬢", ATFC: "全員友達おごりまくり兄さん", ATFK: "ノンアル宴会部長",
    AVRC: "顔で卓を沸かすエース", AVRK: "ビジュ最強・財布鉄壁", AVFC: "推され慣れてない照れエース", AVFK: "写真と違わないアイドル",
    STRC: "しっとりガチ恋沼ホスト", STRK: "既読つけない小悪魔", STFC: "聞き上手すぎるママ", STFK: "説教してくる姉さん",
    SVRC: "静かな色気の魔性", SVRK: "塩対応なのに人気No.1", SVFC: "実は人見知りの美形", SVFK: "定時退勤の鑑",
  },
};

function readPNG(p) { return PNG.sync.read(fs.readFileSync(p)); }
function solid(w, h, col) {
  const png = new PNG({ width: w, height: h });
  for (let i = 0; i < w * h; i++) { png.data[i*4]=col.r; png.data[i*4+1]=col.g; png.data[i*4+2]=col.b; png.data[i*4+3]=255; }
  return png;
}
function paste(dst, W, tile, dx, dy, size) {
  const scale = tile.width / size;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const sx = x*scale, sy = y*scale, x0=Math.floor(sx), y0=Math.floor(sy);
    const x1=Math.min(x0+1,tile.width-1), y1=Math.min(y0+1,tile.height-1), fx=sx-x0, fy=sy-y0, px=[];
    for (let c=0;c<4;c++){const v00=tile.data[(y0*tile.width+x0)*4+c],v10=tile.data[(y0*tile.width+x1)*4+c],v01=tile.data[(y1*tile.width+x0)*4+c],v11=tile.data[(y1*tile.width+x1)*4+c];px[c]=v00*(1-fx)*(1-fy)+v10*fx*(1-fy)+v01*(1-fx)*fy+v11*fx*fy;}
    const a=px[3]/255; if(a<=0.01)continue;
    const di=((dy+y)*W+(dx+x))*4;
    for(let c=0;c<3;c++)dst.data[di+c]=Math.round(px[c]*a+dst.data[di+c]*(1-a));
  }
}
function barStripe(dst, W, H, col) {
  for (let y=0;y<14;y++) for(let x=0;x<W;x++){const t=(y*W+x)*4,b=((H-1-y)*W+x)*4;dst.data[t]=col.r;dst.data[t+1]=col.g;dst.data[t+2]=col.b;dst.data[b]=col.r;dst.data[b+1]=col.g;dst.data[b+2]=col.b;}
}

function main() {
  const W=1200,H=630,imgDir=path.join(ROOT,"img");
  for(const code of CONFIG.order){ if(!fs.existsSync(path.join(imgDir,code+".png"))) throw new Error("img/"+code+".png が見つかりません"); }
  fs.mkdirSync(path.join(ROOT,"card"),{recursive:true});
  fs.mkdirSync(path.join(ROOT,"t"),{recursive:true});
  const og=solid(W,H,CONFIG.bg);
  const SIZE=138,GAP=8,rowW=8*SIZE+7*GAP,x0=Math.round((W-rowW)/2),rowsY=[95,340];
  CONFIG.order.forEach((code,i)=>{ const tile=readPNG(path.join(imgDir,code+".png")); paste(og,W,tile,x0+(i%8)*(SIZE+GAP),rowsY[Math.floor(i/8)],SIZE); });
  barStripe(og,W,H,CONFIG.bar);
  fs.writeFileSync(path.join(ROOT,"og.png"),PNG.sync.write(og));
  for(const code of CONFIG.order){
    const card=solid(W,H,CONFIG.bg), tile=readPNG(path.join(imgDir,code+".png"));
    paste(card,W,tile,Math.round((W-560)/2),35,560); barStripe(card,W,H,CONFIG.bar);
    fs.writeFileSync(path.join(ROOT,"card",code+".png"),PNG.sync.write(card));
    const name=CONFIG.names[code], title="夜職デビューしたら『"+name+"』でした！";
    const html='<!DOCTYPE html>\n<html lang="ja">\n<head>\n<meta charset="UTF-8">\n<title>'+title+'｜'+CONFIG.siteName+'</title>\n'+
      '<meta property="og:type" content="website">\n<meta property="og:site_name" content="'+CONFIG.siteName+'">\n'+
      '<meta property="og:title" content="'+title+'">\n'+
      '<meta property="og:description" content="12問であなたの夜職タイプを16分類。コール風の決め台詞つき。あなたは何タイプ？ '+CONFIG.hashtag+'">\n'+
      '<meta property="og:url" content="'+CONFIG.domain+'/t/'+code+'.html">\n'+
      '<meta property="og:image" content="'+CONFIG.domain+'/card/'+code+'.png">\n'+
      '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'+
      '<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="'+title+'">\n'+
      '<meta name="twitter:image" content="'+CONFIG.domain+'/card/'+code+'.png">\n'+
      '<meta http-equiv="refresh" content="0; url=/?type='+code+'">\n'+
      '<link rel="icon" type="image/png" href="/img/'+CONFIG.faviconCode+'.png">\n</head>\n'+
      '<body><p><a href="/?type='+code+'">'+CONFIG.siteName+'で結果を見る</a></p></body>\n</html>\n';
    fs.writeFileSync(path.join(ROOT,"t",code+".html"),html);
  }
  console.log("done: og.png + card(16) + t(16)");
}
main();
