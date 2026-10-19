from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def remove_media_print(css_html: str) -> str:
    marker = '@media print'
    text = css_html
    while True:
        start = text.find(marker)
        if start == -1:
            break
        brace = text.find('{', start)
        if brace == -1:
            break
        depth = 0
        end = None
        for index in range(brace, len(text)):
            if text[index] == '{':
                depth += 1
            elif text[index] == '}':
                depth -= 1
                if depth == 0:
                    end = index + 1
                    break
        if end is None:
            break
        text = text[:start] + text[end:]
    return text


def remove_print_buttons(html: str) -> str:
    return re.sub(
        r'\s*<button\b[^>]*onclick=["\']window\.print\(\)["\'][^>]*>.*?</button>',
        '',
        html,
        flags=re.IGNORECASE | re.DOTALL,
    )


def add_shared_assets(html: str) -> str:
    if 'assets/site.css' not in html:
        html = html.replace('</head>', '  <link rel="stylesheet" href="assets/site.css">\n</head>', 1)
    if 'assets/site.js' not in html:
        html = html.replace('</body>', '  <script src="assets/site.js"></script>\n</body>', 1)
    return html


def apply_global_html_changes(html: str) -> str:
    html = remove_media_print(html)
    html = remove_print_buttons(html)
    html = add_shared_assets(html)

    replacements = {
        "Pla docent d'anglès de 2n d'ESO": "Anglès 2n d'ESO",
        "Pla docent d'anglès 2n d'ESO": "Anglès 2n d'ESO",
        "El gran repte de la unitat": "Repte final de la unitat",
        "El Gran Repte de la Unitat": "Repte final de la unitat",
        "fitxes imprimibles": "resums de consulta",
        "fitxa imprimible": "resum de consulta",
    }
    for old, new in replacements.items():
        html = html.replace(old, new)
    return html


def improve_index(html: str) -> str:
    html = html.replace(
        "Benvinguts i benvingudes al portal de gramàtica de 2n d'ESO. Aquí trobaràs les 8 unitats del curs explicades pas a pas de manera visual i clara, amb pistes de suport, activitats autocorrectives, fitxes resum i reptes de 10 preguntes per posar-te a prova.",
        "Aquest portal recull la gramàtica de 2n d'ESO perquè puguis consultar una explicació quan la necessitis i passar directament a la pràctica. Comença per la unitat que esteu treballant a classe; utilitza Reforç si necessites més suport i Ampliació quan vulguis aprofundir.",
    )
    html = html.replace(
        "Fes clic a qualsevol unitat per accedir directament a l'explicació per parts, les bastides de suport i la zona de pràctica interactiva.",
        "Entra primer a la unitat que esteu treballant a classe. Cada unitat inclou explicacions i pràctica; Reforç i Ampliació són itineraris alternatius, no tasques que calgui completar sempre.",
    )
    html = html.replace('>WEB DEDICADA<', '>PRÀCTICA DE VERBS IRREGULARS<')
    return html


def improve_unit2(html: str) -> str:
    html = html.replace(
        'Present tenses contrast, stative verbs i tag questions',
        'Present simple i present continuous, stative verbs i tag questions',
    )
    html = html.replace(
        "En aquesta unitat aprendràs a contrastar amb precisió quan cal utilitzar el <strong>present simple</strong> i quan el <strong>present continuous</strong>, quins verbs especials d'estat no admeten mai <code class=\"bg-black/30 px-1.5 py-0.5 rounded font-mono text-amber-300\">-ing</code>, i com construir preguntes confirmatòries (<strong>tag questions</strong>) amb total fluïdesa i seguretat.",
        "En aquesta unitat aprendràs a decidir quan cal utilitzar el <strong>present simple</strong> i quan el <strong>present continuous</strong>. També treballaràs com funcionen els verbs d'estat, inclosos els casos en què el significat permet el continuous, i com construir preguntes confirmatòries (<strong>tag questions</strong>).",
    )
    html = html.replace(
        'Verbs de sentiment, ment i possessió que no porten mai <em>-ing</em>.',
        'Quan expressen un estat, aquests verbs normalment no s’utilitzen en continuous.',
    )
    html = html.replace(
        "Els verbs estàtics expressen <strong>estats</strong> (no pas accions físiques en moviment). Per aquest motiu, <strong>no s'acostumen a fer servir mai en present continuous (<span class=\"line-through text-rose-500 font-mono\">-ing</span>)</strong>!",
        "Els verbs estàtics expressen <strong>estats</strong>. Quan tenen aquest significat, normalment no s'utilitzen en present continuous (<span class=\"line-through text-rose-500 font-mono\">-ing</span>). Alguns verbs també poden expressar una acció i, en aquest cas, sí que admeten continuous.",
    )
    html = html.replace(
        "Exacte! 'Want' és un desig i és sempre un verb estàtic; mai no es diu 'is wanting'.",
        "Exacte! En aquest significat, 'want' expressa un desig i s'utilitza en present simple: no diem 'is wanting'.",
    )
    html = html.replace(
        "Quin d'aquests verbs no s'acostuma a utilitzar mai en present continuous?",
        "Quin d'aquests verbs s'utilitza normalment en present simple quan expressa un estat?",
    )
    return html


