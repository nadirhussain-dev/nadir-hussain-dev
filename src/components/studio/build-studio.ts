import * as THREE from 'three';
import { poseAt, type Pose, type Stop } from '@/lib/scene/path';

export interface StudioOptions {
  canvas: HTMLCanvasElement;
  /** Fewer particles and a lower resolution on small or weak devices. */
  lowPower: boolean;
  onReady: () => void;
}

export interface Studio {
  setStops: (stops: readonly Stop[]) => void;
  setScroll: (y: number) => void;
  setPointer: (x: number, y: number) => void;
  setAlarm: (on: boolean) => void;
  setMonitor: (lines: readonly string[]) => void;
  resize: () => void;
  dispose: () => void;
}

const NEON = 0x7fdcff;
const ALARM = 0xff3b4e;
const WARM = 0xffb36b;
const VIOLET = 0x7a5cff;
const FONT = '"Inter", "Segoe UI", system-ui, sans-serif';

/** Every texture here is drawn in code, so the scene ships no model files. */
function canvasTexture(
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D) => void,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (context) draw(context);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

const standard = (color: number, roughness = 0.6, metalness = 0.1) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

function box(
  size: [number, number, number],
  material: THREE.Material,
  position: [number, number, number],
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  return mesh;
}

/** A soft additive light pool, standing in for a bloom pass at a fraction of the cost. */
function glow(color: number, size: number, opacity = 0.6): THREE.Mesh {
  const texture = canvasTexture(128, 128, (context) => {
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.35, 'rgba(255,255,255,.35)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
  });
  // A flat plane rather than a sprite: a billboard near a wall tilts into it and clips.
  return new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({
      map: texture,
      color,
      opacity,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
  );
}

function buildRoom(scene: THREE.Scene): THREE.MeshBasicMaterial {
  const wallTexture = canvasTexture(1024, 512, (context) => {
    const gradient = context.createLinearGradient(0, 0, 1024, 0);
    gradient.addColorStop(0, '#2b3fd6');
    gradient.addColorStop(0.5, '#3f3fc8');
    gradient.addColorStop(0.75, '#6a4fd0');
    gradient.addColorStop(1, '#c98a7a');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1024, 512);
    const shade = context.createLinearGradient(0, 0, 0, 512);
    shade.addColorStop(0, 'rgba(8,8,30,.62)');
    shade.addColorStop(1, 'rgba(8,8,30,.1)');
    context.fillStyle = shade;
    context.fillRect(0, 0, 1024, 512);
  });
  const wallMaterial = new THREE.MeshBasicMaterial({ map: wallTexture });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(22, 11), wallMaterial);
  wall.position.set(0, 3.2, -3.5);
  scene.add(wall);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 16),
    standard(0x12122e, 0.35, 0.4),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -2.1, 3);
  scene.add(floor);

  // The back desk the monitor stands on.
  scene.add(box([6.5, 0.1, 1.4], standard(0xd8d2e6, 0.5), [-3.8, 0.42, -1.8]));

  // Shelving, with warm strips under each board as in the reference.
  const board = standard(0x2a2a48, 0.5, 0.2);
  scene.add(box([0.09, 7, 0.09], standard(0x10101f, 0.4, 0.6), [2.05, 2.5, -3.2]));
  for (const y of [1.28, 2.42, 3.56]) {
    scene.add(box([4.8, 0.09, 0.8], board, [4.4, y, -3]));
    const strip = box(
      [4.7, 0.025, 0.05],
      new THREE.MeshBasicMaterial({ color: WARM }),
      [4.4, y - 0.055, -2.7],
    );
    scene.add(strip);
    const pool = glow(WARM, 3.8, 0.34);
    pool.position.set(4.3, y - 0.3, -3.47);
    scene.add(pool);
  }
  return wallMaterial;
}

