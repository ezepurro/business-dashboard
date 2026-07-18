import { GithubIcon, GlobeIcon, LinkedinIcon, MailIcon } from './icons';

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/ezepurro/', icon: GithubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ezequiel-purro/', icon: LinkedinIcon },
  { label: 'Portfolio', href: 'https://ezequiel-purro.netlify.app/', icon: GlobeIcon },
  { label: 'ezequiel.purro@gmail.com', href: 'mailto:ezequiel.purro@gmail.com', icon: MailIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-base font-semibold text-foreground">Business Dashboard</p>
            <p className="mt-2 max-w-xs text-sm text-foreground-secondary">
              Business Intelligence for growing companies — turning spreadsheets into decisions.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Connect</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => {
                const isMail = href.startsWith('mailto:');

                return (
                  <li key={label}>
                    <a
                      href={href}
                      target={isMail ? undefined : '_blank'}
                      rel={isMail ? undefined : 'noopener noreferrer'}
                      className="flex items-center gap-2 text-sm text-foreground-secondary transition hover:text-primary"
                    >
                      <Icon />
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Business Dashboard. Built for growing SMBs.
          </p>
        </div>
      </div>
    </footer>
  );
}
