build:
	docker build prisma/. -t nexus-benchmark:dev

dev-up:
	docker-compose up postgres prisma nginx-prisma

dev-benchmark:
	docker-compose up benchmark

dev-down:
	docker-compose down

deploy:
	docker-compose run --entrypoint "npm run deploy" benchmark
