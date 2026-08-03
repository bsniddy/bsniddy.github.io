/* ============================================================
   PROJECT INDEX
   ------------------------------------------------------------
   This is the only file you need to touch to add / edit work.

   cover : "assets/work/xxx.jpg"  -> real image
           { gen: "wave" }        -> procedurally drawn plate
                                     (wave | scatter | grid | orbit | bars | pixels)
   accent: hex used for the card's signal color
   tags  : first tag is used as the card's category chip
   ============================================================ */

const CATEGORIES = ['ALL', 'EMBEDDED', 'ML & CV', 'RESEARCH', 'FULL-STACK', 'WEB'];

const PROJECTS = [
  /* ── 01 ─────────────────────────────────────────────── */
  {
    id: 'iridium',
    title: 'Solar Power Subsystem',
    subtitle: 'Iridium 9704 satellite transceiver',
    org: 'Iridium Communications',
    role: 'Software Engineering Intern',
    period: 'May 2026 — Present',
    cat: 'EMBEDDED',
    tags: ['EMBEDDED', 'FIRMWARE', 'POWER'],
    accent: '#F5C24A',
    cover: 'assets/work/iridium-joulescope.jpg',
    coverFit: 'cover',
    blurb: 'Battery-management and power-path firmware that lets a satellite dev kit run off-grid on solar.',
    stack: ['C', 'Embedded C++', 'BQ24195L PMIC', 'Joulescope', 'Git', 'CI/CD'],
    body: [
      { h: 'Problem', p: 'The 9704 developer kit is built to sit on a bench with a wall supply. Field deployments are the opposite: no mains power, unpredictable sun, and a transmit burst that spikes current the instant the modem wakes up. Without a power budget the kit browns out mid-transmission.' },
      { h: 'Approach', p: 'I extended the kit with a solar charging subsystem and wrote the firmware around it — power-path arbitration between panel, battery and load, charge-state supervision on the PMIC, and instrumentation so every state transition shows up on a current trace instead of a guess. Every change is validated against captured waveforms and folded into the CI/CD pipeline the team already runs.' },
      { h: 'Result', p: 'Measured, repeatable power behavior: an idle floor around 90 mA at 8 V, a clean charge-path handoff, and transmit spikes that are bounded instead of surprising. That turns "how long does it last outside?" into a number rather than a hope.' }
    ],
    gallery: [
      { src: 'assets/work/iridium-joulescope.jpg', cap: 'Joulescope capture — cold start into steady-state draw, ~94 mA at 8 V.' },
      { src: 'assets/work/iridium-board.jpg', cap: 'Power-path handoff. The notch is the load dropping out; the spike is the reset transient.' },
      { src: 'assets/work/iridium-lowlight.jpg', cap: 'Low-light solar test — charge current under a degraded panel input.' }
    ],
    note: 'Shown at the level of detail already published on my résumé. Implementation specifics are proprietary.'
  },

  /* ── 02 ─────────────────────────────────────────────── */
  {
    id: 'cmsc',
    title: 'Thermal Feedback Control',
    subtitle: 'Closed-loop speed control for industrial 3D printing',
    org: 'CMSC — Purdue',
    role: 'Undergraduate Researcher',
    period: 'Jan 2025 — Present',
    cat: 'RESEARCH',
    tags: ['RESEARCH', 'COMPUTER VISION', 'CONTROL'],
    accent: '#22D3D8',
    cover: 'assets/work/cmsc-thermal-track.png',
    coverFit: 'cover',
    blurb: 'A vision loop that watches the melt front through a thermal camera and rewrites the printer\'s speed mid-print.',
    stack: ['Python', 'OpenCV', 'NumPy', 'Thermal imaging', 'G-code'],
    body: [
      { h: 'Problem', p: 'On an industrial-scale printer, layer adhesion is a chemistry problem wearing a mechanics costume. Deposit too fast and the previous layer has already cooled out of its bonding window; too slow and you have paid hours for strength you did not need. The correct speed is not a constant — it moves with geometry, ambient temperature, and how much mass is under the nozzle.' },
      { h: 'Approach', p: 'I built a feedback control system that closes the loop with a thermal camera. Each frame is binned into temperature bands, the deposition bead is segmented out of the background, and its contour is tracked frame to frame. The measured interface temperature is compared against the bonding window and the controller modulates G-code feed rate so the next pass lands while the substrate is still chemically receptive.' },
      { h: 'Result', p: 'The tracker holds the bead through a full bell-shaped build — thousands of frames — and the loop drives speed up in the regions that can take it instead of running the whole part at the worst case. Faster prints, without giving up bond strength.' }
    ],
    gallery: [
      { src: 'assets/work/cmsc-thermal-track.png', cap: 'Frame 14,000 — segmented bead with tracked contour and bounding box, 80–300 °F scale.' },
      { src: 'assets/work/cmsc-thermal-print.jpg', cap: 'Raw thermal field mid-print. The gradient down the wall is the cooling history of every prior layer.' },
      { src: 'assets/work/cmsc-binned-overlay.jpg', cap: 'Temperature-binned overlay — the discretization the controller actually reasons over.' },
      { src: 'assets/work/cmsc-edges.png', cap: 'Tight-threshold edge extraction used to lock the bead boundary.' },
      { src: 'assets/work/cmsc-color3d.jpg', cap: 'HSV color-space projection used to separate the melt pool from reflections.' }
    ]
  },

  /* ── 03 ─────────────────────────────────────────────── */
  {
    id: 'burbio',
    title: 'Calendar Extraction at Scale',
    subtitle: 'Reading 1,000+ K–12 school calendars automatically',
    org: 'Burbio',
    role: 'AI Data Analytics Intern',
    period: 'Jul — Sep 2025',
    cat: 'ML & CV',
    tags: ['ML & CV', 'OCR', 'YOLO'],
    accent: '#57E08A',
    cover: 'assets/work/burbio-legend-detect.jpg',
    coverFit: 'cover',
    blurb: 'A detection + OCR pipeline that learns each district\'s color key, then reads every day cell against it.',
    stack: ['Python', 'YOLOv8', 'OCR', 'SSIM', 'HOG', 'Canny', 'OpenCV'],
    body: [
      { h: 'Problem', p: 'Every school district publishes its calendar as a picture. Same information, a thousand different layouts: a color means "no school" in one district and "early release" in the next, the legend might be a boxed sidebar or scattered under the grid, and half of them are scans. Humans were reading these one at a time.' },
      { h: 'Approach', p: 'I treated the legend as the primary detection target rather than an afterthought. A YOLOv8 model locates the legend blocks on the page; each swatch is sampled for its color and paired with its OCR\'d label, which gives you a per-district color→meaning dictionary. Only then does the pipeline walk the month grids, classify each day cell by swatch match, and emit structured events. SSIM, HOG and edge detection do the structural work — finding month blocks and day cells on documents that never agree on a layout.' },
      { h: 'Result', p: 'Extraction ran automatically across 1,000+ schools, with legend detection holding high confidence on unseen calendar formats. What had been a manual read became a batch job, and partners got their event data measurably faster.' }
    ],
    gallery: [
      { src: 'assets/work/burbio-legend-detect.jpg', cap: 'Legend detection on an unseen district calendar — four legend regions found at 0.90–0.98 confidence.' },
      { src: 'assets/work/burbio-calmon.png', cap: 'Per-cell classification. Each swatch resolves to a labeled event class from that district\'s own key.' }
    ],
    note: 'Calendars shown are publicly published district documents used as test inputs.'
  },

  /* ── 04 ─────────────────────────────────────────────── */
  {
    id: 'flake',
    title: '2D Flake Recognition',
    subtitle: 'Finding monolayer graphene under a microscope',
    org: 'Purdue — 2D materials research',
    role: 'Computer Vision Developer',
    period: '2025',
    cat: 'ML & CV',
    tags: ['ML & CV', 'CNN', 'SEGMENTATION'],
    accent: '#8FE04A',
    cover: 'assets/work/flake-cnn.jpg',
    coverFit: 'cover',
    blurb: 'A classifier that spots atomically thin flakes on a wafer by color, then a human-in-the-loop labeler to keep it honest.',
    stack: ['PyTorch', 'TensorFlow / Keras', 'YOLO', 'OpenCV', 'Segment Anything'],
    body: [
      { h: 'Problem', p: 'Exfoliated 2D material lands on a silicon-oxide wafer as thousands of specks, and only a handful are the monolayer you actually want. Thickness reads as a subtle color shift — a few RGB values apart from the substrate — so researchers hunt for them by eye at 10× through 100×, slide after slide.' },
      { h: 'Approach', p: 'Two models working together. A color classifier learns the substrate-relative signature of thin versus thick flakes, and a CNN plus contour segmentation pass proposes and outlines candidate regions with a confidence score. I also built the labeling app the training data came from, and a background-mask tuner so the pipeline could be retuned per illumination setup instead of per image.' },
      { h: 'Result', p: 'Whole-slide scans come back annotated with per-flake class and confidence, so the researcher reviews a shortlist instead of a wafer. The tuner made it portable across microscopes rather than overfit to one bench.' }
    ],
    gallery: [
      { src: 'assets/work/flake-cnn.jpg', cap: '10× scan with per-flake classification. Green is thin, yellow is thick, each with model confidence.' },
      { src: 'assets/work/flake-cnn-2.jpg', cap: 'Dense field — the case that makes manual review impractical.' },
      { src: 'assets/work/flake-segmented.jpg', cap: '20× color segmentation output used to isolate flake boundaries from substrate.' }
    ]
  },

  /* ── 05 ─────────────────────────────────────────────── */
  {
    id: 'digitaltwin',
    title: 'Cardiovascular Digital Twin',
    subtitle: 'Failure detection from biosensor time series',
    org: 'FLEX Lab — Purdue',
    role: 'Undergraduate Researcher',
    period: 'Aug 2024 — Jan 2025',
    cat: 'RESEARCH',
    tags: ['RESEARCH', 'DEEP LEARNING', 'FLASK'],
    accent: '#FF5A6E',
    cover: { gen: 'wave' },
    blurb: 'A deep model over wearable biosensor streams, plus the web UI that made its output inspectable in real time.',
    stack: ['Python', 'PyTorch', 'Flask', 'Time-series modeling'],
    body: [
      { h: 'Problem', p: 'A digital twin of the cardiovascular system is only useful if someone can see what it thinks and when it changed its mind. The modeling work was well underway; the outputs were arrays in a notebook.' },
      { h: 'Approach', p: 'I contributed to the deep learning model detecting cardiovascular failure signatures in biosensor data, and then built the thing it was missing — a Flask web interface that renders twin outputs live so researchers can scrub the signal, compare predicted against measured, and inspect the moments where they diverge.' },
      { h: 'Result', p: 'Real-time inspection and analysis of twin outputs in the browser, which turned model debugging from an export-and-plot loop into something you could actually watch happen.' }
    ]
  },

  /* ── 06 ─────────────────────────────────────────────── */
  {
    id: 'kalshi',
    title: 'Forecasting TSA Volume',
    subtitle: 'Signal research for Kalshi event markets',
    org: 'ML@Purdue',
    role: 'Project Member',
    period: '2026',
    cat: 'ML & CV',
    tags: ['ML & CV', 'FORECASTING', 'BACKTESTING'],
    accent: '#4C9DFF',
    cover: 'assets/work/mlp-baselines.png',
    coverFit: 'contain',
    coverPad: true,
    blurb: 'Daily passenger-throughput forecasting judged the only way that counts: walk-forward, against baselines, on unseen weeks.',
    stack: ['Python', 'Pandas', 'Gradient boosting', 'Walk-forward CV'],
    body: [
      { h: 'Problem', p: 'A prediction market does not ask for a point estimate, it asks whether the crowd is mispriced. That means you need a forecast distribution, an honest backtest with no lookahead, and a statistical gate that keeps a pretty-looking feature out of the model until it earns its place.' },
      { h: 'Approach', p: 'The team mapped a Kalshi market back to daily TSA checkpoint throughput, layered external demand and disruption signals on top, and put every candidate feature through correlation and lag-profile screening before it was allowed near a model. Evaluation is walk-forward — train on the past, predict the next window, never peek.' },
      { h: 'Result', p: 'Against a naive seasonal baseline the release candidate cut daily MAE by roughly 76%, and comfortably beat the tree baseline it was measured against. More usefully, the validation standard means that number survives contact with weeks the model has never seen.' }
    ],
    gallery: [
      { src: 'assets/work/mlp-baselines.png', cap: 'Daily MAE against baselines — the release candidate cuts error ~76% versus naive seasonal.', pad: true },
      { src: 'assets/work/mlp-generations.png', cap: 'Model generations. Each step is a validation gate passed, not a leaderboard climb.', pad: true }
    ],
    note: 'Collaborative ML@Purdue project. Charts are from the team\'s public-safe report; features, model configuration and trading rules are intentionally omitted.'
  },

  /* ── 07 ─────────────────────────────────────────────── */
  {
    id: 'numerai',
    title: 'Numerai Prediction Model',
    subtitle: 'Generalisation over financial time series',
    org: 'ML@Purdue',
    role: 'Project Member',
    period: 'Aug 2025 — Present',
    cat: 'ML & CV',
    tags: ['ML & CV', 'FINANCE', 'MLOPS'],
    accent: '#B08BFF',
    cover: { gen: 'scatter' },
    blurb: 'Building for the tournament where overfitting is not a bug you find later — it is the entire scoring function.',
    stack: ['Python', 'NumPy', 'Pandas', 'Feature neutralization', 'Hyperparameter search'],
    body: [
      { h: 'Problem', p: 'Numerai hands you thousands of obfuscated features over encrypted financial eras and scores you on live data you have never seen. Any model that leans on a feature whose relationship to the target is era-specific gets quietly destroyed.' },
      { h: 'Approach', p: 'Feature-target correlation analysis across every feature group to find what actually carries signal, feature neutralization to strip exposure that will not survive a regime change, cross-validation structured by era rather than by row, and a tuning pipeline the team can rerun rather than a config someone hand-tweaked once.' },
      { h: 'Result', p: 'Ongoing submissions with ML@Purdue, and a repeatable pipeline where the goal is explicitly generalization rather than in-sample score.' }
    ]
  },

  /* ── 08 ─────────────────────────────────────────────── */
  {
    id: 'personalos',
    title: 'Personal OS',
    subtitle: 'Second-brain dashboard and voice bot',
    org: 'Personal',
    role: 'Designer & Engineer',
    period: '2026',
    cat: 'FULL-STACK',
    tags: ['FULL-STACK', 'TYPESCRIPT', 'SUPABASE'],
    accent: '#3DDC97',
    cover: { gen: 'grid' },
    blurb: 'One dark instrument panel for training, school, tasks, finance and career — plus a bot that captures thoughts by voice.',
    stack: ['TypeScript', 'Vite', 'Supabase', 'Node', 'Telegram Bot API', 'Vercel'],
    body: [
      { h: 'Problem', p: 'Habit trackers, task apps, calendars and spreadsheets each hold a slice of the same life and none of them talk. The friction is not storage, it is capture: the thought arrives while you are walking to class, and by the time you have opened the right app it is gone.' },
      { h: 'Approach', p: 'A single dashboard with numbered panels — session, habits, training, school, tasks, career, nutrition, finance, weekly review — backed by Supabase, plus a companion bot that accepts a voice note or a one-line dump and routes it to the right panel later. Same design language you are looking at now: monospace labels, panel numbering, one signal color for state.' },
      { h: 'Result', p: 'Running daily. Capture takes about three seconds and nothing has to be filed at the moment it is thought of.' }
    ],
    note: 'Screenshots withheld — the dashboard renders my actual personal data.'
  },

  /* ── 09 ─────────────────────────────────────────────── */
  {
    id: 'launchpad',
    title: 'LaunchPad Dashboard',
    subtitle: 'Desktop diagnostics for Iridium 9704 / 9604',
    org: 'Personal',
    role: 'Engineer',
    period: '2026',
    cat: 'EMBEDDED',
    tags: ['EMBEDDED', 'ELECTRON', 'SERIAL'],
    accent: '#FF9F45',
    cover: { gen: 'bars' },
    blurb: 'A native desktop panel for talking to satellite modems over serial without living inside a terminal.',
    stack: ['Electron', 'React', 'TypeScript', 'Mantine', 'Vite', 'Serial / AT commands'],
    body: [
      { h: 'Problem', p: 'Bringing up a satellite transceiver means a serial console, a command reference open in another window, and a mental model of state you are reconstructing from scrollback every time.' },
      { h: 'Approach', p: 'An Electron app with a main-process serial layer and a typed IPC boundary to the renderer, so the UI never guesses about device state. Panels for overview, link status and command history, built with React and Mantine against a shared theme — macOS-first, because that is where the work happens.' },
      { h: 'Result', p: 'Device state you can read at a glance instead of parsing, and a command surface that does not require memorising the AT set.' }
    ],
    note: 'Personal tooling, built against publicly documented developer-kit interfaces.'
  },

  /* ── 10 ─────────────────────────────────────────────── */
  {
    id: 'cruw',
    title: 'CRUW',
    subtitle: 'Habit tracking with group accountability',
    org: 'Personal',
    role: 'Full-stack Developer',
    period: 'May — Aug 2025',
    cat: 'FULL-STACK',
    tags: ['FULL-STACK', 'REACT NATIVE', 'MONGODB'],
    accent: '#FF6FB5',
    cover: { gen: 'pixels' },
    blurb: 'A habit tracker built on the observation that the streak you keep is the one somebody else can see.',
    stack: ['React Native (Expo)', 'JavaScript', 'Node', 'MongoDB Atlas'],
    body: [
      { h: 'Problem', p: 'Solo habit trackers work until the first day you do not feel like it. The mechanism that actually holds is social — a small group who will notice.' },
      { h: 'Approach', p: 'A cross-platform app with individual habits and shared group accountability on the same object, deliberately minimal: a habit is a name and a streak, and the group view is the whole product. React Native front end over a JavaScript backend with MongoDB Atlas for persistence and sync.' },
      { h: 'Result', p: 'A full-stack build shipped end to end — auth, data model, sync and UI — with a design that stays out of the way of the one interaction that matters.' }
    ]
  },

  /* ── 11 ─────────────────────────────────────────────── */
  {
    id: 'woca',
    title: 'White Oak Children\'s Academy',
    subtitle: 'Full site design and build, live in production',
    org: 'Freelance',
    role: 'Designer & Developer',
    period: '2026',
    cat: 'WEB',
    tags: ['WEB', 'FRONTEND', 'CLIENT WORK'],
    accent: '#2EA9C7',
    cover: 'assets/work/woca-site.jpg',
    coverFit: 'cover',
    blurb: 'A nine-page site for a Northwest Indiana preschool — enrollment, programs, forms, the whole operation.',
    stack: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages', 'Custom domain'],
    link: { href: 'https://whiteoakchildrensacademy.com', label: 'whiteoakchildrensacademy.com' },
    body: [
      { h: 'Problem', p: 'A working preschool whose website had to answer, without a phone call: which program fits my child, what does it cost, when does registration open, and where is the form.' },
      { h: 'Approach', p: 'Nine pages built around the questions parents actually ask in order — programs with ages, schedules and monthly cost side by side, a virtual tour, staff, FAQ, and downloadable enrollment and medical-authorization forms. A notice bar at the top carries the one time-sensitive fact (registration open or closed) so nobody has to hunt for it.' },
      { h: 'Result', p: 'Live in production on a custom domain, maintained as their real site.' }
    ],
    gallery: [
      { src: 'assets/work/woca-site.jpg', cap: 'Programs page — ages, schedule and cost readable without scrolling past a marketing block.' },
      { src: 'assets/work/woca-logo.jpg', cap: 'Identity as used across the site.' }
    ]
  },

  /* ── 12 ─────────────────────────────────────────────── */
  {
    id: 'nsh',
    title: 'New Scholar Hub',
    subtitle: 'Onboarding portal for incoming Evans Scholars',
    org: 'Evans Scholars — Purdue',
    role: 'VP of New Scholars · Builder',
    period: '2026',
    cat: 'WEB',
    tags: ['WEB', 'NODE', 'EXPRESS'],
    accent: '#7FB069',
    cover: 'assets/work/nsh-site.jpg',
    coverFit: 'cover',
    blurb: 'The internal site for the scholarship class I run — built because the alternative was another group chat.',
    stack: ['Node', 'Express', 'EJS', 'JavaScript'],
    body: [
      { h: 'Problem', p: 'Every incoming class gets the same information delivered the same bad way: scattered across group chats, half-remembered from an orientation, and lost by week three.' },
      { h: 'Approach', p: 'A private, credentialed hub for the new scholar class — accounts issued by the VP rather than self-registration, so the space stays the class\'s own. Express and EJS on a small data layer, with a deliberately quiet dark interface that gets out of the way.' },
      { h: 'Result', p: 'One place instead of six, for a class of new scholars I am directly responsible for.' }
    ],
    gallery: [
      { src: 'assets/work/nsh-site.jpg', cap: 'Sign-in. Accounts are provisioned, not self-served.' }
    ]
  },

  /* ── 13 ─────────────────────────────────────────────── */
  {
    id: 'ranch',
    title: 'Birthday Ranch',
    subtitle: 'A pixel exploration game, built as a gift',
    org: 'Personal',
    role: 'Everything',
    period: 'Jul 2026',
    cat: 'FULL-STACK',
    tags: ['FULL-STACK', 'CANVAS', 'GAMEDEV'],
    accent: '#E8B84B',
    cover: 'assets/work/birthday-game.jpg',
    coverFit: 'cover',
    blurb: 'A top-down treasure hunt in a single HTML file — no engine, no build step, no dependencies.',
    stack: ['HTML5 Canvas', 'Vanilla JavaScript', 'Procedural sprites'],
    body: [
      { h: 'Problem', p: 'I wanted to give someone a birthday present they had to actually play, and I wanted it to open from a link on a phone with nothing installed.' },
      { h: 'Approach', p: 'One HTML file. A tile-based overworld, click-to-path movement, nine hidden collectibles gating a locked barn, and every sprite drawn procedurally to the canvas rather than loaded — which is what keeps it to a single file with zero dependencies.' },
      { h: 'Result', p: 'Opens instantly from a link, plays on desktop or phone, and holds up as a small complete game loop: explore, collect, unlock, payoff.' }
    ],
    gallery: [
      { src: 'assets/work/birthday-game.jpg', cap: 'The overworld. Paths, props and shadows are all drawn at runtime.' }
    ]
  }
];

