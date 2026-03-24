package main

import (
	"context"
	"net"
	"strings"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetNetworkLinks() []string {
	var links []string
	addrs, err := net.InterfaceAddrs()
	if err == nil {
		for _, address := range addrs {
			if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
				if ipnet.IP.To4() != nil {
					ipStr := ipnet.IP.String()
					if strings.HasPrefix(ipStr, "192.168.") || strings.HasPrefix(ipStr, "10.") || strings.HasPrefix(ipStr, "172.") {
						links = append(links, "http://"+ipStr+":10086")
					}
				}
			}
		}
	}
	
	if len(links) == 0 {
		links = append(links, "http://localhost:10086")
	}
	return links
}
