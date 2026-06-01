import os
import re

def fix_all_keys():
    search_dirs = ['app', 'components']
    for search_dir in search_dirs:
        for root, dirs, files in os.walk(search_dir):
            for file in files:
                if file.endswith('.tsx') or file.endswith('.ts'):
                    path = os.path.join(root, file)
                    with open(path, 'r') as f:
                        content = f.read()
                    
                    original_content = content
                    
                    # Regex to match key={variable.id}
                    content = re.sub(r'key={(\w+)\.id}', r'key={\1.id || \1.id_pasien || \1.id_anc || \1.id_kb || \1.id_lansia || \1.id_jadwal || \1.id_edukasi || \1.id_admin}', content)
                    
                    if content != original_content:
                        with open(path, 'w') as f:
                            f.write(content)

fix_all_keys()
