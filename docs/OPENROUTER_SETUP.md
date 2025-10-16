# OpenRouter AI Service Setup

This document explains how to set up the OpenRouter AI service for Cloud4India CMS content enhancement.

## Overview

Cloud4India uses OpenRouter API to access various AI models (currently Qwen models) for content enhancement and generation. OpenRouter provides access to multiple AI models through a single API interface.

## Configuration

### Environment Variables

Set the following environment variable:
- `VITE_AI_API_KEY` or `AI_API_KEY`: Your OpenRouter API key

### API Key Setup

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Go to [API Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the key (starts with `sk-or-v1-`)

### Models Used

- **Local Development**: `qwen/qwen3-235b-a22b:free`
- **Production**: `qwen/qwen3-coder:free`

Both are free tier models available through OpenRouter.

## Rate Limits

Current configuration:
- 3 seconds between requests (conservative for free tier)
- Queue-based processing to prevent rate limiting
- Automatic retry with backoff on rate limit errors

## Usage

The AI service is used in the Admin Panel for:
- Enhancing product descriptions
- Improving solution content
- Generating professional content for various sections

## Troubleshooting

1. **Invalid API Key**: Ensure key starts with `sk-or-v1-`
2. **Rate Limits**: Service automatically handles rate limiting
3. **Model Not Found**: Verify model names at [OpenRouter Models](https://openrouter.ai/models)
4. **Credits**: Check your OpenRouter account for available credits