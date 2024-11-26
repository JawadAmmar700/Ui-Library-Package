import React from "react";
import { Card } from "@/components/ui/card";
import TypeWriter from "../re-uc/type-writer";

const TypewriterShowcase = () => {
  return (
    <div className="min-h-screen bg-background p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {/* Classic Terminal */}
      <Card className="p-6 bg-black">
        <h2 className="text-green-500 mb-4 font-mono">Classic Terminal</h2>
        <TypeWriter
          text="echo 'Hello, Terminal World!'"
          loop={true}
          animationDuration={100}
          TextStyle="font-mono text-green-500"
          cursorStyle="bg-green-500"
        />
      </Card>

      {/* Modern Code Editor */}
      <Card className="p-6 bg-[#1e1e1e]">
        <h2 className="text-blue-400 mb-4 font-mono">Modern Code Editor</h2>
        <TypeWriter
          text="const greeting = 'Welcome to the future';"
          loop={false}
          animationDuration={80}
          TextStyle="font-mono text-blue-400"
          cursorStyle="bg-blue-400"
        />
      </Card>

      {/* Elegant Headlines */}
      <Card className="p-6">
        <h2 className="text-foreground mb-4">Elegant Headlines</h2>
        <TypeWriter
          text="Crafting Digital Experiences"
          loop={false}
          animationDuration={120}
          TextStyle="font-serif text-3xl font-light text-black"
          cursorStyle="h-8 bg-primary"
        />
      </Card>

      {/* Cyberpunk Style */}
      <Card className="p-6 bg-purple-900">
        <h2 className="text-pink-500 mb-4">Cyberpunk</h2>
        <TypeWriter
          text="SYSTEM.INITIALIZE()"
          loop={true}
          animationDuration={90}
          TextStyle="font-mono text-pink-500 tracking-wider"
          cursorStyle="bg-pink-500 w-3 animate-pulse"
        />
      </Card>

      {/* Minimalist */}
      <Card className="p-6">
        <h2 className="text-foreground mb-4">Minimalist</h2>
        <TypeWriter
          text="Less is more."
          loop={false}
          animationDuration={150}
          TextStyle="font-sans text-xl tracking-wide text-black"
          cursorStyle="w-1 h-5"
        />
      </Card>

      {/* Handwriting Style */}
      <Card className="p-6 bg-amber-50 dark:bg-amber-900">
        <h2 className="text-foreground mb-4">Handwriting</h2>
        <TypeWriter
          text="Dear diary..."
          loop={true}
          animationDuration={200}
          TextStyle="font-['Segoe_Script'] text-2xl text-amber-800 dark:text-amber-200"
          cursorStyle="bg-amber-800 dark:bg-amber-200"
        />
      </Card>
    </div>
  );
};

export default TypewriterShowcase;
