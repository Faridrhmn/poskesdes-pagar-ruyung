import os
import glob

def fix_all_ids():
    search_dirs = ['app', 'components']
    for search_dir in search_dirs:
        for root, dirs, files in os.walk(search_dir):
            for file in files:
                if file.endswith('.tsx') or file.endswith('.ts'):
                    path = os.path.join(root, file)
                    with open(path, 'r') as f:
                        content = f.read()
                    
                    original_content = content
                    
                    # Fix PasienSection.tsx and JadwalFormSection.tsx variable "pasien"
                    content = content.replace('pasien.id', '(pasien.id || pasien.id_pasien)')
                    
                    # Fix any missed key={item.id} or similar
                    content = content.replace('key={item.id}', 'key={item.id || item.id_pasien || item.id_anc || item.id_kb || item.id_lansia || item.id_jadwal || item.id_edukasi}')
                    content = content.replace('key={p.id}', 'key={p.id || p.id_pasien}')
                    content = content.replace('value={pasien.id}', 'value={pasien.id || pasien.id_pasien}')
                    
                    # Also fix any remaining .id accesses for item, p, j, record etc that might be causing warnings
                    content = content.replace('record.id', '(record.id || record.id_anc || record.id_kb || record.id_lansia)')
                    
                    if content != original_content:
                        with open(path, 'w') as f:
                            f.write(content)

fix_all_ids()
