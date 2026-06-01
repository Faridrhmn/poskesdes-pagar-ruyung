import os
import re

def fix_init_poskesdes():
    path = 'components/poskesdes/init-poskesdes.ts'
    if not os.path.exists(path): return
    with open(path, 'r') as f: content = f.read()

    # Fix getPendaftar
    content = content.replace('item.id && item.id.startsWith', '(item.id || item.id_pasien) && (item.id || item.id_pasien)!.startsWith')
    
    # Fix populateDropdown
    content = content.replace('!pasien.id', '!(pasien.id || pasien.id_pasien)')
    content = content.replace('option.value = pasien.id', 'option.value = (pasien.id || pasien.id_pasien) as string')
    
    # Fix handlePasienSelect
    content = content.replace('p.id === pasienId', '(p.id || p.id_pasien) === pasienId')
    
    # Fix handleRecordSubmission
    content = content.replace('pasien?.id || undefined', '(pasien?.id || pasien?.id_pasien) || undefined')
    content = content.replace('pasien_id: pasien?.id', 'pasien_id: pasien?.id || pasien?.id_pasien')
    
    # Fix loadEducation delete loop
    content = content.replace('data-delete-edu="${item.id}"', 'data-delete-edu="${item.id || item.id_edukasi}"')
    
    with open(path, 'w') as f: f.write(content)

fix_init_poskesdes()
