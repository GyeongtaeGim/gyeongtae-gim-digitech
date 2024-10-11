import { useRef, useMemo } from 'react';
import { Canvas, MeshProps, useFrame } from '@react-three/fiber';

import * as Three from 'three';
import { SoftShadows } from '@react-three/drei';

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

interface SphereProps extends MeshProps {
  position?: [number, number, number];
}

function Sphere({ position = [0, 0, 0], ...props }: SphereProps) {
  const ref = useRef<Three.Mesh>(null);
  const factor = useMemo(() => 0.5 + Math.random(), []);
  useFrame((state) => {
    if (!ref.current) return;
    const t = easeInOutCubic(
      (1 + Math.sin(state.clock.getElapsedTime() * factor)) / 2
    );
    ref.current.position.y = position[1] + t * 4;
    ref.current.scale.y = 1 + t * 3;
  });
  return (
    <mesh ref={ref} position={position} {...props} castShadow receiveShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
    </mesh>
  );
}

function Spheres({ number = 20 }) {
  const ref = useRef<Three.Group>(null);
  const positions = useMemo(
    () =>
      [...new Array(number)].map(
        () =>
          [3 - Math.random() * 6, Math.random() * 4, 3 - Math.random() * 6] as [
            number,
            number,
            number,
          ]
      ),
    [number]
  );

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y =
      Math.sin(state.clock.getElapsedTime() / 2) * Math.PI;
  });
  return (
    <group ref={ref}>
      {positions.map((pos, index) => (
        <Sphere key={index} position={pos} />
      ))}
    </group>
  );
}

export default function EnginearCradleScene() {
  return (
    <Canvas shadows camera={{ position: [-25, 2, 20], fov: 10 }}>
      <SoftShadows size={25} focus={0} samples={10} />
      <fog attach='fog' args={['white', 0, 40]} />
      <ambientLight intensity={1.5} />
      <directionalLight
        castShadow
        position={[2.5, 8, 5]}
        intensity={1.5}
        shadow-mapSize={1024}>
        <orthographicCamera
          attach='shadow-camera'
          args={[-10, 10, -10, 10, 0.1, 50]}
        />
      </directionalLight>
      <pointLight position={[-10, 0, -20]} color='white' intensity={1} />
      <pointLight position={[0, -10, 0]} intensity={1} />
      <group scale={0.8} position={[0, -3.5, 0]}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.5, 0]}
          receiveShadow>
          <planeGeometry args={[100, 100]} />
          <shadowMaterial transparent opacity={0.4} />
        </mesh>
        <Spheres />
      </group>
    </Canvas>
  );
}
