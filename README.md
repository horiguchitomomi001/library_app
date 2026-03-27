# 図書館管理システム

## 自己紹介
現在は、ウェブアプリエンジニア志望で転職活動を行っています。<br />
図書館アプリのプロトタイプ制作を通して、フルスタックの学習を進めて参りました。<br />
就活後も自身で使用するアプリの自主制作などを継続してきたいと考えております。<br />
何卒、よろしくお願い申し上げます！

<br />

## システム概要
書籍の貸出・予約・管理を行うWebアプリケーションです。

<br />

## 使用技術

|領域				|言語		|
| ------------- |	------------- |
|フロント		| React|
|バックエンド	 | Node.js / Express|
|DB	 	   		| MySQL|
|認証			| JWT	|
|その他	 		| bcrypt|

<br />

## 機能一覧

|画面				|機能		|
| ------------- |	------------- |
|トップ画面			| 検索 / 詳細	|
|詳細画面		   | 予約 / 貸出	|
|マイページ	 	    | 予約(一覧 / 貸出 / キャンセル)	|
|				  | 貸出(一覧 / 返却 / 延長)	|
|ログイン画面		| ログイン	|
|アカウント管理画面	 | 追加 / 更新 / 削除	|
|書籍管理画面		| 追加 / 更新 / 削除	|

<br />

## 環境構築

### 環境変数

|変数				|値		|
| ------------- |	------------- |
|DB_HOST		| localhost|
|DB_USER		 | root|
|DB_PASSWORD	 | -|
|DB_NAME	 	| library_app|
|JWT_SECRET		| library_secret_key	|
|VITE_API_URL	 | http://localhost:3000|

<br />

### 起動方法
- git clone ...
- cd library_app
- npm install

<br />

## 工夫した点
- JWTによる認証機能の実装
- トランザクションによるデータ整合性の担保
- ファイル構成による責務分離

<br />

## 今後の課題
- UI/UXの改善
- 状態管理の最適化
- 権限確認を、authMiddlewareに書換え
- バリデーションを、express-validatorに書換え
- 新しい制作へ挑戦(動物病院予約サイト,アサーション練習アプリ,ジャーナリングアプリ　等々)

<br />

## データベース設計
### 【books】
- id
- title
- author
- status(available未貸出/borrowed貸出中/reserved予約中)
- created_at

### 【users】
- id
- name
- email
- password_hash
- role (user / librarian / admin)
- created_at

### 【loans】
- id
- user_id (FK → users.id)
- book_id (FK → books.id)
- loaned_at(貸出日時)
- due_date(返却期限)
- returned_at (返却日時)

### 【reservations】
- id (PK)
- user_id (FK → users.id)
- book_id (FK → books.id)
- reserved_at (予約日時)
- status (ENUM)<br />
	active     : 予約<br />
	cancelled  : 利用者がキャンセル<br />
	fulfilled  : 貸出に昇格済み


## API設計
### 【books】

<div style="width:80vw; display: flex; gap: 40px; flex-direction:row;flex-wrap:wrap;">
<div>

|検索		|		|
| ------ |	------ |
|method	 | GET	|
|URL     | /books/search?${params.toString()}|
|params  | params.toString()|
|body    | ー|

</div>
<div>

|詳細		|		|
| ------ |	------ |
|method	 | GET	|
|URL     | /books/:bookId|
|params  | bookId|
|body    | ー|

</div>
<div>

|追加		|		|
| ------ |	------ |
|method	 | POST	|
|URL     | /books|
|params  | ー|
|body    | title,author|

</div>
<div>

|更新		|		|
| ------ |	------ |
|method	 | PUT	|
|URL     | /books/:bookId|
|params  | bookId|
|body    | title, author, status|

</div>
<div>

|削除		|		|
| ------ |	------ |
|method	 | DELETE	|
|URL     | /books/:bookId|
|params  | bookId|
|body    | ー|

</div>
</div>
<br />

### 【users】

<div style="width:80vw; display: flex; gap: 40px; flex-direction:row;flex-wrap:wrap;">
<div>

|予約一覧		|		|
| ------ |	------ |
|method	 | GET	|
|URL     | /users/:userId/reservations|
|params  | userId|
|body    | ー|

</div>
<div>

|貸出一覧		|		|
| ------ |	------ |
|method	 | GET	|
|URL     | /users/:userId/loans|
|params  | userId|
|body    | ー|

</div>
<div>

|検索		|		|
| ------ |	------ |
|method	 | GET	|
|URL     | /users/search?${params.toString()}|
|params  | params.toString()|
|body    | |

</div>
<div>

