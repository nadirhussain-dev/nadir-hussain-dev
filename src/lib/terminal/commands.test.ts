import { describe, expect, it } from 'vitest';
import { runCommand, type TerminalContext } from './commands';

const context: TerminalContext = {
  projects: [{ slug: 'daynora', name: 'Daynora', summary: 'Local-first life app' }],
  email: 'a@b.c',
  github: 'gh',
  linkedin: 'li',
  location: 'Multan',
  role: 'Engineer',
  resumeHref: '/cv.pdf',
};

describe('runCommand', () => {
  it('opens a project by slug prefix, ignoring case', () => {
    expect(runCommand('OPEN day', context).action).toEqual({
      type: 'navigate',
      href: '#daynora',
    });
  });

  it('reports an unknown project and an unknown command', () => {
    expect(runCommand('open nope', context).lines[0]).toContain('no such project');
    expect(runCommand('vim', context).lines[0]).toContain('command not found');
  });

  it('handles a missing CV', () => {
    expect(runCommand('cv', { ...context, resumeHref: null }).action).toBeUndefined();
    expect(runCommand('cv', context).action).toEqual({ type: 'open', href: '/cv.pdf' });
  });

  it('ignores blank input', () => {
    expect(runCommand('   ', context)).toEqual({ lines: [] });
  });

  it('honours sudo hire', () => {
    expect(runCommand('sudo hire nadir', context).action).toEqual({
      type: 'navigate',
      href: '#contact',
    });
  });
});
