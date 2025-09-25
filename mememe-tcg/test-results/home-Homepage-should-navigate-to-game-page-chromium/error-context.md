# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8] [cursor=pointer]
  - navigation [ref=e11]:
    - generic [ref=e13]:
      - link "めめめのくらげ TCG" [ref=e15] [cursor=pointer]:
        - /url: /
      - generic [ref=e16]:
        - link "カードコレクション" [ref=e17] [cursor=pointer]:
          - /url: /collection/
        - link "デッキビルダー" [ref=e18] [cursor=pointer]:
          - /url: /deck-builder/
        - link "対戦" [ref=e19] [cursor=pointer]:
          - /url: /game/
  - main [ref=e20]:
    - generic [ref=e22]:
      - heading "ゲーム開始" [level=2] [ref=e23]
      - generic [ref=e24]:
        - generic [ref=e25]: "使用するデッキを選択:"
        - combobox [ref=e26]:
          - option "デッキを選択..." [selected]
      - button "ゲーム開始" [disabled] [ref=e27]
      - paragraph [ref=e28]: ※デッキビルダーで50枚のデッキを作成してください
  - alert [ref=e29]: めめめのくらげ TCG
```