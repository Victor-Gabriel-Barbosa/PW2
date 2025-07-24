"use client";

import { useEffect, useState } from "react";
import { Window } from "../components/window";

type Member = {
  name: string;
  photo: string;
  matricula?: string;
  email?: string;
}

export default function Membros() {
  const [members, setMembers] = useState<Member[]>();

  useEffect(() => {
    fetch("https://api-petsimc.facom.ufu.br/member")
      .then(data => data.json())
      .then(data => setMembers(data.data.members));
  }, []);

  return (
    <div className="w-full flex justify-center p-4">
      <Window>
        <div className="font-ps2p text-center py-4">
          <h1 className="text-3xl">Membros</h1>
          <h1 className="text-xl text-w95-dark-grey">Membros Atuais do PET</h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mx-4">
          {
            members && members.map((m, i) => (
              <div key={i}>
                <img className="rounded-lg shadow-md w-40 h-40 border-4 border-w95-blue" src={"data:image/jpeg;base64 ," + m.photo} alt={m.name} />
                <p>{m.name}</p>
                {m.matricula && <p className="text-sm text-w95-dark-grey">Matrícula: {m.matricula}</p>}
                {m.email && <p className="text-sm text-w95-dark-grey">Email: {m.email}</p>}
              </div>)
            )
          }
        </div>
      </Window>
    </div>
  );
}