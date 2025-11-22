import http.server
import socketserver
import webbrowser
import os

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

# Change to the directory where the script is located
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Try to open the browser automatically
try:
    webbrowser.open(f'http://localhost:{PORT}')
except:
    print(f"Please open http://localhost:{PORT} in your browser")

# Start the server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
