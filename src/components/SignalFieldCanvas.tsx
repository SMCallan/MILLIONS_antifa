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
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
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
    mat2 rotate = mat2(0.82, -0.57, 0.57, 0.82);

    for (int i = 0; i < 3; i++) {
      value += amplitude * noise(p);
      p = rotate * p * 2.02 + 17.17;
      amplitude *= 0.48;
    }

    return value;
  }

  float gridLine(vec2 p, float scale, float width) {
    vec2 grid = abs(fract(p * scale) - 0.5);
    float line = min(grid.x, grid.y);
    return 1.0 - smoothstep(0.0, width, line);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / max(uResolution.xy, vec2(1.0));
    vec2 p = uv * 2.0 - 1.0;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    p.x *= aspect;

    float mobile = clamp(uMobile, 0.0, 1.0);
    float time = uTime * (0.062 + uScroll * 0.025) * mix(1.0, 0.72, mobile);
    vec2 mouse = vec2(uMouse.x * aspect, uMouse.y);
    float mouseField = exp(-dot(p - mouse * 0.72, p - mouse * 0.72) * mix(2.7, 3.6, mobile));

    vec2 flow = p;
    flow += mix(0.15, 0.08, mobile) * uIntensity * mouseField * vec2(
      sin(time * 3.0 + p.y * 3.0),
      cos(time * 2.4 + p.x * 2.7)
    );
    flow.x += sin(flow.y * 2.4 + time * 2.5) * mix(0.07, 0.04, mobile);
    flow.y += cos(flow.x * 1.9 - time * 1.7) * mix(0.055, 0.032, mobile);

    float fieldA = fbm(flow * mix(1.32, 1.08, mobile) + vec2(time * 1.45, -time * 0.55));
    float fieldB = fbm(flow * mix(2.35, 1.75, mobile) - vec2(time * 0.72, time * 1.1));
    float fieldC = fbm(flow * mix(4.2, 2.8, mobile) + fieldA * 0.92);

    float ribbon = sin((flow.y + fieldA * 0.52) * 3.35 + time * 4.25);
    ribbon += sin((flow.x * 0.68 - flow.y + fieldB * 0.42) * 4.45 - time * 2.65) * 0.38;
    ribbon = smoothstep(0.18, 0.98, ribbon * 0.5 + 0.5);

    float contour = abs(fract((fieldA * 1.45 + fieldB * 0.68 + flow.y * 0.14) * mix(6.2, 4.7, mobile)) - 0.5);
    contour = 1.0 - smoothstep(0.012, mix(0.06, 0.075, mobile), contour);

    float grid = gridLine(flow + fieldB * 0.035, mix(8.0, 5.4, mobile) + uScroll * 2.0, 0.02);
    float fineGrid = gridLine(flow + vec2(fieldA, fieldC) * 0.018, mix(24.0, 12.0, mobile), 0.008);

    float signal = ribbon * (0.38 + fieldC * 0.58) * uIntensity;
    signal += contour * mix(0.085, 0.055, mobile);
    signal += grid * 0.026 + fineGrid * mix(0.014, 0.004, mobile);
    signal += mouseField * mix(0.12, 0.06, mobile);

    vec3 base = vec3(0.014, 0.018, 0.026);
    vec3 deep = vec3(0.028, 0.064, 0.062);
    vec3 ice = vec3(0.06, 0.88, 0.8);
    vec3 red = vec3(1.0, 0.14, 0.08);
    vec3 paper = vec3(1.0, 0.82, 0.48);
    vec3 oxidized = vec3(0.24, 0.7, 0.62);

    vec3 color = mix(base, deep, smoothstep(-0.8, 0.85, flow.y + fieldA * 0.6));
    color += ice * signal * 0.68;
    color += oxidized * pow(max(ribbon, 0.0), 2.25) * 0.22;
    color += red * smoothstep(0.56, 0.98, fieldB) * signal * 0.34;
    color += paper * contour * 0.076;
    color += vec3(0.42, 0.72, 0.72) * fineGrid * 0.028;

    float scan = smoothstep(0.997, 1.0, sin((uv.y + time * 0.055) * 190.0) * 0.5 + 0.5);
    color += scan * vec3(0.018, 0.045, 0.048) * (1.0 - mobile * 0.85);

    float vignette = smoothstep(1.35, 0.16, length(p * vec2(0.82, 1.0)));
    color *= 0.44 + vignette * 1.02;
    color += vec3(0.006, 0.012, 0.012);
    color = pow(color, vec3(0.86));

    gl_FragColor = vec4(color, 1.0);
  }
`;

function ShaderPlane() {
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
      uIntensity: { value: 0.92 },
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

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;

    smoothedMouse.current.lerp(targetMouse.current, 0.055);
    smoothedScroll.current += (targetScroll.current - smoothedScroll.current) * 0.035;

    material.uniforms.uTime.value = clock.getElapsedTime();
    material.uniforms.uMouse.value.copy(smoothedMouse.current);
    material.uniforms.uScroll.value = smoothedScroll.current;
    material.uniforms.uIntensity.value = 0.86 + smoothedScroll.current * 0.24;
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

export function SignalFieldCanvas() {
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
      <ShaderPlane />
    </Canvas>
  );
}
