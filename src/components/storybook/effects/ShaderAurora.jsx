import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Shader-based Aurora effect adapted from CodePen
 * Creates realistic aurora with oxygen green, nitrogen blue, and aurora pink layers
 */
export default function ShaderAurora({
  animationProgress = 1,
  intensity = 1,
  position = [0, 0, -5],
  scale = [20, 8, 1]
}) {
  const meshRef = useRef();

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(1024, 512) },
        u_opacity: { value: 1.0 },
        u_intensity: { value: 1.0 }
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform float u_opacity;
        uniform float u_intensity;

        varying vec2 vUv;

        #define baseColor vec3(.4, .7, 1.)
        #define emeraldGreen vec3(0.0, 0.8, 0.4)
        #define electricBlue vec3(0.2, 0.5, 1.0)
        #define auroraPink vec3(0.9, 0.3, 0.7)
        #define grow 1.

        mat2 mm2(in float a){
          float c = cos(a), s = sin(a);
          return mat2(c, s, -s, c);
        }

        mat2 m2 = mat2(0.95534, 0.29552, -0.29552, 0.95534);

        float tri(in float x){
          return clamp(abs(fract(x) - .5), 0.01, 0.49);
        }

        vec2 tri2(in vec2 p){
          return vec2(tri(p.x) + tri(p.y), tri(p.y + tri(p.x)));
        }

        float fastPow14(float x) {
          return exp2(1.4 * log2(x + 0.001));
        }

        float fastExp2(float x) {
          return exp2(x);
        }

        float triNoise2d(in vec2 p, float spd)
        {
          float z = 1.8;
          float z2 = 2.5;
          float rz = 0.;
          p *= mm2(p.x * 0.06);
          vec2 bp = p;
          mat2 timeRot = mm2(u_time * spd);

          for (float i = 0.; i < 3.; i++)
          {
            vec2 dg = tri2(bp * 1.85) * .75;
            dg *= timeRot;
            p -= dg / z2;

            bp *= 1.3;
            z2 *= .45;
            z *= .42;
            p *= 1.21 + (rz - 1.0) * .02;

            rz += tri(p.x + tri(p.y)) * z;
            p *= -m2;
          }
          return clamp(1. / (rz * 29.), 0., .55);
        }

        float hash21(in vec2 n){
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        vec4 oxygenGreenLayer(vec3 ro, vec3 rd, vec2 fragCoordHash) {
          vec4 col = vec4(0);
          vec4 avgCol = vec4(0);

          for(float i = 2.; i < 8.; i++)
          {
            float of = 0.006 * hash21(fragCoordHash) * smoothstep(0., 15., i);
            float pt = ((.8 + fastPow14(i) * .002) - ro.y) / (rd.y * 2. + 0.4);
            pt -= of;
            vec3 bpos = ro + pt * rd;
            vec2 p = bpos.zx;
            float rzt = triNoise2d(p, 1.);

            float intensity = exp(-abs((i / 12.0) - 0.28) * 5.0);
            vec4 col2 = vec4(emeraldGreen * rzt * intensity * 1.1, rzt * intensity);

            avgCol = mix(avgCol, col2, .5);
            col += avgCol * fastExp2(-i * 0.065 - 2.5) * smoothstep(0., 5., i);
          }
          return col;
        }

        vec4 nitrogenBlueLayer(vec3 ro, vec3 rd, vec2 fragCoordHash) {
          vec4 col = vec4(0);
          vec4 avgCol = vec4(0);

          for(float i = 4.; i < 10.; i++)
          {
            float of = 0.008 * hash21(fragCoordHash + vec2(100.0)) * smoothstep(0., 15., i);
            float pt = ((.8 + fastPow14(i) * .002) - ro.y) / (rd.y * 2. + 0.4);
            pt -= of;
            vec3 bpos = ro + pt * rd;
            vec2 p = bpos.zx + vec2(0.5, 0.0);
            float rzt = triNoise2d(p, 0.8);

            float intensity = exp(-abs((i / 12.0) - 0.5) * 3.0);
            vec4 col2 = vec4(electricBlue * rzt * intensity * 0.4, rzt * intensity);

            avgCol = mix(avgCol, col2, .5);
            col += avgCol * fastExp2(-i * 0.065 - 2.5) * smoothstep(0., 5., i);
          }
          return col;
        }

        vec4 oxygenRedLayer(vec3 ro, vec3 rd, vec2 fragCoordHash) {
          vec4 col = vec4(0);
          vec4 avgCol = vec4(0);

          for(float i = 7.; i < 12.; i++)
          {
            float of = 0.004 * hash21(fragCoordHash + vec2(200.0)) * smoothstep(0., 15., i);
            float pt = ((.8 + fastPow14(i) * .002) - ro.y) / (rd.y * 2. + 0.4);
            pt -= of;
            vec3 bpos = ro + pt * rd;
            vec2 p = bpos.zx + vec2(0.0, 0.3);
            float rzt = triNoise2d(p, 1.2);

            float intensity = exp(-abs((i / 12.0) - 0.7) * 3.0);
            vec4 col2 = vec4(auroraPink * rzt * intensity * 1.0, rzt * intensity);

            avgCol = mix(avgCol, col2, .5);
            col += avgCol * fastExp2(-i * 0.065 - 2.5) * smoothstep(0., 5., i);
          }
          return col;
        }

        vec4 aurora(vec3 ro, vec3 rd)
        {
          vec2 fragCoordHash = vUv * u_resolution;
          vec4 greenLayer = oxygenGreenLayer(ro, rd, fragCoordHash);
          vec4 blueLayer = nitrogenBlueLayer(ro, rd, fragCoordHash);
          vec4 pinkLayer = oxygenRedLayer(ro, rd, fragCoordHash);

          vec3 col = greenLayer.rgb * 1.2 + blueLayer.rgb * 0.5 + pinkLayer.rgb * 0.8;

          float finalAlpha = max(max(greenLayer.a, blueLayer.a), pinkLayer.a);
          finalAlpha = clamp(finalAlpha * 2.0, 0.0, 1.0);

          col *= clamp(rd.y * 15. + .4, 0., 1.);
          return vec4(col * 1.8 * u_intensity, finalAlpha);
        }

        void main()
        {
          vec2 uv = vUv;
          vec3 ro = vec3(0, 0, 0);
          vec3 rd = normalize(vec3(uv - 1. + grow, 1.3));
          vec3 col = vec3(0.);

          float fade = smoothstep(0., 0.01, abs(rd.y));
          float bottomFade = smoothstep(0.0, 0.1, uv.y);

          vec4 aur = smoothstep(0., .5, aurora(ro, rd)) * fade * bottomFade;
          col = mix(col, aur.rgb, aur.a);

          gl_FragColor = vec4(col, aur.a * u_opacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.u_time.value = state.clock.getElapsedTime();
      meshRef.current.material.uniforms.u_opacity.value = animationProgress;
      meshRef.current.material.uniforms.u_intensity.value = intensity;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
    >
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}
