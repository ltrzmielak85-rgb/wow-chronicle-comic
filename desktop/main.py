"""WoW Comic Chronicle — local Windows smart capture, no game injection."""
import json
import os
import time
import threading
import queue
import tkinter as tk
from tkinter import ttk, messagebox
from pathlib import Path
from datetime import datetime, timezone
from PIL import Image, ImageChops, ImageStat
import mss

BASE = Path.home() / "Documents" / "WoWComicChronicle"
SHOTS = BASE / "screenshots"
SHOTS.mkdir(parents=True, exist_ok=True)
LOG = BASE / "captures.jsonl"

class App:
    def __init__(self, root):
        self.root = root
        self.root.title("WoW Comic Chronicle — Smart Capture v0.3")
        self.running = False
        self.previous = None
        self.last = 0
        self.events = queue.Queue()
        self.status = tk.StringVar(value="Stopped — F9 captures manually while focused here")
        ttk.Label(root, text="Smart Capture: visual change + cooldown", padding=12).pack()
        ttk.Label(root, textvariable=self.status, padding=8).pack()
        ttk.Button(root, text="Start", command=self.start).pack(fill="x", padx=15)
        ttk.Button(root, text="Stop", command=self.stop).pack(fill="x", padx=15)
        ttk.Button(root, text="Capture now (F9 in app)", command=self.manual).pack(fill="x", padx=15)
        ttk.Label(root, text="Capture is limited to the primary display.\nKeep game visible; no background gameplay automation.", padding=12).pack()
        root.bind("<F9>", lambda _: self.manual())
        root.protocol("WM_DELETE_WINDOW", self.close)
        self.poll()

    def capture(self):
        with mss.mss() as sct:
            shot = sct.grab(sct.monitors[1])
            return Image.frombytes("RGB", shot.size, shot.rgb)

    def save(self, im, reason):
        stamp = datetime.now(timezone.utc)
        name = stamp.strftime("%Y%m%dT%H%M%S_%fZ") + ".jpg"
        im.save(SHOTS / name, quality=85)
        with LOG.open("a", encoding="utf-8") as f:
            f.write(json.dumps({"timestamp":stamp.isoformat(),"file":name,"reason":reason})+"\n")
        self.events.put("Saved " + reason + ": " + name)

    def manual(self):
        try:
            self.save(self.capture(), "manual")
        except Exception as e:
            messagebox.showerror("Capture error", str(e))

    def start(self):
        if self.running:
            return
        self.running = True
        self.previous = None
        threading.Thread(target=self.loop, daemon=True).start()
        self.status.set("Capturing — balanced sensitivity")

    def stop(self):
        self.running = False
        self.status.set("Stopped")

    def loop(self):
        while self.running:
            try:
                im = self.capture()
                small = im.resize((320,180)).convert("L")
                if self.previous is not None:
                    diff = ImageStat.Stat(ImageChops.difference(small, self.previous)).mean[0]
                    if diff > 12 and time.monotonic()-self.last >= 12:
                        self.save(im, "visual_change")
                        self.last = time.monotonic()
                self.previous = small
            except Exception as e:
                self.events.put("Error: " + str(e))
                self.running = False
            time.sleep(2)

    def poll(self):
        try:
            while True:
                self.status.set(self.events.get_nowait())
        except queue.Empty:
            pass
        self.root.after(250, self.poll)

    def close(self):
        self.running = False
        self.root.destroy()

if __name__ == "__main__":
    root = tk.Tk()
    App(root)
    root.mainloop()
