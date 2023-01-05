# 網服 期末專題報告

## 服務基本資訊
+ 組別：12 
+ 組長中文姓名：張力升
+ 題目名稱：西洋棋連線對戰遊戲 （原本為棒球紀錄系統，後來改變題目）
+ Deployed service 網址：
+ Github Repo 網址： https://github.com/LiSeng0903/WP_Chess.git
+ Demo 影片網址：
+ FB 社團貼文網址：
描述這個服務在做什麼

## localhost 安裝與測試之詳細步驟
此 Application 為 server-client 架構。執行 server process 的電腦必須要完成後端的所有設置；執行 client 的則須完成前端的所有設置。目前只支援在同一個 subnet 下的電腦連線。

### 安裝
#### 後端設置
1. 下載前端所需 package：在 `final/WP_CHESS/backend` 下執行 `yarn install`
2. 設定 server 執行的 IP，要查看電腦在 LAN 中的 ip 位址，並且修改 `final/WP_CHESS/backend/src/server.js` 中的 `SERVER_IP`，例如 `SERVER_IP = '192.168.1.104'`。
3. 設定 mongoDB：在 `final/WP_CHESS/backend` 下放入 `.env` 檔案。檔案內容加入 `MONGO_URL=<Your mongo url>`
4. 設定 server 使用的 PORT：Server process 設定是使用 port 4000，如果您的電腦 port 4000 已經有跑其他 process 的話，可以在 `.env` 檔案中設定希望 server 執行的 port，加入 `PORT=<desired port>`
5. 初始化資料庫（optinal）：第一次執行可以先初始化 mongodb // not finish
6. 啟動 server：在 `final/WP_CHESS` 下執行 `yarn backend`。待 terminal 出現 `server is on 4000`, `db connected`, `mongo db connection created` 訊息後代表 server 成功執行

#### 前端設置
1. 下載前端所需 package：在 `final/WP_CHESS/frontend` 下執行 `yarn install`
2. 設定 server 執行的 IP，問到執行 server process 電腦的 IP，並且修改 `final/WP_CHESS/frontend/src/containers/hooks/useChess.js` 中的 `SERVER_IP`，例如 `SERVER_IP = '192.168.1.104'`。
ˇ. 啟動 client：在 `final/WP_CHESS` 下執行 `yarn frontend` 

### 測試
#### 登入
前端打開會進入登入介面
![image](./README_imgs/login.jpg)

##### 已註冊
如果帳號已註冊，那麼可以直接用 User name 及之前註冊時的 password 登入

##### 尚未註冊
如果還沒註冊帳號，可以點擊 Register 的按紐，進入註冊介面，在此填入 User name 及 password 即可註冊。（如果名字已經被取過，則無法註冊）
![image](./README_imgs/register.jpg)

#### 進入遊戲
進入遊戲的方式分為兩種，一種是建立新遊戲；另一種則是加入別人已經建立的遊戲
![image](./README_imgs/join.jpg)

##### 建立新遊戲
點擊 Create a Room 即可建立新遊戲。進入新遊戲後必須要等待對手加入才能開始下棋。
![image](./README_imgs/waiting.jpg)
畫面中央會出現 Waiting for opponent to join 的字樣。這時可以將左上角的房間 ID 分享給想一起玩的人，讓他加入遊戲。此例中房間 ID 是 `81c4db08-7343-47db-9f37-cca4c7213f70`

##### 加入遊戲
在 Enter a Room Number 輸入房間 ID，接下來點擊 Join 即可加入

#### 開始遊戲
雙方都進入遊戲之後就可以開始下棋，規則比照正式西洋棋規則，由白方先走，黑白雙方輪流一人一回合。
因此玩家會有兩種狀態：「對手的回合」及「自己的回合」，以下分別說明玩家在這兩種狀態可以做的事。

#### 對手的回合
正在等待的一方螢幕上會出現 Waiting for opponent 的字樣，且不能進行任何操作，例如一開始的黑方
![image](./README_imgs/start_b.jpg)

![image](./README_imgs/start_w.jpg)

#### 自己的回合
可以進行兩種操作：預覽可走的步、移動
+ 預覽：點擊自己持有的棋子，螢幕上會顯示該棋子這回合可以走的步，並且在點擊的棋子下會出現黃色，提示玩家接下來要移動的棋子。預覽只有自己會看到，對手的棋盤不會有任何變動。（註：某些狀況會導致 check，因此棋子無法走他平常可以走的步，此並非 bug，是防呆機制。另外，入堡、吃過路兵等規則也有實作）
+ 移動：在預覽後，點即可走的步，就會移動該顆（背景為黃色）的棋子。移動後對手的棋盤也會出現相應的變化。移動後如果有 check，那麼螢幕上就會出現字幕提示
![image](./README_imgs/check.jpg)

#### 結束遊戲
當 checkmate 發生時，遊戲即結束，螢幕會出現輸贏的字樣，接下來按 Back to Room Page 可以回到主畫面
![image](./README_imgs/checkmate.jpg)

#### 同帳號登入
如果同一個帳號同時從兩個地方登入，較早登入的帳號將會喪失連線，並跳出帳號從其他地方登入的提示，玩家無法再從這個連線進行遊戲，只能點選 Back to Login Page 的按鈕，回到登入前。
![image](./README_imgs/loginOther.jpg)

## 每位組員之負責項目
### 張力升
前端邏輯設計、與後端連線

### 許圃菘
設計 server、連接資料庫、與前端連線

### 陳亮妤
前端介面設計、找美術素材

## 如果此專題是之前作品/專題的延伸，請務必在此說明清楚 (本學期的貢獻)
本專案為 111-1 網路技術與應用的期末專案延伸。當時的組員有許圃菘、張力升及另一位同學，但另一位同學主要負責程式碼以外的地方，因此程式碼也是由這次網服的組員在這學期完成的。

網路技術與應用的期末專案原先只能進行單局遊戲，且介面簡單。接下來我們加入了使用者登入的系統，及可以同時開啟許多場遊戲的功能，將整個對戰遊戲變得更完善，介面也進行了許多優化。

下圖為就專案的遊戲畫面，Client 一連上 server 之後就會進入棋局，並沒有登入系統。
![image](./README_imgs/old.jpg)
另外，如果有超過兩個 client 連上 server，也都會進入同一場棋局中，只有第一個 client 是白方，其他都是黑方，且都可以進行活動。遊戲結束後就必須要重啟 server 才能再玩下一場遊戲。

登入頁面、同時開啟多局遊戲、遊戲結束之後可再開新局、介面優化等都是本次網服專案新加入的功能。

## 使用第三方套件

## 專題製作心得
### 張力升
### 許圃菘
### 陳亮妤

圖片來源：
- Login、Jion 背景：https://pixabay.com/photos/chess-chessboard-board-game-3960184/
- 棋盤背景：https://pixabay.com/photos/floor-wood-hardwood-floors-1256804/
- 下棋背景：https://pixabay.com/photos/marble-background-backdrop-1006628/
