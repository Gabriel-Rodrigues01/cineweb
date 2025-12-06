# Cineflex 🎬

Bem-vindo ao Cineflex, o sistema de gerenciamento de cinema mais caótico e divertido que você já viu! Se você achava que organizar sessões de filmes, vender ingressos e gerenciar salas era uma tarefa séria, pense de novo. Com o Cineflex, a gente leva a essa tarefaa um novo patamar de eficiência.

## O que raios é isso? 🤔

O Cineflex é um projeto feito em React com TypeScript que simula a administração de um cinema. Ele é perfeito para:

-   Desenvolvedores que amam filmes e códigos.
-   Estudantes que precisam de um projeto para o portfólio (e para dar umas risadas).
-   Qualquer pessoa que queira ver como *não* gerenciar um cinema na vida real.

## Funcionalidades (que funcionam... na maior parte do tempo) ✨

-   **Gerenciamento de Filmes:** Cadastre, edite, e exclua filmes. Você pode até adicionar um URL de imagem para deixar tudo mais bonito (ou mais feio, dependendo da sua escolha de imagem).
-   **Controle de Salas:** Adicione salas com capacidades variadas. Cuidado para não colocar 500 pessoas numa sala para 10. Ou coloque, a gente não vai te impedir.
-   **Agendamento de Sessões:** Marque sessões de filmes, combinando um filme, uma sala e um horário. Tente não agendar dois filmes na mesma sala ao mesmo tempo. Ou tente, e veja o caos acontecer.
-   **Venda de Ingressos:** Venda ingressos do tipo "Inteira" ou "Meia". O sistema até te avisa quando a sala está lotada, para você não ter que lidar com clientes bravos.

## Como Executar essa Obra de Arte 🎨

Para rodar o Cineflex na sua máquina e se divertir com a gente, siga estes passos (e reze para dar tudo certo):

**1. Clone o Repositório (ou baixe o ZIP, se você for old school):**

```bash
git clone https://github.com/seu-usuario/cineflex.git
cd cineflex
```

**2. Instale as Dependências (a parte chata):**

Com o [Node.js](https://nodejs.org/) instalado, rode o comando mágico:

```bash
npm install
```

**3. Inicie o Servidor JSON (o nosso "banco de dados" de mentirinha):**

Este comando vai iniciar um servidor local com os dados dos filmes, salas, etc.

```bash
npx json-server --watch db.json
```

**4. Rode a Aplicação (a hora da verdade):**

Em outro terminal, inicie a aplicação React:

```bash
npm run dev
```

**5. Acesse no Navegador:**

Abra o seu navegador e acesse [http://localhost:5173](http://localhost:5173). Se tudo deu certo, você verá o Cineflex em toda a sua glória. Se não, bem... boa sorte com o debug! 😉

## Contribuindo 🤝

Se você encontrou um bug (o que é bem provável) ou tem uma ideia para deixar o Cineflex ainda mais maluco, sinta-se à vontade para abrir uma *issue* ou um *pull request*. A gente adora ver o que vocês aprontam!

---

Feito com ☕, 🍕,😭 e muitas risadas por Gabriel Rodrigues. Divirta-se!
