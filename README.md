# Listening Project

The Listening Project is a neural audio interface designed to decode the world around you. We bypass traditional, high-latency speech-to-text pipelines by leveraging the Gemini Multimodal Live API, delivering fluid, context-aware translation that understands nuance, tone, and speaker identity in real-time.

## Prerequisites

- Node.js

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Set up environment variables:**

    Create a `.env.local` file in the root directory and add your Gemini API key:

    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

3.  **Run the app:**

    ```bash
    npm run dev
    ```

## Features

-   **Real-Time Universal Translator:** Instantly translates spoken audio into your target language with near-zero latency.
-   **Multi-Language Scanning:** Automatically detects and identifies multiple languages spoken in the same conversation.
-   **Speaker Identification:** Distinguishes between different voices and labels them in the transcript.
-   **Context-Aware AI Assistant:** Ask questions about the conversation or get cultural context for terms mentioned in real-time.
-   **Local-First Architecture:** All session data is stored locally on your device, not in the cloud.
-   **Zero-Knowledge Encryption:** Secure your transcripts with a personal Vault Key.
-   **Pocket Mode:** Lock your screen while keeping the microphone active for discreet operation.
