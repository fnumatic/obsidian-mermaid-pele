// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { installPeleFacade, removePeleFacade } from './facade';
import {
    createMermaidMock,
    getWindowMermaid,
    resetMermaidEnvironment,
    setMockMermaid,
    setWindowMermaid,
} from './test-helpers';

const noop = (): void => undefined;

describe('Pele facade', () => {
    afterEach(resetMermaidEnvironment);

    it('keeps every original method except render', async () => {
        const original = createMermaidMock({
            initialize: noop,
            getConfig: () => ({ theme: 'dark' }),
        });
        setMockMermaid(original);

        expect(await installPeleFacade()).toBe('installed');

        const facade = getWindowMermaid();
        expect(facade).toBeDefined();
        expect(facade?.initialize).toBe(noop);
        expect(facade?.getConfig?.()).toEqual({ theme: 'dark' });
        expect(facade?.render).not.toBe(original.render);
    });

    it('renders Mermaid source through Pele', async () => {
        setMockMermaid(createMermaidMock());

        await installPeleFacade();

        const facade = getWindowMermaid();
        if (!facade) {
            throw new Error('facade was not installed');
        }

        const { svg } = await facade.render('id', 'flowchart LR\n A[Start] --> B[End]', {});
        expect(svg).toContain('<svg');
    });

    it('restores the original object', async () => {
        const original = createMermaidMock();
        setMockMermaid(original);

        await installPeleFacade();
        expect(getWindowMermaid()).not.toBe(original);

        expect(removePeleFacade()).toBe('restored');
        expect(getWindowMermaid()).toBe(original);
    });

    it('leaves a foreign Mermaid instance alone', () => {
        const foreign = { render: () => undefined };
        setWindowMermaid(foreign);

        expect(removePeleFacade()).toBe('skipped');
        expect(Reflect.get(window, 'mermaid')).toBe(foreign);
    });

    it('installs only once', async () => {
        setMockMermaid(createMermaidMock());

        expect(await installPeleFacade()).toBe('installed');
        expect(await installPeleFacade()).toBe('already');
    });
});
