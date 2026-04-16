import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

type LocaleMessages = Record<string, string>;

const i18nMessages: Record<string, LocaleMessages> = {
    'en': JSON.parse(fs.readFileSync(path.join(__dirname, '../package.nls.json'), 'utf8')) as LocaleMessages,
    'zh-cn': JSON.parse(fs.readFileSync(path.join(__dirname, '../package.nls.zh-cn.json'), 'utf8')) as LocaleMessages,
};

const defaultLocale = 'en';
const locale = resolveLocale(vscode.env.language);

function resolveLocale(language: string | undefined): string {
    const normalized = (language || defaultLocale).toLowerCase();
    if (normalized in i18nMessages) {
        return normalized;
    }
    if (normalized.startsWith('zh') && 'zh-cn' in i18nMessages) {
        return 'zh-cn';
    }
    return defaultLocale;
}

function format(message: string, args: Array<string | number>): string {
    let formatted = message;
    args.forEach((value, index) => {
        formatted = formatted.replace(new RegExp(`\\{${index}\\}`, 'g'), String(value));
    });
    return formatted;
}

export function localize(info: string, ...args: Array<string | number>): string {
    const messages = i18nMessages[locale] || i18nMessages[defaultLocale];
    const template = messages[info] || i18nMessages[defaultLocale][info] || info;
    return format(template, args);
}

export default localize;