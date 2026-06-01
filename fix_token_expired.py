import os

def improve_api_error_handling():
    path = '/home/patrick/Downloads/web-bidan-main/lib/api.ts'
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        content = f.read()
        
    original = content
    
    # Add interceptor for 401
    replacement = """
    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.alert('Sesi Login Anda telah habis (Token Expired). Anda akan diarahkan ke halaman Login.')
          window.location.href = '/admin/login'
        }
      }
      throw new Error(data.message || `API request failed: ${response.status}`)
    }
"""
    
    if "window.location.href = '/admin/login'" not in content:
        # Need to find the exact block
        content = content.replace("""    if (!response.ok) {
      throw new Error(data.message || `API request failed: ${response.status}`)
    }""", replacement)
        
    if content != original:
        with open(path, 'w') as f:
            f.write(content)

improve_api_error_handling()
