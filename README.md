# Mechasys Website Clone

Clone 100% idêntico e completo do site oficial da **Mechasys** ([https://inspired-papaya-993590.framer.app](https://inspired-papaya-993590.framer.app)).

Todos os recursos foram preservados com máxima fidelidade:
- **Tipografia e Fontes originais**: Fonte proprietária Fontshare (General Sans / Satoshi) e família completa do Inter em `.woff2` localizados.
- **Logotipos e Identidade Visual**: Vetores SVG oficiais da Mechasys e de todos os parceiros (ALEC, Egg-Telsa, etc.).
- **Imagens e Mídias**: Todas as imagens em alta resolução em WebP, PNG, JPG e o vídeo em MP4 do XR Projector.
- **Nenhuma informação inventada**: Todos os textos, seções, estudos de caso, dados de projetos e formulários são os originais exatos.
- **Todas as 47 rotas e páginas** compiladas e organizadas com renderização estática (SSG) e hidratação dinâmica.

---

## 🚀 Como Rodar Localmente

Você pode iniciar o site no seu navegador com qualquer um dos métodos abaixo:

### Método 1: Python (Recomendado)
Execute na raiz da pasta:
```bash
./serve.py
```
ou:
```bash
python3 -m http.server 3000
```
Depois acesse: [http://localhost:3000](http://localhost:3000)

### Método 2: Node.js / NPM
```bash
npm start
```
ou:
```bash
npx serve . -p 3000
```

---

## 📁 Estrutura do Projeto

```
Mechasys_website/
├── index.html                 # Página inicial (Home)
├── how-it-works/              # Como Funciona (How it works)
├── applications/              # Aplicações (Applications)
├── company/                   # Sobre a Empresa (Company)
├── contactus/                 # Contato & Formulário (Contact us)
├── become-a-dealer/           # Torne-se um Parceiro (Become a Partner)
├── datasheet/                 # Datasheet técnico do XR Projector
├── careers/                   # Carreiras (Careers)
├── press-kit/                 # Kit de Imprensa (Press kit)
├── pricing/                   # Informações de Aquisição
├── resources/                 # Central de Recursos (Resources)
│   ├── customer-results/      # Estudos de Caso (Case Studies)
│   ├── events/                # Feiras e Eventos (Events)
│   ├── insights/              # Blog e Artigos Técnicos (Insights)
│   └── latest-news/           # Notícias e Comunicados à Imprensa
├── legal/                     # Páginas Jurídicas
│   ├── cookie-policy/
│   ├── eula/
│   ├── privacy-policy/
│   ├── terms/
│   └── terms-of-service/
├── assets/                    # Fontes web WOFF2 e vídeo do produto (MP4)
├── images/                    # Imagens, fotos e logotipos (WebP, PNG, SVG)
├── sites/                     # Scripts JS de componentes e interatividade
├── third-party-assets/        # Fontes de tipografia especializada (Fontshare)
├── package.json               # Configurações do Node/NPM
├── vercel.json                # Configuração para deploy na Vercel
├── netlify.toml               # Configuração para deploy no Netlify
└── serve.py                   # Servidor local imediato em Python
```

---

## 🌐 Deploy em Produção

O projeto é 100% estático e compatível com qualquer serviço de hospedagem:

- **Vercel**: Basta conectar o repositório ou rodar `vercel` no terminal.
- **Netlify**: Basta conectar o repositório ou rodar `netlify deploy --prod`.
- **Cloudflare Pages**: Conecte o repositório, defina o build output directory como `.`.
- **GitHub Pages**: Habilite o GitHub Pages na branch `main`.
