# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8] [cursor=pointer]
  - navigation [ref=e12]:
    - generic [ref=e14]:
      - link "めめめのくらげ TCG" [ref=e16] [cursor=pointer]:
        - /url: /
      - generic [ref=e17]:
        - link "カードコレクション" [ref=e18] [cursor=pointer]:
          - /url: /collection/
        - link "デッキビルダー" [ref=e19] [cursor=pointer]:
          - /url: /deck-builder/
        - link "対戦" [ref=e20] [cursor=pointer]:
          - /url: /game/
  - main [ref=e21]:
    - generic [ref=e23]:
      - heading "ゲーム開始" [level=2] [ref=e24]
      - generic [ref=e25]:
        - generic [ref=e26]: "使用するデッキを選択:"
        - combobox [ref=e27]:
          - option "デッキを選択..." [selected]
      - button "ゲーム開始" [disabled] [ref=e28]
      - paragraph [ref=e29]: ※デッキビルダーで50枚のデッキを作成してください
  - alert [ref=e30]: めめめのくらげ TCG
```