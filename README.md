# English 2n d'ESO - Grammar Lab i Practice

Plataforma web interactiva per treballar la gramàtica d'anglès com a llengua estrangera amb alumnat de **2n d'ESO**. El curs combina explicacions guiades amb pràctica autocorrectiva i ofereix itineraris diferenciats de reforç i ampliació.

**Web:** https://miquelangelfuentes.github.io/english-eso2/

## Què ofereix

- **8 unitats completes**. Cada unitat disposa d'una pàgina principal i d'itineraris de **Reforç** i **Ampliació**.
- **Explicacions amb bastides de suport** i activitats de pràctica amb retorn immediat.
- **Progrés local**. El navegador recorda l'última unitat visitada i pot conservar el millor resultat dels reptes sense comptes d'usuari.
- **Mode clar i mode fosc**. La preferència es conserva al navegador i, si no n'hi ha cap de desada, es respecta la configuració del sistema.
- **Disseny visual unificat**. La interfície utilitza Arial com a tipografia principal i comparteix criteris de color, components i jerarquia visual entre totes les pàgines.
- **Accessibilitat**. Hi ha navegació per teclat i focus visible; les animacions no essencials respecten la preferència de moviment reduït.
- **Contrast revisat automàticament** en totes les pàgines, tant en mode clar com en mode fosc.

## Unitats

| Unitat | Continguts gramaticals |
| --- | --- |
| **1** | *There is / there are*, quantificadors i pronoms personals objecte |
| **2** | *Present simple* vs. *present continuous*, verbs estàtics i *tag questions* |
| **3** | *Past simple*, *there was / there were* i *used to* |
| **4** | Comparatius, *(not) as... as*, *too / (not) enough* i superlatius |
| **5** | Verbs modals - *can, could, must, should, have to, need to* |
| **6** | *Past continuous* i contrast amb *past simple* |
| **7** | Formes de futur i primer condicional |
| **8** | *Present perfect*, partícules temporals, *for / since* i contrast amb *past simple* |

## Estructura del curs

Els fitxers `unit1.html` a `unit8.html` contenen les pàgines principals. Cada unitat té també les variants `-reforc.html` i `-ampliacio.html`.

La capa compartida d'interacció es concentra a:

- `assets/site.js` - navegació, progrés local i comportaments comuns.
- `assets/site.css` - estils compartits del portal.
- `portal-theme.js` i `portal-theme.css` - selector de tema i adaptació clar/fosc.
- `portal-contrast.css`, `portal-readability.css` i `portal-final-contrast.css` - ajustos de llegibilitat i contrast.
- `STYLE_GUIDE.md` - criteris visuals compartits del projecte.
- `scripts/apply_site_improvements.py` - generació i poliment dels fitxers de producció.

## Producció i desplegament

El projecte es publica com a lloc estàtic a **GitHub Pages**.

Tailwind CSS es compila a `assets/tailwind.css`. La versió publicada **no depèn de Tailwind Play CDN**. El navegador executa JavaScript sense framework i no necessita Node.js en temps d'execució.

El workflow `.github/workflows/apply-site-improvements.yml` aplica els ajustos compartits i compila el CSS de producció. També executa una auditoria de contrast de totes les pàgines en mode clar i fosc abans de consolidar els fitxers generats.

## Tecnologies

- HTML5 i CSS compilat amb Tailwind CSS.
- JavaScript sense framework.
- Lucide Icons i Canvas Confetti.
- Web Speech API per a les activitats que utilitzen síntesi de veu.
- GitHub Actions per al procés de producció i les comprovacions visuals.

## Dades i privacitat

El progrés que es conserva es desa amb `localStorage` al navegador. No cal iniciar sessió i el projecte no envia aquest progrés a cap servidor propi.

## Llicències

- **Codi** - [GNU AGPL v3](https://www.gnu.org/licenses/agpl-3.0.html).
- **Continguts educatius** - [Creative Commons CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.ca).
