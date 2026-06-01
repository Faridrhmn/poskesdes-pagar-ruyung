import os
import re

def fix_ts():
    # 1. Update lib/api.ts
    with open('lib/api.ts', 'r') as f:
        content = f.read()
    
    # Add the new properties to the interfaces
    content = content.replace('export interface Pasien {\n  id: string', 'export interface Pasien {\n  id?: string;\n  id_pasien?: string')
    content = content.replace('export interface AncRecord {\n  id: string', 'export interface AncRecord {\n  id?: string;\n  id_anc?: string')
    content = content.replace('export interface KbRecord {\n  id: string', 'export interface KbRecord {\n  id?: string;\n  id_kb?: string')
    content = content.replace('export interface LansiaRecord {\n  id: string', 'export interface LansiaRecord {\n  id?: string;\n  id_lansia?: string')
    content = content.replace('export interface Jadwal {\n  id: string', 'export interface Jadwal {\n  id?: string;\n  id_jadwal?: string')
    content = content.replace('export interface EducationMaterial {\n  id: string', 'export interface EducationMaterial {\n  id?: string;\n  id_edukasi?: string')
    
    with open('lib/api.ts', 'w') as f:
        f.write(content)
        
    # 2. Fix app/admin/pasien/page.tsx
    path = 'app/admin/pasien/page.tsx'
    if os.path.exists(path):
        with open(path, 'r') as f: content = f.read()
        content = content.replace('p.id', '(p.id || p.id_pasien)')
        with open(path, 'w') as f: f.write(content)

    # 3. Fix components/poskesdes/sections/PasienSection.tsx
    path = 'components/poskesdes/sections/PasienSection.tsx'
    if os.path.exists(path):
        with open(path, 'r') as f: content = f.read()
        content = content.replace('p.id', '(p.id || p.id_pasien)')
        with open(path, 'w') as f: f.write(content)

    # 4. Fix app/admin/jadwal/page.tsx
    path = 'app/admin/jadwal/page.tsx'
    if os.path.exists(path):
        with open(path, 'r') as f: content = f.read()
        content = content.replace('j.id', '(j.id || j.id_jadwal)')
        content = content.replace('item.id', '(item.id || item.id_jadwal)')
        with open(path, 'w') as f: f.write(content)

    # 5. Fix components/poskesdes/sections/JadwalSection.tsx
    path = 'components/poskesdes/sections/JadwalSection.tsx'
    if os.path.exists(path):
        with open(path, 'r') as f: content = f.read()
        content = content.replace('item.id', '(item.id || item.id_jadwal)')
        with open(path, 'w') as f: f.write(content)

    # 6. Fix components/poskesdes/sections/JadwalFormSection.tsx
    path = 'components/poskesdes/sections/JadwalFormSection.tsx'
    if os.path.exists(path):
        with open(path, 'r') as f: content = f.read()
        content = content.replace('p.id', '(p.id || p.id_pasien)')
        with open(path, 'w') as f: f.write(content)
        
    # 7. Fix app/admin/anc/page.tsx
    path = 'app/admin/anc/page.tsx'
    if os.path.exists(path):
        with open(path, 'r') as f: content = f.read()
        content = content.replace('item.id', '(item.id || item.id_anc)')
        with open(path, 'w') as f: f.write(content)
        
    # 8. Fix app/admin/kb/page.tsx
    path = 'app/admin/kb/page.tsx'
    if os.path.exists(path):
        with open(path, 'r') as f: content = f.read()
        content = content.replace('item.id', '(item.id || item.id_kb)')
        with open(path, 'w') as f: f.write(content)

    # 9. Fix app/admin/lansia/page.tsx
    path = 'app/admin/lansia/page.tsx'
    if os.path.exists(path):
        with open(path, 'r') as f: content = f.read()
        content = content.replace('item.id', '(item.id || item.id_lansia)')
        with open(path, 'w') as f: f.write(content)

    # 10. Fix app/admin/edukasi/page.tsx
    path = 'app/admin/edukasi/page.tsx'
    if os.path.exists(path):
        with open(path, 'r') as f: content = f.read()
        content = content.replace('item.id', '(item.id || item.id_edukasi)')
        with open(path, 'w') as f: f.write(content)

fix_ts()
