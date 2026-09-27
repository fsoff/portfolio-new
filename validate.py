from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
import json
root=Path(__file__).parent/'docs';errors=[];count=0
class Doc(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=[];self.h1=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='h1':self.h1+=1
  if 'id'in a:self.ids.append(a['id'])
  for key in ['src','href','poster','data-image']:
   if a.get(key):self.links.append(a[key])
  if 'data-pages'in a:self.links+=json.loads(a['data-pages'])
  if 'data-frames'in a:self.links+=json.loads(a['data-frames'])
  if tag=='img' and 'alt'not in a:errors.append('Missing alt')
parsed={}
for path in root.rglob('*.html'):
 d=Doc();d.feed(path.read_text());parsed[path]=d
 if d.h1!=1:errors.append(f'{path}: h1 count {d.h1}')
 if len(d.ids)!=len(set(d.ids)):errors.append(f'{path}: duplicate id')
for path,d in parsed.items():
 for ref in d.links:
  if ref.startswith(('http:','https:','mailto:','data:')):continue
  u=urlsplit(ref);target=(root/unquote(u.path).lstrip('/')) if u.path.startswith('/') else path.parent/unquote(u.path)
  if not u.path:target=path
  target=target.resolve()
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{path.relative_to(root)}: missing {ref}')
  elif u.fragment and target in parsed and u.fragment not in parsed[target].ids:errors.append(f'{path}: missing fragment {ref}')
  count+=1
print(f'Checked {len(parsed)} pages and {count} local links/assets.')
if errors:raise SystemExit('\n'.join(errors))
print('PASS: routes, assets, fragments, image alt attributes and heading structure.')
