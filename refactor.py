import os
import re

mapping = {
    'pasien': 'id_pasien',
    'anc': 'id_anc',
    'kb': 'id_kb',
    'lansia': 'id_lansia',
    'jadwal': 'id_jadwal',
    'education': 'id_edukasi',
    'admin': 'id_admin'
}

def process_php():
    api_dir = 'api'
    for filename in os.listdir(api_dir):
        if not filename.endswith('.php') or filename in ['db.php', 'backup.php']:
            continue
            
        base = filename.replace('.php', '')
        if base not in mapping:
            continue
            
        new_id = mapping[base]
        
        filepath = os.path.join(api_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()
            
        # Replace SELECT * FROM
        content = re.sub(r'SELECT\s+\*\s+FROM', f'SELECT *, {new_id} AS id FROM', content)
        # Replace sql usages: id = ?
        content = re.sub(r'\bid\b\s*=', f'{new_id} =', content)
        # Replace (id, 
        content = re.sub(r'\(id,', f'({new_id},', content)
        
        with open(filepath, 'w') as f:
            f.write(content)

process_php()
