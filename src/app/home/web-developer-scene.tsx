import {
  Canvas,
  useFrame,
  extend,
  createPortal,
  ReactThreeFiber,
  useGraph,
} from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';

import simulationVertexShader from './simulationVertexShader.glsl';
import simulationFragmentShader from './simulationFragmentShader.glsl';
import fragmentShader from './fragmentShader.glsl';
import vertexShader from './vertexShader.glsl';

import * as Three from 'three';
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from '@react-three/postprocessing';
import { PerspectiveCamera, useAnimations, useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { useScroll, useTransform } from 'framer-motion';

useGLTF.preload('/idle.glb');

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
  const size = 256;

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

  const renderTarget = useMemo(() => {
    return new Three.WebGLRenderTarget(size, size, {
      minFilter: Three.NearestFilter,
      magFilter: Three.NearestFilter,
      format: Three.RGBAFormat,
      stencilBuffer: false,
      type: Three.FloatType,
    });
  }, [size]);

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

function Idle() {
  const group = useRef<Three.Group>(null);
  const { scene, animations } = useGLTF('/idle.glb');
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions['Armature|mixamo.com|Layer0']?.play();
  }, [actions]);

  if (
    !(nodes.Alpha_Joints instanceof Three.SkinnedMesh) ||
    !(nodes.Alpha_Surface instanceof Three.SkinnedMesh)
  ) {
    return null;
  }

  return (
    <group ref={group} dispose={null}>
      <group
        name='Armature'
        position={[0, -4, 0]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={0.006}>
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh
          name='Alpha_Joints'
          geometry={nodes.Alpha_Joints.geometry}
          material={materials.Alpha_Joints_MAT}
          skeleton={nodes.Alpha_Joints.skeleton}
        />
        <skinnedMesh
          name='Alpha_Surface'
          geometry={nodes.Alpha_Surface.geometry}
          material={materials.Alpha_Body_MAT}
          skeleton={nodes.Alpha_Surface.skeleton}
        />
      </group>
    </group>
  );
}

interface WebDeveloperSceneProps {
  container: React.RefObject<HTMLElement>;
}

function Scroll({ container }: WebDeveloperSceneProps) {
  const { scrollYProgress } = useScroll({ target: container });
  const fov = useTransform(scrollYProgress, [0, 1], [20, 70]);
  const posY = useTransform(scrollYProgress, [0, 1], [-4, -4.5]);

  useFrame(({ camera }) => {
    console.log(scrollYProgress.get());
    if (!(camera instanceof Three.PerspectiveCamera)) return;
    camera.fov = fov.get();
    camera.position.setY(posY.get());
    camera.updateProjectionMatrix();
  });
  return null;
}

export default function WebDeveloperScene({
  container,
}: WebDeveloperSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 0] }}
      shadows
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}>
      <PerspectiveCamera
        makeDefault
        fov={20}
        position={[0, -4, 6]}
        rotation={[Math.PI / 5, 0, 0]}
      />
      <Scroll container={container} />
      <Idle />
      <EffectComposer enableNormalPass={false}>
        <Bloom mipmapBlur luminanceThreshold={1} levels={8} intensity={5} />
        <ToneMapping adaptive={true} />
      </EffectComposer>
      <mesh receiveShadow position={[0, -4, 0]} rotation={[-1, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color='white' />
      </mesh>
      <spotLight position={[0, 4, 0]} angle={1} intensity={15} penumbra={1} />
      <spotLight position={[0, 2, 0]} angle={0.4} intensity={20} penumbra={1} />
      <spotLight position={[0, 0, 0]} angle={0.4} intensity={20} penumbra={1} />
      <mesh position={[0, 5, 0]} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial
          emissive='#ffffff'
          emissiveIntensity={4.5}
          color={0xffcc00}
        />
      </mesh>
      <FBOParticles />
    </Canvas>
  );
}
