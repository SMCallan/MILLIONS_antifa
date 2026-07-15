import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform float uIntensity;
  uniform float uMobile;

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 74.7);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 turn = mat2(0.74, -0.67, 0.67, 0.74);

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = turn * p * 2.05 + 19.19;
      amplitude *= 0.49;
    }

    return value;
  }

  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }

  float roughBox(vec2 p, vec2 center, vec2 size, float angle, float roughness) {
    vec2 q = rotate2d(angle) * (p - center);
    float n = fbm(q * 9.5 + vec2(uTime * 0.018, -uTime * 0.012));
    float edge = sdBox(q, size) + (n - 0.52) * roughness;
    return 1.0 - smoothstep(0.0, 0.045, edge);
  }

  float hardBox(vec2 p, vec2 center, vec2 size, float angle) {
    vec2 q = rotate2d(angle) * (p - center);
    return 1.0 - smoothstep(0.0, 0.018, sdBox(q, size));
  }

  float stripeField(vec2 p, float angle, float scale, float width) {
    vec2 q = rotate2d(angle) * p;
    float band = abs(fract(q.y * scale) - 0.5);
    return 1.0 - smoothstep(width, width + 0.035, band);
  }

  float halftone(vec2 p, float angle, float scale, float radius) {
    vec2 q = rotate2d(angle) * p * scale;
    vec2 cell = fract(q) - 0.5;
    float jitter = (hash(floor(q)) - 0.5) * 0.12;
    return 1.0 - smoothstep(radius + jitter, radius + jitter + 0.035, length(cell));
  }

  float paperFiber(vec2 p) {
    float fine = noise(p * vec2(170.0, 42.0));
    float broad = fbm(p * vec2(15.0, 6.0));
    return fine * 0.45 + broad * 0.55;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / max(uResolution.xy, vec2(1.0));
    vec2 p = uv * 2.0 - 1.0;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    p.x *= aspect;

    float mobile = clamp(uMobile, 0.0, 1.0);
    float time = uTime * mix(0.48, 0.34, mobile);
    float slowTime = uTime * mix(0.2, 0.14, mobile);
    vec2 mouse = vec2(uMouse.x * aspect, uMouse.y);
    float reveal = exp(-dot(p - mouse * 0.78, p - mouse * 0.78) * mix(2.4, 3.4, mobile));
    float pulse = 0.5 + 0.5 * sin(time * 3.2 + fbm(p * 2.2) * 4.0);
    vec2 paperDrift = vec2(sin(slowTime * 1.1), cos(slowTime * 0.9)) * mix(0.035, 0.02, mobile);
    vec2 printDrift = vec2(sin(time * 1.45), cos(time * 1.25)) * mix(0.024, 0.014, mobile);
    vec2 blackDrift = vec2(cos(time * 1.12), sin(time * 1.36)) * mix(0.018, 0.01, mobile);

    vec3 wall = vec3(0.018, 0.04, 0.028);
    vec3 ink = vec3(0.012, 0.025, 0.018);
    vec3 paper = vec3(0.84, 0.79, 0.55);
    vec3 agedPaper = vec3(0.57, 0.55, 0.36);
    vec3 emerald = vec3(0.025, 0.62, 0.31);
    vec3 cobalt = vec3(0.025, 0.16, 0.64);
    vec3 projection = vec3(0.08, 0.36, 0.94);
    vec3 amber = vec3(0.94, 0.63, 0.1);

    vec3 color = wall;
    color += vec3(0.02, 0.017, 0.012) * fbm(p * 3.0 + time * 0.2);

    float sheetA = roughBox(p, vec2(-0.66 * aspect, 0.02) + paperDrift, vec2(0.62, 0.78), -0.045 + sin(slowTime) * 0.016, 0.06);
    float sheetB = roughBox(p, vec2(0.46 * aspect, -0.05) - paperDrift * 0.8, vec2(0.5, 0.7), 0.065 + cos(slowTime * 0.8) * 0.014, 0.055);
    float sheetC = roughBox(p, vec2(0.03 * aspect, 0.36) + vec2(-paperDrift.y, paperDrift.x) * 0.55, vec2(0.74, 0.24), -0.018 + sin(slowTime * 1.2) * 0.012, 0.045);
    float pasted = clamp(sheetA + sheetB * 0.82 + sheetC * 0.72, 0.0, 1.0);

    float fiber = paperFiber(p + time * 0.02);
    vec3 paperTone = mix(agedPaper, paper, 0.34 + fiber * 0.5);
    color = mix(color, paperTone, pasted * 0.82);

    float colorBlock = hardBox(p, vec2(-0.5 * aspect, 0.19) + printDrift, vec2(0.34, 0.28), -0.055);
    colorBlock += hardBox(p, vec2(0.35 * aspect, -0.42) - printDrift * 0.7, vec2(0.46, 0.18), 0.058);
    colorBlock += hardBox(p, vec2(0.1 * aspect, 0.54) + vec2(printDrift.y, -printDrift.x) * 0.6, vec2(0.68, 0.105), -0.015);
    colorBlock = clamp(colorBlock, 0.0, 1.0) * pasted;
    color = mix(color, mix(cobalt, emerald, 0.72 + pulse * 0.18), colorBlock * 0.82);

    float blackBand = hardBox(p, vec2(-0.2 * aspect, -0.08) + blackDrift, vec2(1.18, 0.08), -0.21);
    blackBand += hardBox(p, vec2(0.7 * aspect, 0.22) - blackDrift * 0.8, vec2(0.5, 0.055), 0.28);
    blackBand += hardBox(p, vec2(-0.78 * aspect, -0.52) + vec2(-blackDrift.y, blackDrift.x), vec2(0.38, 0.075), 0.1);
    blackBand = clamp(blackBand, 0.0, 1.0) * pasted;
    color = mix(color, ink, blackBand * 0.9);

    vec2 stencilDrift = printDrift * 0.42 + vec2(sin(time * 2.2), cos(time * 2.05)) * 0.006;
    float stencil = 0.0;
    stencil += hardBox(p, vec2(-0.05 * aspect, 0.02) + stencilDrift, vec2(0.055, 0.42), 0.0);
    stencil += hardBox(p, vec2(0.1 * aspect, 0.28) + stencilDrift, vec2(0.25, 0.052), 0.0);
    stencil += hardBox(p, vec2(0.08 * aspect, -0.22) + stencilDrift, vec2(0.23, 0.052), 0.0);
    stencil += hardBox(p, vec2(0.28 * aspect, 0.03) + stencilDrift, vec2(0.055, 0.34), 0.0);
    stencil += hardBox(p, vec2(0.56 * aspect, 0.05) - stencilDrift * 0.5, vec2(0.055, 0.36), 0.0);
    stencil += hardBox(p, vec2(0.7 * aspect, 0.25) - stencilDrift * 0.5, vec2(0.22, 0.05), 0.0);
    stencil += hardBox(p, vec2(0.7 * aspect, -0.14) - stencilDrift * 0.5, vec2(0.22, 0.05), 0.0);
    stencil = clamp(stencil, 0.0, 1.0) * pasted * (0.55 + colorBlock * 0.2);
    color = mix(color, ink, stencil * 0.42);

    float stripes = stripeField(p + vec2(time * 0.12, -time * 0.05), -0.58, 9.0, 0.055);
    stripes *= roughBox(p, vec2(-0.32 * aspect, -0.26), vec2(0.9, 0.34), -0.11, 0.06);
    color = mix(color, mix(emerald, amber, 0.22), stripes * pasted * 0.18);

    float dots = halftone(p + vec2(time * 0.09, sin(time * 1.7) * 0.035), 0.24 + sin(time * 0.8) * 0.03, mix(48.0, 32.0, mobile), 0.18 + pulse * 0.03);
    float dotField = dots * pasted * (0.22 + colorBlock * 0.48);
    color = mix(color, ink, dotField * 0.26);

    float archiveLines = stripeField(p + vec2(-time * 0.28, time * 0.06), 1.52 + sin(time * 0.55) * 0.08, 18.0, 0.035);
    archiveLines *= smoothstep(-0.7, 0.84, p.x + fbm(p * 2.8) * 0.55);
    float projected = archiveLines * (0.1 + reveal * 0.9) * (0.5 + uScroll * 0.45);
    color += projection * projected * 0.24 * uIntensity;

    float sweepX = mix(-1.25 * aspect, 1.25 * aspect, fract(slowTime * 0.38));
    float projectorSweep = exp(-pow((p.x - sweepX) * mix(4.6, 5.8, mobile), 2.0));
    projectorSweep *= smoothstep(-0.86, 0.24, p.y) * smoothstep(0.94, -0.18, p.y);
    color += projection * projectorSweep * (0.08 + reveal * 0.1);

    float flare = exp(-dot(p - vec2(sweepX, 0.12 + sin(time) * 0.16), p - vec2(sweepX, 0.12 + sin(time) * 0.16)) * 10.0);
    color += amber * flare * 0.045;

    float registration = 0.0;
    registration += hardBox(p, vec2(-0.9 * aspect, 0.62), vec2(0.2, 0.012), 0.0);
    registration += hardBox(p, vec2(-0.9 * aspect, 0.62), vec2(0.012, 0.2), 0.0);
    registration += hardBox(p, vec2(0.88 * aspect, -0.64), vec2(0.24, 0.01), 0.0);
    registration += hardBox(p, vec2(0.88 * aspect, -0.64), vec2(0.01, 0.24), 0.0);
    color += projection * registration * (0.18 + reveal * 0.32);
    color += emerald * registration * 0.1;

    float tearShadow = smoothstep(0.0, 0.08, pasted) * (1.0 - smoothstep(0.68, 1.0, pasted));
    color -= ink * tearShadow * 0.1;

    float grain = hash(gl_FragCoord.xy + floor(uTime * 12.0));
    color += (grain - 0.5) * 0.07;

    float scan = smoothstep(0.992, 1.0, sin((uv.y + time * 0.04) * 160.0) * 0.5 + 0.5);
    color += projection * scan * 0.025 * (1.0 - mobile * 0.8);

    float vignette = smoothstep(1.45, 0.18, length(p * vec2(0.8, 1.0)));
    color *= 0.48 + vignette * 1.08;
    color = pow(max(color, vec3(0.0)), vec3(0.9));

    gl_FragColor = vec4(color, 1.0);
  }