def improve_unit2_reforc(html: str) -> str:
    html = html.replace(
        "Aquesta fitxa de reforç t'ajuda a dominar la diferència entre el present simple (accions habituals) i el present continuous (accions que passen ara mateix), a memoritzar els verbs estàtics que no s'utilitzen en -ing, i a formar les preguntes confirmatòries (tag questions) sense dubtar.",
        "Aquesta pàgina de reforç t'ajuda a consolidar la diferència entre present simple i present continuous. També treballaràs els verbs d'estat quan no utilitzen continuous i la formació de les preguntes confirmatòries (tag questions).",
    )
    html = html.replace(
        '3. Verbs estàtics (stative verbs): mai en -ing',
        '3. Verbs estàtics (stative verbs): quan expressen un estat',
    )
    html = html.replace(
        'Diferència essencial: sempre es conjuguen en present simple, encara que sigui ara mateix.',
        'Quan expressen un estat, normalment els fem servir en present simple, també si parlem del moment actual.',
    )
    html = html.replace(
        "Diem <em>'I understand now'</em> (mai <em>'I am understanding'</em>).",
        "Diem <em>'I understand now'</em>; en aquest significat no utilitzem <em>'I am understanding'</em>.",
    )
    html = html.replace(
        "Sé la resposta a aquesta pregunta (mai en -ing).",
        "Sé la resposta a aquesta pregunta (aquí, en present simple).",
    )
    html = html.replace(
        "Ella vol un got d'aigua (mai 'is wanting').",
        "Ella vol un got d'aigua (aquí, no 'is wanting').",
    )
    html = html.replace(
        "norma fonamental: 'want' i 'need'",
        "recorda: 'want' i 'need' per expressar estat",
    )
    html = html.replace(
        "Els verbs de desig o necessitat mai es posen amb -ing. Sempre en present simple.",
        "Quan expressen desig o necessitat, verbs com 'want' i 'need' s'utilitzen normalment en present simple.",
    )
    html = html.replace(
        "'Understand' és un verb estàtic, no es posa mai en present continu.",
        "En aquest significat, 'understand' expressa un estat i s'utilitza en present simple.",
    )
    return html


def improve_readme(text: str) -> str:
    text = re.sub(
        r'- \*\*Mode impressió:\*\*.*?(?:\n|$)',
        '- **Progrés local:** el navegador recorda l’última unitat visitada i pot conservar el millor resultat dels reptes, sense comptes d’usuari ni enviament de dades.\n',
        text,
    )
    text = text.replace(
        '- **Enfocament visual i accessible:** explicacions dividides en mòduls (micro-learning), amb codis de colors, taules comparatives, alertes visuals i bastides pas a pas.',
        '- **Enfocament visual i accessible:** explicacions dividides en mòduls, navegació per teclat, focus visible i compatibilitat amb la preferència de moviment reduït.',
    )
    text = text.replace(
        "- **Escalabilitat curricular (de la unitat 1 a la 8):** arquitectura preparada per acollir les 8 unitats del curs de 2n d'ESO, amb la **unitat 2** 100% interactiva i desenvolupada al detall.",
        '- **Curs complet:** les 8 unitats disposen de pàgina principal i itineraris de reforç i ampliació. La capa compartida d’interacció es centralitza a `assets/site.js` i `assets/site.css`.',
    )
    if 'Producció pròpia' not in text:
        anchor = '- **Zona de pràctica multinivell:**\n'
        addition = '- **Producció pròpia:** la unitat 2 incorpora activitats obertes sense opcions de resposta i amb models que es poden revelar després de l’intent.\n'
        if anchor in text:
            text = text.replace(anchor, addition + anchor, 1)
    return text


def main() -> None:
    changed = []
    for path in sorted(ROOT.glob('*.html')):
        original = path.read_text(encoding='utf-8')
        html = apply_global_html_changes(original)

        if path.name == 'index.html':
            html = improve_index(html)
        elif path.name == 'unit2.html':
            html = improve_unit2(html)
        elif path.name == 'unit2-reforc.html':
            html = improve_unit2_reforc(html)

        if html != original:
            path.write_text(html, encoding='utf-8')
            changed.append(path.name)

    readme = ROOT / 'README.md'
    if readme.exists():
        original = readme.read_text(encoding='utf-8')
        updated = improve_readme(original)
        if updated != original:
            readme.write_text(updated, encoding='utf-8')
            changed.append(readme.name)

    print('Fitxers actualitzats:')
    for name in changed:
        print(f'- {name}')


if __name__ == '__main__':
    main()
