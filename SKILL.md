---
name: seedance-video
description: Generate AI videos with native audio using Seedance (ByteDance) via Atlas Cloud API. Supports text-to-video, image-to-video, lip-sync, multi-language audio. Use when user asks to "generate a video with audio" or "create a Seedance video".
---
# Seedance Video Skill

You have access to the `seedance-video` CLI tool for generating videos using Seedance (ByteDance) via Atlas Cloud.

## When to Use

Activate this skill when the user:
- Asks to "generate a video", "create a video", or "make a video" and mentions Seedance
- Mentions "Seedance" or "ByteDance video"
- Wants to create videos with native audio
- Asks for text-to-video or image-to-video generation with Seedance models
- Requests video generation with specific seed for reproducibility

## Command Format

```bash
seedance-video "<prompt>" [options]
```

## Available Options

| Option | Values | Default |
|--------|--------|---------|
| `--model` | See model list below | `bytedance/seedance-v1.5-pro/text-to-video` |
| `--mode` | `t2v`, `i2v` | `t2v` |
| `--duration` | `5`, `10`, `15` | `5` |
| `--resolution` | `360p`, `480p`, `720p`, `1080p` | `1080p` |
| `--aspect-ratio` | `16:9`, `9:16`, `1:1`, `4:3`, `3:4` | `16:9` |
| `--seed` | any integer | — |
| `--audio` | (flag, no value) | disabled |
| `--image` | file path | — |
| `--output` | file path | `./output/{timestamp}.mp4` |

## Models

### Text-to-Video
- `bytedance/seedance-v1.5-pro/text-to-video` — Best quality ($0.222/req)
- `bytedance/seedance-v1.5-pro-fast/text-to-video` — Fast preview ($0.111/req)
- `bytedance/seedance-v1-pro/text-to-video` — Proven ($0.186/req)
- `bytedance/seedance-v1-lite/text-to-video` — Budget ($0.093/req)

### Image-to-Video
- `bytedance/seedance-v1.5-pro/image-to-video` — Best quality ($0.222/req)
- `bytedance/seedance-v1.5-pro-fast/image-to-video` — Fast preview ($0.111/req)
- `bytedance/seedance-v1-pro/image-to-video` — Proven ($0.186/req)
- `bytedance/seedance-v1-lite/image-to-video` — Budget ($0.093/req)

## Usage Examples

### Text-to-Video
```bash
seedance-video "Cherry blossoms falling in slow motion in a Japanese garden" --duration 10 --resolution 1080p
```

### Image-to-Video
```bash
seedance-video "The person smiles and nods" --mode i2v --image ./portrait.jpg --duration 5
```

### With Audio
```bash
seedance-video "Thunderstorm over the ocean with crashing waves" --audio --duration 15
```

### With Seed (Reproducible)
```bash
seedance-video "A butterfly landing on a flower" --seed 42 --duration 5
```

### Quick Preview
```bash
seedance-video "Sunset over mountains" --model bytedance/seedance-v1.5-pro-fast/text-to-video --duration 5
```

### Cinematic Widescreen
```bash
seedance-video "Epic aerial shot of a volcano erupting" --aspect-ratio 21:9 --duration 10 --resolution 1080p
```

## Important Notes

- The `ATLASCLOUD_API_KEY` environment variable must be set
- Image-to-video mode (`--mode i2v`) requires `--image` flag with a valid file path
- Video generation takes 1-5 minutes depending on model, duration, and settings
- Supported durations: 5, 10, or 15 seconds (varies by model)
- Supported resolutions: 360p, 480p, 720p, 1080p
- Output files are saved as `.mp4`
- Use `--seed` for reproducible results across identical prompts
- For vertical video (e.g., mobile/social), use `--aspect-ratio 9:16`
- Native audio generation works best with scenes that have natural sound elements
