# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8] [cursor=pointer]
  - navigation [ref=e13]:
    - generic [ref=e15]:
      - link "めめめのくらげ TCG" [ref=e17]:
        - /url: /
      - generic [ref=e18]:
        - link "カードコレクション" [ref=e19]:
          - /url: /collection/
        - link "デッキビルダー" [ref=e20]:
          - /url: /deck-builder/
        - link "対戦" [ref=e21]:
          - /url: /game/
  - main [ref=e22]:
    - generic [ref=e24]:
      - heading "ゲーム開始" [level=2] [ref=e25]
      - generic [ref=e26]:
        - generic [ref=e27]: "使用するデッキを選択:"
        - combobox [ref=e28]:
          - option "デッキを選択..." [selected]
      - button "ゲーム開始" [disabled] [ref=e29]
      - paragraph [ref=e30]: ※デッキビルダーで50枚のデッキを作成してください
  - alert [ref=e31]: めめめのくらげ TCG
```