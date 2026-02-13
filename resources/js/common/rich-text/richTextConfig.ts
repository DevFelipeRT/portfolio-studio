import { CodeNode } from '@lexical/code';
import {
  AutoLinkNode,
  LinkNode,
  createLinkMatcherWithRegExp,
} from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';

export const defaultRichTextNodes = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  AutoLinkNode,
  CodeNode,
];

export const defaultRichTextTheme = {
  paragraph: 'mb-3 last:mb-0',
  quote: 'border-l-4 border-muted pl-4 italic text-muted-foreground',
  heading: {
    h1: 'text-3xl font-semibold tracking-tight',
    h2: 'text-2xl font-semibold tracking-tight',
    h3: 'text-xl font-semibold tracking-tight',
    h4: 'text-lg font-semibold tracking-tight',
  },
    list: {
        nested: {
            listitem: 'list-none',
        },
        ol: 'ml-6 list-decimal space-y-1',
        ul: 'ml-6 list-disc space-y-1',
        listitem: 'leading-relaxed',
        listitemChecked:
            'relative list-none pl-6 before:absolute before:left-0 before:top-1 before:h-4 before:w-4 before:rounded-sm before:border before:border-muted-foreground/60 before:bg-primary before:content-[\" \"] after:absolute after:left-[0.3rem] after:top-[0.5rem] after:h-1.5 after:w-2.5 after:-rotate-45 after:border-b-2 after:border-l-2 after:border-background after:content-[\" \"]',
        listitemUnchecked:
            'relative list-none pl-6 before:absolute before:left-0 before:top-1 before:h-4 before:w-4 before:rounded-sm before:border before:border-muted-foreground/60 before:bg-transparent before:content-[\" \"]',
    },
  link: 'text-primary underline underline-offset-4',
  text: {
    bold: 'font-semibold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
    code: 'rounded bg-muted px-1.5 py-0.5 font-mono text-sm',
  },
  code: 'block rounded-md bg-muted px-4 py-3 font-mono text-sm whitespace-pre overflow-x-auto',
};

export const defaultRichTextAutoLinkMatchers = [
  createLinkMatcherWithRegExp(/https?:\/\/[^\s]+/g, (text) => text),
  createLinkMatcherWithRegExp(
    /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
    (text) => `mailto:${text}`,
  ),
];
