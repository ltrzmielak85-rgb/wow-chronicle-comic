# WoW Comic Chronicle — TBC Anniversary v0.3.0

Local WoW quest-event addon + Windows screenshot capture prototype.

## Install addon
Copy `addon/WoWComicChronicle` to `World of Warcraft/_anniversary_/Interface/AddOns/`.
Enable the addon, log in, and try `/wcc status`, `/wcc quests`, `/wcc debug`.
Quest and world events persist in per-character SavedVariables after logout or /reload.

## Windows EXE — no Python needed
Open **Actions → Build Windows EXE → Run workflow**, wait for success, and download the `WoWComicChronicle-Windows` artifact. Extract and run `WoWComicChronicle.exe`.

## Current limits
The Windows capture prototype uses visual-change detection, not reliable semantic recognition of NPCs, combat or quest completion. It captures the primary monitor and may include other visible windows or personal information. Use only when comfortable with that; screenshots remain local. F9 works when the capture app has keyboard focus, not globally while WoW is focused. Quest-to-screenshot matching and AI comic generation are future work. The addon is not yet live-tested in TBC Anniversary and may need an Interface number update after patches.

## Build status
GitHub Actions builds the executable on Windows using Python and PyInstaller in GitHub's runner; the end user does not install Python.
