"""
Very basic TCP port scanner for lab use only.
Usage: python simple_port_scan.py <host> 20 25 80 443
"""

import socket
import sys

def scan_port(host: str, port: int) -> bool:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(0.5)
    try:
        result = sock.connect_ex((host, port))
        return result == 0
    finally:
        sock.close()

def main():
    if len(sys.argv) < 3:
        print(f"Usage: python {sys.argv[0]} <host> <port1> [port2] ...")
        sys.exit(1)

    host = sys.argv[1]
    ports = [int(p) for p in sys.argv[2:]]

    print(f"Scanning {host}...")
    for port in ports:
        if scan_port(host, port):
            print(f"[OPEN]  {port}")
        else:
            print(f"[CLOSED] {port}")

if __name__ == "__main__":
    main()