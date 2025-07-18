"use client";

import { useEffect, useState } from "react";

export default function Membros() {
  const [number1, setNumber1] = useState<number>(0);
  const [number2, setNumber2] = useState<number>(0);
  const [members, setMembers] = useState<any>();

  useEffect(() => {
    fetch("https://api-petsimc.facom.ufu.br/member")
      .then(data => data.json())
      .then(data => setMembers(data.data.members));
  }, []);

  return (
    <article>
      <section>
        <p><strong>Contador(1): {number1}</strong></p>
        <button onClick={() => setNumber1(number1 + 1)}>Incrementar 1</button>
        <p><strong>Contador(2): {number2}</strong></p>
        <button onClick={() => setNumber2(number2 + 1)}>Incrementar 2</button>

        <h1>Membros</h1> 
        {
          members && members.map((m, i) => (
            <div key={i}>
              {m.name} - {m.email} - {m.matricula}
              <img src={"data:image/jpeg;base64, " + m.photo} alt={m.name} width="50" height="50" />
            </div>)
          )
        }
      </section>
    </article>
  );
}