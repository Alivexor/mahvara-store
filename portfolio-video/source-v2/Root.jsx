import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FPS = 60;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const starts = [0, 240, 1080, 2040, 3180, 3900, 4740, 5280, 5880];

const faNumber = (value) => new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2 }).format(value);

function Grain({ dark = false }) {
  return <div className={`v2-grain${dark ? " v2-grain-dark" : ""}`} aria-hidden="true" />;
}

function EdgeShade() {
  return <div className="v2-edge-shade" aria-hidden="true" />;
}

function SceneWipe({ tone = "cream" }) {
  const frame = useCurrentFrame();
  const travel = interpolate(frame, [0, 34], [0, 108], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <div className={`v2-wipe v2-wipe-${tone}`} style={{ transform: `translateX(${travel}%)` }} />
  );
}

function MiniBrand({ light = false }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [20, 50], [0, 0.9], clamp);
  return (
    <div className={`v2-mini-brand${light ? " light" : ""}`} style={{ opacity }}>
      <Img src={staticFile("assets/mahvara-mark.svg")} />
      <span>ماه‌ورا</span>
    </div>
  );
}

function Timeline({ scene, frames, light = false }) {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [0, frames], [0, 100], clamp);
  return (
    <div className={`v2-timeline${light ? " light" : ""}`}>
      <b>{faNumber(scene)}</b>
      <i><span style={{ width: `${width}%` }} /></i>
    </div>
  );
}

function CompactCaption({ title, kicker, frames, side = "left" }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 34, fps, config: { damping: 19, stiffness: 94, mass: 0.78 } });
  const exit = interpolate(frame, [Math.min(270, frames - 120), Math.min(340, frames - 54)], [1, 0], clamp);
  const opacity = Math.min(enter, exit);
  return (
    <div className={`v2-caption v2-caption-${side}`} dir="rtl" style={{ opacity, transform: `translateY(${(1 - enter) * 28}px)` }}>
      <i />
      <p>{kicker}</p>
      <h2>{title}</h2>
    </div>
  );
}

function ConnectionBadge({ frames, mode }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = mode === "out" ? frames - 165 : 32;
  const reveal = spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 105 } });
  const fade = mode === "out" ? 1 : interpolate(frame, [0, 190, 250], [0, 1, 0], clamp);
  return (
    <div className="v2-connection" dir="rtl" style={{ opacity: reveal * fade, transform: `translateX(${(1 - reveal) * -34}px)` }}>
      <span className="v2-connection-dot" />
      <strong>همان سفارش؛ همان داده</strong>
      <small>حساب مشتری ← پنل مدیریت</small>
    </div>
  );
}

function CaptureScene({ file, sourceDuration, sourceStart = 0, frames, scene, title, kicker, side = "left", focusX = 0, tone = "cream", connection }) {
  const frame = useCurrentFrame();
  const sceneSeconds = frames / FPS;
  const playbackRate = (sourceDuration - sourceStart) / sceneSeconds;
  const fade = interpolate(frame, [0, 18, frames - 25, frames], [0, 1, 1, 0], clamp);
  const drift = interpolate(frame, [0, frames], [focusX - 8, focusX + 8], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const scale = interpolate(frame, [0, frames], [1.008, 1.035], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill className="v2-capture" style={{ opacity: fade }}>
      <div className="v2-video-layer" style={{ transform: `translateX(${drift}px) scale(${scale})` }}>
        <OffthreadVideo className="v2-screen" src={staticFile(`captures/v2/${file}`)} muted startFrom={Math.round(sourceStart * FPS)} playbackRate={playbackRate} />
      </div>
      <EdgeShade />
      <div className={`v2-light-sweep v2-light-sweep-${side}`} />
      <MiniBrand />
      <Timeline scene={scene} frames={frames} />
      <CompactCaption title={title} kicker={kicker} frames={frames} side={side} />
      {connection ? <ConnectionBadge frames={frames} mode={connection} /> : null}
      <Grain />
      <SceneWipe tone={tone} />
    </AbsoluteFill>
  );
}

function IntroPanel({ src, className, delay }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 108, mass: 0.72 } });
  return (
    <div className={`v2-intro-panel ${className}`} style={{ opacity: reveal, transform: `translateY(${(1 - reveal) * 80}px) scale(${0.92 + reveal * 0.08})` }}>
      <Img src={staticFile(src)} />
    </div>
  );
}

