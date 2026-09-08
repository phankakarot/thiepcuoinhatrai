"""Create web-optimized copies from the original wedding-photo folder.

The original files are never modified. Update SOURCE or FILES when choosing a
different album, then run this script with Pillow installed.
"""

from pathlib import Path

from PIL import Image, ImageOps

SOURCE = Path(r"D:\Hình Cưới\Final")
DESTINATION = Path(__file__).resolve().parents[1] / "public" / "images"

FILES = {
    "hero.jpg": "DSC_2926.jpg",
    "opening.jpg": "DSC_1985.jpg",
    "couple-01.jpg": "DSC_2035.jpg",
    "couple-02.jpg": "DSC_2448.jpg",
    "couple-03.jpg": "DSC_2576.jpg",
    "couple-04.jpg": "DSC_3214.jpg",
    "album-01.jpg": "DSC_2057.jpg",
    "album-02.jpg": "DSC_2237.jpg",
    "album-03.jpg": "DSC_2393.jpg",
    "album-04.jpg": "DSC_2576.jpg",
    "album-05.jpg": "11111.jpg",
    "album-06.jpg": "DSC_2673.jpg",
    "album-07.jpg": "DSC_3053.jpg",
    "album-08.jpg": "DSC_3144.jpg",
}

DESTINATION.mkdir(parents=True, exist_ok=True)

for target_name, source_name in FILES.items():
    with Image.open(SOURCE / source_name) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        image.thumbnail((2200, 2200), Image.Resampling.LANCZOS)
        image.save(
            DESTINATION / target_name,
            "JPEG",
            quality=84,
            optimize=True,
            progressive=True,
        )
        print(f"{source_name} -> {target_name} ({image.width}x{image.height})")
