"use client";

import { useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

type SignaturePadProps = {
  name: string;
};

export function SignaturePad({ name }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [signature, setSignature] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    const { x, y } = point(event);
    context.beginPath();
    context.moveTo(x, y);
    context.lineWidth = 3;
    context.lineCap = "round";
    context.strokeStyle = "#17211b";
    setIsDrawing(true);
  }

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const { x, y } = point(event);
    context.lineTo(x, y);
    context.stroke();
    setSignature(canvas.toDataURL("image/png"));
  }

  function stop() {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) setSignature(canvas.toDataURL("image/png"));
  }

  function clear() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
  }

  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={signature} />
      <canvas
        ref={canvasRef}
        width={900}
        height={260}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={stop}
        onPointerCancel={stop}
        className="h-44 w-full touch-none rounded-md border border-slate-300 bg-white"
      />
      <button type="button" onClick={clear} className="focus-ring inline-flex min-h-10 w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Zurücksetzen
      </button>
    </div>
  );
}
