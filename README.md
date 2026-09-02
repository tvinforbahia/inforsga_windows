# Painel TV para Windows

Aplicação desktop para abrir o Painel TV em Chromium/Electron.

## Recursos
- Tela cheia automática.
- Reprodução automática de áudio.
- `speechSynthesis` disponível pelo Chromium/Electron.
- URL configurável.
- Impede o Windows de desligar a tela enquanto o app estiver aberto.
- F11: alterna tela cheia.
- F5: atualiza o painel.
- Ctrl+Shift+S: abre a configuração.
- Alt+F4: fecha o aplicativo.

## Gerar o .EXE pelo GitHub
1. Crie um repositório ou envie todo o conteúdo deste ZIP para o seu repositório.
2. Mantenha `.github/workflows/windows.yml`.
3. Abra a aba **Actions**.
4. Execute **Gerar EXE Painel TV Windows**.
5. Quando ficar verde, abra a execução e baixe o artefato **PainelTV-Windows**.
6. O artefato terá a versão instalável e a versão portátil em `.exe`.

## Teste local (opcional)
Instale Node.js 20 e execute:

npm install
npm start

## Primeira abertura
Informe a URL completa do seu painel, por exemplo:

http://192.168.1.100/paineltv/

Depois o aplicativo abre o painel em tela cheia.
