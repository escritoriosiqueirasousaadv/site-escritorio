# Como publicar o site e criar seu login para editar o blog

Este guia mostra como colocar o site no ar de graça e ganhar uma área de
login de verdade (com usuário e senha), onde você escreve os textos do
blog numa tela simples, sem mexer em código.

A solução usa três serviços gratuitos:

- **GitHub** — guarda os arquivos do site (como uma pasta na nuvem).
- **Netlify** — hospeda o site e o coloca no ar.
- **Cloudflare** — cuida do login com sua conta do GitHub.

Nenhum deles cobra nada para um site como o seu.

---

## Passo 1 — Colocar os arquivos no GitHub

1. Crie uma conta em [github.com](https://github.com) (gratuita).
2. Clique em "New repository", dê um nome (ex: `site-escritorio`) e marque
   como privado ou público, como preferir.
3. Envie todos os arquivos desta pasta do site para dentro desse
   repositório (o GitHub tem um botão de "upload files" direto pelo
   navegador — não precisa instalar nada).

## Passo 2 — Publicar no Netlify

1. Crie uma conta em [netlify.com](https://netlify.com), usando "Sign up
   with GitHub" para já conectar as duas contas.
2. Clique em "Add new site" → "Import an existing project" → escolha o
   repositório que você criou no Passo 1.
3. O Netlify já vai reconhecer as configurações de publicação sozinho
   (estão no arquivo `netlify.toml`). Clique em "Deploy".
4. Em alguns minutos o site estará no ar num endereço tipo
   `nome-aleatorio.netlify.app`. Depois, em Site settings → Domain
   management, você pode ligar seu domínio próprio (ex:
   siqueirasousa.adv.br), se já tiver comprado um.

## Passo 3 — Criar o login (Cloudflare + GitHub)

Isso permite que você entre no painel `/admin` do site com sua conta do
GitHub.

1. Acesse [github.com/sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)
   e siga o botão de deploy para o Cloudflare Workers (ou crie uma conta
   grátis em [cloudflare.com](https://cloudflare.com), vá em Workers e
   importe esse projeto). Ao final, você terá um endereço parecido com
   `https://sveltia-cms-auth.SEUNOME.workers.dev` — guarde-o.
2. No GitHub, vá em Settings → Developer settings → OAuth Apps → "New
   OAuth App" e preencha:
   - Homepage URL: o endereço do seu site no Netlify
   - Authorization callback URL: o endereço do Worker do passo anterior
     + `/callback` (ex: `https://sveltia-cms-auth.SEUNOME.workers.dev/callback`)
3. O GitHub vai gerar um **Client ID** e um **Client Secret**. Copie os
   dois.
4. Volte ao Cloudflare, no seu Worker, vá em Settings → Variables e
   cole o Client ID e o Client Secret nas variáveis `GITHUB_CLIENT_ID`
   e `GITHUB_CLIENT_SECRET`.

## Passo 4 — Ligar tudo no arquivo de configuração

Abra o arquivo `admin/config.yml` (direto pelo GitHub, tem um lápis de
edição em cada arquivo) e troque as três linhas marcadas "TROCAR AQUI":

- `repo:` → coloque `seu-usuario/nome-do-repositorio`
- `base_url:` → coloque o endereço do Worker do Passo 3
- `site_url:` → coloque o endereço do seu site no Netlify (ou seu domínio próprio)

Salve o arquivo (isso já conta como uma publicação, o Netlify atualiza
o site sozinho).

## Passo 5 — Usar o painel

Acesse `SEUSITE.netlify.app/admin`, clique em "Login with GitHub",
autorize, e pronto: você verá uma tela com a lista de textos do blog,
um botão de "Novo texto", campos para título, data, resumo e o texto
completo. Ao clicar em publicar, o site atualiza sozinho em 1 ou 2
minutos.

---

### Se preferir, eu ajudo a fazer isso com você

Esses passos envolvem criar contas em sites de terceiros (GitHub,
Netlify, Cloudflare), que só você pode fazer com seus próprios dados de
login. Se quiser, me chame durante o processo e vou te orientando tela
por tela.

### Enquanto isso

Até você publicar o site de verdade, continue usando o arquivo
`assets/data/posts.js` para adicionar textos (veja as instruções no
topo dele) — funciona igual, só que editando o arquivo direto.
