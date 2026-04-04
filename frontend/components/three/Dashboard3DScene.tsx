// ============================================================
// COMPONENT: Dashboard3DScene — Three.js 3D analytics visualization
// Uses React Three Fiber for interactive 3D bar chart
// UI Layer (MVVM - View/Component)
// ============================================================

"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { DepartmentDistribution, MonthlyPayrollData } from "@/models/Dashboard";

interface Dashboard3DSceneProps {
  departmentData: DepartmentDistribution[];
  monthlyData: MonthlyPayrollData[];
}

// ===================== 3D Bar Component =====================
function Bar({
  position,
  height,
  color,
  label,
}: {
  position: [number, number, number];
  height: number;
  color: string;
  label: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetHeight = Math.max(height, 0.1);

  useFrame(() => {
    if (meshRef.current) {
      // Animate bar height
      const currentScale = meshRef.current.scale.y;
      meshRef.current.scale.y += (targetHeight - currentScale) * 0.05;
      meshRef.current.position.y = meshRef.current.scale.y / 2;
    }
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[0.6, 1, 0.6]}
        radius={0.05}
        smoothness={4}
        scale={[1, 0.1, 1]}
      >
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </RoundedBox>
      {/* Label */}
      <Text
        position={[0, -0.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.18}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

// ===================== Grid Floor =====================
function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[12, 8]} />
      <meshStandardMaterial
        color="#1e1e2e"
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

// ===================== Floating Orb (Decorative) =====================
function FloatingOrb({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.15;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// ===================== Main Scene =====================
export default function Dashboard3DScene({
  departmentData,
  monthlyData,
}: Dashboard3DSceneProps) {
  // Normalize data for bar heights
  const maxDeptCount = Math.max(...departmentData.map((d) => d.count), 1);
  const maxPayroll = Math.max(...monthlyData.map((d) => d.totalPaid), 1);

  return (
    <Canvas
      camera={{ position: [5, 4, 5], fov: 50 }}
      style={{ background: "transparent" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1} castShadow />
      <pointLight position={[-3, 5, -3]} intensity={0.5} color="#60a5fa" />
      <pointLight position={[3, 5, 3]} intensity={0.3} color="#a78bfa" />

      {/* Grid */}
      <GridFloor />
      <gridHelper args={[12, 12, "#334155", "#1e293b"]} position={[0, 0, 0]} />

      {/* Department Bars (left side) */}
      <group position={[-3, 0, 0]}>
        <Text
          position={[0, 3, 0]}
          fontSize={0.25}
          color="#60a5fa"
          anchorX="center"
        >
          Departments
        </Text>
        {departmentData.map((dept, i) => (
          <Bar
            key={dept.department}
            position={[i * 1, 0, 0]}
            height={(dept.count / maxDeptCount) * 2.5}
            color={dept.color}
            label={dept.department.slice(0, 4).toUpperCase()}
          />
        ))}
      </group>

      {/* Monthly Payroll Bars (right side) */}
      <group position={[-2, 0, 3]}>
        <Text
          position={[2.5, 3, 0]}
          fontSize={0.25}
          color="#a78bfa"
          anchorX="center"
        >
          Monthly Trend
        </Text>
        {monthlyData.map((item, i) => (
          <Bar
            key={item.month}
            position={[i * 1, 0, 0]}
            height={(item.totalPaid / maxPayroll) * 2.5}
            color={`hsl(${250 + i * 15}, 70%, 60%)`}
            label={item.month}
          />
        ))}
      </group>

      {/* Decorative floating orbs */}
      <FloatingOrb position={[-4, 2, -2]} color="#60a5fa" />
      <FloatingOrb position={[4, 1.5, -1]} color="#a78bfa" />
      <FloatingOrb position={[0, 3, 2]} color="#34d399" />
      <FloatingOrb position={[2, 2.5, -3]} color="#f472b6" />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={3}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
