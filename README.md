# Social-Network
Exemplo de Aplicação Web que funciona como Rede social.

## Funcionalidades

- Usuário
  * **Criar conta** - Possível criar conta utilizando email e senha
  * **Fazer Login** - Antes de utilizar qualquer rota da api é necessário autenticar
  * **Deletar conta** - Caso deseje, é possível deletar a sua própria conta (Deletar a conta não deleta postagens)
  * **Pesquisar usuários** - Pesquise por uma lista de usuário pelo nome ou um usuário pelo id
  * **Atualizar perfil** - Atualize seu nome e biografia, além da foto de perfil e capa
- Seguidor
  * **Seguir** - Siga ou Deixe de seguir um usuário
  * **Listar Seguidores** - Liste os seguidores ou os seguindo de um usuário
  * **Contar Seguidores** - Conte o número de seguidores e seguindo de um usuário
- Postagem
  * **Pesquisar postagens** - É possível pesquisar postagens por vários filtros, pelo id, mais recentes, por palavras no conteudo, pelos hashtags, respostas de uma postagem, postagens de um usuário, respostas de um usuário.
  * **Realizar postagem** - Envie texto e/ou até 8 imagens em sua postagem. Também pode fazer uma postagem como resposta à outra
  * **Deletar postagem** - Deletar uma postagem irá apagar todo seu conteúdo e imagens, porém continuará na listagem caso seja uma resposta a outra postagem
- Curtir
  * **Curtir postagens** - Curta/Descurta postagens
  * **Listar Curtidas** - Liste as postagens curtidas por você

## Criar Conta
Deve informar o **nome**, **email** e **senha** do usuário a ser criado

A força da senha da senha é calculada levando em contra o número de caracteres
únicos, número de caracteres repetidos, se contém números, maiúsculas, minúsculas e símbolos

O cálculo é feito de forma que seja calculada uma *nota* da força da senha.
Os pesos são:
* +2 para cada caractere único
* +1 para cada caractere repetido
* +10 se conter números
* +10 se conter maiúsculas
* +10 se conter minúsculas
* +10 se conter símbolos

**A senha deve ter no mínimo 8 caracteres e a força da senha pelo menos 50**

Exemplos de senhas **não aceitas** e suas forças calculadas:
- 123456789012345678901 41
- abcdefghijklmnopq 44
- QWERTYUqwerty 46
- ABCabc123 48
- 1!bcdBC <-- menos de 8 caracteres

Exemplos de senhas aceitas (Mas agora que todo mundo sabe são fracas):
- ABCDabcd1234
- deveserumtextoassimbemlongomesmo
- ComMaiusculasEMenor
- 0123abcd!

Basicamente, se sua senha contiver maiúsculas, minúsculas, números e 
símbolos se possuir pelo menos 8 caracteres já será aceita. Agora para
cada característica que a senha não possuir o tamanho mínimo aceito será maior.
(Veja que a senha contendo apenas letras minúsculas deve ser gigante para ser aceita)

## Autenticação
A autenticação é feita utilizando JWT. faça login na rota /login e então guarde o token retornado, ele deve estar no header **Authorization** de todas as requisições para ser autorizado.

