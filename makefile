GO := "C:\Program Files\Go\bin\go.exe"
CAMP_BIN := ./bin/camp

run: build
	@$(CAMP_BIN)


build:
	@$(GO) build -o $(CAMP_BIN) cmd/camp/main.go