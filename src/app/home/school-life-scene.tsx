import * as Three from 'three';
import { ContactShadows, useGLTF } from '@react-three/drei';
import { Canvas, MeshProps, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';

interface ModelProps extends MeshProps {
  name: string;
}
function Model({ name, ...props }: ModelProps) {
  const meshRef =
    useRef<
      Three.Mesh<
        Three.BufferGeometry<Three.NormalBufferAttributes>,
        Three.Material
      >
    >(null);
  const { nodes } = useGLTF('/compressed.glb');

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = Three.MathUtils.lerp(
      meshRef.current.rotation.y,
      Math.sin(t / 4) / 2,
      0.5
    );
  });

  if (!(nodes[name] instanceof Three.Mesh)) throw new Error('Invalid node');

  return (
    <mesh
      ref={meshRef}
      name={name}
      material-color='white'
      material-emissive='#ff5347'
      material-roughness={1}
      material={nodes[name].material}
      geometry={nodes[name].geometry}
      dispose={null}
      {...props}></mesh>
  );
}

export default function SchoolLifeScene() {
  return (
    <Canvas camera={{ position: [0, 1, 110], fov: 50 }} dpr={[1, 2]}>
      <spotLight
        position={[-100, -100, -100]}
        intensity={0.2}
        angle={0.3}
        penumbra={1}
      />
      <hemisphereLight
        color='white'
        groundColor='#ffdad7'
        position={[-7, 25, 13]}
        intensity={1}
      />
      <Suspense fallback={null}>
        <group position={[0, 10, 0]} scale={1.5}>
          <Model name='Curly' position={[1, -11, -20]} rotation={[2, 0, -0]} />
          <Model name='DNA' position={[20, 0, -17]} rotation={[1, 1, -2]} />
          <Model
            name='Headphones'
            position={[32, 2, 4]}
            rotation={[1, 0, -1]}
          />
          <Model
            name='Notebook'
            position={[-32, -32, -13]}
            rotation={[2, 0, 1]}
          />
          <Model
            name='Rocket003'
            position={[18, 15, -25]}
            rotation={[1, 1, 0]}
          />
          <Model
            name='Roundcube001'
            position={[-56, -4, 5]}
            rotation={[1, 0, 0]}
            scale={0.5}
          />
          <Model
            name='Table'
            position={[1, -4, -28]}
            rotation={[1, 0, -1]}
            scale={0.5}
          />
          <Model
            name='VR_Headset'
            position={[27, -15, 28]}
            rotation={[1, 0, -1]}
            scale={5}
          />
          <Model
            name='Zeppelin'
            position={[-24, 12, 10]}
            rotation={[3, -1, 3]}
            scale={0.005}
          />
          <ContactShadows
            rotation-x={Math.PI / 2}
            position={[0, -35, 0]}
            opacity={0.2}
            width={200}
            height={200}
            blur={1}
            far={50}
          />
        </group>
      </Suspense>
    </Canvas>
  );
}
