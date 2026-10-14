# BoaTour — sistema de usuários atualizado

## O que foi implementado

- Cadastro com validação de nome, CPF, e-mail, senha e termos.
- Senhas armazenadas com `bcrypt`.
- Login por CPF e senha.
- Sessão por token (`boatourSessionToken`) em vez de confiar apenas no ID enviado pelo navegador.
- Compatibilidade com as rotas antigas e novas:
  - `POST /registro`
  - `POST /usuarios/cadastro`
  - `POST /login`
  - `POST /usuarios/login`
- Consulta da conta logada: `GET /usuarios/me`.
- Alteração de nome, CPF, e-mail, telefone, data de nascimento e banner.
- Alteração de foto de perfil com limite de 5 MB e validação de JPG/PNG/WEBP.
- Alteração de senha exigindo a senha atual.
- Logout que invalida a sessão no servidor.
- Exclusão da conta exigindo confirmação da senha.
- Proteção para impedir que uma sessão altere ou consulte outra conta.
- Tratamento de CORS para `localhost:5500` e `127.0.0.1:5500`.
- Atualização automática dos dados do perfil no `localStorage`.
- Correção do erro comum de frontend chamar `/usuarios/cadastro` enquanto o servidor só possuía `/registro`.
- Recuperação de senha por código de seis dígitos enviado por e-mail, com expiração de 10 minutos e limite de tentativas.

## Banco de dados

Se você já possui o banco `boatour_bd`, execute:

`servidor/database/migracao_usuarios.sql`

Se for importar o `boatour_bd.sql` novamente do zero, ele já contém as novas colunas.

As novas colunas são:
- `telefone`
- `data_nascimento`
- `banner_perfil`

## Como executar

1. Abra o XAMPP/WAMP e inicie o MySQL/MariaDB.
2. Garanta que o banco se chama `boatour_bd`.
3. Execute a migração SQL acima caso esteja usando um banco que já existia.
4. Abra um terminal na pasta `servidor`.
5. Execute:
   `npm install`
6. Depois:
   `node app.js`
7. Abra o projeto pelo Live Server na porta 5500, por exemplo:
   `http://127.0.0.1:5500/`

## Recuperação de senha

Antes de iniciar a API, crie ou confira o arquivo `servidor/.env` com uma conta Gmail e uma **senha de app** (não use a senha normal da conta):

```env
EMAIL_REMETENTE=seu-email@gmail.com
EMAIL_SENHA_APP=sua-senha-de-app
```

Os nomes antigos `email_remitente` e `email_senha_app` também continuam compatíveis. No login, clique em **Esqueci minha senha**, informe o e-mail cadastrado e use o código recebido para criar a nova senha.

## Observação importante

Este projeto foi preparado para ambiente local/desenvolvimento. Para colocar em produção, o ideal é usar HTTPS, cookies de sessão `HttpOnly`/`Secure`, proteção CSRF, rate limiting, validação de MIME por conteúdo real e armazenamento de imagens em serviço apropriado.
