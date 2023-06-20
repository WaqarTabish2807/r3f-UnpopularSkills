import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { ScrollControls } from "@react-three/drei";
// import { EffectComposer, Noise } from "@react-three/postprocessing";
import { Overlay } from "./components/Overlay";
import { usePlay } from "./contexts/Play";
// import { Perf } from "r3f-perf";

function App() {
  const play = usePlay((state) => state.play);
  const end = usePlay((state) => state.end);
  return (
    <>
      <Canvas>
        {/* <Perf /> */}
        <color attach="background" args={["#ececec"]} />
        <ScrollControls
          pages={play && !end ? 20 : 0}
          damping={0.5}
          style={{
            top: "10px",
            left: "0px",
            bottom: "10px",
            right: "10px",
            width: "auto",
            height: "auto",
            animation: "fadeIn 2.4s ease-in-out 1.2s forwards",
            opacity: 0,
          }}
        >
          <Experience />
        </ScrollControls>
        {/* <EffectComposer>
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} />
        </EffectComposer> */}
      </Canvas>
      <Overlay />
    </>
  );
}

export default App;
