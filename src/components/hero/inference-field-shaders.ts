/**
 * Simplex noise below is Ashima Arts / Stefan Gustavson's public implementation
 * (MIT). Everything around it drives a curl noise flow field: each point is
 * displaced along the curl of the noise, which reads as an advected field
 * without the cost of a ping pong simulation pass.
 */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 curl(vec3 p){
  const float e = 0.12;
  float n1 = snoise(vec3(p.x, p.y + e, p.z));
  float n2 = snoise(vec3(p.x, p.y - e, p.z));
  float n3 = snoise(vec3(p.x, p.y, p.z + e));
  float n4 = snoise(vec3(p.x, p.y, p.z - e));
  float n5 = snoise(vec3(p.x + e, p.y, p.z));
  float n6 = snoise(vec3(p.x - e, p.y, p.z));
  float x = (n1 - n2) - (n3 - n4);
  float y = (n3 - n4) - (n5 - n6);
  float z = (n5 - n6) - (n1 - n2);
  return normalize(vec3(x, y, z) + 1e-6);
}
`

export const VERTEX = /* glsl */ `
precision highp float;

attribute vec3 position;
attribute float seed;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uDpr;
uniform float uAspect;

varying float vAlpha;

${NOISE}

void main() {
  vec3 sampled = vec3(position.x * uAspect, position.y, position.z + uTime * 0.045);
  vec3 flow = curl(sampled * 0.85);

  vec3 p = position;
  p.xy += flow.xy * 0.34;
  p.x += sin(uTime * 0.11 + seed * 6.2831) * 0.02;

  vec2 screen = (p.xy * 0.5 + 0.5) * uResolution;

  vec2 delta = screen - uPointer;
  float dist = length(delta);
  float radius = 200.0 * uDpr;
  float push = uPointerActive * smoothstep(radius, 0.0, dist) * 64.0 * uDpr;
  screen += normalize(delta + vec2(0.0001)) * push;

  gl_Position = vec4((screen / uResolution) * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = (1.6 + fract(seed * 13.37) * 2.2) * uDpr;

  vAlpha = 0.45 + 0.55 * fract(seed * 7.13);
}
`

export const FRAGMENT = /* glsl */ `
precision mediump float;

uniform vec3 uColor;
uniform float uOpacity;

varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = dot(uv, uv);
  if (d > 0.25) discard;
  float soft = smoothstep(0.25, 0.05, d);
  gl_FragColor = vec4(uColor, vAlpha * uOpacity * soft);
}
`
