<div align="center">

# Seedance Video Skill

**An open AI agent skill for generating videos using Seedance (ByteDance) via Atlas Cloud API**

[![npm version](https://img.shields.io/npm/v/seedance-video-skill.svg)](https://www.npmjs.com/package/seedance-video-skill)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stars](https://img.shields.io/github/stars/thoughtincode/seedance-video-skill?style=social)](https://github.com/thoughtincode/seedance-video-skill)

Generate high-quality AI videos directly from your terminal or through AI coding agents (Claude Code, Cursor, Codex, Copilot, Gemini CLI, Windsurf, Kiro, and more). Powered by ByteDance's Seedance video generation models with native audio support, accessible through Atlas Cloud's unified API.

</div>

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Agent Skill Integration](#agent-skill-integration)
- [CLI Usage](#cli-usage)
- [Model Variants](#model-variants)
- [Options Reference](#options-reference)
- [API Details](#api-details)
- [Examples](#examples)
- [Pricing](#pricing)
- [Take This to Production](#-take-this-to-production-today)
- [License](#license)

---

## Features

- **Text-to-Video (t2v)** — Generate videos from text prompts with cinematic quality
- **Image-to-Video (i2v)** — Animate still images into dynamic video sequences
- **Native Audio Generation** — Built-in synchronized audio generation for immersive videos
- **Multi-Shot Generation** — Create multi-scene videos with consistent characters and settings
- **1080p Full HD Output** — Generate videos in crisp 1080p resolution
- **Motion Control** — Direct camera movement and subject motion with prompt keywords
- **Camera Control** — Specify camera angles, movements (dolly, pan, tilt, zoom)
- **Fast Variants** — Quick preview generation with fast model variants
- **Flexible Duration** — Generate 5, 10, or 15-second video clips
- **Agent Skill** — Works with 15+ AI coding agents including Claude Code, Cursor, OpenAI Codex, GitHub Copilot, Gemini CLI, Windsurf, OpenCode, Kiro, and more

---

## Prerequisites

- [Bun](https://bun.sh/) runtime (v1.0+)
- An [Atlas Cloud](https://www.atlascloud.ai?ref=JPM683&utm_source=github&utm_campaign=seedance-video-skill) API key

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/thoughtincode/seedance-video-skill.git
cd seedance-video-skill
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Link the CLI Globally

```bash
bun link
```

This makes the `seedance-video` command available system-wide.

### 4. Set Your API Key

```bash
export ATLASCLOUD_API_KEY=your_api_key_here
```

Or create a `.env` file in the project root:

```
ATLASCLOUD_API_KEY=your_api_key_here
```

---

## Agent Skill Integration

This repository is designed to work as an **open agent skill** compatible with 15+ AI coding agents. Install it with a single command that works across all supported platforms:

```bash
npx skills add seedance-video-skill
```

Or manually clone and set up:

### How It Works

1. Clone this repo and run `bun link`
2. Load the skill in your AI coding agent (e.g., `/init` in Claude Code, or the equivalent in Cursor, Codex, Copilot, Gemini CLI, Windsurf, Kiro, etc.)
3. Use natural language to generate videos:

```
"Generate a 10-second video of cherry blossoms falling in slow motion"
```

```
"Create a video from this image: ./landscape.jpg — add gentle camera pan"
```

```
"Make a 15-second cinematic video of a futuristic cityscape using Seedance v1.5 Pro"
```

Your AI coding agent will automatically construct and execute the appropriate `seedance-video` CLI command based on your natural language request.

---

## CLI Usage

### Basic Text-to-Video

```bash
seedance-video "A serene Japanese garden with koi fish swimming in a crystal-clear pond"
```

### Image-to-Video

```bash
seedance-video "The leaves rustle gently in the wind" --mode i2v --image ./garden.jpg
```

### Specify Model and Duration

```bash
seedance-video "Neon-lit street in a cyberpunk city with rain and reflections" \
  --model bytedance/seedance-v1.5-pro/text-to-video \
  --duration 15
```

### Full Options Example

```bash
seedance-video "A time-lapse of a flower blooming from bud to full bloom" \
  --model bytedance/seedance-v1.5-pro/text-to-video \
  --mode t2v \
  --duration 10 \
  --resolution 1080p \
  --aspect-ratio 16:9 \
  --audio \
  --output ./flower-bloom.mp4
```

### With Audio Generation

```bash
seedance-video "Thunderstorm over the ocean with crashing waves and lightning" \
  --audio --duration 10
```

### Quick Preview with Fast Model

```bash
seedance-video "A puppy chasing butterflies in a meadow" \
  --model bytedance/seedance-v1.5-pro-fast/text-to-video \
  --duration 5
```

---

## Model Variants

Seedance offers multiple model variants through Atlas Cloud, each optimized for different use cases:

| Model | Model ID | Starting Price per Second | Speed | Quality | Best For |
|-------|----------|--------------------------|-------|---------|----------|
| **Seedance v1.5 Pro** | `bytedance/seedance-v1.5-pro/text-to-video` | from $0.044/s | Medium | Highest | Production-quality videos, best motion |
| **Seedance v1.5 Pro Fast** | `bytedance/seedance-v1.5-pro-fast/text-to-video` | from $0.111/s | Fast | High | Quick iterations, previews |
| **Seedance v1 Pro** | `bytedance/seedance-v1-pro/text-to-video` | from $0.186/s | Medium | Very High | Proven reliability |
| **Seedance v1 Lite** | `bytedance/seedance-v1-lite/text-to-video` | from $0.093/s | Very Fast | Good | Budget-friendly, rapid prototyping |

### Image-to-Video Variants

| Model | Model ID | Starting Price per Second |
|-------|----------|--------------------------|
| **Seedance v1.5 Pro i2v** | `bytedance/seedance-v1.5-pro/image-to-video` | from $0.044/s |
| **Seedance v1.5 Pro Fast i2v** | `bytedance/seedance-v1.5-pro-fast/image-to-video` | from $0.111/s |
| **Seedance v1 Pro i2v** | `bytedance/seedance-v1-pro/image-to-video` | from $0.186/s |
| **Seedance v1 Lite i2v** | `bytedance/seedance-v1-lite/image-to-video` | from $0.093/s |

> **Default model:** `bytedance/seedance-v1.5-pro/text-to-video`

---

## Options Reference

| Option | Flag | Default | Description |
|--------|------|---------|-------------|
| **Prompt** | (positional) | *required* | Text description of the video to generate |
| **Model** | `--model` | `bytedance/seedance-v1.5-pro/text-to-video` | Model variant to use (see table above) |
| **Mode** | `--mode` | `t2v` | Generation mode: `t2v`, `i2v` |
| **Duration** | `--duration` | `5` | Video duration in seconds (5, 10, 15) |
| **Resolution** | `--resolution` | `1080p` | Output resolution: `360p`, `480p`, `720p`, `1080p` |
| **Aspect Ratio** | `--aspect-ratio` | `16:9` | Video aspect ratio: `16:9`, `9:16`, `1:1`, `4:3`, `3:4` |
| **Seed** | `--seed` | — | Random seed for reproducible results |
| **Audio** | `--audio` | `false` | Enable native audio generation |
| **Image** | `--image` | — | Input image path for i2v mode |
| **Output** | `--output` | `./output/{timestamp}.mp4` | Output file path |

---

## API Details

This CLI interacts with the Atlas Cloud API to submit video generation jobs and poll for results.

### Workflow

1. **Submit Job** — POST request to create a prediction
2. **Poll Status** — GET request to check prediction status every 5 seconds
3. **Download** — Fetch the completed video and save locally

### Endpoints

```
POST   https://api.atlascloud.ai/api/v1/model/prediction
GET    https://api.atlascloud.ai/api/v1/model/prediction/{request_id}
```

### Authentication

All requests require the `ATLASCLOUD_API_KEY` header:

```
Authorization: Bearer YOUR_API_KEY
```

### Request Body Example (Text-to-Video)

```json
{
  "model": "bytedance/seedance-v1.5-pro/text-to-video",
  "input": {
    "prompt": "A cinematic aerial shot of autumn forests with a winding river",
    "duration": 10,
    "resolution": "1080p",
    "aspect_ratio": "16:9",
    "audio_generation": true
  }
}
```

### Request Body Example (Image-to-Video)

```json
{
  "model": "bytedance/seedance-v1.5-pro/image-to-video",
  "input": {
    "prompt": "The subject slowly turns their head and smiles",
    "image_url": "https://example.com/portrait.jpg",
    "duration": 5,
    "resolution": "1080p",
    "aspect_ratio": "16:9"
  }
}
```

### Request Body with Seed

```json
{
  "model": "bytedance/seedance-v1.5-pro/text-to-video",
  "input": {
    "prompt": "A butterfly landing on a sunflower in golden hour light",
    "duration": 5,
    "resolution": "1080p",
    "aspect_ratio": "1:1",
    "seed": 42
  }
}
```

### Response Example

```json
{
  "request_id": "xyz789-abc012",
  "status": "completed",
  "output": {
    "video_url": "https://cdn.atlascloud.ai/videos/xyz789.mp4"
  },
  "cost": {
    "amount": 0.222,
    "currency": "USD"
  }
}
```

---

## Examples

### 1. Cinematic Nature Scene

```bash
seedance-video "Aerial drone shot flying through a misty mountain valley at sunrise, \
golden light filtering through clouds, cinematic color grading" \
  --duration 10 --resolution 1080p --aspect-ratio 21:9 --audio
```

### 2. Product Showcase

```bash
seedance-video "A luxury perfume bottle rotating on a marble surface, \
dramatic studio lighting with prismatic reflections, premium commercial quality" \
  --duration 5 --resolution 1080p --aspect-ratio 9:16
```

### 3. Social Media Reel

```bash
seedance-video "A barista creating intricate latte art in slow motion, \
warm cafe atmosphere, soft bokeh background, Instagram aesthetic" \
  --duration 5 --aspect-ratio 9:16 --audio \
  --model bytedance/seedance-v1.5-pro-fast/text-to-video
```

### 4. Animate a Portrait

```bash
seedance-video "The person smiles warmly and nods, then looks to the left \
as if noticing something interesting, natural and subtle movements" \
  --mode i2v --image ./portrait.jpg --duration 5
```

### 5. Sci-Fi Scene

```bash
seedance-video "A massive spaceship emerging from hyperspace above an alien planet, \
debris field and aurora in the background, epic cinematic scale, \
lens flare and volumetric lighting" \
  --duration 15 --resolution 1080p --aspect-ratio 21:9
```

### 6. Music Video Style

```bash
seedance-video "Abstract flowing liquid metal morphing into geometric shapes, \
vibrant neon colors against pitch black background, \
synchronized rhythmic movement, music video aesthetic" \
  --duration 10 --audio --resolution 1080p
```

### 7. Camera Control

```bash
seedance-video "Smooth dolly-in through an enchanted forest, \
camera slowly pushing forward along a winding path, \
fireflies and magical particles floating in the air, \
volumetric god rays through the canopy" \
  --duration 10 --resolution 1080p
```

### 8. Multi-Shot Sequence

```bash
# Scene 1: Wide establishing shot
seedance-video "Wide shot of a medieval castle on a cliff at sunset, \
dramatic clouds and crashing waves below" \
  --duration 5 --output ./scene1.mp4

# Scene 2: Interior
seedance-video "Camera pushing through massive castle doors into a grand hall, \
torches flickering on stone walls, long banquet table" \
  --duration 5 --output ./scene2.mp4

# Scene 3: Close-up detail
seedance-video "Close-up of an ancient map being unrolled on the table, \
candlelight illuminating cryptic symbols and routes" \
  --duration 5 --output ./scene3.mp4
```

### 9. Reproducible Generation with Seed

```bash
seedance-video "A white cat sitting on a windowsill watching snow fall outside" \
  --seed 12345 --duration 5 --resolution 1080p

# Run again with same seed for identical result
seedance-video "A white cat sitting on a windowsill watching snow fall outside" \
  --seed 12345 --duration 5 --resolution 1080p
```

### 10. Batch Generation Script

```bash
#!/bin/bash
prompts=(
  "Waves gently lapping on a tropical beach at sunset"
  "Northern lights dancing over a snowy mountain landscape"
  "A hummingbird hovering near a vibrant red flower in slow motion"
  "Time-lapse of clouds rolling through a mountain pass"
  "Rain falling on a quiet city street at night with neon reflections"
)

for i in "${!prompts[@]}"; do
  seedance-video "${prompts[$i]}" \
    --duration 5 \
    --resolution 1080p \
    --audio \
    --output "./output/batch_${i}.mp4"
done
```

---

## Pricing

### Seedance on Atlas Cloud

| Model Variant | Starting Price per Second | Duration | Resolution |
|--------------|--------------------------|----------|------------|
| Seedance v1.5 Pro | **from $0.044/s** | 5-15s | Up to 1080p |
| Seedance v1.5 Pro Fast | from $0.111/s | 5-10s | Up to 1080p |
| Seedance v1 Pro | from $0.186/s | 5-10s | Up to 1080p |
| Seedance v1 Lite | from $0.093/s | 5s | Up to 720p |

*Prices shown are starting prices. Higher resolution or longer duration may cost more.*

### Volume Estimates

| Volume | Seedance v1.5 Pro | v1.5 Pro Fast | v1 Lite |
|--------|------------------|---------------|---------|
| 100 videos | $22.20 | $11.10 | $9.30 |
| 500 videos | $111.00 | $55.50 | $46.50 |
| 1,000 videos | $222.00 | $111.00 | $93.00 |

### First-Time Bonus

Atlas Cloud offers a **25% bonus on your first recharge** (up to $100 bonus):

| Top-Up | Bonus (25%) | Total Credits | Effective Rate (v1.5 Pro) |
|--------|-------------|---------------|--------------------------|
| $10 | $2.50 | $12.50 | from $0.178/s |
| $50 | $12.50 | $62.50 | from $0.178/s |
| $100 | $25.00 | $125.00 | from $0.178/s |
| $400 | $100.00 | $500.00 | from $0.178/s |

---

## Take This to Production Today

This workflow is optimized for Atlas Cloud. Move from experiment to enterprise-ready scale.

- **Production-Ready**: All Seedance model variants, from $0.044/s
- **Enterprise Security**: SOC I & II Certified | HIPAA Compliant
- **Zero Maintenance**: Serverless architecture — focus on your product, not the servers
- **25% Bonus**: First recharge bonus up to $100

[Start Building](https://www.atlascloud.ai?ref=JPM683&utm_source=github&utm_campaign=seedance-video-skill)

---

## Troubleshooting

### Common Issues

**`ATLASCLOUD_API_KEY` not set**
```
Error: ATLASCLOUD_API_KEY environment variable is required
```
Set the environment variable or create a `.env` file.

**Prediction timeout**
```
Error: Prediction timed out after 300 seconds
```
Video generation can take 1-5 minutes. The default timeout is 300 seconds. For 15-second videos or complex prompts, generation may take longer.

**Invalid model ID**
```
Error: Model not found
```
Check the [Model Variants](#model-variants) table for valid model IDs.

**Image file not found (i2v mode)**
```
Error: Image file not found: ./photo.jpg
```
Ensure the image path is correct and the file exists.

**Unsupported duration**
```
Error: Invalid duration
```
Seedance supports durations of 5, 10, or 15 seconds depending on the model variant.

---

## Architecture

```
seedance-video-skill/
├── src/
│   └── cli.ts          # Main CLI entry point
├── output/             # Default output directory for generated videos
├── CLAUDE.md           # Claude Code skill definition
├── package.json        # Package configuration
├── .env.example        # Environment variable template
├── .gitignore          # Git ignore rules
├── LICENSE             # MIT License
└── README.md           # This file
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built for the open agent skills ecosystem — works with Claude Code, Cursor, Codex, Copilot, Gemini CLI, Windsurf, OpenCode, Kiro, and 15+ AI coding agents. Powered by [Atlas Cloud](https://www.atlascloud.ai?ref=JPM683&utm_source=github&utm_campaign=seedance-video-skill).**

</div>
