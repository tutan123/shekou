#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import shutil
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
SOURCE_02 = PROJECT_ROOT / "02主界面页"
SOURCE_03 = PROJECT_ROOT / "03路线选择页"
TARGET_INDEX = PROJECT_ROOT / "uniapp" / "static" / "index"
TARGET_ROUTE = PROJECT_ROOT / "uniapp" / "static" / "route"

def copy_file(src, dest):
    if src.exists():
        shutil.copy2(src, dest)
        print(f"[OK] {src.name} -> {dest.name}")
    else:
        print(f"[MISSING] {src}")

def main():
    TARGET_INDEX.mkdir(parents=True, exist_ok=True)
    TARGET_ROUTE.mkdir(parents=True, exist_ok=True)
    
    # 1. Assets for Index Page fix
    copy_file(SOURCE_02 / "Ellipse 1.png", TARGET_INDEX / "ellipse.png")
    
    # 2. Assets for Route Select Page
    MAPPING_03 = {
        "Vector 11.png": "card_bg_1.png",
        "Vector 13.png": "card_bg_2.png",
        "Vector 14.png": "card_bg_3.png",
        "明华轮 2.png": "route_oldstreet.png",
        "alla 2.png": "route_western.png",
        "jojo土耳其占卜咖啡 1.png": "route_coffee.png",
        "Group 37.png": "text_desc.png"
    }
    
    for src_name, target_name in MAPPING_03.items():
        copy_file(SOURCE_03 / src_name, TARGET_ROUTE / target_name)

if __name__ == "__main__":
    main()