/* ── experience timeline ─────────────────────────────── */
const TIMELINE = [
  { when: 'May 2026 —', what: 'Software Engineering Intern', where: 'Iridium Communications', kind: 'WORK', live: true },
  { when: 'Jan 2026 —', what: 'VP of New Scholars', where: 'Evans Scholars', kind: 'LEAD', live: true },
  { when: 'Jul — Sep 2025', what: 'AI Data Analytics Intern', where: 'Burbio', kind: 'WORK' },
  { when: 'Aug 2025 —', what: 'Numerai Prediction Model', where: 'ML@Purdue', kind: 'PROJECT', live: true },
  { when: 'Jan 2025 —', what: '3D Print Optimization', where: 'CMSC Research', kind: 'RESEARCH', live: true },
  { when: 'Aug 2024 — Jan 2025', what: 'Digital Twin Research', where: 'FLEX Lab', kind: 'RESEARCH' },
  { when: 'Aug 2024 —', what: 'Event Lead & Test Writer', where: 'Science Olympiad', kind: 'LEAD', live: true },
  { when: 'Aug 2024 —', what: 'B.S. Computer Science, Machine Intelligence', where: 'Purdue · Honors College · Chick Evans Scholar', kind: 'EDU', live: true }
];

/* ── stack ───────────────────────────────────────────── */
const STACK = [
  { group: 'Languages', items: ['Java', 'Python', 'C', 'C++', 'TypeScript', 'JavaScript', 'HTML / CSS'] },
  { group: 'ML & Vision', items: ['PyTorch', 'TensorFlow', 'Torchvision', 'YOLOv8', 'OpenCV', 'OCR', 'SSIM', 'HOG', 'Edge detection', 'NumPy', 'Pandas'] },
  { group: 'Embedded', items: ['Embedded C', 'Arduino', 'Serial / AT', 'PMIC & battery mgmt', 'Joulescope', 'Oscilloscope'] },
  { group: 'Build & Ship', items: ['React', 'React Native', 'Node', 'Express', 'Electron', 'Vite', 'Flask', 'MongoDB', 'Supabase', 'Vercel'] },
  { group: 'Craft', items: ['Figma', 'Jira', 'Git', 'Fusion 360', 'Claude'] }
];
