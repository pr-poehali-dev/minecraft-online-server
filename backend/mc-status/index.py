"""
Пингует Minecraft сервер и возвращает реальный онлайн и максимум игроков.
Использует Minecraft Server List Ping протокол (SLP) для Java Edition 1.7+.
"""
import json
import socket
import struct
import time


def pack_varint(value: int) -> bytes:
    result = b""
    while True:
        byte = value & 0x7F
        value >>= 7
        if value:
            byte |= 0x80
        result += bytes([byte])
        if not value:
            break
    return result


def read_varint(sock: socket.socket) -> int:
    result = 0
    shift = 0
    while True:
        byte = sock.recv(1)
        if not byte:
            raise ConnectionError("Connection closed")
        b = byte[0]
        result |= (b & 0x7F) << shift
        shift += 7
        if not (b & 0x80):
            break
    return result


def ping_minecraft(host: str, port: int, timeout: int = 5) -> dict:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    sock.connect((host, port))

    # Handshake packet
    host_bytes = host.encode("utf-8")
    handshake = (
        pack_varint(0x00) +           # Packet ID
        pack_varint(760) +             # Protocol version (1.19.4 / generic modern)
        pack_varint(len(host_bytes)) + # Host length
        host_bytes +                   # Host
        struct.pack(">H", port) +      # Port
        pack_varint(1)                 # Next state: Status
    )
    length_prefix = pack_varint(len(handshake))
    sock.send(length_prefix + handshake)

    # Status request
    sock.send(b"\x01\x00")

    # Read response
    _pkt_len = read_varint(sock)
    _pkt_id = read_varint(sock)
    json_len = read_varint(sock)

    data = b""
    while len(data) < json_len:
        chunk = sock.recv(json_len - len(data))
        if not chunk:
            break
        data += chunk

    sock.close()
    return json.loads(data.decode("utf-8"))


def handler(event: dict, context) -> dict:
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    host = "lastcraft.ddns.net"
    port = 2255

    try:
        start = time.time()
        status = ping_minecraft(host, port)
        latency = round((time.time() - start) * 1000)

        players = status.get("players", {})
        online = players.get("online", 0)
        maximum = players.get("max", 0)
        description = status.get("description", {})
        motd = description if isinstance(description, str) else description.get("text", "LastCraft Server")
        version = status.get("version", {}).get("name", "unknown")

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({
                "online": True,
                "players": online,
                "max_players": maximum,
                "latency": latency,
                "motd": motd,
                "version": version,
            }),
        }
    except Exception as e:
        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({
                "online": False,
                "players": 0,
                "max_players": 500,
                "latency": 0,
                "motd": "",
                "version": "1.20.1",
                "error": str(e),
            }),
        }
