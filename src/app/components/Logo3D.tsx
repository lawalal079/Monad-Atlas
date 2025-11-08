"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Group } from "three";

function Model({ url }: { url: string }) {
  const group = useRef<Group>(null);
  // Drei caches models by URL
  const gltf = useGLTF(url);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.4; // slow continuous spin
    }
  });

  return <primitive ref={group} object={(gltf as any).scene} />;
}

export default function Logo3D({
  url = "/Monad.glb",
  ambientIntensity = 0.6,
  dirIntensity = 0.8,
  stageIntensity = 0.5,
}: {
  url?: string;
  ambientIntensity?: number;
  dirIntensity?: number;
  stageIntensity?: number;
}) {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 40 }}
        className="[transform:translateZ(0)]"
      >
        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[2, 2, 2]} intensity={dirIntensity} />
        <Suspense fallback={null}>
          {/* Stage adds soft AO without gradients; keep it subtle */}
          <Stage intensity={stageIntensity} environment={null} shadows={false}>
            <Model url={url} />
          </Stage>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/Monad.glb");
