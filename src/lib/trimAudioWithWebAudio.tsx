// src/utils/trimAudio.ts
import audioBufferToWav from "audiobuffer-to-wav";

export const trimAudioWithWebAudio = async (
  audioUrl: string,
  duration: number,
): Promise<string> => {
  // Fetch the audio file
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();

  // Create an AudioContext to decode the audio
  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  // Calculate the number of samples corresponding to the desired duration
  const sampleRate = audioBuffer.sampleRate;
  const newLength = Math.min(
    audioBuffer.length,
    Math.floor(duration * sampleRate),
  );

  // Create a new AudioBuffer with the trimmed length
  const trimmedBuffer = audioCtx.createBuffer(
    audioBuffer.numberOfChannels,
    newLength,
    sampleRate,
  );

  // Copy the audio data from each channel
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel).slice(0, newLength);
    trimmedBuffer.copyToChannel(channelData, channel, 0);
  }

  // Convert the trimmed AudioBuffer to a WAV ArrayBuffer
  const wavArrayBuffer = audioBufferToWav(trimmedBuffer);

  // Create a Blob from the WAV data and generate an object URL
  const blob = new Blob([wavArrayBuffer], { type: "audio/wav" });
  const trimmedUrl = URL.createObjectURL(blob);

  return trimmedUrl;
};
