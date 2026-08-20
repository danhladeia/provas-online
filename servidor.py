# -*- coding: utf-8 -*-
"""Servidor local da prova. Envia tudo com 'no-store' para que nenhum
aluno pegue uma versão antiga dos arquivos guardada no navegador."""
import http.server, socket, sys

PORTA = int(sys.argv[1]) if len(sys.argv) > 1 else 8123

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()
    protocol_version = "HTTP/1.1"

    def log_message(self, *a):
        pass

def meu_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80)); return s.getsockname()[0]
    except Exception:
        return "127.0.0.1"
    finally:
        s.close()

class Servidor(http.server.ThreadingHTTPServer):
    """Multithread: aguenta a turma inteira acessando ao mesmo tempo."""
    allow_reuse_address = True
    daemon_threads = True

with Servidor(("", PORTA), Handler) as httpd:
    print("=" * 58)
    print("  AVALIACAO 2 TRIMESTRE - ED. FISICA")
    print("  4 turmas: 6o, 7o, 8o e 9o ano")
    print("=" * 58)
    print("  Neste computador ....: http://localhost:%d" % PORTA)
    print("  Nos aparelhos da sala: http://%s:%d" % (meu_ip(), PORTA))
    print("  Area do professor ...: /professor.html")
    print()
    print("  Feche esta janela para encerrar a prova.")
    print("=" * 58)
    httpd.serve_forever()
