# Dermify - Platforma de Analiză a Tenului Alimentată de AI

![Dermify Logo](./public/dermifylogon.png)

Dermify este o aplicație web cuprinzătoare care ajută utilizatorii să analizeze produsele de îngrijire a tenului, să învețe despre ingrediente, să construiască rutine personalizate și să efectueze analize faciale alimentate de AI pentru recomandări de îngrijire a pielii.

## Funcționalități

- **Analiza Produselor**: Informații detaliate despre produsele de îngrijire a tenului, inclusiv ingrediente și recenzii
- **Baza de Date a Ingredientelor**: Bază de date cuprinzătoare a ingredientelor pentru îngrijirea pielii cu beneficii și preocupări potențiale
- **Rutine Personalizate**: Rutine curatate de îngrijire a tenului pentru diferite tipuri de piele și preocupări
- **Analiza Facială**: Analiză alimentată de AI pentru detectarea afecțiunilor pielii și recomandări personalizate
- **Chatbot AI**: Asistent inteligent pentru îngrijirea pielii care oferă sfaturi personalizate
- **Conturi de Utilizator**: Experiență personalizată cu produse, rutine și preferințe salvate
- **Moduri Întunecat/Luminos**: Experiență de vizualizare confortabilă în orice iluminare
- **Suport Multi-limbă**: În prezent suportă engleza și româna

## Arhitectura

Dermify folosește o arhitectură de microservicii cu următoarele componente:

- **Serviciul Web** (Next.js) - Aplicația frontend
- **API Gateway** - Orchestrarea serviciilor și rutarea cererilor
- **Serviciul AI** - Analiza pielii bazată pe YOLO
- **Serviciul Utilizatori** - Autentificare și gestionarea utilizatorilor
- **Serviciul Produse** - Gestionarea produselor și ingredientelor
- **Serviciul Chatbot** - Interfață conversațională alimentată de AI
- **Redis** - Cache și stocare sesiuni

## Tehnologii Folosite

### Frontend
- Next.js 15, React 19, Tailwind CSS 4
- TypeScript pentru siguranța tipurilor
- Design responsive cu suport pentru modul întunecat

### Servicii Backend
- **API Gateway**: Node.js/Express
- **Serviciul AI**: Python/FastAPI cu YOLOv8
- **Serviciul Utilizatori**: Node.js/Express cu autentificare JWT
- **Serviciul Produse**: Node.js/Express
- **Serviciul Chatbot**: Node.js/Express

### Infrastructură
- **Baza de Date**: Redis pentru cache și sesiuni
- **Containerizare**: Docker & Docker Compose
- **Orchestrare**: Scripturi personalizate de gestionare a serviciilor

## Start Rapid

### Opțiunea 1: Configurare Completă Docker (Recomandat)

1. **Clonează repository-ul:**
   ```bash
   git clone https://github.com/edy4ever78/dermify.git
   cd dermify
   ```

2. **Pornește toate serviciile:**
   ```bash
   # Windows
   npm run services:build
   npm run services:start
   
   # Linux/macOS
   ./manage-services.sh build
   ./manage-services.sh start
   ```

3. **Accesează aplicația:**
   - Aplicația Web: http://localhost:3000
   - API Gateway: http://localhost:4000
   - Status servicii: `npm run services:status`

### Opțiunea 2: Modul Dezvoltare

1. **Pornește infrastructura:**
   ```bash
   npm run services:dev
   ```

2. **Rulează serviciile individual:**
   ```bash
   # Terminal 1 - API Gateway
   cd services/gateway && npm install && npm run dev
   
   # Terminal 2 - Serviciul AI
   cd services/ai && pip install -r requirements.txt && python app.py
   
   # Terminal 3 - Serviciul Utilizatori
   cd services/user && npm install && npm run dev
   
   # Terminal 4 - Serviciul Produse
   cd services/product && npm install && npm run dev
   
   # Terminal 5 - Serviciul Chatbot
   cd services/chatbot && npm install && npm run dev
   
   # Terminal 6 - Frontend Web
   npm run dev
   ```

## Documentație

- **[Arhitectura Microserviciilor](./MICROSERVICES.md)** - Prezentare detaliată a arhitecturii
- **[Ghidul Dezvoltării](./DEVELOPMENT.md)** - Configurarea dezvoltării locale
- **[Documentația API](./API_DOCS.md)** - Referință completă API

## Configurare

1. **Copiază fișierul de mediu:**
   ```bash
   copy .env.example .env
   ```

2. **Configurează variabilele:**
   ```env
   REDIS_HOST=localhost
   REDIS_PORT=6379
   JWT_SECRET=cheia-ta-secreta
   API_GATEWAY_URL=http://localhost:4000
   ```

## Testare

```bash
# Verificare stare toate serviciile
npm run services:test

# Vizualizare log-uri
npm run services:logs

# Testare endpoint-uri specifice
curl http://localhost:4000/health
curl http://localhost:4000/api/products
```

## Scripturi Disponibile

