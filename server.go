package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/chat", func(w http.ResponseWriter, r *http.Request) { http.ServeFile(w, r, "./index.html") })
	// http.HandleFunc("/pwa.webmanifest", http.ServeFile("./pwa.webmanifest", nil))
	http.HandleFunc("/app.js", func(w http.ResponseWriter, r *http.Request) { http.ServeFile(w, r, "./app.js") })
	http.HandleFunc("/style.css", func(w http.ResponseWriter, r *http.Request) { http.ServeFile(w, r, "./style.css") })

	fmt.Println("Started")
	panic(http.ListenAndServe(":80", nil))
}
