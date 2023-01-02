# 執行方式
前端以 React 實作；後端則是 JavaScript 在 node.js 中執行，要先確定電腦有可以的環境。

另外後端使用的 port 為 4000；前端使用的 port 為 3000，請確保這些 port 上沒有程式運行。

## Server 程式
需到 `NWA-CHESS/backend/src/server.js` 中修改 `SERVER_IP`，改成要跑 server 的電腦的 ip。

接下來在 `NWA-CHESS` 目錄下執行 `yarn backend`，待跑出 `port on 4000` 即可

## Client 程式
需到 `NWA-CHESS/frontend/src/containers/hook/useChess.js` 中修改 `SERVER_IP`，改成要跑 server 的電腦的 ip。

接下來在 `NWA-CHESS` 目錄下執行 `yarn frontend`，出現網頁畫面（網址是 http://localhost:3000）即可，連上線時後端也會印出 `player connected`的訊息。