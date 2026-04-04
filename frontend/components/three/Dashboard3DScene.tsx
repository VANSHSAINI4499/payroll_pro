// ============================================================
// COMPONENT: Dashboard3DScene — Three.js 3D analytics visualization
// Uses React Three Fiber for interactive 3D bar chart
// UI Layer (MVVM - View/Component)
// ============================================================

"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { DepartmentDistribution, MonthlyPayrollData } from "@/models/Dashboard";

interface Dashboard3DSceneProps {
  departmentData: DepartmentDistribution[];
  monthlyData: MonthlyPayrollData[];
}

// ===================== Glowing Bar =====================
function GlowBar({
  position,
  height,
  color,
  label,
  value,
  delay = 0,
}: {
  position: [number, number, number];
  height: number;
  color: string;
  label: string;
  value: string;
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const targetHeight = Math.max(height, 0.15);
  const progressRef = useRef(0);

  useFrame((state, delta) => {
    // Animate entrance
    if (progressRef.current < 1) {
      progressRef.current = Math.min(progressRef.current + delta * 1.2, 1);
    }
    const delayOffset = Math.max(0, progressRef.current - delay * 0.3);
    const eased = Math.min(delayOffset * 2, 1);
    const easedCubic = 1 - Math.pow(1 - eased, 3);
    const currentHeight = targetHeight * easedCubic;

    if (meshRef.current) {
      meshRef.current.scale.y = Math.max(currentHeight, 0.01);
      meshRef.current.position.y = currentHeight / 2;

      // Subtle pulse
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + delay * 3) * 0.015;
      meshRef.current.scale.x = pulse;
      meshRef.current.scale.z = pulse;
    }
    if (glowRef.current) {
      glowRef.current.scale.y = Math.max(currentHeight, 0.01);
      glowRef.current.position.y = currentHeight / 2;
    }
  });

  return (
    <group position={position}>
      {/* Main bar */}
      <RoundedBox
        ref={meshRef}
        args={[0.5, 1, 0.5]}
        radius={0.06}
        smoothness={4}
        scale={[1, 0.01, 1]}
      >
        <meshPhysicalMaterial
          color={color}
          metalness={0.15}
          roughness={0.25}
          clearcoat={0.6}
          clearcoatRoughness={0.3}
          toneMapped={true}
        />
      </RoundedBox>
      {/* Glow shell */}
      <RoundedBox
        ref={glowRef}
        args={[0.56, 1, 0.56]}
        radius={0.06}
        smoothness={4}
        scale={[1, 0.01, 1]}
      >
        <meshBasicMaterial color={color} transparent opacity={0.07} />
      </RoundedBox>
      {/* Value label on top */}
      <Text
        position={[0, targetHeight + 0.3, 0]}
        fontSize={0.18}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
      {/* Bottom label */}
      <Text
        position={[0, -0.25, 0.4]}
        fontSize={0.13}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      {/* Base glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.35, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

// ===================== Grid Floor =====================
function AnimatedFloor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[16, 10]} />
        <meshStandardMaterial
          color="#0a0a2e"
          metalness={0.5}
          roughness={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      <gridHelper args={[16, 24, "#1e3a6e", "#0f1e40"]} position={[0, 0, 0]} />
    </group>
  );
}

// ===================== Floating Particle =====================
function Particle({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + position[0] * 2) * 0.3;
      ref.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.5 + position[2]) * 0.1;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

// ===================== Floating Orb =====================
function FloatingOrb({ position, color, size = 0.3 }: { position: [number, number, number]; color: string; size?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[size, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.2}
        wireframe
      />
    </mesh>
  );
}

// ===================== Section Label =====================
function SectionLabel({ position, text, color }: { position: [number, number, number]; text: string; color: string }) {
  return (
    <group position={position}>
      <Text
        fontSize={0.22}
        color={color}
        anchorX="center"
        fontWeight="bold"
      >
        {text}
      </Text>
      <mesh position={[0, -0.15, 0]}>
        <planeGeometry args={[text.length * 0.12, 0.02]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// ===================== Main Scene =====================
export default function Dashboard3DScene({
  departmentData,
  monthlyData,
}: Dashboard3DSceneProps) {
  const maxDeptCount = Math.max(...departmentData.map((d) => d.count), 1);
  const maxPayroll = Math.max(...monthlyData.map((d) => d.totalPaid), 1);

  const barColors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

  // Generate particles deterministically
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 15; i++) {
      const seed = i * 137.5;
      arr.push({
        position: [
          Math.sin(seed) * 6,
          1 + (i % 4) * 0.8,
          Math.cos(seed) * 4,
        ] as [number, number, number],
        color: barColors[i % barColors.length],
        speed: 0.5 + (i % 3) * 0.5,
      });
    }
    return arr;
  }, []);

  return (
    <Canvas
      camera={{ position: [6, 5, 6], fov: 45 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-4, 6, -4]} intensity={0.5} color="#3b82f6" distance={15} />
      <pointLight position={[4, 6, 4]} intensity={0.4} color="#8b5cf6" distance={15} />

      {/* Floor */}
      <AnimatedFloor />

      {/* Department Bars (left cluster) */}
      <group position={[-3.5, 0, -0.5]}>
        <SectionLabel position={[departmentData.length * 0.45, 3.2, 0]} text="DEPARTMENTS" color="#60a5fa" />
        {departmentData.map((dept, i) => (
          <GlowBar
            key={dept.department}
            position={[i * 1.1, 0, 0]}
            height={(dept.count / maxDeptCount) * 2.5}
            color={dept.color}
            label={dept.department.slice(0, 5).toUpperCase()}
            value={String(dept.count)}
            delay={i * 0.15}
          />
        ))}
      </group>

      {/* Monthly Payroll Bars (right cluster) */}
      <group position={[-2.5, 0, 3]}>
        <SectionLabel position={[monthlyData.length * 0.5, 3.2, 0]} text="MONTHLY TREND" color="#a78bfa" />
        {monthlyData.map((item, i) => (
          <GlowBar
            key={item.month}
            position={[i * 1.1, 0, 0]}
            height={(item.totalPaid / maxPayroll) * 2.5}
            color={barColors[i % barColors.length]}
            label={item.month}
            value={`${Math.round(item.totalPaid / 1000)}k`}
            delay={0.5 + i * 0.15}
          />
        ))}
      </group>

      {/* Decorative orbs */}
      <FloatingOrb position={[-5, 2.5, -3]} color="#3b82f6" size={0.4} />
      <FloatingOrb position={[5, 2, -1]} color="#8b5cf6" size={0.35} />
      <FloatingOrb position={[0, 3.5, 4]} color="#06b6d4" size={0.3} />

      {/* Particles */}
      {particles.map((p, i) => (
        <Particle key={i} position={p.position} color={p.color} speed={p.speed} />
      ))}

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2.3}
        minPolarAngle={Math.PI / 6}
        minDistance={4}
        maxDistance={14}
        autoRotate
        autoRotateSpeed={0.4}
        enableDamping
        dampingFactor={0.05}
      />

      {/* Fog for depth */}
      <fog attach="fog" args={["#0a0a2e", 10, 22]} />
    </Canvas>
  );
}
