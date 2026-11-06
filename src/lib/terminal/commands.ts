export interface TerminalProject {
  slug: string;
  name: string;
  summary: string;
}

export interface TerminalContext {
  projects: readonly TerminalProject[];
  email: string;
  github: string;
  linkedin: string;
  location: string;
  role: string;
  resumeHref: string | null;
}

export type TerminalAction =
  | { type: 'navigate'; href: string }
  | { type: 'open'; href: string }
  | { type: 'clear' }
  | { type: 'close' };

export interface TerminalOutput {
  lines: readonly string[];
  action?: TerminalAction;
}

export const HELP = [
  'whoami          who is this',
  'ls              list projects',
  'open <project>  jump to a case study',
  'stack           what I work with',
  'cv              open my CV',
  'contact         how to reach me',
  'fit             check me against your role',
  'break           go and break the payment simulator',
  'clear           clear the screen',
  'exit            close the terminal',
];

/**
 * The interpreter. Pure, so every command is covered by a plain unit test and
 * the component is left with nothing to do but draw lines.
 */
export function runCommand(input: string, context: TerminalContext): TerminalOutput {
  const [command = '', ...rest] = input.trim().toLowerCase().split(/\s+/);
  const argument = rest.join(' ');

  switch (command) {
    case '':
      return { lines: [] };
    case 'help':
    case '?':
      return { lines: HELP };
    case 'whoami':
      return { lines: [`Nadir Hussain, ${context.role}. ${context.location}.`] };
    case 'ls':
      return {
        lines: context.projects.map(
          (project) => `${project.slug.padEnd(20)} ${project.summary}`,
        ),
      };
    case 'cat':
    case 'cd':
    case 'open': {
      if (argument === '') return { lines: ['usage: open <project>. Try ls.'] };
      const project = context.projects.find(
        ({ slug, name }) =>
          slug.startsWith(argument) || name.toLowerCase().startsWith(argument),
      );
      return project === undefined
        ? { lines: [`open: ${argument}: no such project. Try ls.`] }
        : {
            lines: [`opening ${project.name}…`],
            action: { type: 'navigate', href: `#${project.slug}` },
          };
    }
    case 'stack':
      return {
        lines: ['opening the stack…'],
        action: { type: 'navigate', href: '#stack' },
      };
    case 'fit':
      return {
        lines: ['opening the matcher…'],
        action: { type: 'navigate', href: '#fit' },
      };
    case 'break':
      return {
        lines: ['opening the simulator. Try the processor timeout.'],
        action: { type: 'navigate', href: '#playground' },
      };
    case 'cv':
    case 'resume':
      return context.resumeHref === null
        ? { lines: ['cv: not published yet.'] }
        : {
            lines: ['opening cv…'],
            action: { type: 'open', href: context.resumeHref },
          };
    case 'contact':
      return {
        lines: [
          `email     ${context.email}`,
          `github    ${context.github}`,
          `linkedin  ${context.linkedin}`,
        ],
      };
    case 'sudo':
      return argument.includes('hire')
        ? {
            lines: ['Password accepted. Opening the channel…'],
            action: { type: 'navigate', href: '#contact' },
          }
        : { lines: ['nadir is not in the sudoers file. This will be reported.'] };
    case 'rm':
      return { lines: ['Nice try. Production has backups.'] };
    case 'clear':
      return { lines: [], action: { type: 'clear' } };
    case 'exit':
    case 'quit':
      return { lines: [], action: { type: 'close' } };
    default:
      return { lines: [`${command}: command not found. Try help.`] };
  }
}