function buildNeonSign(scene: THREE.Scene): THREE.MeshBasicMaterial {
  const material = new THREE.MeshBasicMaterial({ color: NEON, toneMapped: false });
  const group = new THREE.Group();
  const strokes: [number, number][][] = [
    [
      [-0.45, 0.42],
      [-0.98, 0],
      [-0.45, -0.42],
    ],
    [
      [0.45, 0.42],
      [0.98, 0],
      [0.45, -0.42],
    ],
    [
      [0.16, 0.62],
      [-0.16, -0.62],
    ],
  ];
  for (const points of strokes) {
    const path = new THREE.CurvePath<THREE.Vector3>();
    points.slice(1).forEach(([x, y], index) => {
      const [fromX, fromY] = points[index] ?? [0, 0];
      path.add(
        new THREE.LineCurve3(
          new THREE.Vector3(fromX, fromY, 0),
          new THREE.Vector3(x, y, 0),
        ),
      );
    });
    group.add(new THREE.Mesh(new THREE.TubeGeometry(path, 24, 0.045, 8), material));
  }
  const halo = glow(NEON, 5.4, 0.42);
  halo.position.z = 0.01;
  group.add(halo);
  group.position.set(-3.1, 3.85, -3.42);
  scene.add(group);
  return material;
}

function monitorTexture(): {
  texture: THREE.CanvasTexture;
  draw: (lines: readonly string[], frame: number) => void;
} {
  const palette = ['#7fdcff', '#c58bff', '#ffb36b', '#7dffb2', '#8a93d6'];
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 620;
  const context = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const draw = (lines: readonly string[], frame: number): void => {
    if (!context) return;
    context.fillStyle = '#0c0e24';
    context.fillRect(0, 0, 1024, 620);
    context.fillStyle = '#151838';
    context.fillRect(0, 0, 44, 620);
    for (let row = 0; row < 26; row += 1) {
      const seed = (row + frame) % 53;
      const indent = 70 + ((seed * 7) % 5) * 22;
      let x = indent;
      for (let token = 0; token < 2 + (seed % 3); token += 1) {
        const width = 30 + ((seed * (token + 3) * 13) % 80);
        context.fillStyle = palette[(seed + token) % palette.length] ?? '#fff';
        context.fillRect(x, 16 + row * 23, width, 9);
        x += width + 12;
      }
    }
    context.fillStyle = '#f4f6ff';
    context.font = `700 76px ${FONT}`;
    lines.forEach((line, index) => context.fillText(line, 540, 190 + index * 92));
    if (lines.length === 0) {
      texture.needsUpdate = true;
      return;
    }
    const underline = context.createLinearGradient(540, 0, 880, 0);
    underline.addColorStop(0, '#7a5cff');
    underline.addColorStop(1, '#ff5ccd');
    context.fillStyle = underline;
    context.fillRect(540, 450, 340, 7);
    texture.needsUpdate = true;
  };
  return { texture, draw };
}

function buildMonitor(scene: THREE.Scene, texture: THREE.Texture): void {
  const group = new THREE.Group();
  group.add(box([3.1, 1.9, 0.08], standard(0x0b0b14, 0.3, 0.6), [0, 0, 0]));
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.98, 1.78),
    new THREE.MeshBasicMaterial({ map: texture }),
  );
  screen.position.z = 0.045;
  group.add(screen);
  group.add(box([0.2, 0.5, 0.1], standard(0x15151f), [0, -1.15, -0.05]));
  group.add(box([1, 0.05, 0.5], standard(0x15151f), [0, -1.38, -0.05]));
  const light = glow(0x5a78ff, 5.5, 0.26);
  light.position.z = -0.3;
  group.add(light);
  group.position.set(-3.2, 1.86, -1.75);
  group.rotation.y = 0.16;
  scene.add(group);
}

function label(
  text: string,
  options: {
    width: number;
    height: number;
    font: string;
    color: string;
    background: string;
  },
): THREE.CanvasTexture {
  return canvasTexture(options.width, options.height, (context) => {
    context.fillStyle = options.background;
    context.fillRect(0, 0, options.width, options.height);
    context.fillStyle = options.color;
    context.font = options.font;
    context.textBaseline = 'middle';
    context.fillText(text, options.width * 0.1, options.height / 2);
  });
}

