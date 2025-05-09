"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Video } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface ScriptDisplayProps {
  script: string;
  onGenerateVideo: () => Promise<void>;
  isLoading: boolean;
}

export function ScriptDisplay({
  script,
  onGenerateVideo,
  isLoading,
}: ScriptDisplayProps) {
  return (
    <div className="space-y-3 lg:space-y-4">
      <Card className="border border-purple-100/50 dark:border-purple-900/50 shadow-sm bg-white/50 dark:bg-gray-900/50">
        <CardContent className="pt-4 lg:pt-6 relative">
          <div className="absolute top-2 right-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-0.5 lg:py-1 rounded-full text-xs font-medium">
            Preview
          </div>
          <Textarea
            value={script}
            readOnly
            className="min-h-[150px] lg:min-h-[200px] w-full text-sm lg:text-base rounded-lg border-purple-100/50 dark:border-purple-900/50 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all bg-white/80 dark:bg-gray-900/80 resize-none text-gray-900 dark:text-gray-100"
          />
        </CardContent>
      </Card>

      <motion.div
        className="flex items-center gap-3 lg:gap-4"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={onGenerateVideo}
          disabled={isLoading}
          className="flex-1 bg-gradient-to-br from-gray-900 to-black hover:from-gray-800 hover:bg-gradient-to-r hover:to-gray-900 text-white font-medium py-4 lg:py-6 rounded-xl transition-all text-sm lg:text-base"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 lg:h-5 lg:w-5 animate-spin" />
              Generating Preview...
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
              Continue to Scene Editor
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
