import os

path = 'components/poskesdes/init-poskesdes.ts'
if os.path.exists(path):
    with open(path, 'r') as f:
        content = f.read()

    # The broken strings
    broken_str1 = '((pasien.id || pasien.id_pasien) || (pasien.id || pasien.id_pasien)_pasien)'
    broken_str2 = '((p.id || p.id_pasien) || (p.id || p.id_pasien)_pasien)'
    broken_str3 = '((item.id || item.id_pasien) || (item.id || item.id_pasien)_pasien)'
    
    # Fix broken syntax
    content = content.replace(broken_str1, '(pasien.id || pasien.id_pasien)')
    content = content.replace(broken_str2, '(p.id || p.id_pasien)')
    content = content.replace(broken_str3, '(item.id || item.id_pasien)')
    
    with open(path, 'w') as f:
        f.write(content)

