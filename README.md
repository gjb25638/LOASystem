# LOASystem(Leave of Absence System)

### 這是一套請假系統, 提供員工們請假(假別資訊都依據勞基法規定), 請假完再由所屬簽核人作簽核.
### 這裡有 [demo](https://chaoliou.github.io/) 供你檢視(純靜態頁面), 進去請直接按 LOGIN, 仔細閱讀錯誤訊息, 你就會知道接下來該怎麼做了.

### 如果合您胃口, 可以繼續往下閱讀
- 一切是從 [VENoM-Docker](https://github.com/jamesaud/VENoM-Docker/) 開始, 它是一個結合 vuejs, expressjs, nodejs 與 mongodb 的 boilerplate, 並且已經幫你設置好 docker-compose.yml, 與 client & server 的 Dockerfile 了, 非常感謝此 repo 讓我不用從 0 開始做這套請假系統.
- 因此, 你只要依照以下步驟, 基本上就能 self-host 這套請假系統

## 步驟
0. 開始之前, 請確認已經安裝 git 與 Docker.
1. 將 repo 下載, 並移動到 LOASystem 這層資料夾
```
git clone https://github.com/ChaoLiou/LOASystem.git
cd LOASystem
```
2. 請修改資料夾內的 docker-compose.yml, 修改 API_URL
   - API_URL 為 server 端的網址, 是 client 端所需要的資訊.
   - 此架構 client 與 server 分開, 假如 self-host 的機器為 192.168.1.1, 那 client 與 server 分別會是 192.168.1.1:8080 與 192.168.1.1:8081, 這時你就要修改成 API_URL=http://192.168.1.1:8081.
3. 開始 docker-compose
```
docker-compose build
docker-compose up
```
