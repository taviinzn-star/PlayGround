# PlayGround

<!-- omgithub:readme:start -->
## 🚀 Build, play, and remix with OMGithub

**Created using [OMGithub.com](https://go.ondev.store/).**

[![OMGithub](https://img.shields.io/badge/OMGithub-Open%20project-orange?style=for-the-badge)](https://go.ondev.store/taviinzn-star/PlayGround)
[![GitHub](https://img.shields.io/badge/GitHub-Source-181717?logo=github&style=for-the-badge)](https://github.com/taviinzn-star/PlayGround)

- 🎮 [Open the project](https://go.ondev.store/taviinzn-star/PlayGround).
- ✨ [Remix this project](https://go.ondev.store/taviinzn-star/PlayGround?remix=1).
- 💻 [Explore the source](https://github.com/taviinzn-star/PlayGround).
- 🛠️ [Check build runs](https://github.com/taviinzn-star/PlayGround/actions).
- 🐛 [Report an issue](https://github.com/taviinzn-star/PlayGround/issues).
- 👤 [Explore the creator's projects](https://go.ondev.store/taviinzn-star).
- 🌍 [Create with OMGithub](https://go.ondev.store/).
<!-- omgithub:readme:end -->

## 100 — A Última Rodada

Protótipo 3D explorável feito com Three.js, HTML, CSS e JavaScript. O cenário é renderizado em WebGL: uma arena suspensa com plataformas de pedra, sofá, cama, travesseiros gigantes, iluminação, sombras e céu estrelado.

### Executar no computador

Sirva a pasta por HTTP (módulos JavaScript não funcionam de forma confiável abrindo o HTML direto como `file://`):

```bash
python3 -m http.server 8000
```

Abra <http://localhost:8000>. O navegador precisa de acesso à internet para carregar Three.js e as fontes externas.

### Testar no celular Android

1. Conecte o celular e o computador à mesma rede Wi-Fi.
2. No computador, execute `python3 -m http.server 8000 --bind 0.0.0.0` na pasta do projeto.
3. Descubra o IP local do computador (por exemplo, `192.168.1.25`) e abra `http://192.168.1.25:8000` no Chrome do celular. Permita a conexão na firewall, se solicitado.
4. Toque em **Entrar na arena**. Use o controle circular à esquerda para caminhar; arraste a área 3D para girar a câmera e use dois dedos para aproximar/afastar.

No computador: `WASD` ou setas para caminhar, arrastar com o mouse para girar a câmera e scroll para zoom. O botão de som ativa/desativa um tom ambiente sintetizado localmente. Este primeiro protótipo prioriza a exploração da arena; os 100 participantes e as rodadas do jogo ainda não estão implementados.