function Intro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const word = spring({ frame: frame - 72, fps, config: { damping: 18, stiffness: 100, mass: 0.72 } });
  const brand = spring({ frame: frame - 126, fps, config: { damping: 18, stiffness: 86 } });
  const hookFade = interpolate(frame, [101, 124], [1, 0], clamp);
  const montageFade = interpolate(frame, [108, 166], [1, 0.28], clamp);
  const totalFade = interpolate(frame, [0, 16, 215, 240], [0, 1, 1, 0], clamp);
  const slash = interpolate(frame, [74, 132], [0, 520], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill className="v2-intro" style={{ opacity: totalFade }}>
      <div className="v2-intro-grid" />
      <div className="v2-intro-panels" style={{ opacity: montageFade }}>
        <IntroPanel src="captures/v2/poster-home.png" className="home" delay={4} />
        <IntroPanel src="captures/v2/poster-product.png" className="product" delay={18} />
        <IntroPanel src="captures/v2/poster-admin.png" className="admin" delay={32} />
      </div>
      <div className="v2-intro-shade" />
      <div className="v2-intro-hook" dir="rtl" style={{ opacity: word * hookFade, transform: `translateY(${(1 - word) * 24}px)` }}>
        <span>یک فروشگاه</span>
        <i style={{ width: slash }} />
        <strong>یک سیستم کامل</strong>
      </div>
      <div className="v2-intro-brand" dir="rtl" style={{ opacity: brand, transform: `scale(${0.86 + brand * 0.14})` }}>
        <Img src={staticFile("assets/mahvara-mark.svg")} />
        <div><b>MAHVARA</b><h1>ماه‌ورا</h1></div>
      </div>
      <Grain dark />
    </AbsoluteFill>
  );
}

const technologies = ["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"];
const engineering = ["احراز هویت نقش‌محور", "محاسبات سمت سرور", "رزرو تراکنشی موجودی", "داده‌های یکپارچه"];

function TechScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frames = 540;
  const title = spring({ frame: frame - 26, fps, config: { damping: 18, stiffness: 84 } });
  const fade = interpolate(frame, [0, 18, frames - 28, frames], [0, 1, 1, 0], clamp);
  const beam = interpolate(frame, [0, frames], [-420, 2120], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill className="v2-tech" style={{ opacity: fade }}>
      <div className="v2-tech-grid" />
      <div className="v2-tech-beam" style={{ transform: `translateX(${beam}px) rotate(-18deg)` }} />
      <MiniBrand light />
      <Timeline scene={7} frames={frames} light />
      <div className="v2-tech-copy" dir="rtl">
        <p style={{ opacity: title }}>مهندسی پشت تجربه</p>
        <h2 style={{ opacity: title, transform: `translateY(${(1 - title) * 30}px)` }}>تکنولوژی مدرن در تمام لایه‌ها</h2>
        <div className="v2-tech-stack" dir="ltr">
          {technologies.map((item, index) => {
            const reveal = spring({ frame: frame - 92 - index * 12, fps, config: { damping: 17, stiffness: 104 } });
            return <span key={item} style={{ opacity: reveal, transform: `translateY(${(1 - reveal) * 26}px)` }}>{item}</span>;
          })}
        </div>
        <div className="v2-engineering">
          {engineering.map((item, index) => {
            const reveal = spring({ frame: frame - 230 - index * 16, fps, config: { damping: 18, stiffness: 91 } });
            return <div key={item} style={{ opacity: reveal, transform: `translateX(${(1 - reveal) * 28}px)` }}><i>{faNumber(index + 1)}</i><b>{item}</b></div>;
          })}
        </div>
      </div>
      <Grain dark />
      <SceneWipe tone="wine" />
    </AbsoluteFill>
  );
}

function MobileScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frames = 600;
  const phone = spring({ frame: frame - 24, fps, config: { damping: 17, stiffness: 75, mass: 0.82 } });
  const copy = spring({ frame: frame - 76, fps, config: { damping: 18, stiffness: 88 } });
  const fade = interpolate(frame, [0, 20, frames - 28, frames], [0, 1, 1, 0], clamp);
  const rotate = interpolate(frame, [0, frames], [-2.3, 1.4], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill className="v2-mobile" style={{ opacity: fade }}>
      <div className="v2-mobile-orb" />
      <div className="v2-mobile-still v2-mobile-still-one"><Img src={staticFile("captures/v2/poster-home.png")} /></div>
      <div className="v2-mobile-still v2-mobile-still-two"><Img src={staticFile("captures/v2/poster-product.png")} /></div>
      <MiniBrand />
      <Timeline scene={8} frames={frames} />
      <div className="v2-phone-shadow" style={{ opacity: phone }} />
      <div className="v2-phone" style={{ opacity: phone, transform: `translateY(${(1 - phone) * 86}px) scale(${0.9 + phone * 0.1}) rotate(${rotate}deg)` }}>
        <div className="v2-phone-island" />
        <div className="v2-phone-screen"><OffthreadVideo src={staticFile("captures/v2/mobile-flow.webm")} muted playbackRate={1.088} /></div>
      </div>
      <div className="v2-mobile-copy" dir="rtl" style={{ opacity: copy, transform: `translateX(${(1 - copy) * -46}px)` }}>
        <p>همراهِ تجربهٔ خرید</p>
        <h2>طراحی کاملاً واکنش‌گرا</h2>
        <div><span>خانه</span><span>فروشگاه</span><span>محصول</span><span>سبد خرید</span></div>
      </div>
      <Grain />
      <SceneWipe tone="cream" />
    </AbsoluteFill>
  );
}

function Outro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame: frame - 28, fps, config: { damping: 19, stiffness: 82 } });
  const credit = spring({ frame: frame - 132, fps, config: { damping: 18, stiffness: 92 } });
  const fade = interpolate(frame, [0, 22, 315, 360], [0, 1, 1, 0], clamp);
  const line = interpolate(frame, [78, 145], [0, 370], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill className="v2-outro" style={{ opacity: fade }}>
      <div className="v2-outro-halo" />
      <div className="v2-outro-rings" />
      <div className="v2-outro-content" dir="rtl">
        <Img src={staticFile("assets/mahvara-mark.svg")} style={{ opacity: reveal, transform: `scale(${0.72 + reveal * 0.28})` }} />
        <h2 style={{ opacity: reveal, transform: `translateY(${(1 - reveal) * 26}px)` }}><span>MAHVARA</span><i>|</i> ماه‌ورا</h2>
        <div className="v2-outro-line" style={{ width: line }} />
        <p style={{ opacity: reveal }}>فروشگاه اینترنتی Full-Stack</p>
        <div className="v2-credit" style={{ opacity: credit, transform: `translateY(${(1 - credit) * 18}px)` }}><small>طراحی و توسعه</small><b>Ali.D</b></div>
      </div>
      <Grain dark />
    </AbsoluteFill>
  );
}

function Soundtrack() {
  const transitionStarts = starts.slice(1);
  const clicks = [813, 1285, 1430, 1660, 2290, 2740, 3380, 4135, 4400, 5460];
  return (
    <>
      <Audio src={staticFile("audio/mahvara-v2-score.wav")} volume={1} />
      <Sequence from={14}><Audio src={staticFile("audio/ui-impact-v2.wav")} volume={0.36} /></Sequence>
      {transitionStarts.map((at, index) => <Sequence key={at} from={at - 28}><Audio src={staticFile("audio/ui-sweep-v2.wav")} volume={index === 5 ? 0.25 : 0.17} /></Sequence>)}
      {clicks.map((at, index) => <Sequence key={at} from={at}><Audio src={staticFile(index === 2 ? "audio/ui-pop.wav" : "audio/ui-click-v2.wav")} volume={index === 2 ? 0.24 : 0.12} /></Sequence>)}
      <Sequence from={3056}><Audio src={staticFile("audio/ui-confirm.wav")} volume={0.28} /></Sequence>
      <Sequence from={3868}><Audio src={staticFile("audio/ui-impact-v2.wav")} volume={0.25} /></Sequence>
      <Sequence from={4638}><Audio src={staticFile("audio/digital-rise-v2.wav")} volume={0.24} /></Sequence>
      <Sequence from={5884}><Audio src={staticFile("audio/ui-impact-v2.wav")} volume={0.28} /></Sequence>
    </>
  );
}

