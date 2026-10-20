// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { installPeleFacade, removePeleFacade } from './facade';

type AnyObject = Record<string, unknown>;

const globalMermaid = (): unknown => (window as { mermaid?: unknown }).mermaid;
const setGlobalMermaid = (value: unknown): void => {
    (window as { mermaid?: unknown }).mermaid = value;
};

const setMockMermaid = (value: unknown): void => {
    (globalThis as { __mockMermaid?: unknown }).__mockMermaid = value;
};

const noop = () => undefined;
const originalRender = async () => ({ svg: '' });

describe('Pele facade', () => {
    afterEach(() => {
        removePeleFacade();
        setGlobalMermaid(undefined);
        setMockMermaid(undefined);
    });

    it('keeps every original method except render', async () => {
        const original = {
            initialize: noop,
            render: originalRender,
            getConfig: () => ({ theme: 'dark' }),
        };
        setMockMermaid(original);

        expect(await installPeleFacade()).toBe('installed');

        const facade = globalMermaid() as AnyObject;
        expect(facade.initialize).toBe(noop);
        expect((facade.getConfig as () => unknown)()).toEqual({ theme: 'dark' });
        expect(facade.render).not.toBe(originalRender);
    });

    it('renders Mermaid source through Pele', async () => {
        setMockMermaid({ initialize() {} });

        await installPeleFacade();

        const facade = globalMermaid() as {
            render: (id: string, text: string, container?: unknown) => Promise<{ svg: string }>;
        };
        const { svg } = await facade.render('id', 'flowchart LR\n A[Start] --> B[End]', {});

        expect(svg).toContain('<svg');
    });

    it('restores the original object', async () => {
        const original = { initialize() {} };
        setMockMermaid(original);

        await installPeleFacade();
        expect(globalMermaid()).not.toBe(original);

        expect(removePeleFacade()).toBe('restored');
        expect(globalMermaid()).toBe(original);
    });

    it('leaves a foreign Mermaid instance alone', () => {
        const foreign = { render: () => undefined };
        setGlobalMermaid(foreign);

        expect(removePeleFacade()).toBe('skipped');
        expect(globalMermaid()).toBe(foreign);
    });

    it('installs only once', async () => {
        setMockMermaid({ initialize() {} });

        expect(await installPeleFacade()).toBe('installed');
        expect(await installPeleFacade()).toBe('already');
    });
});
