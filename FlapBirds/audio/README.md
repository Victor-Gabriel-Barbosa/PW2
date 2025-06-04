# Pasta de Áudio

## Música de Fundo

Coloque seu arquivo de música de fundo aqui com o nome `background-music.mp3`.

### Formatos suportados:
- MP3
- WAV
- OGG
- M4A

### Recomendações:
- Use arquivos com qualidade moderada (128-192 kbps) para equilibrar qualidade e tamanho
- Certifique-se de que a música seja adequada para loop (sem pausas abruptas no final)
- Volume moderado, pois será controlado pelo AudioManager

### Como usar:
1. Coloque seu arquivo MP3 na pasta `audio/`
2. Renomeie para `background-music.mp3` ou use o método `setMusicFile()` para especificar um nome diferente

### Exemplo de uso com arquivo personalizado:
```javascript
// No seu código do jogo
audioManager.setMusicFile('audio/minha-musica.mp3');
```
