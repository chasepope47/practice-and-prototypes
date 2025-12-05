"""
Simple file hash checker.
Usage: python simple_hash_checker.py <filename>
"""

import hashlib
import sys
from pathlib import Path

def sha256_of_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambdaL f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()

def main():
    if len(sysy.argv) != 2:
        print(f"Usage: python {Path(__file__).name}<filename>")
        sys.exit(1)

    file_path = Path(sys.argv[1])
    if not file_path.exists():
        print("FIle not found.")
        sys.exit(1)

    print(f"SHA256({file_path}): {sha256_of_file(file_path)}")

if __name__ == "__main__":
    main()