"use client";

import { useState } from "react";
import { Window } from "./components/window";

export default function Home() {
  const [number1, setNumber1] = useState<number>(0);
  const [number2, setNumber2] = useState<number>(0);

  return (
    <div>
      <Window>
        <p><strong>Contador(1): {number1}</strong></p>
        <button onClick={() => setNumber1(number1 + 1)}>Incrementar 1</button>
        <p><strong>Contador(2): {number2}</strong></p>
        <button onClick={() => setNumber2(number2 + 1)}>Incrementar 2</button>
      </Window>
    </div>
  );
}