"use client";
import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";

interface InputFormProps {
  onGenerateScript: (input: string) => Promise<void>;
  isLoading: boolean;
}

export function InputForm({ onGenerateScript, isLoading }: InputFormProps) {
  const [userInput, setUserInput] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onGenerateScript(userInput);
  };

  return (
    <Card className="border-2 border-gray-100 dark:border-gray-700 shadow-lg dark:bg-gray-950">
      <CardContent className="pt-6">
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
              Enter Your Video Idea
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Describe your video concept and let AI do the magic
            </p>
          </div>

          <Input
            placeholder="E.g., Create a promotional video for a new tech startup..."
            value={userInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUserInput(e.target.value)
            }
            disabled={isLoading}
            className="w-full text-base p-4 rounded-xl border-2 border-gray-100 dark:border-gray-900 focus:border-gray-300 dark:focus:border-gray-500 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 transition-all dark:bg-white/10 dark:text-white"
          />

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="w-full bg-gradient-to-br from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 dark:bg-gradient-to-r dark:from-purple-800 dark:to-pink-900 dark:hover:from-gray-500 dark:hover:to-gray-900 text-white font-medium py-6 rounded-xl transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Script...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Script
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </CardContent>
    </Card>
  );
}
