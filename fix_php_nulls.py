import os
import re

def fix_api_empty_strings():
    api_dir = 'api'
    if not os.path.exists(api_dir): return
    
    for filename in os.listdir(api_dir):
        if not filename.endswith('.php'): continue
        filepath = os.path.join(api_dir, filename)
        
        with open(filepath, 'r') as f:
            content = f.read()
            
        original_content = content
        
        # Replace $stmt->bindParam(X, $data['key']); with proper empty check inline
        # Wait, bindParam needs a variable reference, we cannot put an expression in it!
        # So we have to do:
        # $val_key = !empty($data['key']) ? $data['key'] : null;
        # $stmt->bindParam(X, $val_key);
        
        # Actually, a better way is to loop over $data and set empty strings to null.
        # Let's just add a snippet at the top of POST and PUT handlers.
        
        snippet = """
            // Convert empty strings to null to prevent MySQL strict mode errors
            foreach ($data as $key => $value) {
                if ($value === '') {
                    $data[$key] = null;
                }
            }
"""
        
        if "Convert empty strings to null" not in content:
            content = content.replace("$data = json_decode(file_get_contents('php://input'), true);", 
                                      "$data = json_decode(file_get_contents('php://input'), true);" + snippet)
                                      
        if content != original_content:
            with open(filepath, 'w') as f:
                f.write(content)

fix_api_empty_strings()
