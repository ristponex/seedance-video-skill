#!/usr/bin/env bun

/**
 * Seedance Video CLI — Generate videos using Seedance (ByteDance) via Atlas Cloud API
 *
 * Usage:
 *   seedance-video "prompt" [options]
 *
 * Options:
 *   --model        Model variant (default: bytedance/seedance-v1.5-pro/text-to-video)
 *   --mode         Generation mode: t2v, i2v (default: t2v)
 *   --duration     Video duration in seconds: 5, 10, 15 (default: 5)
 *   --resolution   Output resolution: 360p, 480p, 720p, 1080p (default: 1080p)
 *   --aspect-ratio Aspect ratio: 16:9, 9:16, 1:1, 4:3, 3:4 (default: 16:9)
 *   --seed         Random seed for reproducible results
 *   --audio        Enable native audio generation (default: false)
 *   --image        Input image path for i2v mode
 *   --output       Output file path (default: ./output/{timestamp}.mp4)
 *   --help         Show help message
 */

const API_BASE = "https://api.atlascloud.ai/api/v1/model/prediction";
const DEFAULT_MODEL = "bytedance/seedance-v1.5-pro/text-to-video";
const POLL_INTERVAL = 5000; // 5 seconds
const MAX_POLL_TIME = 300000; // 5 minutes

// Model mapping for mode-based model selection
const MODEL_MAP: Record<string, Record<string, string>> = {
  "bytedance/seedance-v1.5-pro": {
    t2v: "bytedance/seedance-v1.5-pro/text-to-video",
    i2v: "bytedance/seedance-v1.5-pro/image-to-video",
  },
  "bytedance/seedance-v1.5-pro-fast": {
    t2v: "bytedance/seedance-v1.5-pro-fast/text-to-video",
    i2v: "bytedance/seedance-v1.5-pro-fast/image-to-video",
  },
  "bytedance/seedance-v1-pro": {
    t2v: "bytedance/seedance-v1-pro/text-to-video",
    i2v: "bytedance/seedance-v1-pro/image-to-video",
  },
  "bytedance/seedance-v1-lite": {
    t2v: "bytedance/seedance-v1-lite/text-to-video",
    i2v: "bytedance/seedance-v1-lite/image-to-video",
  },
};

interface CLIArgs {
  prompt: string;
  model: string;
  mode: "t2v" | "i2v";
  duration: number;
  resolution: string;
  aspectRatio: string;
  seed: number | null;
  audio: boolean;
  image: string | null;
  output: string;
}

interface PredictionResponse {
  request_id: string;
  status: string;
  output?: {
    video_url?: string;
  };
  cost?: {
    amount: number;
    currency: string;
  };
  error?: string;
}

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): CLIArgs {
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  // Find the prompt (first non-flag argument)
  let prompt = "";
  const flagArgs: string[] = [];
  let skipNext = false;

  for (let i = 0; i < args.length; i++) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    if (args[i].startsWith("--")) {
      flagArgs.push(args[i]);
      // Check if this flag has a value (not --audio which is boolean)
      if (args[i] !== "--audio" && i + 1 < args.length && !args[i + 1].startsWith("--")) {
        flagArgs.push(args[i + 1]);
        skipNext = true;
      }
    } else if (!prompt) {
      prompt = args[i];
    }
  }

  if (!prompt) {
    console.error("Error: A prompt is required.");
    console.error('Usage: seedance-video "your prompt" [options]');
    process.exit(1);
  }

  const getFlag = (name: string, defaultValue: string): string => {
    const idx = flagArgs.indexOf(`--${name}`);
    if (idx !== -1 && idx + 1 < flagArgs.length) {
      return flagArgs[idx + 1];
    }
    return defaultValue;
  };

  const hasFlag = (name: string): boolean => {
    return flagArgs.includes(`--${name}`);
  };

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const seedStr = getFlag("seed", "");

  return {
    prompt,
    model: getFlag("model", DEFAULT_MODEL),
    mode: getFlag("mode", "t2v") as CLIArgs["mode"],
    duration: parseInt(getFlag("duration", "5"), 10),
    resolution: getFlag("resolution", "1080p"),
    aspectRatio: getFlag("aspect-ratio", "16:9"),
    seed: seedStr ? parseInt(seedStr, 10) : null,
    audio: hasFlag("audio"),
    image: getFlag("image", "") || null,
    output: getFlag("output", `./output/seedance_${timestamp}.mp4`),
  };
}

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
Seedance Video CLI — Generate videos using Seedance (ByteDance) via Atlas Cloud API

