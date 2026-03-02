import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Float, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

export function Stadium() {
  const group = useRef<THREE.Group>(null);
  const spotlightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (group.current) {
      // Subtle breathing movement
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (spotlightRef.current) {
      spotlightRef.current.target.position.x = Math.sin(state.clock.elapsedTime) * 5;
    }
  });

  return (
    <>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 10, 50]} />
      
      <PerspectiveCamera makeDefault position={[0, 2, 15]} fov={50} />
      
      <ambientLight intensity={0.2} />
      <spotLight
        ref={spotlightRef}
        position={[10, 20, 10]}
        angle={0.15}
        penumbra={1}
        intensity={2}
        castShadow
        color="#ffd700"
      />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <group ref={group}>
        {/* Field */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>

        {/* Stadium Bowl (Simplified) */}
        <mesh position={[0, 5, -20]}>
          <boxGeometry args={[60, 20, 2]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        
        {/* Volumetric Light Rays (Simplified with Distorted Mesh) */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[0, 10, -10]} rotation={[0.5, 0, 0]}>
            <coneGeometry args={[5, 20, 32]} />
            <MeshDistortMaterial
              transparent
              opacity={0.1}
              color="#ffd700"
              speed={2}
              distort={0.4}
            />
          </mesh>
        </Float>
      </group>
    </>
  );
}
