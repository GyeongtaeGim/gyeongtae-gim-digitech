import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  useGLTF,
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, N8AO } from '@react-three/postprocessing';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { PropsWithChildren, useMemo, useRef } from 'react';

import { easing } from 'maath';
import * as Three from 'three';
import { isMeshType } from '../../types';

const connectors = [
  { color: '#444', roughness: 0.1 },
  { color: '#444', roughness: 0.75 },
  { color: '#444', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: '#4060ff', roughness: 0.1, accent: true },
  { color: '#4060ff', roughness: 0.75, accent: true },
  { color: '#4060ff', roughness: 0.1, accent: true },
];

useGLTF.preload('/c-transformed.glb');

export default function MainSectionScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}>
      <color attach='background' args={['#141622']} />
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <Physics gravity={[0, 0, 0]}>
        <Pointer />
        {connectors.map((props, i) => (
          <Connector key={i} {...props} />
        ))}
        <Connector position={new Three.Vector3(10, 10, 5)}>
          <Model>
            <MeshTransmissionMaterial
              clearcoat={1}
              thickness={0.1}
              anisotropicBlur={0.1}
              chromaticAberration={0.1}
              samples={8}
              resolution={512}
            />
          </Model>
        </Connector>
      </Physics>
      <EffectComposer multisampling={8}>
        <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
      </EffectComposer>
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer
            form='circle'
            intensity={4}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={2}
          />
          <Lightformer
            form='circle'
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, 1, -1]}
            scale={2}
          />
          <Lightformer
            form='circle'
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, -1, -1]}
            scale={2}
          />
          <Lightformer
            form='circle'
            intensity={2}
            rotation-y={-Math.PI / 2}
            position={[10, 1, 0]}
            scale={8}
          />
        </group>
      </Environment>
    </Canvas>
  );
}

interface ConnectorProps {
  position?: Three.Vector3;
  vec?: Three.Vector3;
  scale?: number;
  r?: (max: number) => number;
  accent?: boolean;
  color?: Three.Color | string;
}

function Connector({
  position,
  children,
  vec = new Three.Vector3(),
  scale,
  r = Three.MathUtils.randFloatSpread,
  accent,
  ...props
}: PropsWithChildren<ConnectorProps>) {
  const api = useRef<RapierRigidBody>(null);
  const pos = useMemo(
    () => position || new Three.Vector3(r(10), r(10), r(10)),
    []
  );

  useFrame((_, delta) => {
    delta = Math.min(0.1, delta);
    api.current?.applyImpulse(
      vec.copy(api.current.translation()).negate().multiplyScalar(0.2),
      true
    );
  });

  return (
    <RigidBody
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      position={pos}
      ref={api}
      colliders={false}>
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />
      {children ? children : <Model {...props}>{children}</Model>}
      {accent && (
        <pointLight intensity={4} distance={2.5} color={props.color} />
      )}
    </RigidBody>
  );
}

interface PointerProps {
  vec?: Three.Vector3;
}

function Pointer({ vec = new Three.Vector3() }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);
  useFrame(({ pointer, viewport }) => {
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      )
    );
  });
  return (
    <RigidBody
      position={[0, 0, 0]}
      type='kinematicPosition'
      colliders={false}
      ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  );
}

interface ModelProps {
  color?: Three.Color | string;
  roughness?: number;
}

function Model({
  children,
  color = 'white',
  roughness = 0,
}: PropsWithChildren<ModelProps>) {
  const ref =
    useRef<
      Three.Mesh<
        Three.BufferGeometry<Three.NormalBufferAttributes>,
        Three.Material
      >
    >(null);
  const { nodes, materials } = useGLTF('/c-transformed.glb');

  useFrame((_, delta) => {
    if (ref.current?.material instanceof Three.MeshStandardMaterial) {
      easing.dampC(ref.current?.material.color, color, 0.2, delta);
    }
  });

  if (
    !isMeshType(nodes.connector) ||
    !(materials.base instanceof Three.MeshStandardMaterial)
  ) {
    return null;
  }

  return (
    <mesh
      ref={ref}
      castShadow
      receiveShadow
      scale={10}
      geometry={nodes.connector.geometry}>
      <meshStandardMaterial
        metalness={0.2}
        roughness={roughness}
        map={materials.base.map}
      />
      {children}
    </mesh>
  );
}
