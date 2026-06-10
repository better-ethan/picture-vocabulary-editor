import {
  type Engine,
  type OutputFormat,
  type VoiceId,
  PollyClient,
  SynthesizeSpeechCommand,
} from "@aws-sdk/client-polly";

const polly = new PollyClient({
  region: process.env.AWS_REGION,
});

export async function text2Speech({
  text,
  format = "mp3",
  voiceId = "Joanna",
  engine = "standard",
}: {
  text: string;
  format?: OutputFormat;
  voiceId?: VoiceId;
  engine?: Engine;
}) {
  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: format,
    VoiceId: voiceId,
    Engine: engine,
  });

  try {
    const response = await polly.send(command);
    if (!response.AudioStream) {
      throw new Error("No audio stream received from Polly");
    }

    const bytes = await response.AudioStream.transformToByteArray();

    return bytes;
  } catch (err) {
    console.error("Error synthesizing speech:", err);
    throw err;
  }
}