Usage:
  seedance-video "prompt" [options]

Options:
  --model <id>          Model variant (default: bytedance/seedance-v1.5-pro/text-to-video)
  --mode <mode>         Generation mode: t2v, i2v (default: t2v)
  --duration <seconds>  Video duration: 5, 10, 15 (default: 5)
  --resolution <res>    Output resolution: 360p, 480p, 720p, 1080p (default: 1080p)
  --aspect-ratio <r>    Aspect ratio: 16:9, 9:16, 1:1, 4:3, 3:4 (default: 16:9)
  --seed <number>       Random seed for reproducible results
  --audio               Enable native audio generation
  --image <path>        Input image path for i2v mode
  --output <path>       Output file path (default: ./output/{timestamp}.mp4)
  --help                Show this help message

Examples:
  seedance-video "Cherry blossoms falling in slow motion"
  seedance-video "Clouds moving" --mode i2v --image ./photo.jpg
  seedance-video "City at night" --duration 15 --audio

Models:
  bytedance/seedance-v1.5-pro/text-to-video       $0.222/req (default)
  bytedance/seedance-v1.5-pro-fast/text-to-video   $0.111/req
  bytedance/seedance-v1-pro/text-to-video          $0.186/req
  bytedance/seedance-v1-lite/text-to-video         $0.093/req
  `);
}

/**
 * Get the API key from environment
 */
function getApiKey(): string {
  const key = process.env.ATLASCLOUD_API_KEY;
  if (!key) {
    console.error("Error: ATLASCLOUD_API_KEY environment variable is required.");
    console.error("");
    console.error("Set it with:");
    console.error("  export ATLASCLOUD_API_KEY=your_api_key_here");
    console.error("");
    console.error("Get your API key at: https://www.atlascloud.ai?ref=JPM683");
    process.exit(1);
  }
  return key;
}

/**
 * Read image file and convert to base64 data URL
 */
async function readImageAsBase64(imagePath: string): Promise<string> {
  const file = Bun.file(imagePath);
  const exists = await file.exists();

  if (!exists) {
    console.error(`Error: Image file not found: ${imagePath}`);
    process.exit(1);
  }

  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const mimeType = imagePath.endsWith(".png") ? "image/png"
    : imagePath.endsWith(".webp") ? "image/webp"
    : imagePath.endsWith(".gif") ? "image/gif"
    : "image/jpeg";

  return `data:${mimeType};base64,${base64}`;
}

/**
 * Build the request body for the prediction API
 */
async function buildRequestBody(args: CLIArgs): Promise<Record<string, unknown>> {
  const input: Record<string, unknown> = {
    prompt: args.prompt,
    duration: args.duration,
    resolution: args.resolution,
    aspect_ratio: args.aspectRatio,
    audio_generation: args.audio,
  };

  // Include seed if specified
  if (args.seed !== null) {
    input.seed = args.seed;
  }

  // If mode requires an image, read and include it
  if (args.mode === "i2v" && args.image) {
    input.image_url = await readImageAsBase64(args.image);
  }

  return {
    model: args.model,
    input,
  };
}

/**
 * Submit a prediction to the Atlas Cloud API
 */
async function submitPrediction(apiKey: string, body: Record<string, unknown>): Promise<PredictionResponse> {
  console.log("Submitting video generation request...");
  console.log(`  Model: ${body.model}`);
  console.log(`  Prompt: ${(body.input as Record<string, unknown>).prompt}`);

  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error: API request failed with status ${response.status}`);
    console.error(`Response: ${errorText}`);
    process.exit(1);
  }

  const data = await response.json() as PredictionResponse;
  console.log(`  Request ID: ${data.request_id}`);
  return data;
}

/**
 * Poll for prediction results until completed or timeout
 */
