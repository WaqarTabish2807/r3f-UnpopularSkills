import { useProgress } from "@react-three/drei";
import { usePlay } from "../contexts/Play";

export const Overlay = () => {
  const { progress } = useProgress();
  const state = usePlay();
  const setPlay = usePlay((state) => state.setPlay);
  return (
    <div
      className={`overlay ${state.play ? "overlay--disable" : ""}
    ${state.hasScroll ? "overlay--scrolled" : ""}`}
    >
      <div
        className={`loader ${progress === 100 ? "loader--disappear" : ""}`}
      />
      {progress === 100 && (
        <div className={`intro ${state.play ? "intro--disappear" : ""}`}>
          <h1 className="logo">Unpopular Skills.</h1>
          <p className="intro__scroll">Scroll slowly to see what all I can do.</p>
          <button className="explore" onClick={setPlay}>
            Explore
          </button>
        </div>
      )}
      <div className={`outro ${state.end ? "outro--appear" : ""}`}>
        <p className="outro__text">
          A lot to take, right? <br /> Lmk what else can I learn.
        </p>
      </div>
    </div>
  );
};
