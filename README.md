# pg-tictactoe

瀏覽器井字遊戲（3×3）：雙人輪流、人機對弈、AI 對 AI（Minimax）。純前端，無建置步驟。

也可當作 [Playgrounds（遊樂場）](https://samkuo.me/playgrounds/) 的 **SAM**（`index.html` 入口）。

## 一鍵開 SAM 小

在遊樂場直接載入本儲存庫（需能連到 GitHub API）：

**[一鍵開 SAM 小](https://samkuo.me/playgrounds/?open=sampot%2Fpg-tictactoe&name=%E4%BA%95%E5%AD%97%E9%81%8A%E6%88%B2)**

等同網址：

```
https://samkuo.me/playgrounds/?open=sampot/pg-tictactoe&name=井字遊戲
```

同源會重用本機已匯入的沙盒；要強制新建可加 `&fresh=1`。

## 試玩（本機）

```bash
npx --yes serve .
# 或
python3 -m http.server 8080
```

瀏覽器打開顯示的網址即可。

## 操作

| 按鈕 | 行為 |
| --- | --- |
| （直接點格子） | 雙人模式輪流下 X／O |
| **開始 AI 對弈** | 您執 X，O 由 Minimax AI 應手；再按一次改回雙人 |
| **AI 對 AI 自動對弈** | 雙方皆由 AI 自動下；進行中再按可停止／繼續；可調速度 |
| **重新開始** | 清空棋盤（AI 對 AI 會停並回到雙人） |

規則：先連成三子者勝；棋盤滿且無人勝則平局。人機模式 AI 盡力不敗；AI 對 AI 帶少量隨機，避免場場平局。

## 檔案

| 檔案 | 說明 |
| --- | --- |
| `index.html` | 頁面結構 |
| `styles.css` | 亮／暗色主題與版面 |
| `app.js` | UI、三種模式 |
| `tictactoe.js` | 棋盤、勝負、Minimax |
| `functions.js` | Playgrounds 可選 stub |

## License

MIT