function buildShelfProps(scene: THREE.Scene): void {
  // Plaque, as on the reference shelf.
  const plaque = new THREE.Group();
  plaque.add(box([1.9, 0.72, 0.26], standard(0x14162f, 0.4, 0.3), [0, 0, 0]));
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.64),
    new THREE.MeshBasicMaterial({
      map: canvasTexture(640, 228, (context) => {
        context.fillStyle = '#12142c';
        context.fillRect(0, 0, 640, 228);
        context.fillStyle = '#dfe5ff';
        context.font = `600 64px ${FONT}`;
        context.fillText('Software', 170, 100);
        context.fillText('Engineer', 170, 172);
        context.strokeStyle = '#dfe5ff';
        context.lineWidth = 7;
        context.strokeRect(50, 74, 90, 62);
        context.strokeRect(34, 136, 122, 10);
      }),
    }),
  );
  face.position.z = 0.135;
  plaque.add(face);
  plaque.position.set(3.7, 2.82, -2.9);
  scene.add(plaque);

  // Upright books on the top shelf.
  const colors = [0x1f3a68, 0x8a5a2b, 0x12264d, 0x2e2a6b, 0x7a3b52, 0x1d4d5c];
  colors.forEach((color, index) => {
    const height = 0.72 + ((index * 37) % 5) * 0.05;
    scene.add(
      box([0.2, height, 0.56], standard(color, 0.55), [
        4.5 + index * 0.23,
        3.6 + height / 2,
        -3,
      ]),
    );
  });

  // Plants: clusters of leaves, cheap enough to repeat.
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3fa34d, roughness: 0.55 });
  const addPlant = (x: number, y: number, z: number, scale: number): void => {
    const group = new THREE.Group();
    group.add(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.15, 0.3, 16),
        standard(0xf1eef6, 0.35),
      ),
    );
    for (let index = 0; index < 11; index += 1) {
      const blade = new THREE.Mesh(new THREE.SphereGeometry(0.17, 8, 6), leaf);
      const angle = index * 2.4;
      blade.scale.set(0.42, 0.14, 1);
      blade.position.set(
        Math.cos(angle) * 0.22,
        0.24 + (index % 4) * 0.08,
        Math.sin(angle) * 0.22,
      );
      blade.rotation.set(0.6, -angle + Math.PI / 2, 0.3);
      group.add(blade);
    }
    group.position.set(x, y, z);
    group.scale.setScalar(scale);
    scene.add(group);
  };
  addPlant(2.7, 3.76, -3, 1.2);
  addPlant(6.2, 1.48, -3, 1);
  addPlant(-3.05, 0.2, 2.15, 1.1);
}

interface Robot {
  group: THREE.Group;
  head: THREE.Group;
  eyes: THREE.MeshBasicMaterial;
}

function buildRobot(scene: THREE.Scene): Robot {
  const shell = standard(0xeef0fa, 0.28, 0.25);
  const dark = standard(0x11131f, 0.25, 0.5);
  const eyes = new THREE.MeshBasicMaterial({ color: NEON, toneMapped: false });
  const group = new THREE.Group();

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.2, 8, 20), shell);
  body.position.y = 0.42;
  group.add(body);
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.2, 6, 12), shell);
    arm.position.set(side * 0.27, 0.42, 0);
    arm.rotation.z = side * 0.3;
    group.add(arm);
    const foot = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.1, 6, 12), dark);
    foot.position.set(side * 0.12, 0.08, 0);
    group.add(foot);
  }

  const head = new THREE.Group();
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.3, 28, 20), shell);
  skull.scale.set(1.15, 0.92, 1);
  head.add(skull);
  const visor = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 16), dark);
  visor.scale.set(1.12, 0.72, 0.62);
  visor.position.z = 0.17;
  head.add(visor);
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), eyes);
    eye.position.set(side * 0.105, 0.01, 0.32);
    head.add(eye);
  }
  head.position.y = 0.86;
  group.add(head);

  const halo = glow(NEON, 0.9, 0.3);
  halo.position.set(0, 0.86, 0.36);
  group.add(halo);

  group.position.set(3.9, 1.33, -2.95);
  group.scale.setScalar(0.82);
  scene.add(group);
  return { group, head, eyes };
}

