from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]

TAILWIND_CDN_RE = re.compile(r'\s*<script\s+src=["\']https://cdn\.tailwindcss\.com["\']></script>\s*', re.I)
TAILWIND_CONFIG_RE = re.compile(r'\s*<script>\s*tailwind\.config\s*=.*?</script>\s*', re.I | re.S)


def ensure_tailwind_config() -> None:
    config = ROOT / 'tailwind.config.cjs'
    if config.exists():
        return

    node_script = r'''
const fs = require('fs');
const vm = require('vm');

function merge(target, source) {
  for (const [key, value] of Object.entries(source || {})) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      target[key] ??= {};
      merge(target[key], value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

const extend = {};
let found = false;
for (const file of fs.readdirSync('.').filter(name => name.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  const scripts = html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi);
  for (const match of scripts) {
    const code = match[1];
    if (!code.includes('tailwind.config')) continue;
    const sandbox = { tailwind: {} };
    vm.runInNewContext(code, sandbox, { filename: file });
    merge(extend, sandbox.tailwind?.config?.theme?.extend || {});
    found = true;
  }
}

if (!found) throw new Error('No s’ha trobat cap configuració Tailwind per migrar.');

const out = `module.exports = {
  content: ['./*.html', './assets/**/*.js'],
  safelist: [
    {
      pattern: /^(bg|text|border|ring)-(slate|indigo|emerald|amber|rose|sky|purple|pink|blue|orange|red|green|brand|simple|continuous|tag)-(50|100|200|300|400|500|600|700|800|900|950)$/,
      variants: ['hover', 'focus']
    }
  ],
  theme: { extend: ${JSON.stringify(extend, null, 2)} }
};\n`;
fs.writeFileSync('tailwind.config.cjs', out);
'''
    subprocess.run(['node', '-e', node_script], cwd=ROOT, check=True)


def build_tailwind() -> None:
    ensure_tailwind_config()
    src = ROOT / 'src'
    assets = ROOT / 'assets'
    src.mkdir(exist_ok=True)
    assets.mkdir(exist_ok=True)
    input_css = src / 'tailwind-input.css'
    input_css.write_text('@tailwind base;\n@tailwind components;\n@tailwind utilities;\n', encoding='utf-8')
    subprocess.run(
        [
            'npx', '--yes', 'tailwindcss@3.4.17',
            '-c', 'tailwind.config.cjs',
            '-i', 'src/tailwind-input.css',
            '-o', 'assets/tailwind.css',
            '--minify',
        ],
        cwd=ROOT,
        check=True,
    )


def migrate_tailwind(html: str) -> str:
    html = TAILWIND_CDN_RE.sub('\n', html)
    html = TAILWIND_CONFIG_RE.sub('\n', html)
    link = '<link rel="stylesheet" href="assets/tailwind.css">'
    if link not in html:
        if '<link rel="stylesheet" href="assets/site.css">' in html:
            html = html.replace(
                '<link rel="stylesheet" href="assets/site.css">',
                f'{link}\n  <link rel="stylesheet" href="assets/site.css">',
                1,
            )
        else:
            html = html.replace('</head>', f'  {link}\n</head>', 1)
    return html


