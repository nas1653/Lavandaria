# Galeria de perdidos e achados

A galeria da página **Perdidos e achados** lê a lista do ficheiro `achados.json`, nesta pasta.

## Acrescentar um objeto

1. Tire uma fotografia ao objeto (sem documentos, cartões nem dados pessoais visíveis).
2. No GitHub, abra a pasta `achados/fotos`, carregue em **Add file → Upload files** e envie a foto.
   Use um nome simples, sem espaços nem acentos, por exemplo `casaco-castanho-chile.jpg`.
3. Abra `achados/achados.json`, carregue no lápis (**Edit**) e acrescente uma linha como esta:

```json
[
  { "loja": "chile", "foto": "achados/fotos/casaco-castanho-chile.jpg", "descricao": "Casaco castanho, tamanho L", "data": "2026-11-13" }
]
```

Para vários objetos, separe-os com vírgulas:

```json
[
  { "loja": "chile",    "foto": "achados/fotos/casaco-castanho-chile.jpg", "descricao": "Casaco castanho, tamanho L", "data": "2026-11-13" },
  { "loja": "ericeira", "foto": "achados/fotos/cachecol-vermelho.jpg",     "descricao": "Cachecol vermelho de lã",   "data": "2026-11-10" }
]
```

4. Carregue em **Commit changes**. O Netlify publica sozinho em um ou dois minutos.

| Campo | O que pôr |
|---|---|
| `loja` | `arroios`, `chile`, `areeiro` ou `ericeira` |
| `foto` | caminho da foto (opcional; sem foto aparece só o texto) |
| `descricao` | descrição curta do objeto |
| `data` | dia em que foi encontrado, no formato `AAAA-MM-DD` |

## Retirar um objeto

Quando alguém levantar o objeto, apague a linha dele em `achados.json`.
Os objetos com mais de 30 dias deixam de aparecer sozinhos, mesmo que fiquem na lista.

## Objetos de valor

Não ponha na galeria carteiras, documentos, telemóveis, chaves ou cartões.
Assim, só quem os perdeu os consegue descrever ao balcão.