Exemplo:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTYzMjIwOTg4NWQ4ZTgzNzhlZTU5MCIsIm5vbWUiOiJKb8OjbyBkYSBTaWx2YSIsImVtYWlsIjoiam9hb0BlbWFpbC5jb20iLCJpYXQiOjE2ODg4MjkzMTcsImV4cCI6MTY4ODgzNjUxN30.VPPzKImGQrcQdKz6wEq7MLgZ0OuMEgpaHtRCgZn7Tdc
```

> ### Desativando Autenticação
> É possível desativar a autenticação executando a API com a variável de ambiente DISABLE_AUTH=true
> 
> Isto fará com que você esteja logado com o usuário com email joao@email.com que é criado pelo seed
## Upload De Imagens 
Para enviar a imagem deve ela deve ser enviada por meio de formulário multipart/form-data
Em cada rota há um nome esperado para o campo da imagem. 
- foto_perfil no caso da foto do perfil do usuário
- foto_capa - Foto da capa do usuário
- fotos_postagem - Fotos da postagem (Até 8)

Os formatos aceitos são: **jpeg, bmp, png e gif**. Porém independente do formato enviado será
salva novamente como um .jpg com 80% de qualidade. Devido à imagem ser salva novamente serão
removidos quaisquer metadados possivelmente contidos na imagem (EXIF pode conter informações de GPS), além
de mitigar problemas relacionados à esteganografia (Esconder mensagens na imagem). Por último imagens
corrompidas, ou arquivos que se passando por imagens causam erro ao serem salvas e não são aceitas.

A resolução da imagem é limitada ao mínimo de 150x150 pixels e ao máximo de 1024x1024 pixels. Sendo
redimensionada mantendo o aspect ratio quando necessário.

Caso a imagem seja muito estreita ou muito alta ela será cortada, 
sendo 21.0/9.0 (ultra wide screen) o mais largo que a imagem pode ser
e 9.0/16.0 (wide screen de pé) o mais alto que a imagem pode ser

No caso da foto do perfil, a imagem ainda será cortada para ficar quadrada, ou seja, aspect ratio 1/1.
E no caso da foto de capa prefere-se imagens em paisagem sendo 1/1 o mais alto que a imagem pode ser.

## Pesquisa Por Texto
A pesquisa por texto é utilizada ao pesquisar usuários pelo nome e também ao pesquisar postagens.
As regras abaixo valem para os dois casos.

Acentos, maiúsculas e minúsculas são ignorados, são equivalentes joao, Joao, João, JOAO

As palavras da pesquisa
são ignoradas quanto à contrações de gênero, plural, etc... **berto** não encontra Alberto mas
 **albertos**, **alberta**, **albertas** e **albert** encontra.

Caso você pesquise por **João Alberto Paulo** (Sem aspas) irá encontrar todos os
usuário que possuem João **ou** Alberto **ou** Paulo como uma das partes do nome
Ex: Alberto Nogueira, João da Silva e Paula Silva

É possível pesquisar por um termo exato colocando aspas, **"João da Silva"** só encontraria
um único resultado: João da Silva

Para mais informações, veja a documentação sobre o índice de texto do mongodb. Veja: [https://www.mongodb.com/docs/manual/core/index-text/](https://www.mongodb.com/docs/manual/core/index-text/)

### Pesquisa por hashtag
No caso de postagens onde é possível pesquisar hashtags, outro procedimento é realizado: no momento que a postagem é criada, as hashtags são encontradas, processadas pelo [any-ascii](https://github.com/anyascii/anyascii) para remover todos os caracteres especiais e acentos e então convertida para minúsculas antes de finalmente serem salvas no registro da postagem como um array no campo **hashtags**. Ao pesquisar por com hashtag, a pesquisa ignora acentos, maiúsculas e minúsculas pois a sua pesquisa será tratada da mesma forma antes de realizar uma busca por que postagens possuem no array de hashtags esta exata hashtag.

## Deletar Elementos
Nem todas as rotas que deletam *realmente* deletam por completo o que foi solicitado.

- **Atualizar imagem de Perfil e Capa**

  Ao atualizar a imagem de perfil e/ou capa de um usuário, a imagem anterior será deletada.
- **Deletar Usuário**

  Será deletado a sua entrada do usuário como também:
  - As imagens de capa e perfil
  - Removido da listagem de seguindo de todos que seguem você
  - Removido da listagem de seguidores de todos que você segue

  Porém **não serão removidos** as suas postagens/respostas. Apenas ficará o autor da postagem como [deletado]

  Também as postagens que você curtiu continuarão com a sua curtida registrada
- **Deletar Postagem**

  Deletar uma postagem irá apagar todo seu conteúdo e imagens, porém continuará na listagem caso seja uma resposta a outra postagem.

  Uma postagem deletada não é exibida mais na pesquisa de postagens do usuário nem na página 'For You', porém caso o usuário possua o link da postagem ainda será possível visualizar que ela existe e que usuário foi o autor, porém sem conteúdo nem as imagens( Não é possível acessar as imagens nem mesmo com o link original pois estarão deletadas). Respostas a esta postagem porém irão ser visíveis e podem ser encontradas na pesquisa de respostas de um usuário.
  
  Deletar a postagem que é resposta a outra não modifica a contagem de respostas dela.
# Instalação
Para executar esta API localmente, é possível utilizar **Docker** ou então executando via node direto.

## Docker-Compose
Para executar esta API via docker, basta clonar o repositório e na pasta raiz do projeto renomear o env exemplo e executar o docker compose:
```bash
cp ./backend/.env.example ./backend/.env
docker compose up
```

No primeiro início é necessário rodar o seed 
```bash
docker ps
# Com o id/nome do container nodejs obtido pelo docker ps:
docker exec <NOME-DO-CONTAINER> sh -c "npm run seed"
```
> Obs: Opcionalmente há o docker-compose-dev.yml que permite iniciar o projeto via docker porém é iniciado com nodemon e diretório local mapeado dentro do container, permitindo editar os arquivos e ver em tempo real as modificações.
## Docker sem realizar build
Caso não queira utilizar o Docker compose nem fazer build da imagem, há disponível no Docker Hub
a imagem deste projeto, [erickweil/social-network](https://hub.docker.com/r/erickweil/social-network), é necessário iniciar dois containers, o container do banco de dados
MongoDB e o container da api NodeJS.
```bash
docker network create social-network
docker rm -f mongo
docker run -d \
    --network social-network \
    -p 27017:27017 \
    -v vol-db:/data/db \
    --name mongo \
    mongo:6.0.7
