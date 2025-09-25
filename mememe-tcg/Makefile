# めめめのくらげ TCG - Makefile
# タスクランナーとして主要コマンドを管理

.PHONY: help
help: ## ヘルプを表示
	@echo "めめめのくらげ TCG - 利用可能なコマンド:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""

# デフォルトタスク
.DEFAULT_GOAL := help

# =====================================
# 開発系タスク
# =====================================

.PHONY: install
install: ## 依存関係をインストール
	npm ci

.PHONY: dev
dev: ## 開発サーバーを起動 (ポート3000)
	npm run dev

.PHONY: dev-clean
dev-clean: ## 開発サーバーを起動 (DevTools無効化)
	NEXT_DEVTOOLS_DISABLED=true npm run dev

.PHONY: build
build: ## プロダクションビルドを実行
	npm run build

.PHONY: start
start: ## プロダクションサーバーを起動
	npm run start

.PHONY: export
export: ## 静的ファイルをエクスポート
	npm run export

# =====================================
# テスト系タスク
# =====================================

.PHONY: test
test: ## ユニットテストを実行
	npm test

.PHONY: test-watch
test-watch: ## ウォッチモードでテストを実行
	npm run test:watch

.PHONY: test-coverage
test-coverage: ## カバレッジ付きでテストを実行
	npm run test:coverage

.PHONY: test-e2e
test-e2e: ## E2Eテストを実行
	npm run test:e2e

.PHONY: test-e2e-ui
test-e2e-ui: ## E2EテストをUIモードで実行
	npm run test:e2e:ui

.PHONY: test-e2e-headed
test-e2e-headed: ## E2Eテストをブラウザ表示で実行
	npx playwright test --headed

.PHONY: test-all
test-all: ## 全てのテストを実行
	npm test && npm run test:e2e

# =====================================
# 品質チェック系タスク
# =====================================

.PHONY: lint
lint: ## ESLintを実行
	npm run lint

.PHONY: lint-fix
lint-fix: ## ESLintで自動修正
	npx eslint . --fix

.PHONY: typecheck
typecheck: ## TypeScriptの型チェック
	npx tsc --noEmit

.PHONY: check
check: lint typecheck test ## 全ての品質チェックを実行

# =====================================
# デプロイ系タスク
# =====================================

.PHONY: deploy
deploy: ## GitHub Pagesにデプロイ
	npm run deploy
	@echo "デプロイ完了！ https://yourusername.github.io/mememe-tcg でアクセス可能です"

.PHONY: deploy-preview
deploy-preview: build ## ビルド結果をプレビュー
	npx serve out

# =====================================
# クリーンアップ系タスク
# =====================================

.PHONY: clean
clean: ## ビルド成果物とキャッシュをクリーン
	rm -rf .next out node_modules/.cache
	@echo "クリーンアップ完了"

.PHONY: clean-all
clean-all: clean ## 全てをクリーン（node_modules含む）
	rm -rf node_modules
	@echo "完全クリーンアップ完了 - 'make install' で依存関係を再インストールしてください"

.PHONY: reset
reset: clean-all install ## プロジェクトをリセット（クリーン後に再インストール）
	@echo "プロジェクトのリセット完了"

# =====================================
# Docker系タスク（将来の拡張用）
# =====================================

.PHONY: docker-build
docker-build: ## Dockerイメージをビルド
	@echo "Docker対応は今後実装予定です"

.PHONY: docker-run
docker-run: ## Dockerコンテナを起動
	@echo "Docker対応は今後実装予定です"

# =====================================
# ユーティリティ
# =====================================

.PHONY: info
info: ## プロジェクト情報を表示
	@echo "=================="
	@echo "めめめのくらげ TCG"
	@echo "=================="
	@echo "Node.js version: $$(node -v)"
	@echo "npm version: $$(npm -v)"
	@echo "Next.js version: $$(npm list next | grep next@)"
	@echo ""
	@echo "プロジェクトディレクトリ: $$(pwd)"
	@echo ""

.PHONY: serve
serve: ## ビルド済みファイルをローカルでサーブ
	@if [ -d "out" ]; then \
		npx serve out; \
	else \
		echo "ビルド済みファイルが見つかりません。先に 'make build' を実行してください"; \
	fi

.PHONY: analyze
analyze: ## バンドルサイズを分析
	ANALYZE=true npm run build

# =====================================
# 開発効率化
# =====================================

.PHONY: setup
setup: install ## 初期セットアップ（新規開発者向け）
	@echo "================="
	@echo "セットアップ完了!"
	@echo "================="
	@echo ""
	@echo "次のコマンドで開発を開始できます:"
	@echo "  make dev     - 開発サーバーを起動"
	@echo "  make test    - テストを実行"
	@echo "  make help    - 利用可能なコマンド一覧"
	@echo ""

.PHONY: update
update: ## 依存関係を最新版に更新
	npm update
	@echo "依存関係を更新しました"

.PHONY: outdated
outdated: ## 古い依存関係をチェック
	npm outdated || true

# =====================================
# Git系タスク
# =====================================

.PHONY: commit
commit: ## 変更をコミット（事前チェック付き）
	@make check
	@echo "チェック完了。コミットメッセージを入力してください:"
	@read -p "コミットメッセージ: " msg; \
	git add -A && git commit -m "$$msg"

.PHONY: push
push: ## リモートリポジトリにプッシュ
	git push origin $$(git branch --show-current)

# =====================================
# 複合タスク
# =====================================

.PHONY: dev-full
dev-full: ## フルスタック開発環境を起動
	@echo "開発サーバーを起動中..."
	@make dev

.PHONY: ci
ci: install check test-e2e build ## CI環境で実行する全タスク
	@echo "CI処理完了"