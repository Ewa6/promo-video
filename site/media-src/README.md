# Home page media

The frames and the clip in `../src/media` are real renders from `../../template`, made with the
example script in `script.ts` (a sample product, Acme Cloud). The timings are estimated, so the clip
has no voice.

To render them again:

```bash
cp -r ../../template /tmp/pv-render && cd /tmp/pv-render
cp <this folder>/script.ts src/script.ts
npm ci
npm run sync -- hero --estimate
npm run sync -- vertical --estimate
npx remotion still src/index.ts Hero title.jpg --frame=105 --scale=0.6667 --image-format=jpeg --jpeg-quality=82
npx remotion still src/index.ts Hero problem.jpg --frame=225 --scale=0.6667 --image-format=jpeg --jpeg-quality=82
npx remotion still src/index.ts Hero inbox.jpg --frame=465 --scale=0.6667 --image-format=jpeg --jpeg-quality=82
npx remotion still src/index.ts Hero steps.jpg --frame=585 --scale=0.6667 --image-format=jpeg --jpeg-quality=82
npx remotion still src/index.ts Hero dashboard.jpg --frame=705 --scale=0.6667 --image-format=jpeg --jpeg-quality=82
npx remotion still src/index.ts Hero endcard.jpg --frame=825 --scale=0.6667 --image-format=jpeg --jpeg-quality=82
npx remotion still src/index.ts Vertical vertical.jpg --frame=150 --scale=0.5 --image-format=jpeg --jpeg-quality=82
npx remotion render src/index.ts Hero demo.mp4 --scale=0.5 --crf=30 --codec=h264 --muted
```

Then copy the files into `../src/media`.
