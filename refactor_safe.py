import os

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
            
        # Select
        content = content.replace('SELECT * FROM', f'SELECT *, {new_id} AS id FROM')
        
        # Where clauses
        content = content.replace('WHERE id = ?', f'WHERE {new_id} = ?')
        
        # Inserts: (id,
        content = content.replace('(id,', f'({new_id},')
        content = content.replace('(id)', f'({new_id})')
        
        with open(filepath, 'w') as f:
            f.write(content)

process_php()
