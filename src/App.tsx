import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

/* ---------- Styles (kept in this file so App.tsx is fully self-contained) ---------- */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Schibsted+Grotesk:wght@400;500;600&display=swap');
:root{--bg:#E8E4DD;--ink:#24211E;--muted:#5F5A53;--line:rgba(36,33,30,.18);--accent:#6E5F4E;--deep:#4A4139;--flash:#D9C7A8;--field:#F4F1EC;
--serif:'Instrument Serif',Georgia,'Times New Roman',serif;--sans:'Schibsted Grotesk',system-ui,-apple-system,'Segoe UI',sans-serif;
box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root{--bg:#1C1916;--ink:#EDE8E0;--muted:#A69F94;--line:rgba(237,232,224,.16);--accent:#D9C7A8;--deep:#3A322B;--field:#26221E}}
html{scroll-padding-top:calc(env(safe-area-inset-top,0px) + 72px);scroll-behavior:smooth}
*,*::before,*::after{box-sizing:inherit}
body{margin:0;background:var(--bg);color:var(--ink);font:400 1.0625rem/1.6 var(--sans);-webkit-font-smoothing:antialiased}
h1,h2,h3{font-family:var(--serif);font-weight:400;margin:0;letter-spacing:-.015em}
p{margin:0}
a{color:inherit}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.wrap{max-width:1180px;margin:0 auto;padding:0 clamp(20px,5vw,48px)}
.nav{position:sticky;top:env(safe-area-inset-top,0px);z-index:20;background:var(--bg);border-bottom:1px solid var(--line)}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;height:68px}
.logo{font:400 1.75rem/1 var(--serif);text-decoration:none;font-style:italic}
.nav ul{display:flex;gap:28px;list-style:none;margin:0;padding:0;font-size:.95rem}
.nav ul a{text-decoration:none;color:var(--muted)}.nav ul a:hover{color:var(--ink)}
.btn{display:inline-block;border:0;border-radius:999px;padding:.8em 1.5em;font:500 1rem var(--sans);text-decoration:none;cursor:pointer;background:var(--ink);color:var(--bg)}
.btn.ghost{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--ink)}
.btn.accent{background:var(--accent);color:var(--bg)}
@media(max-width:720px){.nav ul{display:none}}
.hero{padding:clamp(40px,7vw,96px) 0 clamp(56px,8vw,112px)}
.hero .wrap{display:grid;grid-template-columns:1.25fr .75fr;gap:clamp(24px,5vw,72px);align-items:center}
.hero h1{font-size:clamp(3.4rem,9.2vw,8rem);line-height:.92}
.hero p.lead{max-width:34rem;margin:28px 0 36px;font-size:1.2rem;color:var(--muted)}
.hero .row{display:flex;gap:12px;flex-wrap:wrap}
.hero .facts{display:flex;gap:32px;margin-top:44px;padding-top:20px;border-top:1px solid var(--line);font-size:.95rem;color:var(--muted);flex-wrap:wrap}
.hero .facts b{display:block;color:var(--ink);font:400 1.6rem/1.2 var(--serif)}
@media(max-width:860px){.hero .wrap{grid-template-columns:1fr}}
.stage{display:flex;justify-content:center}
.strip-btn{all:unset;cursor:pointer;display:block;transform:rotate(4deg);transition:transform .35s}
.strip-btn:hover{transform:rotate(1deg) translateY(-6px)}
.strip-btn:focus-visible{outline:3px solid var(--accent);outline-offset:8px}
.strip{width:min(210px,52vw);background:#FBF9F5;padding:12px 12px 16px;display:grid;gap:8px;box-shadow:0 18px 40px -16px rgba(36,33,30,.4)}
.strip svg{display:block;width:100%;height:auto;animation:print .6s cubic-bezier(.3,.7,.2,1) both}
.strip .cap{font:italic 1rem var(--serif);color:#24211E;text-align:center;padding-top:4px}
.strip-hint{margin-top:22px;text-align:center;font-size:.9rem;color:var(--muted)}
@media(min-width:861px){
.hero{display:flex;align-items:center;min-height:calc(100svh - 68px - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px));padding:24px 0}
.hero .wrap{width:100%}
.hero h1{font-size:clamp(3.4rem,min(9.2vw,13.5vh),8rem)}
.hero p.lead{margin:20px 0 28px}
.hero .facts{margin-top:32px}
.strip{width:min(240px,calc((100svh - 215px)/3.75))}
}
@keyframes print{from{clip-path:inset(0 0 100% 0);transform:translateY(-10px)}to{clip-path:inset(0);transform:none}}
.flash-o{position:fixed;inset:0;background:#FBF9F5;pointer-events:none;z-index:50;animation:pop .7s ease-out both}
@keyframes pop{0%{opacity:.95}100%{opacity:0}}
section{padding:clamp(64px,9vw,120px) 0}
.sec-h{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:end;margin-bottom:48px}
.sec-h h2{font-size:clamp(2.4rem,5.5vw,4.4rem);line-height:1}
.sec-h p{color:var(--muted);max-width:30rem}
@media(max-width:760px){.sec-h{grid-template-columns:1fr;gap:16px}}
.booths{border-top:1px solid var(--line)}
.booth{border-bottom:1px solid var(--line)}
.booth>button{all:unset;box-sizing:border-box;width:100%;cursor:pointer;display:grid;grid-template-columns:1fr auto;align-items:center;padding:26px 0;gap:16px}
.booth>button:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.booth h3{font-size:clamp(2rem,4.5vw,3.4rem);line-height:1.05;transition:transform .3s,color .3s}
.booth button:hover h3,.booth.open h3{transform:translateX(12px);color:var(--accent)}
.booth .plus{width:38px;height:38px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--ink);position:relative;transition:transform .3s}
.booth .plus::before,.booth .plus::after{content:"";position:absolute;left:11px;right:11px;top:18px;height:2px;background:var(--ink)}
.booth .plus::after{transform:rotate(90deg);transition:transform .3s}
.booth.open .plus{transform:rotate(180deg)}.booth.open .plus::after{transform:rotate(0)}
.booth .body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s}
.booth.open .body{grid-template-rows:1fr}
.booth .body>div{overflow:hidden}
.booth .body p{max-width:40rem;padding:0 0 28px 12px;color:var(--muted)}
.booth .body span{display:block;padding:0 0 28px 12px;margin-top:-16px;font-weight:500}
.steps{display:grid;grid-template-columns:repeat(3,1fr)}
.step{padding:0 32px 0 0;border-right:1px solid var(--line);margin-right:32px}
.step:last-child{border:0;margin:0;padding:0}
.step .n{font:italic 4.5rem/1 var(--serif);color:var(--accent)}
.step h3{font-size:1.8rem;margin:14px 0 8px}
.step p{color:var(--muted)}
@media(max-width:820px){.steps{grid-template-columns:1fr;gap:36px}.step{border:0;margin:0;padding:0}}
.pk{background:var(--deep);color:#F4EFE7}
.pk .sec-h p{color:rgba(244,239,231,.8)}
.tiers{display:grid;grid-template-columns:repeat(3,1fr);border:1.5px solid rgba(244,239,231,.55)}
.tier{padding:36px 32px 32px;display:flex;flex-direction:column;gap:18px}
.tier+.tier{border-left:1.5px solid rgba(244,239,231,.55)}
.tier.pick{background:var(--flash);color:#24211E}
.tier h3{font-size:2rem}
.tier .price{font:400 3.6rem/1 var(--serif)}
.tier .price small{font:500 1.6rem var(--sans);opacity:.75;margin-right:4px;vertical-align:.85em}
.tier ul{list-style:none;margin:0;padding:0;display:grid;gap:8px;flex:1}
.tier li{padding-left:22px;position:relative}
.tier li::before{content:"";position:absolute;left:0;top:.62em;width:10px;height:1.5px;background:currentColor}
.tier .btn{align-self:flex-start;background:#F4EFE7;color:#24211E}
.tier.pick .btn{background:#24211E;color:#F4EFE7}
.note{margin-top:20px;font-size:.9rem;color:rgba(244,239,231,.75)}
@media(max-width:860px){.tiers{grid-template-columns:1fr}.tier+.tier{border-left:0;border-top:1.5px solid rgba(244,239,231,.55)}}
.quote blockquote{margin:0;max-width:52rem;font:400 clamp(1.9rem,4.4vw,3.3rem)/1.15 var(--serif)}
.quote cite{display:block;margin-top:28px;font:400 1rem var(--sans);color:var(--muted)}
.book .wrap{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(32px,6vw,88px)}
.book h2{font-size:clamp(2.6rem,6vw,5rem);line-height:.98}
.book .side p{margin-top:20px;color:var(--muted);max-width:26rem}
form{display:grid;grid-template-columns:1fr 1fr;gap:20px}
label{display:grid;gap:6px;font-weight:500;font-size:.95rem}
label.full{grid-column:1/-1}
input,select,textarea{font:400 1rem var(--sans);color:var(--ink);background:var(--field);border:1.5px solid var(--line);border-radius:10px;padding:.8em .9em;width:100%}
input:focus,select:focus,textarea:focus{outline:3px solid var(--accent);outline-offset:1px;border-color:var(--accent)}
textarea{min-height:96px;resize:vertical}
form .btn{grid-column:1/-1;justify-self:start}
.done{padding:36px;border:1.5px solid var(--ink);border-radius:10px}
.done h3{font-size:2.4rem;margin-bottom:10px}
@media(max-width:860px){.book .wrap{grid-template-columns:1fr}}
@media(max-width:520px){form{grid-template-columns:1fr}}
footer{border-top:1px solid var(--line);padding:40px 0 48px;color:var(--muted);font-size:.95rem}
footer .wrap{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:center}
footer .logo{color:var(--ink)}
.btn.sm{padding:.6em 1.15em;font-size:.95rem}
.btn:disabled{opacity:.55;cursor:default}
.controls{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px}
.privacy,.err{text-align:center;font-size:.85rem;color:var(--muted);margin:8px auto 0;max-width:22rem}
.err{color:var(--ink)}
.strip.flat{padding:0;gap:0}
.strip.flat img{display:block;width:100%}
.ph{position:relative;display:block;width:100%;aspect-ratio:120/110;object-fit:cover;background:#E3DBCF;overflow:hidden}
.ph video{display:block;width:100%;height:100%;object-fit:cover;transform:scaleX(-1)}
.ph .count{position:absolute;inset:0;display:grid;place-items:center;font:400 4.5rem/1 var(--serif);color:#FBF9F5;background:rgba(36,33,30,.35)}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
`;

/* ---------- Data ---------- */
type Booth = readonly [name: string, description: string, capacity: string];
type Tier = { name: string; price: string; perks: string[]; featured: boolean };

const COLORS: ReadonlyArray<readonly [string, string]> = [
  ["#D8CCBB", "#4A4139"],
  ["#F1ECE4", "#7A6A57"],
  ["#8C7B68", "#EDE6DA"],
  ["#2B2723", "#D9C7A8"],
];
const POSES: ReadonlyArray<readonly number[]> = [[60], [46, 74], [36, 60, 84], [60]];

const BOOTHS: Booth[] = [
  ["Curtain booth", "The classic enclosed booth. Guests pull the curtain, pose four times, and take a printed strip out of the slot.", "1 to 4 people per session"],
  ["Open backdrop", "No walls and a wider frame, so whole tables and families fit. Best for dance floors and big crowds.", "Up to 10 people per session"],
  ["360 spin", "A slow-motion video platform. Guests step on, the camera circles them, and the clip lands on their phone.", "1 to 3 people per session"],
];

const STEPS: ReadonlyArray<readonly [string, string]> = [
  ["Pick a date", "Send the form below. Alexa confirms availability and sends a quote within one day."],
  ["We set up early", "Alexa arrives 45 minutes before your start time, tests the lights, and stays with the booth all night."],
  ["Take home the strips", "Guests keep printed strips on the spot. Your online gallery is ready within 24 hours."],
];

const TIERS: Tier[] = [
  { name: "Two hours", price: "6,500", perks: ["One booth of your choice", "Unlimited printed strips", "On-site attendant"], featured: false },
  { name: "Four hours", price: "11,500", perks: ["Everything in Two hours", "Strip design matched to your event", "Props kit and online gallery"], featured: true },
  { name: "Full night", price: "17,500", perks: ["Everything in Four hours", "A second booth running in parallel", "Guestbook album of printed strips"], featured: false },
];

const EVENT_TYPES = ["Wedding", "Birthday", "Corporate event", "Other"];

const SHOT_COUNT = 4;
const COUNTDOWN_SECONDS = 5;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });
}

/** Stacks the captured photos into one printable strip image (PNG data URL). */
async function composeStrip(photos: string[]): Promise<string> {
  const W = 600, pad = 30, gap = 20;
  const fw = W - pad * 2, fh = Math.round((fw * 110) / 120);
  const H = pad + photos.length * fh + (photos.length - 1) * gap + 100;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#FBF9F5";
  ctx.fillRect(0, 0, W, H);
  const imgs = await Promise.all(photos.map(loadImage));
  imgs.forEach((im, i) => ctx.drawImage(im, pad, pad + i * (fh + gap), fw, fh));
  try { await document.fonts.load('italic 44px "Instrument Serif"'); } catch { /* fall back to Georgia */ }
  ctx.fillStyle = "#24211E";
  ctx.textAlign = "center";
  ctx.font = 'italic 44px "Instrument Serif", Georgia, serif';
  ctx.fillText("Alex Aura", W / 2, H - 32);
  return canvas.toDataURL("image/png");
}

type Mode = "demo" | "camera" | "done";

/* ---------- Components ---------- */
function Frame({ i, n }: { i: number; n: number }) {
  const [bg, fg] = COLORS[(i + n) % 4];
  const xs = POSES[i];
  const big = i === 3;
  const r = big ? 19 : xs.length > 2 ? 11 : 13;
  const hy = big ? 52 : 56;
  return (
    <svg viewBox="0 0 120 110" aria-hidden="true" style={{ animationDelay: `${0.55 + i * 0.5}s` }}>
      <rect width="120" height="110" fill={bg} />
      <circle cx="60" cy="66" r="46" fill="none" stroke={fg} strokeWidth="1.5" opacity=".55" />
      <circle cx="60" cy="66" r="58" fill="none" stroke={fg} strokeWidth="1.5" opacity=".3" />
      {xs.map((x) => (
        <g key={x} fill={fg}>
          <circle cx={x} cy={hy} r={r} />
          <path
            d={`M${x - r * 1.6} 112Q${x - r * 1.6} ${hy + r + 6} ${x} ${hy + r + 6}Q${x + r * 1.6} ${hy + r + 6} ${x + r * 1.6} 112Z`}
          />
        </g>
      ))}
    </svg>
  );
}

function BoothRow({ booth, open, toggle }: { booth: Booth; open: boolean; toggle: () => void }) {
  return (
    <div className={`booth${open ? " open" : ""}`}>
      <button aria-expanded={open} onClick={toggle}>
        <h3>{booth[0]}</h3>
        <span className="plus" />
      </button>
      <div className="body">
        <div>
          <p>{booth[1]}</p>
          <span>{booth[2]}</span>
        </div>
      </div>
    </div>
  );
}

type FormState = { name: string; email: string; date: string; type: string; note: string };
type FieldEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

export default function App() {
  const [shots, setShots] = useState(0);
  const [openBooth, setOpenBooth] = useState(0);
  const [pkg, setPkg] = useState("Four hours");
  const [sent, setSent] = useState<FormState | null>(null);
  const [form, setForm] = useState<FormState>({ name: "", email: "", date: "", type: "Wedding", note: "" });

  const [mode, setMode] = useState<Mode>("demo");
  const [photos, setPhotos] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [camError, setCamError] = useState("");
  const [stripUrl, setStripUrl] = useState("");
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const runId = useRef(0);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };
  useEffect(() => stopCamera, []);

  const startCamera = async () => {
    setCamError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError("This browser can't open a camera.");
      return;
    }
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 } },
        audio: false,
      });
      setPhotos([]);
      setStripUrl("");
      setRunning(false);
      setMode("camera");
    } catch (err) {
      const denied = err instanceof DOMException && err.name === "NotAllowedError";
      setCamError(
        denied
          ? "Camera access was blocked. Allow it in your browser settings, then try again."
          : "No camera could be opened here. Try again in a full browser tab."
      );
    }
  };

  const attachVideo = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && streamRef.current && el.srcObject !== streamRef.current) {
      el.srcObject = streamRef.current;
      el.play().catch(() => {});
    }
  };

  /** One click runs the whole booth: 5-4-3-2-1, snap, hold the photo for 1s, repeat. */
  const startSequence = async () => {
    if (running) return;
    const id = ++runId.current;
    setRunning(true);
    setPhotos([]);
    const taken: string[] = [];
    for (let shot = 0; shot < SHOT_COUNT; shot++) {
      for (let c = COUNTDOWN_SECONDS; c > 0; c--) {
        setCount(c);
        await sleep(1000);
        if (runId.current !== id) return; // cancelled
      }
      setCount(0);
      const video = videoRef.current;
      if (!video) return;
      const vw = video.videoWidth || 720, vh = video.videoHeight || 660;
      const target = 120 / 110;
      let sw = vw, sh = vh;
      if (vw / vh > target) sw = vh * target; else sh = vw / target;
      const canvas = document.createElement("canvas");
      canvas.width = 720;
      canvas.height = 660;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.translate(720, 0);
      ctx.scale(-1, 1); // mirror, like the preview
      ctx.drawImage(video, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, 720, 660);
      taken.push(canvas.toDataURL("image/jpeg", 0.92));
      setPhotos([...taken]);
      setShots((n) => n + 1); // camera flash
      await sleep(1000); // hold the new photo on screen
      if (runId.current !== id) return;
    }
    stopCamera();
    setStripUrl(await composeStrip(taken));
    setRunning(false);
    setMode("done");
  };

  const cancelCamera = () => {
    runId.current++;
    stopCamera();
    setRunning(false);
    setCount(0);
    setPhotos([]);
    setMode("demo");
  };

  const field = (k: keyof FormState) => (e: FieldEvent) => setForm({ ...form, [k]: e.target.value });
  const choosePackage = (name: string) => {
    setPkg(name);
    document.getElementById("book")?.scrollIntoView();
  };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: send `form` and `pkg` to your email service or backend here.
    setSent(form);
  };

  return (
    <div>
      <style>{CSS}</style>
      <div className="flash-o" key={shots} />

      <header className="nav">
        <div className="wrap">
          <a className="logo" href="#top">Alex Aura</a>
          <nav aria-label="Main">
            <ul>
              <li><a href="#booths">Booths</a></li>
              <li><a href="#process">Process</a></li>
              <li><a href="#packages">Packages</a></li>
            </ul>
          </nav>
          <a className="btn" href="#book">Check a date</a>
        </div>
      </header>

      <main id="top">
        <div className="hero">
          <div className="wrap">
            <div>
              <h1>Four frames.<br />One good night.</h1>
              <p className="lead">
                Photobooth rentals for weddings, birthdays and brand events. Alexa sets up, runs the booth, and puts a
                printed strip in every guest's hand.
              </p>
              <div className="row">
                <a className="btn accent" href="#book">Check a date</a>
                <a className="btn ghost" href="#packages">See packages</a>
              </div>
              <div className="facts">
                <div><b>Under 10 seconds</b>from pose to printed strip</div>
                <div><b>24 hours</b>to your online gallery</div>
              </div>
            </div>
            <div className="stage">
              <div>
                {mode === "demo" && (
                  <button className="strip-btn" onClick={() => setShots(shots + 1)} aria-label="Shuffle the strip colours">
                    <div className="strip" key={shots}>
                      {[0, 1, 2, 3].map((i) => (
                        <Frame key={i} i={i} n={shots} />
                      ))}
                      <div className="cap">Alex Aura</div>
                    </div>
                  </button>
                )}
                {mode === "camera" && (
                  <div className="strip">
                    {Array.from({ length: SHOT_COUNT }, (_, i) =>
                      photos[i] ? (
                        <img key={i} className="ph" src={photos[i]} alt={`Photo ${i + 1}`} />
                      ) : i === photos.length ? (
                        <div key={i} className="ph">
                          <video ref={attachVideo} playsInline muted autoPlay aria-label="Camera preview" />
                          {count > 0 && <div className="count" aria-live="assertive">{count}</div>}
                        </div>
                      ) : (
                        <div key={i} className="ph" />
                      )
                    )}
                    <div className="cap">Alex Aura</div>
                  </div>
                )}
                {mode === "done" && (
                  <div className="strip flat">
                    <img src={stripUrl} alt="Your finished photo strip" />
                  </div>
                )}
                <div className="controls">
                  {mode === "demo" && (
                    <>
                      <button className="btn accent sm" onClick={startCamera}>Take your own strip</button>
                      <button className="btn ghost sm" onClick={() => setShots(shots + 1)}>Shuffle colours</button>
                    </>
                  )}
                  {mode === "camera" && (
                    <>
                      <button className="btn accent sm" onClick={startSequence} disabled={running}>
                        {running ? `Photo ${Math.min(photos.length + 1, SHOT_COUNT)} of ${SHOT_COUNT}` : `Start ${SHOT_COUNT} photos`}
                      </button>
                      <button className="btn ghost sm" onClick={cancelCamera}>Cancel</button>
                    </>
                  )}
                  {mode === "done" && (
                    <>
                      <a className="btn accent sm" href={stripUrl} download="alex-aura-strip.png">Save strip</a>
                      <button className="btn ghost sm" onClick={startCamera}>Retake</button>
                    </>
                  )}
                </div>
                {mode !== "demo" && <p className="privacy">Your photos stay on your device.</p>}
                {camError && <p className="err" role="alert">{camError}</p>}
              </div>
            </div>
          </div>
        </div>

        <section id="booths">
          <div className="wrap">
            <div className="sec-h">
              <h2>Three ways to pose</h2>
              <p>Choose one booth or mix them. Every booth includes lighting, an attendant, and your own strip design.</p>
            </div>
            <div className="booths">
              {BOOTHS.map((b, i) => (
                <BoothRow key={b[0]} booth={b} open={openBooth === i} toggle={() => setOpenBooth(openBooth === i ? -1 : i)} />
              ))}
            </div>
          </div>
        </section>

        <section id="process" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-h">
              <h2>From inquiry to strip</h2>
              <p>You handle the guest list. Alexa handles the rest.</p>
            </div>
            <div className="steps">
              {STEPS.map((s, i) => (
                <div className="step" key={s[0]}>
                  <div className="n">{i + 1}</div>
                  <h3>{s[0]}</h3>
                  <p>{s[1]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="packages" className="pk">
          <div className="wrap">
            <div className="sec-h">
              <h2>Pick your hours</h2>
              <p>Prices are flat in Philippine pesos. No per-print fees, and no travel charge within the city.</p>
            </div>
            <div className="tiers">
              {TIERS.map((t) => (
                <div className={`tier${t.featured ? " pick" : ""}`} key={t.name}>
                  <h3>{t.name}</h3>
                  <div className="price"><small>₱</small>{t.price}</div>
                  <ul>
                    {t.perks.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <button className="btn" onClick={() => choosePackage(t.name)}>Choose {t.name.toLowerCase()}</button>
                </div>
              ))}
            </div>
            <p className="note">Add a booth or an extra hour to any package. Ask in the form.</p>
          </div>
        </section>

        <section className="quote">
          <div className="wrap">
            <blockquote>Alexa had a line going before the cake was cut. My grandmother still keeps our strip on her fridge.</blockquote>
            <cite>Marisol and Dev, wedding guests turned clients</cite>
          </div>
        </section>

        <section id="book" className="book" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="side">
              <h2>Hold your date</h2>
              <p>Tell Alexa about your event. You will hear back within one day with availability and a quote.</p>
            </div>
            {sent ? (
              <div className="done" role="status">
                <h3>Request sent, {sent.name}.</h3>
                <p>
                  Alexa will reply to {sent.email} within one day about {sent.date} ({pkg.toLowerCase()}).
                </p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <label>Your name<input required value={form.name} onChange={field("name")} autoComplete="name" /></label>
                <label>Email<input required type="email" value={form.email} onChange={field("email")} autoComplete="email" /></label>
                <label>Event date<input required type="date" value={form.date} onChange={field("date")} /></label>
                <label>
                  Event type
                  <select value={form.type} onChange={field("type")}>
                    {EVENT_TYPES.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <label className="full">
                  Package
                  <select value={pkg} onChange={(e) => setPkg(e.target.value)}>
                    {TIERS.map((t) => (
                      <option key={t.name}>{t.name}</option>
                    ))}
                  </select>
                </label>
                <label className="full">
                  Anything Alexa should know?
                  <textarea value={form.note} onChange={field("note")} />
                </label>
                <button className="btn accent" type="submit">Send request</button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <a className="logo" href="#top">Alex Aura</a>
          <span>Photobooth rentals for weddings, birthdays and brand events.</span>
          <span>hello@alexaura.example</span>
        </div>
      </footer>
    </div>
  );
}