# English 2n d'ESO - Grammar Lab & Practice

Una plataforma web interactiva d'aprenentatge d'anglès com a llengua estrangera per a l'alumnat de **2n d'ESO**, dissenyada específicament per a desplegar-se de manera gratuïta i immediata a **GitHub Pages**.

🔗 **URL del lloc web (un cop activat GitHub Pages):**  
`https://miquelangelfuentes.github.io/english-eso2/`

---

## 🌟 Característiques pedagògiques

- **Enfocament DUA (disseny universal per a l'aprenentatge):** explicacions dividides en mòduls (micro-learning), amb codis de colors, taules comparatives, alertes visuals i bastides pas a pas.
- **Bastides de suport (scaffolding):**
  - Eina interactiva *tag question builder* per deduir la pregunta confirmatòria en 3 passos.
  - *Detectiu d'errors comuns* per anticipar i corregir les errades més freqüents de l'alumnat catalanoparlant.
  - Suport d'àudio integrat (mitjançant la síntesi de veu del navegador) per escoltar la pronunciació i l'entonació de les tag questions.
- **Zona de pràctica multinivell:**
  1. *Classificador ràpid:* hàbits vs. accions en curs.
  2. *Reptes de verbs estàtics:* estats vs. accions mentals (casos especials de *think*, *have*, *see*).
  3. *Taller de tag questions:* completar tags amb explicació de la regla de l'imant.
  4. *El gran repte de la unitat 2:* qüestionari d'autoavaluació de 10 preguntes amb puntuació, confeti i informe de resultats.
- **Escalabilitat curricular (de la unitat 1 a la 8):** arquitectura preparada per acollir les 8 unitats del curs de 2n d'ESO, amb la **unitat 2** 100% interactiva i desenvolupada al detall.
- **Mode impressió:** format adaptat per imprimir o desar en PDF com a fitxa de resum per a l'aula o deures.

---

## 🚀 Com publicar a GitHub Pages en 3 minuts

1. **Crea un nou repositori a GitHub:**
   - Ves a [GitHub](https://github.com/new).
   - Anomena el repositori: `english-eso2` (o el nom que prefereixis).
   - Deixa'l com a **Públic**.

2. **Puja aquests fitxers:**
   Pots fer-ho des del terminal en aquesta mateixa carpeta:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: English 2n ESO Grammar Lab"
   git branch -M main
   git remote add origin https://github.com/miquelangelfuentes/english-eso2.git
   git push -u origin main
   ```

3. **Activa GitHub Pages:**
   - Dins del teu repositori a GitHub, ves a **Settings** > **Pages** (al menú lateral esquerre).
   - A l'apartat **Branch**, selecciona `main` i la carpeta `/ (root)`.
   - Fes clic a **Save**.
   - En un parell de minuts, la teva web estarà disponible a:  
     `https://miquelangelfuentes.github.io/english-eso2/`

---

## 📚 Estructura de les unitats (syllabus de 2n d'ESO)

| Unitat | Continguts gramaticals | Estat |
| :--- | :--- | :--- |
| **Unitat 1** | Present simple & adverbs of frequency | Planificada |
| **Unitat 2** | **Contrast: present simple vs. continuous, stative verbs & tag questions** | **Completada (interactiva)** |
| **Unitat 3** | Past simple vs. past continuous, time clauses (*when/while*) | Planificada |
| **Unitat 4** | Comparatives, superlatives & *(not) as... as* | Planificada |
| **Unitat 5** | The future: *will*, *be going to*, present continuous | Planificada |
| **Unitat 6** | Modal verbs: *can, could, must, should, have to* | Planificada |
| **Unitat 7** | Present perfect simple & *just / already / yet* | Planificada |
| **Unitat 8** | Conditionals (zero & first) & final course review | Planificada |

---

## 🛠️ Tecnologies emprades

- **HTML5 semàntic**
- **Tailwind CSS** (via CDN oficial)
- **Vanilla JavaScript** (sense necessitat de compilació ni dependències de Node)
- **Lucide Icons** & **Canvas-Confetti**
- **Web Speech API** per a l'àudio natiu d'anglès