`;

function PosterPlane() {
  const materialRef = React.useRef<THREE.ShaderMaterial>(null);
  const targetMouse = React.useRef(new THREE.Vector2(0, 0));
  const smoothedMouse = React.useRef(new THREE.Vector2(0, 0));
  const targetScroll = React.useRef(0);
  const smoothedScroll = React.useRef(0);
  const { gl, size, viewport } = useThree();

  const uniforms = React.useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uIntensity: { value: 0.95 },
      uMobile: { value: 0 },
    }),
    [],
  );

  React.useEffect(() => {
    const pixelRatio = Math.min(gl.getPixelRatio(), 1.35);
    uniforms.uResolution.value.set(size.width * pixelRatio, size.height * pixelRatio);
    uniforms.uMobile.value = size.width < 640 ? 1 : 0;
  }, [gl, size.height, size.width, uniforms]);

  React.useEffect(() => {
    const updateScroll = () => {
      const viewportHeight = Math.max(window.innerHeight, 1);
      targetScroll.current = Math.min(window.scrollY / viewportHeight, 1);
    };

    const updatePointer = (event: PointerEvent) => {
      const x = event.clientX / Math.max(window.innerWidth, 1);
      const y = event.clientY / Math.max(window.innerHeight, 1);
      targetMouse.current.set(x * 2 - 1, (1 - y) * 2 - 1);
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
    };
  }, []);

  useFrame(() => {
    const material = materialRef.current;
    if (!material) return;

    smoothedMouse.current.lerp(targetMouse.current, 0.06);
    smoothedScroll.current += (targetScroll.current - smoothedScroll.current) * 0.04;

    material.uniforms.uTime.value = performance.now() * 0.001;
    material.uniforms.uMouse.value.copy(smoothedMouse.current);
    material.uniforms.uScroll.value = smoothedScroll.current;
    material.uniforms.uIntensity.value = 0.9 + smoothedScroll.current * 0.24;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export function PosterFieldCanvas() {
  return (
    <Canvas
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      dpr={[1, 1.35]}
      gl={{
        alpha: true,
        antialias: false,
        depth: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <PosterPlane />
    </Canvas>
  );
}
