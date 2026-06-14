$root = "c:\Users\acer\Desktop\TVK(Talent Venture Konnect)\frontend\src"

$files = Get-ChildItem -Path $root -Recurse -Include *.jsx, *.js

foreach ($file in $files) {
    Write-Host "Processing $($file.FullName)"
    $content = Get-Content $file.FullName -Raw
    
    # 1. Restore broken react imports
    $content = $content -replace 'import\s+\*\s+from\s+"react"', 'import * as React from "react"'
    
    # 2. Remove complex multiline type annotations on function components and props
    # This matches from : to ) { or ) => {
    $content = $content -replace '(?s):\s*(?:React\.|VariantProps|\[|\{).*?(?=\)\s*\{|\)\s*=>|\)\s*\n\s*\{)', ''
    
    # 3. Remove interfaces
    $content = $content -replace '(?s)interface\s+\w+\s*(?:extends\s+.*?)?\{.*?\}', ''
    
    # 4. Remove type aliases
    $content = $content -replace '(?s)type\s+\w+\s*=\s*.*?;', ''
    
    # 5. Remove simple types
    $content = $content -replace ':\s*React\.[A-Z]\w+', ''
    $content = $content -replace ':\s*(?:string|number|boolean|any|void|unknown|never)(?=[,)=])', ''
    
    # 6. Remove generic types in hooks
    $content = $content -replace 'useState<.*?>', 'useState'
    $content = $content -replace 'useRef<.*?>', 'useRef'
    
    # 7. Remove 'as' assertions (avoiding 'import * as')
    $content = $content -replace '(?<!\*)(\s+as\s+[A-Z]\w+)', ''
    
    # 8. Clean up leftover syntax from broken props
    $content = $content -replace '(?s)\{\s*\w+\?\s*:\s*\w+;\s*\}', '' # matches { asChild?: boolean; }
    
    # 9. Strip non-null assertions
    $content = $content.Replace("!.", ".").Replace("!)", ")").Replace("!?", "?")
    
    Set-Content $file.FullName $content
}
