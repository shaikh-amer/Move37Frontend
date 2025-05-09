"use client";
import React from "react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

export function Loader({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <MultiStepLoader
        loadingStates={[
          {
            text: "Initializing",
            title: "Step 1: Initializing",
            status: "loading",
          },
          {
            text: "Processing",
            title: "Step 2: Processing",
            status: "loading",
          },
          {
            text: "Finalizing",
            title: "Step 3: Finalizing",
            status: "completed",
          },
        ]}
        loading={true}
        duration={3000}
        loop={false}
      />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
