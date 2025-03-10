import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useState } from "react";

function App() {
  const [currentAnimation, setCurrentAnimation] = useState("Idle");

  return (
    <>
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 100 }}>
        <button
          onClick={() => setCurrentAnimation("Bow")}
          style={{ marginRight: 10 }}
        >
          Bow
        </button>
        <button onClick={() => setCurrentAnimation("Walk")}>Walk</button>
      </div>

      <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience
          currentAnimation={currentAnimation}
          setAnimation={setCurrentAnimation}
        />
      </Canvas>
    </>
  );
}

export default App;