|詳細		|		|
| ------ |	------ |
|method	 | GET	|
|URL     | /users/:userId|
|params  | userId|
|body    | ー|

</div>
<div>

|追加		|		|
| ------ |	------ |
|method	 | POST	|
|URL     | users/|
|params  | ー|
|body    | name, email, password, role|

</div>
<div>

|更新		|		|
| ------ |	------ |
|method	 | PUT	|
|URL     | users/:userId|
|params  | userId|
|body    | name, email, oldPassword, password, role|

</div>
<div>

|削除		|		|
| ------ |	------ |
|method	 | DELETE	|
|URL     | users/:userId|
|params  | userId|
|body    | ー|

</div>
</div>
<br />

### 【loans】

<div style="width:80vw; display: flex; gap: 40px; flex-direction:row;flex-wrap:wrap;">
<div>

|一覧		|		|
| ------ |	------ |
|method	 | GET	|
|URL     | /users/${loginUserId}/loans|
|params  | loginUserId|
|body    | ー|

</div>
<div>

|貸出		|		|
| ------ |	------ |
|method	 | POST	|
|URL     | /loans|
|params  | ー|
|body    | userId/bookId|
|update  | book.status=“borrowed”|
|		 | loans追加|

</div>
<div>

|返却		|		|
| ------ |	------ |
|method	 | PUT	|
|URL     | /loans/${book.id}/return|
|params  | book.id|
|body    | ー|
|update  | books.status = ‘available’|
|		 | loans.returned_at|

</div>
<div>

|延長		|		|
| ------ |	------ |
|method	 | PUT	|
|URL     | /loans/${book.id}/extend|
|params  | book.id|
|body    | ー|
|update  | loans.due_date|

</div>
</div>
<br />

### 【reservations】

<div style="width:80vw; display: flex; gap: 40px; flex-direction:row;flex-wrap:wrap;">
<div>

|一覧		|		|
| ------ |	------ |
|method	 | GET	|
|URL     | /users/${loginUserId}/reservations|
|params  | loginUserId|
|body    | ー|

</div>
<div>


|予約		|		|
| ------ |	------ |
|method	 | POST	|
|URL     | /reservations|
|params  | ー|
|body    | bookId|
|	   	 | loginUserId|
|update  | book.status=“reserved”|
|		 | reservations追加|

</div>
<div>

|予約貸出		|		|
| ------ |	------ |
|method	 | POST	|
|URL     | reservations/:bookId/loan|
|params  | bookId|
|body    | loginUserId|
|update  | book.status=“borrowed”|
|		|	reservations.status=“fulfilled”|
|		|    loans追加|

</div>
<div>

|キャンセル		|		|
| ------ |	------ |
|method	 | PUT	|
|URL     | /reservations/${book.id}/cancel|
|params  | bookId|
|body    | loginUserId|
|update  | book.status=“canceled”|

</div>
</div>
<br />


## 権限・条件設計

### 【user】

|画面		|機能		|権限		|条件		|
| -------- | -------- | -------- | -------- |
| トップ画面 | 検索 | 利用者/司書/管理者 |  |
| トップ画面 | 詳細 | 利用者/司書/管理者 |  |
| 詳細画面 | 予約 | 利用者/司書/管理者 | 貸出中/未予約(順番待ち拡張) |
| 詳細画面 | 貸出 | 利用者/司書/管理者 | 未貸出の書籍のみ |
| マイページ | 一覧(予約) | 利用者 |  |
| マイページ | 貸出(予約) | 利用者 | 未貸出の書籍のみ |
| マイページ | キャンセル(予約) | 利用者 | 自分の予約 |
| マイページ | 一覧(貸出) | 利用者 |  |
| マイページ | 返却(貸出) | 利用者 | 自分の貸出 |
| マイページ | 延長(貸出) | 利用者 | 自分の貸出 |
| ログイン画面　 | ログイン | 利用者 |  |
| パスワード更新更新画面　 | パスワード更新 | 利用者 | 旧パスワードと一致のみ |

<br />

### 【librarian】

|画面		|機能		|権限		|条件		|
| -------- | -------- | -------- | -------- |
| アカウント管理画面 | 追加 | 司書/管理者 |  |
| アカウント管理画面 | 更新 | 司書/管理者 |  |
| アカウント管理画面 | 削除 | 司書/管理者 | 貸出予約なしアカウント |

<br />

### 【admin】

|画面		|機能		|権限		|条件		|
| -------- | -------- | -------- | -------- |
| 書籍管理画面 | 追加 | 管理者 |  |
| 書籍管理画面 | 更新 | 管理者 | 未貸出のみ |
| 書籍管理画面 | 削除 | 管理者 | 未貸出のみ |

<br />