async function pollForResult(apiKey: string, requestId: string): Promise<PredictionResponse> {
  const startTime = Date.now();
  let dots = 0;

  while (Date.now() - startTime < MAX_POLL_TIME) {
    const response = await fetch(`${API_BASE}/${requestId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`\nError: Failed to check prediction status: ${response.status}`);
      console.error(`Response: ${errorText}`);
      process.exit(1);
    }

    const data = await response.json() as PredictionResponse;

    if (data.status === "completed") {
      process.stdout.write("\n");
      return data;
    }

    if (data.status === "failed") {
      process.stdout.write("\n");
      console.error(`Error: Video generation failed: ${data.error || "Unknown error"}`);
      process.exit(1);
    }

    // Show progress
    dots = (dots + 1) % 4;
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    process.stdout.write(`\r  Generating${".".repeat(dots + 1)}${" ".repeat(3 - dots)} (${elapsed}s)`);

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
  }

  console.error("\nError: Prediction timed out after 300 seconds.");
  console.error("Video generation can take up to 5 minutes for longer durations.");
  process.exit(1);
}

/**
 * Download video from URL and save to local file
 */
async function downloadVideo(videoUrl: string, outputPath: string): Promise<void> {
  console.log(`Downloading video to ${outputPath}...`);

  // Ensure output directory exists
  const dir = outputPath.substring(0, outputPath.lastIndexOf("/"));
  if (dir) {
    await Bun.write(Bun.file(dir + "/.keep"), "");
  }

  const response = await fetch(videoUrl);
  if (!response.ok) {
    console.error(`Error: Failed to download video: ${response.status}`);
    process.exit(1);
  }

  const buffer = await response.arrayBuffer();
  await Bun.write(outputPath, buffer);

  const sizeMB = (buffer.byteLength / (1024 * 1024)).toFixed(2);
  console.log(`  Saved: ${outputPath} (${sizeMB} MB)`);
}

/**
 * Display cost information
 */
function displayCost(cost?: { amount: number; currency: string }): void {
  if (cost) {
    console.log(`\nCost: $${cost.amount.toFixed(4)} ${cost.currency}`);
  }
  console.log("\nPowered by Atlas Cloud — https://www.atlascloud.ai?ref=JPM683");
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  // Skip the first two args (bun and script path)
  const rawArgs = process.argv.slice(2);
  const args = parseArgs(rawArgs);

  // Validate mode-specific requirements
  if (args.mode === "i2v" && !args.image) {
    console.error("Error: --image is required for i2v mode.");
    process.exit(1);
  }

  // Validate duration
  const validDurations = [5, 10, 15];
  if (!validDurations.includes(args.duration)) {
    console.error(`Error: Invalid duration ${args.duration}. Supported values: 5, 10, 15`);
    process.exit(1);
  }

  // Validate resolution
  const validResolutions = ["360p", "480p", "720p", "1080p"];
  if (!validResolutions.includes(args.resolution)) {
    console.error(`Error: Invalid resolution ${args.resolution}. Supported values: 360p, 480p, 720p, 1080p`);
    process.exit(1);
  }

  // Auto-select model variant based on mode if using default
  if (args.model === DEFAULT_MODEL && args.mode === "i2v") {
    args.model = "bytedance/seedance-v1.5-pro/image-to-video";
    console.log(`  Auto-selected model: ${args.model} (for i2v mode)`);
  }

  const apiKey = getApiKey();

  console.log("");
  console.log("=== Seedance Video Generator ===");
  console.log("");

  // Build request
  const body = await buildRequestBody(args);

  // Submit prediction
  const prediction = await submitPrediction(apiKey, body);

  // Poll for result
  console.log("\n  Waiting for video generation...");
  const result = await pollForResult(apiKey, prediction.request_id);

  // Download video
  if (result.output?.video_url) {
    await downloadVideo(result.output.video_url, args.output);
  } else {
    console.error("Error: No video URL in response.");
    process.exit(1);
  }

  // Display cost
  displayCost(result.cost);

  console.log("\nDone!");
}

// Run
main().catch((error) => {
  console.error("Unexpected error:", error.message);
  process.exit(1);
});
