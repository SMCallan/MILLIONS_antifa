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
    p = fract(p * vec2(131.27, 389.41));
    p += dot(p, p + 71.53);
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
    float amplitude = 0.52;
    mat2 turn = mat2(0.79, -0.61, 0.61, 0.79);

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = turn * p * 2.03 + 17.2;
      amplitude *= 0.48;
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
    float n = fbm(q * 8.5 + vec2(uTime * 0.022, -uTime * 0.014));
    float edge = sdBox(q, size) + (n - 0.5) * roughness;
    return 1.0 - smoothstep(0.0, 0.04, edge);
  }

  float hardBox(vec2 p, vec2 center, vec2 size, float angle) {
    vec2 q = rotate2d(angle) * (p - center);
    return 1.0 - smoothstep(0.0, 0.018, sdBox(q, size));
  }

  float documentLines(vec2 p, vec2 center, vec2 size, float angle, float offset) {
    vec2 q = rotate2d(angle) * (p - center);
    vec2 uv = q / size * 0.5 + 0.5;
    float inside = step(0.04, uv.x) * step(uv.x, 0.96) * step(0.08, uv.y) * step(uv.y, 0.92);
    float rows = 18.0;
    float row = floor(uv.y * rows);
    float rowUv = fract(uv.y * rows);
    float stroke = 1.0 - smoothstep(0.18, 0.34, abs(rowUv - 0.5));
    float start = mix(0.08, 0.22, hash(vec2(row, offset + 5.7)));
    float width = mix(0.25, 0.82, hash(vec2(row, offset)));
    float x = smoothstep(start, start + 0.02, uv.x) * smoothstep(start + width, start + width - 0.04, uv.x);
    float cadence = step(0.18, hash(vec2(row, offset + 11.3)));
    return inside * stroke * x * cadence;
  }

  float stamp(vec2 p, vec2 center, float radius, float angle) {
    vec2 q = rotate2d(angle) * (p - center);
    float ring = 1.0 - smoothstep(0.016, 0.038, abs(length(q) - radius));
    float bandA = hardBox(q, vec2(0.0, -0.018), vec2(radius * 0.76, 0.024), 0.0);
    float bandB = hardBox(q, vec2(0.0, 0.07), vec2(radius * 0.5, 0.014), 0.0);
    return max(ring, max(bandA, bandB) * 0.86);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / max(uResolution.xy, vec2(1.0));
    vec2 p = uv * 2.0 - 1.0;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    p.x *= aspect;

    float mobile = clamp(uMobile, 0.0, 1.0);
    float time = uTime * mix(0.42, 0.3, mobile);
    float slow = uTime * mix(0.18, 0.12, mobile);
    vec2 mouse = vec2(uMouse.x * aspect, uMouse.y);
    float reveal = exp(-dot(p - mouse * 0.76, p - mouse * 0.76) * mix(2.1, 3.4, mobile));

    vec3 dark = vec3(0.012, 0.012, 0.014);
    vec3 table = vec3(0.035, 0.031, 0.026);
    vec3 paper = vec3(0.9, 0.82, 0.62);
    vec3 oldPaper = vec3(0.58, 0.5, 0.36);
    vec3 ink = vec3(0.016, 0.014, 0.012);
    vec3 red = vec3(0.86, 0.045, 0.032);
    vec3 oxblood = vec3(0.42, 0.018, 0.016);
    vec3 cyan = vec3(0.02, 0.82, 0.76);
    vec3 amber = vec3(0.96, 0.58, 0.18);

    vec3 color = mix(dark, table, smoothstep(-1.0, 0.86, p.y + fbm(p * 1.7) * 0.22));
    color += vec3(0.038, 0.026, 0.018) * smoothstep(-1.0, -0.2, p.y) * smoothstep(0.4, -0.7, p.y);

    float driftA = sin(slow * 1.2);
    float driftB = cos(slow * 0.95);
    float driftC = sin(slow * 1.45 + 1.8);

    vec2 cA = vec2(-0.42 * aspect + driftA * 0.035, 0.05 + driftB * 0.018);
    vec2 sA = vec2(0.44, 0.66);
    float aA = -0.055 + driftB * 0.015;
    vec2 cB = vec2(0.24 * aspect + driftC * 0.032, -0.02 + driftA * 0.02);
    vec2 sB = vec2(0.5, 0.56);
    float aB = 0.065 + driftA * 0.014;
    vec2 cC = vec2(0.78 * aspect - driftB * 0.03, 0.18 + driftC * 0.018);
    vec2 sC = vec2(0.28, 0.72);
    float aC = -0.035 + driftC * 0.012;

    float pageA = roughBox(p, cA, sA, aA, 0.05);
    float pageB = roughBox(p, cB, sB, aB, 0.045);
    float pageC = roughBox(p, cC, sC, aC, 0.038);
    float pages = clamp(pageA + pageB + pageC * 0.78, 0.0, 1.0);

    float fiber = fbm(p * vec2(18.0, 7.0) + vec2(slow * 0.25, -slow * 0.1));
    vec3 paperTone = mix(oldPaper, paper, 0.38 + fiber * 0.44);
    color = mix(color, paperTone, pages * 0.78);

    float lines = 0.0;
    lines += documentLines(p + vec2(time * 0.01, 0.0), cA, sA, aA, 3.0) * pageA;
    lines += documentLines(p + vec2(-time * 0.012, 0.0), cB, sB, aB, 7.0) * pageB;
    lines += documentLines(p + vec2(time * 0.008, 0.0), cC, sC, aC, 11.0) * pageC;
    color = mix(color, ink, lines * 0.22);

    float redact = 0.0;
    redact += hardBox(p, cA + vec2(-0.08, 0.24) + vec2(sin(time * 1.1), 0.0) * 0.012, vec2(0.26, 0.032), aA);
    redact += hardBox(p, cA + vec2(0.05, -0.12) + vec2(cos(time * 0.9), 0.0) * 0.011, vec2(0.34, 0.038), aA);
    redact += hardBox(p, cB + vec2(-0.02, 0.1) + vec2(sin(time * 1.3), 0.0) * 0.01, vec2(0.36, 0.036), aB);
    redact += hardBox(p, cC + vec2(0.0, -0.2) + vec2(cos(time * 1.2), 0.0) * 0.008, vec2(0.18, 0.034), aC);
    redact *= pages;
    color = mix(color, ink, redact * 0.84);

    float redBlock = 0.0;
    redBlock += hardBox(p, cA + vec2(-0.16, -0.34), vec2(0.3, 0.12), aA);
    redBlock += hardBox(p, cB + vec2(0.18, 0.28), vec2(0.28, 0.1), aB);
    redBlock += hardBox(p, cC + vec2(0.0, 0.34), vec2(0.16, 0.11), aC);
    redBlock *= pages;
    color = mix(color, mix(oxblood, red, 0.68), redBlock * 0.62);

    float stampMask = 0.0;
    stampMask += stamp(p, cA + vec2(0.18, -0.34), 0.16, aA + 0.18) * pageA;
    stampMask += stamp(p, cB + vec2(-0.22, -0.24), 0.13, aB - 0.12) * pageB;
    color += red * stampMask * (0.26 + sin(time * 2.1) * 0.04);

    vec2 ghostP = p + vec2(sin(time * 0.5), cos(time * 0.42)) * 0.045;
    float photogram = 0.0;
    photogram += 1.0 - smoothstep(0.0, 0.05, abs(length((ghostP - vec2(0.18 * aspect, 0.02)) * vec2(1.0, 1.55)) - 0.34));
    photogram += 1.0 - smoothstep(0.0, 0.045, abs(length((ghostP - vec2(0.46 * aspect, -0.18)) * vec2(1.25, 0.9)) - 0.22));
    photogram *= pages * (0.18 + reveal * 0.9);
    color += cyan * photogram * 0.22 * uIntensity;

    float sweep = mix(-1.25 * aspect, 1.25 * aspect, fract(slow * 0.34));
    float light = exp(-pow((p.x - sweep + p.y * 0.18) * mix(4.2, 5.6, mobile), 2.0));
    light *= smoothstep(-0.88, -0.02, p.y) * smoothstep(0.95, -0.18, p.y);
    color += cyan * light * (0.08 + reveal * 0.1) * uIntensity;
    color += amber * light * 0.032;

    vec2 glass = rotate2d(-0.22) * p;
    float glare = smoothstep(0.988, 1.0, sin((glass.y + time * 0.16) * 64.0) * 0.5 + 0.5);
    glare *= smoothstep(-0.75, 0.24, p.x) * smoothstep(0.92, -0.12, p.y);
    color += vec3(0.55, 0.76, 0.7) * glare * 0.045;

    float dust = hash(gl_FragCoord.xy + floor(uTime * 18.0));
    float dustSpark = smoothstep(0.996, 1.0, noise(p * 95.0 + vec2(time, -time * 0.45)));
    color += vec3(0.75, 0.62, 0.42) * dustSpark * 0.06;
    color += (dust - 0.5) * 0.052;

    float shadow = 1.0 - smoothstep(0.92, 1.22, length((p - vec2(-0.96 * aspect, -0.78)) * vec2(1.0, 0.54)));
    color = mix(color, dark, shadow * 0.16);

    float vignette = smoothstep(1.42, 0.14, length(p * vec2(0.8, 1.0)));
    color *= 0.42 + vignette * 1.08;
    color = pow(max(color, vec3(0.0)), vec3(0.9));

    gl_FragColor = vec4(color, 1.0);
  }
`;

function ArchivePlane() {
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

    smoothedMouse.current.lerp(targetMouse.current, 0.058);
    smoothedScroll.current += (targetScroll.current - smoothedScroll.current) * 0.04;

    material.uniforms.uTime.value = performance.now() * 0.001;
    material.uniforms.uMouse.value.copy(smoothedMouse.current);
    material.uniforms.uScroll.value = smoothedScroll.current;
    material.uniforms.uIntensity.value = 0.9 + smoothedScroll.current * 0.22;
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

export function ArchiveLightboxCanvas() {
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
      <ArchivePlane />
    </Canvas>
  );
}
