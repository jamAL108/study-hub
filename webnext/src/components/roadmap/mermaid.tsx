'use client'
import React, { useEffect } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
  theme: "dark",
  securityLevel: "loose",
  // fontFamily: "Fira Code"
});

export const Mermaid=({chart}:any)=>{
    useEffect(()=>{
        mermaid.contentLoaded();
    },[])
    return <div className="mermaid w-[min(100vw,900px)] max-w-[100vw] h-[450px]">{chart}</div>;
}
