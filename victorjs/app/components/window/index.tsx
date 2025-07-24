"use client";

import Image from "next/image"
import { MouseEventHandler, useState } from "react"

type WindowProps = {
  children: React.ReactNode
  onclose?: MouseEventHandler<HTMLButtonElement>
}

export const Window = (props: WindowProps) => {
  const [closed, setClosed] = useState<boolean>(false);
  const [minimized, setMinimized] = useState<boolean>(false);

  return (
    <div className={"border-w95-grey border-8 border-solid w-fit h-fit transition-all duration-500 " + (closed ? "opacity-0 -z-50" : "")}>
      <div className="border-w95-grey border-solid w-full h-6 bg-w95-blue flex items-center justify-end gap-2 pl-10 pr-1">
        <button className="flex items-center bg-w95-grey hover:bg-w95-dark-grey h-fit w-fit p-0.5" onClick={() => setMinimized(true)}>
          <div className="border-b border-solid border-black h-3 w-3"></div>
        </button>
        <button className="flex items-center bg-w95-grey hover:bg-w95-dark-grey h-fit w-fit p-0.5" onClick={() => setMinimized(false)}>
          <div className="border border-solid border-black h-3 w-3"></div>
        </button>
        <button className="bg-w95-grey hover:bg-w95-dark-grey h-4 w-4 flex items-center p-0.5" onClick={props.onclose ? props.onclose : () => setClosed(true)}>
          <Image
            src="/assets/x_icon.svg"
            alt="X"
            width={16}
            height={16}
            style={{ height: "auto", width: "auto" }}
          />
        </button>
      </div>
      <div className={"bg-white transition-all" + ((minimized || closed) ? " hidden" : "")}>
        {props.children}
      </div>
    </div>
  )
}