function buildDesk(scene: THREE.Scene): THREE.Mesh {
  const desk = box([12, 0.12, 2.2], standard(0xd9b08c, 0.38, 0.05), [0, -0.06, 1.75]);
  scene.add(desk);
  const shadow = new THREE.MeshBasicMaterial({
    color: 0x000000,
    opacity: 0.3,
    transparent: true,
    depthWrite: false,
  });
  const blob = new THREE.Mesh(new THREE.CircleGeometry(1.5, 32), shadow);
  blob.rotation.x = -Math.PI / 2;
  blob.scale.set(1.3, 0.3, 1);
  blob.position.set(0, 0.005, 0.95);
  scene.add(blob);

  // Laptop, angled in from the left as in the reference.
  const laptop = new THREE.Group();
  const metal = standard(0x9a9db0, 0.3, 0.8);
  laptop.add(box([2.1, 0.06, 1.4], metal, [0, 0.03, 0]));
  const lid = box([2.1, 1.35, 0.05], metal, [0, 0.68, -0.68]);
  lid.rotation.x = -0.12;
  laptop.add(lid);
  laptop.position.set(-2.15, 0, 1.75);
  laptop.rotation.y = 0.62;
  scene.add(laptop);

  // Book stack, spines facing the camera.
  const spines = [
    ['Node.js', '#7dffb2'],
    ['Next.js', '#ffffff'],
    ['React', '#7fdcff'],
  ] as const;
  spines.forEach(([text, color], index) => {
    const spine = new THREE.MeshBasicMaterial({
      map: label(text, {
        width: 512,
        height: 80,
        font: `600 44px ${FONT}`,
        color,
        background: '#1a1c33',
      }),
    });
    const page = standard(0xe9e6df, 0.8);
    const cover = standard(0x1a1c33, 0.5);
    const book = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.2, 1), [
      page,
      cover,
      cover,
      cover,
      spine,
      cover,
    ]);
    book.position.set(2.25 + (2 - index) * 0.05, 0.1 + index * 0.2, 1.4);
    book.rotation.y = -0.05 + index * 0.03;
    scene.add(book);
  });

  // Mug.
  const mug = new THREE.Group();
  const ceramic = standard(0x0f0f14, 0.32, 0.1);
  mug.add(new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.58, 28), ceramic));
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.035, 10, 24), ceramic);
  handle.position.x = 0.28;
  mug.add(handle);
  const mark = new THREE.Mesh(
    new THREE.PlaneGeometry(0.3, 0.22),
    new THREE.MeshBasicMaterial({
      transparent: true,
      map: canvasTexture(128, 96, (context) => {
        context.fillStyle = '#fff';
        context.font = `700 62px ${FONT}`;
        context.textAlign = 'center';
        context.fillText('</>', 64, 68);
      }),
    }),
  );
  mark.position.z = 0.265;
  mug.add(mark);
  mug.position.set(2.5, 0.89, 1.45);
  scene.add(mug);
  return desk;
}