### Gestionarea Serviciilor
- `npm run services:build` - Construiește toate serviciile
- `npm run services:start` - Pornește toate serviciile
- `npm run services:stop` - Oprește toate serviciile
- `npm run services:status` - Verifică starea serviciilor
- `npm run services:logs` - Vizualizează log-urile serviciilor
- `npm run services:dev` - Modul dezvoltare

### Dezvoltare
- `npm run dev` - Pornește serverul de dezvoltare frontend
- `npm run build` - Construiește frontend pentru producție
- `npm run start` - Pornește serverul de producție frontend

## Funcționalități Cheie

### Analiza Pielii Alimentată de AI
- Încarcă fotografii pentru analiză AI
- Detectează probleme ale pielii (acnee, pete întunecate, riduri)
- Primește recomandări personalizate de produse
- Urmărește istoricul analizelor

### Chatbot Inteligent
- Conversații în limbaj natural despre îngrijirea pielii
- Răspunsuri conștiente de context bazate pe analiză
- Recomandări de produse și ingrediente
- Asistență pentru construirea rutinelor

### Baza de Date a Produselor
- Catalog cuprinzător de produse
- Analiza ingredientelor și evaluări de siguranță
- Recomandări personalizate
- Compararea prețurilor și recenzii

### Gestionarea Utilizatorilor
- Autentificare securizată bazată pe JWT
- Profile personale și preferințe
- Urmărirea istoricului analizelor
- Rutine personalizate de îngrijire a pielii

## Endpoint-uri API

### Workflow-uri Principale
- `POST /api/workflow/skin-analysis` - Workflow complet de analiză
- `POST /api/chatbot/message` - Chat cu asistentul pentru îngrijirea pielii
- `GET /api/products` - Răsfoire produse cu filtrare
- `GET /api/recommendations` - Primește recomandări personalizate

Consultă [API_DOCS.md](./API_DOCS.md) pentru documentația completă.

## Deployare

### Configurare Producție
1. **Configurarea mediului:**
   ```bash
   NODE_ENV=production
   JWT_SECRET=cheie-secreta-producție-sigură
   REDIS_HOST=host-redis-producție
   ```

2. **Construire și deployare:**
   ```bash
   npm run services:build
   npm run services:start
   ```

3. **Monitorizarea stării:**
   ```bash
   npm run services:test
   ```

## Depanare

### Probleme Comune

1. **Conflicte de porturi:**
   ```bash
   # Verifică ce folosește portul
   netstat -ano | findstr :3000
   
   # Oprește procesele conflictuale
   taskkill /PID <PID> /F
   ```

2. **Probleme de conexiune Redis:**
   ```bash
   # Verifică starea Redis
   docker-compose ps redis
   
   # Repornește Redis
   docker-compose restart redis
   ```

3. **Verificări de stare servicii:**
   ```bash
   # Testează toate serviciile
   npm run services:test
   
   # Verifică log-urile unui serviciu specific
   docker-compose logs ai-service
   ```

## Structura Proiectului

```
dermify/
├── services/           # Microservicii
│   ├── gateway/       # API Gateway
│   ├── ai/           # Serviciul Analizei AI
│   ├── user/         # Gestionarea Utilizatorilor
│   ├── product/      # Serviciul Produselor
│   ├── chatbot/      # Serviciul Chatbot
│   └── web/          # Serviciul Frontend
├── app/              # Next.js App Router
├── components/       # Componente React
├── data/            # Date statice
├── lib/             # Utilitare
├── public/          # Asset-uri statice
├── docker-compose.yml
├── manage-services.ps1
└── manage-services.sh
```

## Contribuții

1. Fă fork la repository
2. Creează branch-ul tău de funcționalitate (`git checkout -b feature/FuncționalitateUimitoare`)
3. Comite modificările tale (`git commit -m 'Adaugă o funcționalitate uimitoare'`)
4. Push la branch (`git push origin feature/FuncționalitateUimitoare`)
5. Deschide un Pull Request

## Licența

Acest proiect este licențiat sub Licența MIT - consultă fișierul [LICENSE](LICENSE) pentru detalii.

## Mulțumiri

- YOLOv8 pentru capacitățile de analiză a pielii
- Echipa Next.js pentru framework-ul excelent
- Tailwind CSS pentru sistemul de stilizare
- Redis pentru cache și gestionarea sesiunilor

---

Pentru documentația detaliată, consultă:
- [Arhitectura Microserviciilor](./MICROSERVICES.md)
- [Ghidul Dezvoltării](./DEVELOPMENT.md)
- [Documentația API](./API_DOCS.md)
## Configurarea Dezvoltării Locale

### Prerechizituri

Înainte de a începe, asigură-te că ai instalate următoarele:

