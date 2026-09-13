"""
Subsets the three variable faces to the glyphs this site actually sets.
The content is fixed, so shipping the full latin range is dead weight on the
critical path. Run after changing the font sources:

    python3 scripts/subset-fonts.py
"""
import pathlib
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'scripts' / 'font-sources'
OUT = ROOT / 'src' / 'fonts'

# Printable ASCII, plus the punctuation the copy and the MDX posts use.
CHARS = ''.join(chr(code) for code in range(32, 127))
CHARS += ' ‘’“”–—…•·×÷±°'
CHARS += '→←↑↓©®™€£¥éèüöäñ'

FACES = [
    ('archivo-latin-var.woff2', 'archivo-latin-var.woff2'),
    ('inter-latin-var.woff2', 'inter-latin-var.woff2'),
    ('jetbrains-mono-latin-var.woff2', 'jetbrains-mono-latin-var.woff2'),
]


def build(source: pathlib.Path, target: pathlib.Path) -> None:
    font = TTFont(source)
    options = subset.Options()
    options.layout_features = ['kern', 'liga', 'calt', 'tnum', 'ccmp', 'locl', 'mark', 'mkmk']
    options.retain_gids = False
    options.notdef_outline = True
    options.name_IDs = ['*']
    options.name_legacy = True
    options.drop_tables += ['DSIG']
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=CHARS)
    subsetter.subset(font)
    font.flavor = 'woff2'
    font.save(target)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for source_name, target_name in FACES:
        source = SRC / source_name
        if not source.exists():
            raise SystemExit(f'Missing font source: {source}')
        target = OUT / target_name
        build(source, target)
        print(f'{target.name}: {target.stat().st_size // 1024} KB')


if __name__ == '__main__':
    main()
