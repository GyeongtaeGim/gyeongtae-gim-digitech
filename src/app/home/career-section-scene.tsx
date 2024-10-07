import { Canvas, useFrame } from '@react-three/fiber';

import { useScroll, useTransform } from 'framer-motion';
import { degreesToRadians } from 'popmotion';

function Scroll() {
  const { scrollYProgress } = useScroll();
  const yAngle = useTransform(
    scrollYProgress,
    [0, 1],
    [0.001, degreesToRadians(180)]
  );
  const distance = useTransform(scrollYProgress, [0, 1], [8, 3]);

  useFrame(({ camera }) => {
    camera.position.setFromSphericalCoords(distance.get(), yAngle.get(), 0);
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function CareerSectionScene() {
  return (
    <Canvas shadows dpr={[1, 2]} resize={{ scroll: false, offsetSize: true }}>
      <Scroll />
      <perspectiveCamera fov={1} position={[0, 10, -3]} />
      <group isGroup position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <spotLight color='#f2056f' position={[-4.5, 3, 4]} intensity={80} />
        <spotLight color='#61dafb' position={[-4.5, 3, -7]} intensity={16} />
        <spotLight color='#61dafb' position={[-2, -2, -2]} intensity={16} />
        <spotLight color='#61dafb' position={[-2, 0, 5]} intensity={32} />
        <spotLight color='#61dafb' position={[-1, 5, 0]} intensity={30} />
        <spotLight color='#f2056f' position={[2, 2, 0]} intensity={16} />
        <spotLight color='#f2056f' position={[2, 2, 0]} intensity={8} />
        <spotLight color='#f2056f' position={[4, 2, 2]} intensity={16} />
        <spotLight color='#f2056f' position={[5.3, 2, 3]} intensity={32} />
        <spotLight color='#61dafb' position={[6, 5, 0]} intensity={30} />
        <spotLight color='#b107db' position={[0, -2, 0]} intensity={32} />
      </group>
      <group dispose={null} position={[0, 0, 0]}>
        <mesh position={[-2, -2, 0]}>
          <sphereGeometry args={[1]} />
          <meshPhongMaterial
            color='#ffffff'
            specular='#61dafb'
            shininess={10}
          />
        </mesh>
        <mesh position={[0.2, 0.8, 0]} rotation={[-0.5, 0.5, 0]}>
          <torusGeometry args={[0.4, 0.2, 20, 100]} />
          <meshPhongMaterial
            color='#ffffff'
            specular='#61dafb'
            shininess={10}
          />
        </mesh>
        <mesh position={[5, 0, 0]} rotation-z={0.5}>
          <icosahedronGeometry args={[0.6, 0]} />
          <meshPhongMaterial
            color='#ffffff'
            specular='#61dafb'
            shininess={10}
          />
        </mesh>
        <mesh position={[-4.5, 3, 0]} rotation={[-0.1, 0, -0.3]}>
          <coneGeometry args={[0.6, 1.2, 40]} />
          <meshPhongMaterial
            color='#ffffff'
            specular='#61dafb'
            shininess={10}
          />
        </mesh>
      </group>
    </Canvas>
  );
}
