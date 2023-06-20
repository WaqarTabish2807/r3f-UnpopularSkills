import React, { useRef } from "react";
import { useGLTF, Instances, Instance } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { fadeOnBeforeCompile } from "../utils/fadeMaterial";

export function Clouds({ sceneOpacity, data }) {
  const { nodes } = useGLTF("/models/cloud/model.glb");
  const ref = useRef();

  useFrame(() => {
    ref.current.opacity = sceneOpacity.current;
  });

  return (
    <Instances geometry={nodes.Mball001.geometry}>
      <meshStandardMaterial
        onBeforeCompile={fadeOnBeforeCompile}
        envMapIntensity={2}
        transparent
        ref={ref}
      />
      {data.map((props, i) => (
        <Cloud key={i} {...props} />
      ))}
    </Instances>
  );
}

function Cloud({ sceneOpacity, ...props }) {
  return (
    <group {...props}>
      <Instance />
    </group>
  );
}

useGLTF.preload("/models/cloud/model.glb");