async function loadTexture(url: string): Promise<THREE.Texture> {
  const texture = await new THREE.TextureLoader().loadAsync(url);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

/**
 * The character. The flat picture is pushed out by a depth map in the vertex
 * shader, so it has real parallax as the camera moves around it.
 */
async function buildCharacter(scene: THREE.Scene): Promise<{
  mesh: THREE.Mesh;
  tint: THREE.Color;
}> {
  const [map, depth] = await Promise.all([
    loadTexture('/character/nadir-cutout.webp'),
    loadTexture('/character/nadir-depth.webp'),
  ]);
  map.colorSpace = THREE.SRGBColorSpace;
  const height = 4.1;
  const width = height * 0.7475;
  const tint = new THREE.Color(1, 1, 1);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      map: { value: map },
      depthMap: { value: depth },
      tint: { value: tint },
    },
    vertexShader: /* glsl */ `
      uniform sampler2D depthMap;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 displaced = position;
        displaced.z += texture2D(depthMap, uv).r * 0.72;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D map;
      uniform vec3 tint;
      varying vec2 vUv;
      void main() {
        vec4 color = texture2D(map, vUv);
        if (color.a < 0.5) discard;
        // Neon rim from the left, warm from the shelves on the right.
        float rimLeft = smoothstep(0.3, 0.0, vUv.x) * 0.05;
        float rimRight = smoothstep(0.75, 1.0, vUv.x) * 0.06;
        vec3 lit = color.rgb * tint;
        lit += vec3(0.25, 0.45, 1.0) * rimLeft + vec3(1.0, 0.55, 0.25) * rimRight;
        gl_FragColor = vec4(lit, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height, 80, 110),
    material,
  );
  mesh.position.set(0, height / 2 - 0.42, 0.35);
  scene.add(mesh);

  // The chair behind him.
  const seat = new THREE.Mesh(
    new THREE.CapsuleGeometry(1.15, 1.8, 10, 24),
    standard(0x101018, 0.42, 0.25),
  );
  seat.position.set(0.25, 1.62, -0.42);
  seat.scale.set(1, 1, 0.32);
  seat.rotation.z = -0.08;
  scene.add(seat);
  return { mesh, tint };
}

function buildParticles(scene: THREE.Scene, count: number): THREE.Points {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 16;
    positions[index * 3 + 1] = Math.random() * 7 - 1;
    positions[index * 3 + 2] = Math.random() * 8 - 3;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0x9fd8ff,
      size: 0.028,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  scene.add(points);
  return points;
}

export async function createStudio({
  canvas,
  lowPower,
  onReady,
}: StudioOptions): Promise<Studio> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !lowPower,
    alpha: false,
  });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  let pixelRatio = Math.min(window.devicePixelRatio, lowPower ? 1.25 : 1.75);
  renderer.setPixelRatio(pixelRatio);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070818);
  scene.fog = new THREE.Fog(0x0a0b24, 11, 24);

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);

  const hemisphere = new THREE.HemisphereLight(0x8fa6ff, 0x20152c, 1.5);
  const neonLight = new THREE.PointLight(NEON, 26, 12);
  neonLight.position.set(-3.1, 3.7, -2.2);
  const warmLight = new THREE.PointLight(WARM, 30, 11);
  warmLight.position.set(4.4, 2.4, -1.4);
  const fillLight = new THREE.PointLight(VIOLET, 18, 12);
  fillLight.position.set(0, 3.5, 4.5);
  scene.add(hemisphere, neonLight, warmLight, fillLight);

  const wall = buildRoom(scene);
  const neon = buildNeonSign(scene);
  const screen = monitorTexture();
  buildMonitor(scene, screen.texture);
  buildShelfProps(scene);
  const robot = buildRobot(scene);
  buildDesk(scene);
  const particles = buildParticles(scene, lowPower ? 90 : 260);
  const { mesh: character, tint } = await buildCharacter(scene);

  let stops: readonly Stop[] = [];
  let scrollY = 0;
  let smoothY = 0;
  const pointer = new THREE.Vector2();
  const smoothPointer = new THREE.Vector2();
  let alarmTarget = 0;
  let alarm = 0;
  let monitorLines: readonly string[] = [];
  let monitorFrame = 0;
  let width = 1;
  let height = 1;
  const startedAt = performance.now();

  const neonColor = new THREE.Color(NEON);
  const alarmColor = new THREE.Color(ALARM);
  const white = new THREE.Color(0xffffff);
  const redWash = new THREE.Color(1, 0.42, 0.46);
  const wallWhite = new THREE.Color(0xffffff);

  const applyPose = (pose: Pose, intro: number, time: number): void => {
    const sway = Math.sin(time * 0.35) * 0.05;
    // A portrait screen sees far less sideways, so the camera backs away along
    // its own line of sight until the subject fits.
    const pullBack = Math.min(Math.max(0.95 / (width / height), 1), 2.1);
    const away = (axis: 0 | 1 | 2): number =>
      pose.target[axis] + (pose.position[axis] - pose.target[axis]) * pullBack;
    camera.position.set(
      away(0) + smoothPointer.x * 0.32 + sway,
      away(1) + smoothPointer.y * 0.2,
      away(2) + intro * 3.2,
    );
    camera.lookAt(pose.target[0], pose.target[1] + intro * 0.3, pose.target[2]);
    camera.setViewOffset(
      width,
      height,
      -pose.shift[0] * width,
      pose.shift[1] * height,
      width,
      height,
    );
  };

  const resize = (): void => {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();

  let frame = 0;
  let last = performance.now();
  let slowFrames = 0;

  const tick = (now: number): void => {
    frame = requestAnimationFrame(tick);
    if (document.hidden) return;

    const delta = Math.min((now - last) / 1000, 0.1);
    last = now;
    const time = (now - startedAt) / 1000;

    // Step down once if the device cannot keep up, rather than stutter.
    slowFrames = delta > 1 / 28 ? slowFrames + 1 : Math.max(slowFrames - 1, 0);
    if (slowFrames > 50 && pixelRatio > 1) {
      pixelRatio = 1;
      renderer.setPixelRatio(1);
      resize();
      slowFrames = 0;
    }

    const ease = 1 - Math.exp(-delta * 5);
    smoothY += (scrollY - smoothY) * ease;
    smoothPointer.lerp(pointer, ease);
    alarm += (alarmTarget - alarm) * (1 - Math.exp(-delta * 4));

    const introProgress = Math.min(time / 1.8, 1);
    const intro = (1 - introProgress) ** 3;
    if (stops.length > 0) applyPose(poseAt(stops, smoothY), intro, time);

    // Neon starts with a tube-like flicker, and strobes during an alarm.
    const flicker =
      time < 1.1
        ? Math.sin(time * 37) > 0
          ? 1
          : 0.25
        : 1 - alarm * (0.3 + 0.3 * Math.sin(time * 14));
    neon.color.copy(neonColor).lerp(alarmColor, alarm).multiplyScalar(flicker);
    neonLight.color.copy(neonColor).lerp(alarmColor, alarm);
    wall.color.copy(wallWhite).lerp(redWash, alarm * 0.75);
    robot.eyes.color.copy(neonColor).lerp(alarmColor, alarm);
    tint.copy(white).lerp(redWash, alarm * 0.45);

    character.rotation.y = smoothPointer.x * 0.09;
    character.rotation.x = -smoothPointer.y * 0.035;
    character.position.y = 1.63 + Math.sin(time * 1.3) * 0.012;

    robot.group.position.y = 1.33 + Math.sin(time * 1.7) * 0.035;
    robot.head.rotation.y = smoothPointer.x * 0.6;
    robot.head.rotation.x = -smoothPointer.y * 0.3;
    robot.head.rotation.z = alarm * Math.sin(time * 22) * 0.1;

    particles.rotation.y = time * 0.012;
    particles.position.y = Math.sin(time * 0.2) * 0.12;

    const nextMonitorFrame = Math.floor(time * 5);
    if (nextMonitorFrame !== monitorFrame) {
      monitorFrame = nextMonitorFrame;
      screen.draw(monitorLines, monitorFrame);
    }

    renderer.render(scene, camera);
  };

  screen.draw(monitorLines, 0);
  frame = requestAnimationFrame(tick);
  onReady();

  return {
    setStops: (next) => {
      stops = next;
    },
    setScroll: (y) => {
      scrollY = y;
    },
    setPointer: (x, y) => {
      pointer.set(x, y);
    },
    setAlarm: (on) => {
      alarmTarget = on ? 1 : 0;
    },
    setMonitor: (lines) => {
      monitorLines = lines;
      screen.draw(lines, monitorFrame);
    },
    resize,
    dispose: () => {
      cancelAnimationFrame(frame);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
      renderer.dispose();
    },
  };
}
