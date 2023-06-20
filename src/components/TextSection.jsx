import { Text } from "@react-three/drei";
import { fadeOnBeforeCompileFlat } from "../utils/fadeMaterial";

export const TextSection = ({ title, subtitle, ...props }) => (
  <group {...props}>
    {title && (
      <Text
        color="white"
        anchorX="left"
        anchorY="bottom"
        fontSize={0.5}
        maxWidth={2.5}
        lineHeight={1}
        font="/fonts/MADEMountain-Regular.woff"
      >
        {title}
        <meshStandardMaterial onBeforeCompile={fadeOnBeforeCompileFlat} />
      </Text>
    )}
    <Text
      color="white"
      anchorX="left"
      anchorY="top"
      position-y={-0.1}
      fontSize={0.25}
      maxWidth={2.5}
    >
      {subtitle}
      <meshStandardMaterial onBeforeCompile={fadeOnBeforeCompileFlat} />
    </Text>
  </group>
);
