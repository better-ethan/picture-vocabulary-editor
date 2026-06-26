import {
  type Engine,
  type OutputFormat,
  type VoiceId,
  type LanguageCode,
  PollyClient,
  SynthesizeSpeechCommand,
} from "@aws-sdk/client-polly";
import { createHash } from "node:crypto";

const polly = new PollyClient({
  region: process.env.AWS_REGION,
});

export const voiceConfig = {
  voice: "Joanna",
  engine: "standard",
  locale: "en-US",
};

export const generateSsmlText = (text: string) => {
  return `<speak>
    <prosody volume="+6dB" rate="85%">
      ${text}
    </prosody>
  </speak>`;
};

export async function text2Speech({
  text,
  format = "mp3",
  voiceId = voiceConfig.voice as VoiceId,
  engine = voiceConfig.engine as Engine,
  languageCode = voiceConfig.locale as LanguageCode,
}: {
  text: string;
  format?: OutputFormat;
  voiceId?: VoiceId;
  engine?: Engine;
  languageCode?: LanguageCode;
}) {
  const ssmlText = generateSsmlText(text);

  const command = new SynthesizeSpeechCommand({
    Text: ssmlText,
    OutputFormat: format,
    VoiceId: voiceId,
    Engine: engine,
    LanguageCode: languageCode,
    TextType: "ssml",
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

export const generateHash = ({
  text,
  locale = voiceConfig.locale,
  voice = voiceConfig.voice,
  engine = voiceConfig.engine,
}: {
  text: string;
  locale?: string;
  voice?: string;
  engine?: string;
}) => {
  const input = [locale, voice, engine, text].join("|");

  return createHash("sha256").update(input).digest("hex").slice(0, 32);
};
