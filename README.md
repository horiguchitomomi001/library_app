# 図書館管理システム

## 概要
書籍の貸出・予約・管理を行うWebアプリケーションです。

## 使用技術
- Frontend: React
- Backend: Node.js / Express
- DB: MySQL
- 認証: JWT
- その他: bcrypt, express-validator

## 主な機能
- 書籍検索 / 詳細表示
- 貸出 / 予約 / 返却
- ユーザー管理
- 書籍管理
- ログイン認証 / 権限管理

## 環境構築手順

### テストアカウント
　git clone ...
　cd library_app
　npm install

### 環境変数
　DB_HOST=localhost
　DB_USER=root
　DB_PASSWORD=password123
　JWT_SECRET=library_secret_key

### 起動方法


## デプロイ

## 工夫した点
- JWTによる認証機能の実装
- middlewareを用いた権限制御
- トランザクションによるデータ整合性の担保
- ファイル構成による責務分離

## 今後の課題
- UI/UXの改善
- 状態管理の最適化
- テストコードの追加


## データベース設計
### books
- id
- title
- author
- status(available未貸出/borrowed貸出中/reserved予約中)
- created_at

### users
- id
- name
- email
- password_hash
- role (user / librarian / admin)
- created_at

### loans
- id
- user_id (FK → users.id)
- book_id (FK → books.id)
- loaned_at(貸出日時)
- due_date(返却期限)
- returned_at (返却日時)

### reservations
- id (PK)
- user_id (FK → users.id)
- book_id (FK → books.id)
- reserved_at (予約日時)
- status (ENUM)
	active     : 予約
	cancelled  : 利用者がキャンセル
	fulfilled  : 貸出に昇格済み


## API設計
### books
- 検索: GET	
    URL     : /books/search?${params.toString()}
	params  : params.toString()
	body    : ー
- 詳細: GET
    URL     : /books/:bookId
	params  : bookId
	body    : ー
- 追加: POST
    URL     : /books
	params  : ー
	body    : title,author
- 更新: PUT
    URL     : /books/:bookId
	params  : bookId
	body    : title, author, status
- 削除: DELETE
    URL     : /books/:bookId
	params  : bookId
	body    : ー
	
### users
- 予約一覧: GET
    URL     :/users/:userId/reservations
	params  :userId
	body    :ー
- 貸出一覧: GET
    URL     :/users/:userId/loans
	params  :userId
	body    :ー
- 検索: GET
    URL     :/users/search?${params.toString()}
	params  :params.toString()
	body    :name, email, role
- 詳細: GET
    URL     :/users/:userId
	params  :userId
	body    :ー
- 追加: POST	
    URL     :users/
	params  :ー
	body    :name, email, password_hash, role 
- 更新: PUT
    URL     :users/:userId
	params  :userId
	body    :name, email, password_hash, role 
- 削除: DELETE
    URL     :users/:userId
	params  :userId
	body    :ー

### loans
- 一覧:GET	
    URL     :/users/${loginUserId}/loans
	params  :loginUserId
	body    :ー
- 貸出:POST	
    URL     :/loans
	params  :ー
	body    :userId/bookId
	update  :book.status=“borrowed”+loans追加
- 返却:PUT	
    URL     :/loans/${book.id}/return　
	params  :book.id
	body    :ー	
	update  :books.status = ‘available’+loans.returned_at
- 延長:PUT	
    URL     :/loans/${book.id}/extend　
	params  :book.id
	body    :ー
	update  :loans.due_date
### reservations
- 一覧:GET	
    URL     :/users/${loginUserId}/reservations
	params  :loginUserId
	body    :ー　
- 予約:POST	
    URL     :/reservations
	params  :ー
	body    :bookId
	update  :book.status=“reserved”+reservations追加
- 予約貸出:POST
    URL     :reservations/:bookId/loan
	params  :ー
	body    :userId/bookId
	update  :book.status=“borrowed”
		     reservations.status=“fulfilled”
		     loans追加
- キャンセル:PUT	
    URL     :/reservations/${book.id}/cancel　
	params  :book.id
	body    :ー　
	update  :book.status=“canceled”


## 権限・条件設計

### user
- トップ画面 検索
	権限:利用者/司書/管理者

- トップ画面　詳細
	権限:利用者/司書/管理者

- 詳細画面	予約
	権限:利用者/司書/管理者
	条件:貸出中/未予約(順番待ち拡張)

- 詳細画面	貸出
	権限:利用者/司書/管理者
	条件:未貸出の書籍のみ

- マイページ　一覧(予約)
	権限:利用者

- マイページ　貸出(予約)
	権限:利用者
	条件:未貸出の書籍のみ

- マイページ　キャンセル(予約)
	権限:利用者
	条件:自分の予約

- マイページ　一覧(貸出)
	権限:利用者

- マイページ　返却(貸出)
	権限:利用者
	条件:自分の貸出

- マイページ　延長(貸出)
	権限:利用者
	条件:自分の貸出

- ログイン画面　
	権限:利用者

- パス更新画面
	権限:利用者
	条件:旧パスワードと一致のみ

### librarian
- アカウント管理画面　追加
	権限:司書/管理者

- アカウント管理画面　更新
	権限:司書/管理者

- アカウント管理画面　削除
	権限:司書/管理者
	条件:貸出予約なしアカ

### admin
- 書籍管理画面　追加
	権限:管理者

- 書籍管理画面　更新
	権限:管理者
	条件:未貸出のみ
    
- 書籍管理画面　削除
	権限:管理者
	条件:未貸出のみ