function MahvaraV2() {
  return (
    <AbsoluteFill className="v2-root">
      <Sequence from={0} durationInFrames={240}><Intro /></Sequence>
      <Sequence from={240} durationInFrames={840}><CaptureScene file="discovery.webm" sourceDuration={18.08} frames={840} scene={1} kicker="کشف و جست‌وجو" title="از جست‌وجو تا انتخاب" side="left" focusX={5} /></Sequence>
      <Sequence from={1080} durationInFrames={960}><CaptureScene file="product-cart.webm" sourceDuration={22.28} frames={960} scene={2} kicker="تعامل واقعی" title="انتخاب؛ دقیق و روان" side="right" focusX={-4} tone="wine" /></Sequence>
      <Sequence from={2040} durationInFrames={1140}><CaptureScene file="checkout-flow.webm" sourceDuration={24.32} frames={1140} scene={3} kicker="مسیر یکپارچهٔ خرید" title="از سبد تا ثبت سفارش" side="left" focusX={4} /></Sequence>
      <Sequence from={3180} durationInFrames={720}><CaptureScene file="account-order.webm" sourceDuration={15.64} sourceStart={2.4} frames={720} scene={4} kicker="حساب مشتری" title="سفارش؛ شفاف و در دسترس" side="right" focusX={-4} connection="out" tone="wine" /></Sequence>
      <Sequence from={3900} durationInFrames={840}><CaptureScene file="admin-order.webm" sourceDuration={16.96} frames={840} scene={5} kicker="فراتر از رابط کاربری" title="مدیریت یکپارچهٔ فروشگاه" side="left" focusX={4} connection="in" /></Sequence>
      <Sequence from={4740} durationInFrames={540}><TechScene /></Sequence>
      <Sequence from={5280} durationInFrames={600}><MobileScene /></Sequence>
      <Sequence from={5880} durationInFrames={360}><Outro /></Sequence>
      <Soundtrack />
    </AbsoluteFill>
  );
}

function Poster() {
  return (
    <AbsoluteFill className="poster-v2" dir="rtl">
      <div className="poster-grid" />
      <div className="poster-glow" />
      <div className="poster-browser poster-browser-main">
        <div className="poster-browser-bar"><i /><i /><i /><span>MAHVARA</span></div>
        <Img src={staticFile("captures/v2/poster-home.png")} />
      </div>
      <div className="poster-browser poster-browser-product"><Img src={staticFile("captures/v2/poster-product.png")} /></div>
      <div className="poster-copy">
        <div className="poster-brand"><Img src={staticFile("assets/mahvara-mark.svg")} /><span>MAHVARA</span></div>
        <h1>ماه‌ورا</h1>
        <i className="poster-rule" />
        <h2>فروشگاه اینترنتی<br /><b>Full-Stack</b></h2>
        <p>تجربه‌ای مدرن از خرید آنلاین</p>
        <small>طراحی و توسعه <b>Ali.D</b></small>
      </div>
      <div className="poster-orbit" />
      <Grain />
    </AbsoluteFill>
  );
}

export function RemotionRoot() {
  return (
    <>
      <Composition id="MAHVARA-Portfolio-V2" component={MahvaraV2} durationInFrames={6240} fps={FPS} width={1920} height={1080} />
      <Composition id="MAHVARA-Karlancer-Poster" component={Poster} durationInFrames={1} fps={1} width={800} height={480} />
    </>
  );
}
