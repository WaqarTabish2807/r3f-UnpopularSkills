import { Float, PerspectiveCamera, useScroll } from "@react-three/drei";
import { gsap } from "gsap";
import { Airplane } from "./Airplane";
import { Clouds } from "./Cloud";
import { Background } from "./Background";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { TextSection } from "./TextSection";
import { Speed } from "./Speed";
import { usePlay } from "../contexts/Play";
import { fadeOnBeforeCompile } from "../utils/fadeMaterial";

const NUM_POINTS_LINE = 1000;
const CURVE_DISTANCE = 180;
const CURVE_AHEAD_CAMERA = 0.008;
const CURVE_AHEAD_AIRPLANE = 0.02;
const AIRPLANE_MAX_ANGLE = 35;
const FRICTION_DISTANCE = 80;

// const randomVector = (p, r) =>
//   new THREE.Vector3(
//     p.x + (r / 2 - Math.random() * r),
//     p.y + (r / 4 - Math.random() * r),
//     p.z + (r / 2 - Math.random() * r)
//   );
const randomEuler = () =>
  new THREE.Euler(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
const randomScalarVector = (s) => {
  const scale = Math.max(s - Math.random() * 2, 1);
  return new THREE.Vector3(scale, scale, scale);
};

export const Experience = () => {
  const curvePoints = useMemo(
    () => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -CURVE_DISTANCE),
      new THREE.Vector3(80, 0, -2 * CURVE_DISTANCE),
      new THREE.Vector3(-80, 0, -3 * CURVE_DISTANCE),
      new THREE.Vector3(80, 0, -4 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
      new THREE.Vector3(20, 0, -6 * CURVE_DISTANCE),
      new THREE.Vector3(-50, 0, -7 * CURVE_DISTANCE),
      new THREE.Vector3(50, 0, -8 * CURVE_DISTANCE),
      new THREE.Vector3(-20, 0, -9 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -10 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -11 * CURVE_DISTANCE),
    ],
    []
  );

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.5),
    []
  );

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);
    return shape;
  }, [curve]);

  const textSections = useMemo(() => {
    return [
      {
        cameraRailDist: -1,
        position: new THREE.Vector3(
          curvePoints[1].x - 3,
          curvePoints[1].y,
          curvePoints[1].z
        ),
        title: "Hallo",
        subtitle: `I love trying the hardest of challenges in any genre!`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          curvePoints[2].x + 2,
          curvePoints[2].y,
          curvePoints[2].z
        ),
        title: "Pixel Painting",
        subtitle: `Have you heard of this before? I made 12330 pixel art of Eiffel Tower. `,
      },
      {
        cameraRailDist: -1,
        position: new THREE.Vector3(
          curvePoints[3].x - 3,
          curvePoints[3].y,
          curvePoints[3].z
        ),
        title: "1000 Pushups",
        subtitle: `Ouch, can you do 10 of them? I did 1000 pushup in an hour. `,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          curvePoints[4].x + 3.5,
          curvePoints[4].y,
          curvePoints[4].z - 12
        ),
        title: "Megaminx cube",
        subtitle: `I owe 12 different types of rubix cube, and can solve each of them.`,
      },
      {
        cameraRailDist: -1.5,
        position: new THREE.Vector3(
          curvePoints[5].x - 3.5,
          curvePoints[5].y,
          curvePoints[5].z
        ),
        title: "100 digits of pie",
        subtitle: `Useless. Ikr, but I still remember them.`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          curvePoints[6].x + 3,
          curvePoints[6].y,
          curvePoints[6].z
        ),
        title: "Blind 3*3 rubix cube",
        subtitle: `Unbelievable, right? I can solve the 3*3 rubix cube blindfolded.`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          curvePoints[7].x - 3,
          curvePoints[7].y,
          curvePoints[7].z
        ),
        title: "Muscle Up",
        subtitle: `Can easliy muscle up.`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          curvePoints[8].x + 3,
          curvePoints[8].y,
          curvePoints[8].z
        ),
        title: "Doomsday Algorithm",
        subtitle: `I can tell you what day of the week you were born on (without looking it up).`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          curvePoints[9].x - 3,
          curvePoints[9].y,
          curvePoints[9].z
        ),
        title: "Stack a dice",
        subtitle: `I can stack four dice in a row.`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          curvePoints[10].x + 3,
          curvePoints[10].y,
          curvePoints[10].z
        ),
        title: "Pull ups.",
        subtitle: `I can do more pull-ups than any of the my colleagues.`,
      },
    ];
  }, []);

  const clouds = useMemo(
    () => [
      // STARTING
      {
        position: new THREE.Vector3(-3.5, -3.2, -7),
      },
      {
        position: new THREE.Vector3(3.5, -4, -10),
      },
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(-18, 2, -68),
        rotation: new THREE.Euler(-Math.PI / 5, Math.PI / 6, 0),
      },
      {
        scale: new THREE.Vector3(2.5, 2.5, 2.5),
        position: new THREE.Vector3(10, -1.2, -52),
      },
      // FIRST POINT
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(
          curvePoints[1].x + 10,
          curvePoints[1].y - 4,
          curvePoints[1].z + 64
        ),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[1].x - 20,
          curvePoints[1].y + 4,
          curvePoints[1].z + 28
        ),
        rotation: new THREE.Euler(0, Math.PI / 7, 0),
      },
      {
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[1].x - 10,
          curvePoints[1].y + 4,
          curvePoints[1].z - 62
        ),
        rotation: new THREE.Euler(0, Math.PI / 7, Math.PI / 5),
      },
      {
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[1].x + 60,
          curvePoints[1].y + 2,
          curvePoints[1].z - 82
        ),
        rotation: new THREE.Euler(Math.PI / 2, Math.PI / 2, Math.PI / 3),
      },
      {
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[1].x + 8,
          curvePoints[1].y - 14,
          curvePoints[1].z - 22
        ),
      },
      // SECOND POINT
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[2].x + 6,
          curvePoints[2].y - 7,
          curvePoints[2].z + 50
        ),
      },
      {
        scale: new THREE.Vector3(2, 2, 2),
        position: new THREE.Vector3(
          curvePoints[2].x - 2,
          curvePoints[2].y + 4,
          curvePoints[2].z - 26
        ),
      },
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(
          curvePoints[2].x + 12,
          curvePoints[2].y + 1,
          curvePoints[2].z - 86
        ),
        rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 3),
      },
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(
          curvePoints[2].x - 12,
          curvePoints[2].y + 5,
          curvePoints[2].z
        ),
        rotation: new THREE.Euler(Math.PI / 10, 0, Math.PI / 4),
      },
      // THIRD POINT
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[3].x + 3,
          curvePoints[3].y - 10,
          curvePoints[3].z + 50
        ),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[3].x - 10,
          curvePoints[3].y,
          curvePoints[3].z + 30
        ),
        rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(
          curvePoints[3].x - 20,
          curvePoints[3].y - 5,
          curvePoints[3].z - 8
        ),
        rotation: new THREE.Euler(Math.PI, 0, Math.PI / 5),
      },
      {
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[3].x + 0,
          curvePoints[3].y - 5,
          curvePoints[3].z - 98
        ),
        rotation: new THREE.Euler(0, Math.PI / 3, 0),
      },
      {
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[3].x + 120,
          curvePoints[3].y - 5,
          curvePoints[3].z - 98
        ),
        rotation: new THREE.Euler(0, Math.PI / 3, 0),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[3].x + 20,
          curvePoints[3].y + 2,
          curvePoints[3].z + 20
        ),
        rotation: new THREE.Euler(0, Math.PI / 3, 0),
      },
      // FOURTH POINT
      {
        scale: new THREE.Vector3(2, 2, 2),
        position: new THREE.Vector3(
          curvePoints[4].x + 3,
          curvePoints[4].y - 10,
          curvePoints[4].z + 2
        ),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[4].x + 24,
          curvePoints[4].y - 6,
          curvePoints[4].z - 42
        ),
        rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[4].x - 4,
          curvePoints[4].y + 9,
          curvePoints[4].z - 62
        ),
        rotation: new THREE.Euler(Math.PI / 3, 0, Math.PI / 3),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[4].x - 38,
          curvePoints[4].y + 5,
          curvePoints[4].z - 80
        ),
        rotation: new THREE.Euler(Math.PI / 3, 0, Math.PI / 3),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[4].x - 4,
          curvePoints[4].y + 9,
          curvePoints[4].z + 30
        ),
        rotation: new THREE.Euler(Math.PI / 3, 0, Math.PI / 3),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[4].x - 14,
          curvePoints[4].y - 4,
          curvePoints[4].z
        ),
        rotation: new THREE.Euler(Math.PI / 8, 0, 0),
      },
      // FIFTH POINT
      {
        scale: new THREE.Vector3(2, 2, 2),
        position: new THREE.Vector3(
          curvePoints[5].x + 3,
          curvePoints[5].y - 10,
          curvePoints[5].z + 2
        ),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[5].x - 24,
          curvePoints[5].y - 3,
          curvePoints[5].z - 42
        ),
        rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[5].x - 4,
          curvePoints[5].y + 9,
          curvePoints[5].z - 62
        ),
        rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 2),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[5].x - 8,
          curvePoints[5].y + 5,
          curvePoints[5].z + 10
        ),
        rotation: new THREE.Euler(-Math.PI / 4, 0, Math.PI / 2),
      },
      {
        scale: new THREE.Vector3(2, 2, 2),
        position: new THREE.Vector3(
          curvePoints[5].x + 5,
          curvePoints[5].y - 3,
          curvePoints[5].z - 8
        ),
        rotation: new THREE.Euler(Math.PI / 8, Math.PI / 3, 0),
      },
      // SIXTH POINT
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(
          curvePoints[6].x + 10,
          curvePoints[6].y - 4,
          curvePoints[6].z + 64
        ),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[6].x - 20,
          curvePoints[6].y + 4,
          curvePoints[6].z + 28
        ),
        rotation: new THREE.Euler(0, Math.PI / 7, 0),
      },
      {
        rotation: new THREE.Euler(0, Math.PI / 7, Math.PI / 5),
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[6].x - 40,
          curvePoints[6].y + 4,
          curvePoints[6].z - 62
        ),
      },
      {
        rotation: new THREE.Euler(Math.PI / 2, Math.PI / 2, Math.PI / 3),
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[6].x + 34,
          curvePoints[6].y + 2,
          curvePoints[6].z - 82
        ),
      },
      {
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[6].x + 8,
          curvePoints[6].y - 14,
          curvePoints[6].z - 22
        ),
      },
      // SEVENTH POINT
      {
        scale: randomScalarVector(3),
        position: new THREE.Vector3(
          curvePoints[7].x + 3,
          curvePoints[7].y - 10,
          curvePoints[7].z + 50
        ),
        rotation: randomEuler(),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[7].x - 10,
          curvePoints[7].y,
          curvePoints[7].z + 30
        ),
        rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(
          curvePoints[7].x - 20,
          curvePoints[7].y - 5,
          curvePoints[7].z - 8
        ),
        rotation: new THREE.Euler(Math.PI, 0, Math.PI / 5),
      },
      {
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[7].x + 0,
          curvePoints[7].y - 5,
          curvePoints[7].z - 98
        ),
        rotation: new THREE.Euler(0, Math.PI / 3, 0),
      },
      {
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[7].x + 120,
          curvePoints[7].y - 5,
          curvePoints[7].z - 98
        ),
        rotation: new THREE.Euler(0, Math.PI / 3, 0),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[7].x + 20,
          curvePoints[7].y + 2,
          curvePoints[7].z + 20
        ),
        rotation: new THREE.Euler(0, Math.PI / 3, 0),
      },
      // EIGTH POINT
      {
        scale: new THREE.Vector3(2, 2, 2),
        position: new THREE.Vector3(
          curvePoints[8].x + 3,
          curvePoints[8].y - 10,
          curvePoints[8].z + 2
        ),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[8].x + 24,
          curvePoints[8].y - 6,
          curvePoints[8].z - 42
        ),
        rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[8].x - 4,
          curvePoints[8].y + 9,
          curvePoints[8].z - 62
        ),
        rotation: new THREE.Euler(Math.PI / 3, 0, Math.PI / 3),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[8].x - 38,
          curvePoints[8].y + 5,
          curvePoints[8].z - 80
        ),
        rotation: new THREE.Euler(Math.PI / 3, 0, Math.PI / 3),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[8].x - 4,
          curvePoints[8].y + 9,
          curvePoints[8].z + 30
        ),
        rotation: new THREE.Euler(Math.PI / 3, 0, Math.PI / 3),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[8].x - 14,
          curvePoints[8].y - 4,
          curvePoints[8].z
        ),
        rotation: new THREE.Euler(Math.PI / 8, 0, 0),
      },
      // NINETH POINT
      {
        scale: new THREE.Vector3(2, 2, 2),
        position: new THREE.Vector3(
          curvePoints[9].x + 3,
          curvePoints[9].y - 10,
          curvePoints[9].z + 2
        ),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[9].x - 24,
          curvePoints[9].y - 3,
          curvePoints[9].z - 42
        ),
        rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[9].x - 4,
          curvePoints[9].y + 9,
          curvePoints[9].z - 62
        ),
        rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 2),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[9].x - 8,
          curvePoints[9].y + 5,
          curvePoints[9].z + 10
        ),
        rotation: new THREE.Euler(-Math.PI / 4, 0, Math.PI / 2),
      },
      {
        scale: new THREE.Vector3(2, 2, 2),
        position: new THREE.Vector3(
          curvePoints[9].x + 5,
          curvePoints[9].y - 3,
          curvePoints[9].z - 8
        ),
        rotation: new THREE.Euler(Math.PI / 8, Math.PI / 3, 0),
      },
      // TENTH POINT
      {
        scale: new THREE.Vector3(4, 4, 4),
        position: new THREE.Vector3(
          curvePoints[10].x + 10,
          curvePoints[10].y - 4,
          curvePoints[10].z + 64
        ),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[10].x - 20,
          curvePoints[10].y + 4,
          curvePoints[10].z + 28
        ),
        rotation: new THREE.Euler(0, Math.PI / 7, 0),
      },
      {
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[10].x - 40,
          curvePoints[10].y + 4,
          curvePoints[10].z - 62
        ),
        rotation: randomEuler(),
      },
      {
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[10].x + 34,
          curvePoints[10].y + 2,
          curvePoints[10].z - 82
        ),
        rotation: randomEuler(),
      },
      {
        scale: new THREE.Vector3(5, 5, 5),
        position: new THREE.Vector3(
          curvePoints[10].x + 8,
          curvePoints[10].y - 14,
          curvePoints[10].z - 22
        ),
      },
      // FINAL
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[11].x + 12,
          curvePoints[11].y - 5,
          curvePoints[11].z + 60
        ),
        rotation: new THREE.Euler(-Math.PI / 4, -Math.PI / 6, 0),
      },
      {
        scale: new THREE.Vector3(3, 3, 3),
        position: new THREE.Vector3(
          curvePoints[11].x - 12,
          curvePoints[11].y + 5,
          curvePoints[11].z + 120
        ),
        rotation: new THREE.Euler(Math.PI / 4, Math.PI / 6, 0),
      },
    ],
    []
  );

  console.log(clouds);

  const sceneOpacity = useRef(0);
  const lineMaterialRef = useRef();

  const cameraGroup = useRef();
  const cameraRail = useRef();
  // const camera = useRef();
  const airplane = useRef();

  const scroll = useScroll();
  const lastScroll = useRef(0);

  const tl = useRef();
  const planeInTl = useRef();
  const planeOutTl = useRef();

  const state = usePlay();

  useFrame((_state, delta) => {
    // Adjust camera settings based on device
    // if (window.innerWidth > window.innerHeight) {
    //   // Landscape
    //   camera.current.fov = 30;
    //   camera.current.position.z = 5;
    // } else {
    //   // Portrait
    //   camera.current.fov = 80;
    //   camera.current.position.z = 2;
    // }
    // console.log(camera.current);

    if (lastScroll.current <= 0 && scroll.offset > 0) {
      state.setHasScroll();
    }

    // Fade in scene
    if (state.play && !state.end && sceneOpacity.current < 1) {
      sceneOpacity.current = THREE.MathUtils.lerp(
        sceneOpacity.current,
        1,
        delta * 0.1
      );
    }

    // Fade out scene
    if (state.end && sceneOpacity.current > 0) {
      sceneOpacity.current = THREE.MathUtils.lerp(
        sceneOpacity.current,
        0,
        delta
      );
    }

    lineMaterialRef.current.opacity = sceneOpacity.current;

    if (state.end) {
      return;
    }

    const scrollOffset = Math.max(0, scroll.offset);

    // Look to close text sections
    let friction = 1;
    let resetCameraRail = true;
    textSections.forEach((textSection) => {
      const distance = textSection.position.distanceTo(
        cameraGroup.current.position
      );

      if (distance < FRICTION_DISTANCE) {
        friction = Math.max(distance / FRICTION_DISTANCE, 0.1);
        const targetCameraRailPosition = new THREE.Vector3(
          (1 - distance / FRICTION_DISTANCE) * textSection.cameraRailDist,
          0,
          0
        );
        cameraRail.current.position.lerp(targetCameraRailPosition, delta);
        resetCameraRail = false;
      }
    });
    if (resetCameraRail) {
      const targetCameraRailPosition = new THREE.Vector3(0, 0, 0);
      cameraRail.current.position.lerp(targetCameraRailPosition, delta);
    }

    // Calculate lerped scroll offset
    let lerpedScrollOffset = THREE.MathUtils.lerp(
      lastScroll.current,
      scrollOffset,
      delta * friction
    );
    // Protect below 0 and above 1
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);

    lastScroll.current = lerpedScrollOffset;
    tl.current.seek(lerpedScrollOffset * tl.current.duration());

    // Follow the curve points
    const curPoint = curve.getPoint(lerpedScrollOffset);
    cameraGroup.current.position.lerp(curPoint, delta * 24);

    // Make the group look ahead on the curve
    const lookAtPoint = curve.getPoint(
      Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1)
    );

    const currentLookAt = cameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    );
    const targetLookAt = new THREE.Vector3()
      .subVectors(curPoint, lookAtPoint)
      .normalize();
    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
    cameraGroup.current.lookAt(
      cameraGroup.current.position.clone().add(lookAt)
    );

    // Airplane rotation
    const tangent = curve.getTangent(lerpedScrollOffset + CURVE_AHEAD_AIRPLANE);

    const nonLerpLookAt = new THREE.Group();
    nonLerpLookAt.position.copy(curPoint);
    nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));

    tangent.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -nonLerpLookAt.rotation.y
    );

    let angle = Math.atan2(-tangent.z, tangent.x);
    angle = -Math.PI / 2 + angle;

    let angleDegrees = (angle * 180) / Math.PI;
    angleDegrees *= 2.4; // stronger angle

    // Limit plane angle
    if (angleDegrees < 0) {
      angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE);
    }
    if (angleDegrees > 0) {
      angleDegrees = Math.min(angleDegrees, AIRPLANE_MAX_ANGLE);
    }

    // Set back angle
    angle = (angleDegrees * Math.PI) / 180;

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angle
      )
    );
    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);

    // Play flying out animation if at the end.
    if (
      cameraGroup.current.position.z <
      curvePoints[curvePoints.length - 1].z + 100
    ) {
      state.setEnd();
      planeOutTl.current.play();
    }
  });

  const backgroundColors = useRef({
    colorA: "#357ca1",
    colorB: "white",
  });

  useLayoutEffect(() => {
    // Background Timeline
    tl.current = gsap.timeline();
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#357ca1",
      colorB: "#FCF1C8",
    });
    tl.current.to(backgroundColors.current, {
      duration: 0.5,
      colorA: "#0608BA",
      colorB: "#F1E1DC",
    });
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#5061D5",
      colorB: "#F4BE97",
    });
    tl.current.pause();

    // Plane entering timeline
    planeInTl.current = gsap.timeline();
    planeInTl.current.pause();
    planeInTl.current.from(airplane.current.position, {
      duration: 3,
      z: 5,
      y: -2,
    });

    // Plane leaving timeline
    planeOutTl.current = gsap.timeline();
    planeOutTl.current.pause();

    planeOutTl.current.to(
      airplane.current.position,
      {
        duration: 10,
        z: -250,
        y: 10,
      },
      0
    );
    planeOutTl.current.to(
      cameraRail.current.position,
      {
        duration: 8,
        y: 12,
      },
      0
    );
    planeOutTl.current.to(airplane.current.position, {
      duration: 1,
      z: -1000,
    });
  }, []);

  useEffect(() => {
    if (state.play) {
      planeInTl.current.play();
    }
  }, [state.play]);

  return useMemo(
    () => (
      <>
        <directionalLight position={[0, 3, 1]} intensity={0.1} />
        <group ref={cameraGroup}>
          <Background backgroundColors={backgroundColors} />
          <Speed />
          <group ref={cameraRail}>
            <PerspectiveCamera
              // ref={camera}
              position={[0, 0, 5]}
              fov={30}
              makeDefault
            />
          </group>
          <group ref={airplane}>
            <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
              <Airplane
                rotation-y={Math.PI / 2}
                scale={[0.2, 0.2, 0.2]}
                position-y={0.1}
              />
            </Float>
          </group>
        </group>

        {/* TEXT */}
        {textSections.map((textSections, index) => (
          <TextSection {...textSections} key={index} />
        ))}

        {/* LINE */}
        <group position-y={-2}>
          <mesh>
            <extrudeGeometry
              args={[
                shape,
                {
                  steps: NUM_POINTS_LINE,
                  bevelEnabled: false,
                  extrudePath: curve,
                },
              ]}
            />
            <meshStandardMaterial
              color="white"
              ref={lineMaterialRef}
              transparent
              envMapIntensity={2}
              onBeforeCompile={fadeOnBeforeCompile}
            />
          </mesh>
        </group>

        {/* CLOUDS */}
        <Clouds sceneOpacity={sceneOpacity} data={clouds} />
      </>
    ),
    []
  );
};
