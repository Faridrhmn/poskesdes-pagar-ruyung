import os
import re

def add_logging(path):
    if not os.path.exists(path): return
    with open(path, 'r') as f: content = f.read()
    
    # Replace catch block to log error to /tmp/api_error.log
    content = re.sub(
        r'catch \(Exception \$e\) \{', 
        r"catch (Exception $e) {\n    file_put_contents('/tmp/api_error.log', date('Y-m-d H:i:s') . ' ' . $e->getMessage() . \"\\n\", FILE_APPEND);", 
        content
    )
    
    # Also log if execute returns false
    content = content.replace("return $stmt->execute();", "if (!$stmt->execute()) { file_put_contents('/tmp/api_error.log', date('Y-m-d H:i:s') . ' Execute failed: ' . json_encode($stmt->errorInfo()) . \"\\n\", FILE_APPEND); return false; } return true;")
    
    with open(path, 'w') as f: f.write(content)

add_logging('/home/patrick/skripsi_hehe/api/kb.php')
add_logging('/home/patrick/skripsi_hehe/api/lansia.php')
add_logging('/home/patrick/skripsi_hehe/api/anc.php')
add_logging('/home/patrick/skripsi_hehe/api/jadwal.php')
