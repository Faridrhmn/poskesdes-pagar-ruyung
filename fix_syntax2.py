import os

path = 'components/poskesdes/init-poskesdes.ts'
if os.path.exists(path):
    with open(path, 'r') as f:
        content = f.read()

    # The broken strings
    broken_str1 = '((pasien.id || pasien.id_pasien) || (pasien.id || pasien.id_pasien)_pasien)'
    broken_str2 = '!(pasien.id || pasien.id_pasien) || pasien.id_pasien)'
    
    # Fix broken syntax
    content = content.replace(broken_str1, '(pasien.id || pasien.id_pasien)')
    content = content.replace(broken_str2, '!(pasien.id || pasien.id_pasien)')
    
    with open(path, 'w') as f:
        f.write(content)

