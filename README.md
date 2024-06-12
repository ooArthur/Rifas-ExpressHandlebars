![imagem](https://brandslogos.com/wp-content/uploads/images/large/nodejs-logo.png)

# Projeto de Rifas | Node.js com Express e Handlebars

Este projeto é uma atividade do curso técnico onde desenvolvemos uma aplicação web para gerenciamento de rifas, desenvolvida com Node.js, Express, e Handlebars, utilizando MySQL como banco de dados. O objetivo é permitir a criação, edição, e exclusão de rifas, além de oferecer um sistema de login e cadastro de usuários.

## Funcionalidades
- Criação e gerenciamento de rifas
- Cadastro e autenticação de usuários
- Cadastro de bilhetes para as rifas
- Painel para visualização de rifas ativas e finalizadas

## Instalação

1. Clone o repositório para sua máquina local:
```bash
   git clone https://github.com/Ath3Dev/Rifas-ExpressHandlebars.git
```
2. Navegue até o diretório do projeto:
```bash
    cd Rifas-ExpressHandlebars
```

3. Instale as dependências do projeto:
```bash
    npm i
```

4. Configure as variáveis de ambiente:
- Crie um arquivo .env na raiz do projeto com as seguintes informações:
```bash
    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASS=your_database_password
    DB=your_database_name
    JWTSECRET=your_jwt_secret
```

## Uso da Aplicação
1. Inicie o servidor:
```bash
    npm start
```

2. Abra o navegador e acesse:
```bash
    http://localhost:3000.
```

## Rotas Principais da Aplicação:

Página Home:
```html
    GET http://localhost:3000/
```

Página Cadastro de Usuarios:
```html
    GET http://localhost:3000/cadastro
    POST http://localhost:3000/cadastro/criar-usuario
```
Página Login de Usuarios:
```html
    GET http://localhost:3000/login
    POST http://localhost:3000/login/authUser
```
Página Painel:
```html
    GET http://localhost:3000/login
```
Página Criar Rifa:
```html
    GET http://localhost:3000/criarRifa
    POST http://localhost:3000/criarRifa/create
```

Página Detalhes das Rifas:
```html
    GET http://localhost:3000/detalhes/:id
    POST http://localhost:3000/delete/:id
```

Página Editar Rifa:
```html
    GET http://localhost:3000/editarRifa/:id
    POST http://localhost:3000/editarRifa/edit/:id
```

Página Cadastrar Bilhete:
```html
    GET http://localhost:3000/cadastrarBilhete/:rifaId/:bilheteNum
    POST http://localhost:3000/cadastrarBilhete
```

### Middleware de Autenticação
O middleware authMiddleware.js é utilizado para proteger as rotas que requerem autenticação, verificando a validade do token JWT.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue para relatar problemas ou propor novas funcionalidades. Você também pode enviar um pull request com suas melhorias.
