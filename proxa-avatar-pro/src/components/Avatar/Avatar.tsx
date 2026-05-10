import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Cylinder, MeshDistortMaterial, Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "../../store/useStore";

export default function Avatar() {
  const headRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  
  const status = useStore((state) => state.status);
  const emotion = useStore((state) => state.emotion);
  
  const [mouthOpen, setMouthOpen] = useState(0);

  // Handle Lip Sync Events
  useEffect(() => {
    const handleLipSync = () => {
      // Simulate mouth opening for a brief moment
      setMouthOpen(1);
      setTimeout(() => setMouthOpen(0), 100);
    };

    window.addEventListener('lip-sync', handleLipSync);
    return () => window.removeEventListener('lip-sync', handleLipSync);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (headRef.current) {
      // Idle head movement
      headRef.current.position.y = Math.sin(time * 0.5) * 0.1;
      headRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
      headRef.current.rotation.x = Math.cos(time * 0.2) * 0.05;
    }

    if (mouthRef.current && status === "speaking") {
      // Speaking animation
      mouthRef.current.scale.y = THREE.MathUtils.lerp(
        mouthRef.current.scale.y, 
        0.1 + (mouthOpen * 0.4) + Math.sin(time * 20) * 0.1, 
        0.2
      );
    } else if (mouthRef.current) {
      mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 0.05, 0.1);
    }

    // Blink logic
    const blink = Math.sin(time * 5) > 0.98 ? 0.01 : 1;
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, blink, 0.5);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, blink, 0.5);
    }
  });

  const getEmotionColor = () => {
    switch (emotion) {
      case "positive": return "#4ade80";
      case "skeptical": return "#f87171";
      case "engaged": return "#60a5fa";
      default: return "#ffffff";
    }
  };

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group ref={headRef}>
          {/* Main Head Orb */}
          <Sphere args={[1, 64, 64]} castShadow>
            <MeshDistortMaterial
              color="#1a1a2e"
              roughness={0.1}
              metalness={0.8}
              distort={status === "thinking" ? 0.4 : 0.2}
              speed={2}
            />
          </Sphere>

          {/* Inner Glow Core */}
          <Sphere args={[0.8, 32, 32]}>
            <meshStandardMaterial
              color={getEmotionColor()}
              emissive={getEmotionColor()}
              emissiveIntensity={status === "thinking" ? 2 : 1}
              transparent
              opacity={0.3}
            />
          </Sphere>

          {/* Eyes */}
          <group position={[0, 0.2, 0.8]}>
            <Sphere ref={leftEyeRef} args={[0.08, 16, 16]} position={[-0.3, 0, 0]}>
              <meshStandardMaterial color={getEmotionColor()} emissive={getEmotionColor()} emissiveIntensity={5} />
            </Sphere>
            <Sphere ref={rightEyeRef} args={[0.08, 16, 16]} position={[0.3, 0, 0]}>
              <meshStandardMaterial color={getEmotionColor()} emissive={getEmotionColor()} emissiveIntensity={5} />
            </Sphere>
          </group>

          {/* Mouth */}
          <Cylinder
            ref={mouthRef}
            args={[0.2, 0.2, 0.05, 32]}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, -0.3, 0.8]}
          >
            <meshStandardMaterial color={getEmotionColor()} emissive={getEmotionColor()} emissiveIntensity={3} />
          </Cylinder>

          {/* Proxa Halo */}
          <mesh rotation={[Math.PI / 2.5, 0, 0]} position={[0, 0, 0]}>
            <torusGeometry args={[1.3, 0.015, 16, 100]} />
            <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={10} />
          </mesh>
        </group>
      </Float>

      <Environment preset="city" />
      <ContactShadows opacity={0.4} scale={10} blur={2.4} far={1} />
    </group>
  );
}
