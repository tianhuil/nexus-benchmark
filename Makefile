build:
	docker build prisma/. -t nexus-benchmark:dev

dev-up:
	docker-compose up

dev-down:
	docker-compose down

deploy:
	npx prisma deploy
