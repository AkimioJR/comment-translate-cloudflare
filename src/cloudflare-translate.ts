import { ITranslate, ITranslateOptions } from 'comment-translate-manager';
import { workspace } from 'vscode';

const PREFIX_CONFIG = 'cloudflareTranslate';
const DEFAULT_MODEL = '@cf/meta/llama-3.1-8b-instruct';

interface CloudflareTranslateOption {
    accountId?: string;
    apiToken?: string;
    model?: string;
    systemPrompt?: string;
}

interface CloudflareRunResponse {
    success?: boolean;
    errors?: Array<{ message?: string }>;
    result?: {
        response?: string;
        translated_text?: string;
        text?: string;
    };
}

function getConfig<T>(key: string): T | undefined {
    const configuration = workspace.getConfiguration(PREFIX_CONFIG);
    return configuration.get<T>(key);
}

function extractTranslatedText(data: CloudflareRunResponse): string {
    if (typeof data.result?.translated_text === 'string' && data.result.translated_text.length > 0) {
        return data.result.translated_text;
    }
    if (typeof data.result?.response === 'string' && data.result.response.length > 0) {
        return data.result.response;
    }
    if (typeof data.result?.text === 'string' && data.result.text.length > 0) {
        return data.result.text;
    }
    return '';
}

export class CloudflareTranslate implements ITranslate {

    private _defaultOption: CloudflareTranslateOption;

    constructor() {
        this._defaultOption = this.createOption();
        workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration(PREFIX_CONFIG)) {
                this._defaultOption = this.createOption();
            }
        });
    }

    createOption(): CloudflareTranslateOption {
        return {
            accountId: getConfig<string>('accountId'),
            apiToken: getConfig<string>('apiToken'),
            model: getConfig<string>('model') || DEFAULT_MODEL,
            systemPrompt: getConfig<string>('systemPrompt'),
        };
    }

    get maxLen() {
        // 单词请求最大长度限制
        return 5000;
    }

    async translate(content: string, options: ITranslateOptions): Promise<string> {
        const { accountId, apiToken, model, systemPrompt } = this._defaultOption;
        if (!accountId) {
            throw new Error('Please configure cloudflareTranslate.accountId');
        }
        if (!apiToken) {
            throw new Error('Please configure cloudflareTranslate.apiToken');
        }

        const to = options.to || 'en';
        const from = options.from || 'auto';
        const prompt = systemPrompt || 'You are a translation assistant. Return only translated text.';
        const userMessage = `Translate the following text from ${from} to ${to}. Return only the translated text without explanations:\n\n${content}`;

        const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model || DEFAULT_MODEL}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: prompt,
                    },
                    {
                        role: 'user',
                        content: userMessage,
                    },
                ],
            }),
        });

        const data = (await response.json()) as CloudflareRunResponse;
        if (!response.ok || data.success === false) {
            const errorText = data.errors?.[0]?.message || `${response.status} ${response.statusText}`;
            throw new Error(`Cloudflare translation failed: ${errorText}`);
        }

        const translated = extractTranslatedText(data);
        if (!translated) {
            throw new Error('Cloudflare translation failed: empty response');
        }

        return translated.trim();
    }

    link(content: string, options: ITranslateOptions): string {
        const to = options.to || 'en';
        const query = encodeURIComponent(content);
        const url = `https://translate.google.com/?sl=auto&tl=${encodeURIComponent(to)}&text=${query}&op=translate`;
        return `[Cloudflare Translate](${url})`;
    }

}