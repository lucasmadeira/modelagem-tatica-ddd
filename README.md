# INSTRUCÕES

### Abra um terminal no diretório raiz do seu projeto e execute o seguinte comando para construir a imagem Docker:

#### docker build -t <nome_da_imagem> .

### execute o seguinte comando para iniciar um contêiner a partir da imagem:

#### docker run <nome_da_imagem>

### Ao executar a imagem vai rodar os testes de um service de customer, o service tem dois metodos, um para salvar clientes e um para alterar o endereço de clientes, ao invocar estes metodos os respectivos event services são invocados. 
