package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:webapp/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Start parallel HTTP server for local network
	go func() {
		subFS, err := fs.Sub(assets, "webapp/dist")
		if err != nil {
			fmt.Println("Failed to load dist folder:", err)
			return
		}
		http.Handle("/", http.FileServer(http.FS(subFS)))
		fmt.Println("Local Network Server started on :10086")
		http.ListenAndServe(":10086", nil)
	}()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "VTubeStudio Shortcut",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