docker run -d \
    --network social-network \
    -p 3000:3000 \
    -e DB_URL=mongodb://mongo:27017 \
    -e SUBPATH=/ \
    -e DISABLE_AUTH=false \
    --name nodejs \
    erickweil/social-network
```

No primeiro início é necessário rodar o seed 
```bash
docker exec nodejs sh -c "npm run seed"
```
## Executando manualmente com node
Para rodar este projeto com nodejs localmente, primeiro é necessário configurar o .env, instalar as dependências, e então iniciar o projeto
```bash
cd ./backend
cp .env.example .env

npm install
npm run seed
npm start
```
> Obs: É necessário um banco de dados MongoDB configurado na variável de ambiente **DB_URL**

## Configuração Variáveis de Ambiente:
O arquivo .env.example possui os valores necessários. porém aqui vai um detalhamento:

`./backend/.env.example`
```
PORT=3000
SUBPATH="/"
IMG_PATH="."
DB_URL="mongodb://127.0.0.1:27017"
DISABLE_AUTH="false"
SECRET="insiraoseusecretaqui"
EXPIREIN="2h"
DEBUGLOG="true"
```

- **PORT** - É a porta que o servidor irá escutar
- **SUBPATH** - O caminho ao qual o express irá considerar como o root do site, utilizado para hospedar o site em um subcaminho
- **IMG_PATH** - o caminho no qual as imagens serão salvas, útil ao utilizar containers para salvar as imagens em um volume. Deve ser relativo ao workdir onde o node está executando
- **DB_URL** - url de conexão com banco MongoDB
- **DISABLE_AUTH** - se for true desativa a autenticação, fazendo com que você já esteja automaticamente autenticado com o Usuário Teste "João da Silva" que é criado pelo seed
- **SECRET** - Utilizado pelo JWT para gerar o token, deve ser mantido de forma segura
- **EXPIREIN** - O tempo de expiração do token JWT
- **DEBUGLOG** - se for true irá realizar logs das rotas acessadas e outras informações
# Bibliotecas e Frameworks

* Formidable https://github.com/node-formidable/formidable - Lidar com upload de imagens via multipart/form-data
* Sharp https://github.com/lovell/sharp - Processamento de imagens
* Any-Ascii https://github.com/anyascii/anyascii - Remover acentos e caracteres especiais