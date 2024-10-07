import { useFBO } from '@react-three/drei';
import {
  Canvas,
  useFrame,
  extend,
  createPortal,
  ReactThreeFiber,
} from '@react-three/fiber';
import { useMemo, useRef } from 'react';

import simulationVertexShader from './simulationVertexShader.glsl';
import simulationFragmentShader from './simulationFragmentShader.glsl';
import fragmentShader from './fragmentShader.glsl';
import vertexShader from './vertexShader.glsl';

import * as Three from 'three';

const getRandomData = (width: number, height: number) => {
  // we need to create a vec4 since we're passing the positions to the fragment shader
  // data textures need to have 4 components, R, G, B, and A
  const length = width * height * 4;
  const data = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    const stride = i * 4;

    const distance = Math.sqrt(Math.random()) * 2.0;
    const theta = Three.MathUtils.randFloatSpread(360);
    const phi = Three.MathUtils.randFloatSpread(360);

    data[stride] = distance * Math.sin(theta) * Math.cos(phi);
    data[stride + 1] = distance * Math.sin(theta) * Math.sin(phi);
    data[stride + 2] = distance * Math.cos(theta);
    data[stride + 3] = 1.0; // this value will not have any impact
  }

  return data;
};

class SimulationMaterial extends Three.ShaderMaterial {
  constructor(size: number) {
    const positionsTexture = new Three.DataTexture(
      getRandomData(size, size),
      size,
      size,
      Three.RGBAFormat,
      Three.FloatType
    );
    positionsTexture.needsUpdate = true;

    const simulationUniforms = {
      positions: { value: positionsTexture },
      uFrequency: { value: 0.25 },
      uTime: { value: 0 },
    };

    super({
      uniforms: simulationUniforms,
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      simulationMaterial: ReactThreeFiber.Object3DNode<
        SimulationMaterial,
        typeof SimulationMaterial
      >;
    }
  }
}

extend({ SimulationMaterial: SimulationMaterial });

const FBOParticles = () => {
  const size = 128;

  const points =
    useRef<
      Three.Points<
        Three.BufferGeometry<Three.NormalBufferAttributes>,
        Three.ShaderMaterial
      >
    >(null);
  const simulationMaterialRef = useRef<SimulationMaterial>(null);

  const scene = new Three.Scene();
  const camera = new Three.OrthographicCamera(
    -1,
    1,
    1,
    -1,
    1 / Math.pow(2, 53),
    1
  );
  const positions = new Float32Array([
    -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
  ]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  const renderTarget = useFBO(size, size, {
    minFilter: Three.NearestFilter,
    magFilter: Three.NearestFilter,
    format: Three.RGBAFormat,
    stencilBuffer: false,
    type: Three.FloatType,
  });

  const particlesPosition = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  const uniforms = useMemo(
    () => ({
      uPositions: {
        value: null,
      },
    }),
    []
  );

  useFrame((state) => {
    const { gl, clock } = state;

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    if (points.current) {
      points.current.material.uniforms.uPositions.value = renderTarget.texture;
    }
    if (simulationMaterialRef.current) {
      simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <>
      {createPortal(
        <mesh>
          <simulationMaterial ref={simulationMaterialRef} args={[size]} />
          <bufferGeometry>
            <bufferAttribute
              attach='attributes-position'
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach='attributes-uv'
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach='attributes-position'
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          blending={Three.AdditiveBlending}
          depthWrite={false}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        />
      </points>
    </>
  );
};

export default function WebDeveloperScene() {
  return (
    <Canvas camera={{ position: [1.5, 1.5, 0] }}>
      <mesh>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color='white' />
      </mesh>
      <pointLight intensity={1} position={[0, 0, 0]} />
      <ambientLight intensity={0.5} />
      <FBOParticles />
    </Canvas>
  );
}
