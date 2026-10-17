# English 2n d'ESO - Grammar Lab & Practice

Una plataforma web interactiva d'aprenentatge d'anglès com a llengua estrangera per a l'alumnat de **2n d'ESO**, dissenyada específicament per a desplegar-se de manera gratuïta i immediata a **GitHub Pages**.

🔗 **URL del lloc web (un cop activat GitHub Pages):**  
`https://<teu-usuari-github>.github.io/english-eso2/`

---

## 🌟 Característiques pedagògiques

- **Enfocament DUA (Disseny Universal per a l'Aprenentatge):** Explicacions dividides en mòduls (micro-learning), amb codis de colors, taules comparatives, alertes visuals i bastides pas a pas.
- **Bastides de suport (Scaffolding):**
  - Eina interactiva *Tag Question Builder* per deduir la pregunta confirmatòria en 3 passos.
  - *Detectiu d'Errors Comuns* per anticipar i corregir les errades més freqüents de l'alumnat catalanoparlant.
  - Suport d'àudio integrat (mitjançant la síntesi de veu del navegador) per escoltar la pronunciació i l'entonació de les tag questions.
- **Zona de pràctica multinivell:**
  1. *Classificador ràpid:* Hàbits vs. Accions en curs.
  2. *Reptes de verbs estàtics:* Estats vs. Accions mentals (casos especials de *think*, *have*, *see*).
  3. *Taller de Tag Questions:* Completar tags amb explicació de la regla de l'imant.
  4. *El Gran Repte de la Unitat 2:* Qüestionari d'autoavaluació de 10 preguntes amb puntuació, confeti i informe de resultats.
- **Escalabilitat curricular (Unit 1 a Unit 8):** Arquitectura preparada per acollir les 8 unitats del curs de 2n d'ESO, amb la **Unitat 2** 100% interactiva i desenvolupada al detall.
- **Mode impressió:** Format adaptat per imprimir o desar en PDF com a fitxa de resum per a l'aula o deures.

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
   git remote add origin https://github.com/<teu-usuari-github>/english-eso2.git
   git push -u origin main
   ```

3. **Activa GitHub Pages:**
   - Dins del teu repositori a GitHub, ves a **Settings** > **Pages** (al menú lateral esquerre).
   - A l'apartat **Branch**, selecciona `main` i la carpeta `/ (root)`.
   - Fes clic a **Save**.
   - En un parell de minuts, la teva web estarà disponible a:  
     `https://<teu-usuari-github>.github.io/english-eso2/`

---

## 📚 Estructura de les Unitats (Syllabus 2n d'ESO)

| Unitat | Continguts Gramaticals | Estat |
| :--- | :--- | :--- |
| **Unit 1** | Present Simple & Adverbs of Frequency | Planificada |
| **Unit 2** | **Contrast Present Simple vs. Continuous, Stative Verbs & Tag Questions** | **Completada (Interactiva)** |
| **Unit 3** | Past Simple vs. Past Continuous, Time clauses (*when/while*) | Planificada |
| **Unit 4** | Comparatives, Superlatives & *(not) as... as* | Planificada |
| **Unit 5** | The Future: *Will*, *Be going to*, Present Continuous | Planificada |
| **Unit 6** | Modal Verbs: *Can, Could, Must, Should, Have to* | Planificada |
| **Unit 7** | Present Perfect Simple & *Just / Already / Yet* | Planificada |
| **Unit 8** | Conditionals (Zero & First) & Final Course Review | Planificada |

---

## 🛠️ Tecnologies emprades

- **HTML5 semàntic**
- **Tailwind CSS** (via CDN oficial)
- **Vanilla JavaScript** (sense necessitat de compilació ni dependències de Node)
- **Lucide Icons** & **Canvas-Confetti**
- **Web Speech API** per a l'àudio natiu d'anglès