def polish_html(path: Path, html: str) -> str:
    html = migrate_tailwind(html)

    if path.name == 'index.html':
        html = html.replace(
            '<strong>11 packs de 10 alfabèticament</strong>',
            '<strong>11 packs d\'aprenentatge - 10 packs de 10 verbs i un últim de 8</strong>',
        )

    if path.name == 'unit2.html':
        html = html.replace(
            'verbs que no accepten -ing (stative verbs)',
            'verbs d’estat i els casos en què normalment no utilitzem -ing (stative verbs)',
        )
        html = html.replace(
            'Contrast present simple vs. present continuous (rutines vs. ara mateix), verbs que no accepten -ing (stative verbs) i preguntes confirmatòries (tag questions).',
            'Contrast present simple vs. present continuous, verbs d’estat i casos en què el significat permet continuous, i preguntes confirmatòries (tag questions).',
        )

    if 'id="units-modal"' in html:
        html = re.sub(
            r'<div id="units-modal"(?![^>]*\brole=)',
            '<div id="units-modal" role="dialog" aria-modal="true" aria-labelledby="units-modal-title" aria-hidden="true"',
            html,
            count=1,
        )
        html = re.sub(
            r'<h2(?![^>]*\bid=)([^>]*)>Programa de gramàtica \(unitats 1-8\)</h2>',
            r'<h2 id="units-modal-title"\1>Programa de gramàtica (unitats 1-8)</h2>',
            html,
            count=1,
        )
        html = html.replace(
            'onclick="toggleUnitsModal()" class="flex items-center',
            'onclick="toggleUnitsModal()" aria-controls="units-modal" aria-expanded="false" class="flex items-center',
        )

    return html


def polish_shared_js() -> None:
    path = ROOT / 'assets' / 'site.js'
    if not path.exists():
        return
    text = path.read_text(encoding='utf-8')
    marker = "const modalToggles = Array.from(document.querySelectorAll('[aria-controls=\"units-modal\"]'));"
    if marker not in text:
        text = text.replace(
            "modal.setAttribute('aria-hidden', modal.classList.contains('hidden') ? 'true' : 'false');",
            "modal.setAttribute('aria-hidden', modal.classList.contains('hidden') ? 'true' : 'false');\n    const modalToggles = Array.from(document.querySelectorAll('[aria-controls=\"units-modal\"]'));\n    modalToggles.forEach((button) => button.setAttribute('aria-expanded', modal.classList.contains('hidden') ? 'false' : 'true'));",
            1,
        )
        text = text.replace(
            "modal.setAttribute('aria-hidden', isHidden ? 'true' : 'false');",
            "modal.setAttribute('aria-hidden', isHidden ? 'true' : 'false');\n        modalToggles.forEach((button) => button.setAttribute('aria-expanded', isHidden ? 'false' : 'true'));\n        document.querySelector('main')?.toggleAttribute('inert', !isHidden);",
            1,
        )
    path.write_text(text, encoding='utf-8')


def polish_readme() -> None:
    path = ROOT / 'README.md'
    if not path.exists():
        return
    text = path.read_text(encoding='utf-8')
    note = '- **CSS de producció:** Tailwind es compila a `assets/tailwind.css`; el lloc no depèn del Play CDN de Tailwind.\n'
    if note not in text:
        anchor = '- **Curs complet:**'
        pos = text.find(anchor)
        if pos != -1:
            line_end = text.find('\n', pos)
            text = text[:line_end + 1] + note + text[line_end + 1:]
        else:
            text += '\n' + note
    path.write_text(text, encoding='utf-8')


def validate() -> None:
    for path in ROOT.glob('*.html'):
        html = path.read_text(encoding='utf-8')
        if 'cdn.tailwindcss.com' in html or 'tailwind.config' in html:
            raise RuntimeError(f'Tailwind Play CDN encara és present a {path.name}')
        if 'assets/tailwind.css' not in html:
            raise RuntimeError(f'Falta assets/tailwind.css a {path.name}')
    if not (ROOT / 'assets' / 'tailwind.css').exists():
        raise RuntimeError('No s’ha generat assets/tailwind.css')


def main() -> None:
    # La primera execució compila a partir de les configuracions encara incrustades.
    build_tailwind()

    changed = []
    for path in sorted(ROOT.glob('*.html')):
        original = path.read_text(encoding='utf-8')
        updated = polish_html(path, original)
        if updated != original:
            path.write_text(updated, encoding='utf-8')
            changed.append(path.name)

    polish_shared_js()
    polish_readme()
    validate()

    print('Poliment final completat.')
    for name in changed:
        print(f'- {name}')


if __name__ == '__main__':
    main()
