# Comment Translate Cloudflare

A dedicated translation source extension for the [Comment Translate](https://marketplace.visualstudio.com/items?itemName=intellsmi.comment-translate) VS Code extension, powered by Cloudflare Workers AI.

This extension does not activate on its own — it only runs when selected as your active translation source in Comment Translate. It enables fast, reliable, and cost-effective translation for code comments, documents, and text directly in your editor, leveraging Cloudflare's global AI infrastructure.

## ✨ Key Features

- Native seamless integration with the mainstream Comment Translate extension
- Low-latency translation service powered by Cloudflare's global edge network
- Support for dozens of languages, ideal for cross-regional code collaboration
- Full compatibility with Windows, macOS and Linux operating systems
- Works with Cloudflare's generous free tier for personal and small-team usage
- Secure API-only communication, no user data stored or forwarded to third parties

## 📋 Prerequisites

1. **Visual Studio Code** v1.85.0 or higher
2. The core [Comment Translate](https://marketplace.visualstudio.com/items?itemName=intellsmi.comment-translate) extension installed in your VS Code
3. A valid [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier available)

## 🚀 Getting Started

### Step 1: Get Cloudflare Credentials

First, retrieve your Cloudflare Account ID and Workers AI API Token:

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Select your account from the homepage.
3. In the left sidebar, navigate to **AI > Workers AI**.
4. On the Workers AI page, click **Use REST API**.
5. Under the **Get Account ID** section, copy your Account ID value.
6. On the same page, locate the **Create a Workers AI API Token** section.
7. Verify the pre-configured permissions (the template automatically grants `Workers AI - Read` and `Workers AI - Edit` access).
8. Click **Create API Token**, then copy and securely save your token.

> ⚠️ **Important**: Never share or commit your API Token to public repositories, as it grants access to your Cloudflare account's Workers AI resources.

### Step 2: Configure the Extension

1. Open VS Code Settings.
2. Search for the **Comment Translate Cloudflare** extension settings.
3. Paste the **Account ID** and **API Token** you copied earlier into the corresponding input fields.

### Step 3: Activate the Translation Source

1. Open the VS Code Command Palette (`Ctrl+Shift+P` for Windows/Linux, `Cmd+Shift+P` for macOS).
2. Run the **Comment Translate: Change translation source** command.
3. Select **Cloudflare translate** from the dropdown list.

Once selected, the extension will activate automatically. You can then use all Comment Translate features with Cloudflare AI as the translation backend.