- [Node.js](https://nodejs.org/) (versiunea 18 sau mai nouă)
- [npm](https://www.npmjs.com/) sau [yarn](https://yarnpkg.com/)
- [Python](https://www.python.org/) (versiunea 3.8 sau mai nouă)
- [Redis](https://redis.io/) pentru cache (opțional, pentru dezvoltare locală)

### Instalare

1. Clonează repository-ul:
   ```powershell
   git clone https://github.com/edy4ever78/dermify.git
   cd dermify
   ```

2. Instalează dependențele Node.js:
   ```powershell
   npm install
   ```

3. Configurează mediul Python (opțional, pentru analiza facială):
   ```powershell
   # Creează un mediu virtual
   python -m venv venv
   
   # Activează mediul virtual
   .\venv\Scripts\Activate.ps1
   
   # Instalează pachetele necesare
   pip install -r requirements.txt
   ```

4. Configurează variabilele de mediu:
   - Copiază `.env.local.example` în `.env.local` (sau creează un fișier nou)
   - Actualizează detaliile conexiunii Redis dacă este necesar

5. Pornește serverul de dezvoltare:
   ```powershell
   npm run dev
   ```

6. Deschide [http://localhost:3000](http://localhost:3000) în browser pentru a vedea rezultatul.

### Configurarea Analizei Faciale AI

Funcționalitatea de analiză facială necesită un model YOLOv8 și backend Python:

1. Asigură-te că Python și pachetele necesare sunt instalate:
   ```powershell
   pip install ultralytics fastapi uvicorn python-multipart pillow
   ```

2. Fișierul modelului YOLOv8 (`best.pt`) trebuie plasat în una din aceste locații:
   - Locația principală: `/api/best.pt`
   - Locația alternativă: `/public/models/best.pt`
   
3. Aplicația Next.js va porni automat API-ul Python când este necesar

## Structura Proiectului

- `app/` - Pagini și layout-uri Next.js App Router
  - `api/` - Rute API pentru autentificare, produse și analiza pielii
  - `concerns/` - Pagini preocupări piele
  - `ingredients/` - Pagini baza de date ingrediente
  - `products/` - Pagini catalog produse
  - `routines/` - Pagini rutine îngrijire piele
  - `skin-analysis/` - Pagini analiză piele alimentată de AI
- `components/` - Componente React reutilizabile
- `context/` - Provideri React context (temă, locale, loading)
- `public/` - Asset-uri statice
  - `models/` - Fișiere model AI
- `api/` - API Python pentru analiza facială cu YOLOv8
- `data/` - Fișiere date statice
- `lib/` - Funcții utilitare și helperi
- `hooks/` - Hook-uri React personalizate
- `locales/` - Traduceri limbi

## Pagini Principale

- **Acasă** (`/`) - Pagina de destinație cu evidențierea funcționalităților
- **Produse** (`/products`) - Răsfoiește toate produsele de îngrijire a pielii
- **Ingrediente** (`/ingredients`) - Răsfoiește baza de date a ingredientelor pentru îngrijirea pielii
- **Preocupări Piele** (`/concerns`) - Explorează diferite preocupări ale pielii și soluții
- **Rutine** (`/routines`) - Vizualizează rutinele curatate de îngrijire a pielii
- **Analiza Pielii** (`/skin-analysis`) - Analizează pielea ta cu AI
- **Cont** (`/account/profile`) - Profilul utilizatorului și setări
- **Autentificare** - Pagini de conectare (`/signin`) și înregistrare (`/signup`)

## Dezvoltare

### Variabile de Mediu

Creează un fișier `.env.local` în directorul rădăcină cu următoarele variabile:

```
# Configurarea Redis
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_PASSWORD=parola_ta_dacă_este_necesară

# Opțional: configurarea Upstash Redis
# UPSTASH_REDIS_REST_URL=url-ul-tău-upstash
# UPSTASH_REDIS_REST_TOKEN=token-ul-tău-upstash
```

### Scripturi Disponibile

- `npm run dev` - Pornește serverul de dezvoltare
- `npm run build` - Construiește pentru producție
- `npm run start` - Pornește serverul de producție
- `npm run lint` - Rulează ESLint pentru verificarea calității codului
- `node scripts/importProducts.js` - Importă produse din CSV în modulul de date produse

## Rute API

### Autentificare

- `POST /api/auth/signup` - Înregistrează un utilizator nou
- `POST /api/auth/signin` - Conectează un utilizator
- `GET /api/auth/check-auth` - Verifică starea autentificării
- `POST /api/auth/signout` - Deconectează un utilizator

### Produse și Ingrediente

- `GET /api/products` - Obține toate produsele (cu filtre opționale)
- `GET /api/products/[id]` - Obține un produs specific după ID
- `GET /api/user/profile` - Obține datele profilului utilizatorului
- `PUT /api/user/profile/update` - Actualizează profilul utilizatorului

### Analiza Pielii

- `POST /api/skin-analysis/analyze` - Analizează o imagine a pielii
- `GET /api/skin-analysis/history` - Obține istoricul analizelor utilizatorului
- `GET /api/yolo-status` - Verifică starea API YOLOv8

## API Python YOLO

API-ul YOLOv8 oferă următoarele endpoint-uri:

- `POST /analyze` - Analizează o imagine a pielii și detectează afecțiunile pielii
- `GET /` - Verificare stare și informații API



