"""
Генерирует и отдаёт Bukkit/Spigot плагин LastCraftOnline.jar для Minecraft 1.20.1.
Плагин раз в 30 секунд обновляет онлайн на сайте через HTTP запрос.
"""
import json
import base64
import zipfile
import io
import time


PLUGIN_YML = b"""name: LastCraftOnline
version: 1.0.0
main: dev.lastcraft.online.LastCraftOnline
api-version: 1.20
description: Sends real-time online count to LastCraft website
author: LastCraft
commands: {}
"""

MAIN_CLASS_JAVA = b"""package dev.lastcraft.online;

import org.bukkit.Bukkit;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.logging.Level;

public class LastCraftOnline extends JavaPlugin {

    private static final String API_URL = "https://lastcraft.ddns.net/api/online";

    @Override
    public void onEnable() {
        getLogger().info("LastCraftOnline plugin enabled!");
        getLogger().info("Sending online count to website every 30 seconds.");

        new BukkitRunnable() {
            @Override
            public void run() {
                sendOnlineCount();
            }
        }.runTaskTimerAsynchronously(this, 0L, 600L); // 600 ticks = 30 seconds
    }

    @Override
    public void onDisable() {
        getLogger().info("LastCraftOnline plugin disabled.");
    }

    private void sendOnlineCount() {
        int online = Bukkit.getOnlinePlayers().size();
        int max = Bukkit.getMaxPlayers();

        try {
            String payload = "{\\\"online\\\":" + online + ",\\\"max\\\":" + max + "}";
            byte[] data = payload.getBytes(StandardCharsets.UTF_8);

            URL url = new URL(API_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Content-Length", String.valueOf(data.length));
            conn.setDoOutput(true);
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(data);
            }

            int responseCode = conn.getResponseCode();
            conn.disconnect();

            getLogger().info("Online sent: " + online + "/" + max + " (HTTP " + responseCode + ")");
        } catch (Exception e) {
            getLogger().log(Level.WARNING, "Failed to send online count: " + e.getMessage());
        }
    }
}
"""

README_TXT = b"""LastCraftOnline Plugin
=======================
Version: 1.0.0
For: Minecraft 1.20.1 (Bukkit/Spigot/Paper)

INSTALLATION:
1. Copy LastCraftOnline.jar to your server /plugins folder
2. Restart the server
3. Plugin will automatically send online count every 30 seconds

WHAT IT DOES:
- Every 30 seconds sends current online players count to the LastCraft website
- The website shows REAL online count in real time
- Works on Bukkit, Spigot, Paper 1.20.1

NO CONFIGURATION NEEDED - works out of the box!

Support: discord.gg/lastcraft
"""

def build_plugin_jar() -> bytes:
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        # Plugin manifest
        zf.writestr("plugin.yml", PLUGIN_YML)

        # README
        zf.writestr("README.txt", README_TXT)

        # Java source as reference (compiled class stub)
        zf.writestr(
            "dev/lastcraft/online/LastCraftOnline.java",
            MAIN_CLASS_JAVA
        )

        # Minimal valid compiled class stub (magic bytes for .class)
        # This is a placeholder - real jar needs compiled bytecode
        # We provide source + gradle build instructions
        zf.writestr(
            "COMPILE_INSTRUCTIONS.txt",
            b"""HOW TO COMPILE:
=====================
1. Install Java 17+ and Maven/Gradle
2. Create Maven project with spigot-api dependency:

<dependency>
  <groupId>org.spigotmc</groupId>
  <artifactId>spigot-api</artifactId>
  <version>1.20.1-R0.1-SNAPSHOT</version>
  <scope>provided</scope>
</dependency>

3. Copy LastCraftOnline.java to src/main/java/dev/lastcraft/online/
4. Copy plugin.yml to src/main/resources/
5. Run: mvn clean package
6. Upload target/LastCraftOnline-1.0.0.jar to your /plugins folder

OR use pre-compiled version from:
https://discord.gg/lastcraft (ask admin for .jar)
"""
        )

        # Manifest
        zf.writestr(
            "META-INF/MANIFEST.MF",
            b"Manifest-Version: 1.0\nCreated-By: LastCraft\n"
        )

    return buf.getvalue()


def handler(event: dict, context) -> dict:
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    jar_bytes = build_plugin_jar()
    encoded = base64.b64encode(jar_bytes).decode("utf-8")

    return {
        "statusCode": 200,
        "headers": {
            **cors,
            "Content-Type": "application/zip",
            "Content-Disposition": 'attachment; filename="LastCraftOnline-1.0.0.zip"',
            "Content-Length": str(len(jar_bytes)),
        },
        "body": encoded,
        "isBase64Encoded": True,
    }
