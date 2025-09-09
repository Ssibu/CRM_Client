
import React, { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

const ReadAloudButton = ({ text }) => {
  const { speak, cancel, speaking } = useSpeechSynthesis();
  const [isReading, setIsReading] = useState(false);

  const handleToggle = () => {
    if (isReading) {
      cancel();
      setIsReading(false);
    } else {
      speak({ text });
      setIsReading(true);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="text-green-600 hover:underline font-medium"
    >
      {isReading ? "Stop Reading" : "Read Aloud"}
    </button>
  );
};

export default ReadAloudButton;
