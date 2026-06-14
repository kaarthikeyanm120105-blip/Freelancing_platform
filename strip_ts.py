import os
import re

def strip_ts(content):
    # Remove type imports
    content = re.sub(r'import type\s+{[^}]+}\s+from\s+[\'"][^\'"]+[\'"];?\n?', '', content)
    content = re.sub(r',?\s*type\s+\w+', '', content) # e.g. { cva, type VariantProps }
    
    # Remove interfaces
    content = re.sub(r'interface\s+\w+\s*(?:extends\s+\w+(?:\s*,\s*\w+)*)?\s*{[\s\S]*?}\n?', '', content)
    
    # Remove type aliases
    content = re.sub(r'type\s+\w+\s*=\s*[\s\S]*?;\n?', '', content)
    
    # Remove type annotations in functions: (arg: Type) => (arg)
    # Simple colon annotations
    content = re.sub(r':\s*[A-Z][\w<>[\].,\s&|{}]+(?=[,)=])', '', content)
    # lowercase ones like : string, : number
    content = re.sub(r':\s*(?:string|number|boolean|any|void|unknown|never)(?=[,)=])', '', content)
    
    # Remove return type annotations: function f(): Type { -> function f() {
    content = re.sub(r'\)\s*:\s*[A-Z][\w<>[\].,\s&|{}]+(?=\s*{)', ')', content)
    content = re.sub(r'\)\s*:\s*(?:string|number|boolean|any|void|unknown|never)(?=\s*{)', ')', content)
    
    # Remove non-null assertions
    content = content.replace('!.', '.')
    content = content.replace('!)', ')')
    
    # Remove generics in 1useState<Type>(...)` -> `useState(...)`
    content = re.sub(r'useState<[\s\S]*?>', 'useState', content)
    content = re.sub(r'useRef<[\s\S]*?>', 'useRef', content)
    
    # Remove variable type annotations: const x: Type = ...
    content = re.sub(r'(const|let|var)\s+(\w+)\s*:\s*[A-Z][\w<>[\].,\s&|{}]+(?=\s*=)', r'\1 \2', content)
    
    # Remove "as Type" assertions
    content = re.sub(r'\s+as\s+[A-Z][\w<>[\]|&{}]+', '', content)
    
    return content

root_dir = r"c:\Users\acer\Desktop\TVK(Talent Venture Konnect)\frontend\src"

for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = strip_ts(content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Stripped TS from {path}")
