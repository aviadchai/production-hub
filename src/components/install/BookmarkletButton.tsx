'use client'

import { GripVertical } from 'lucide-react'
import { toast } from 'sonner'

const PRODUCTION_HUB_URL = 'https://production-hub-omega-five.vercel.app'

const bookmarkletCode = `javascript:(function(){
  if(!location.href.includes('toolkit.artlist.io')){
    alert('Open this on toolkit.artlist.io first.');
    return;
  }
  var p=new URLSearchParams(location.search);
  var prompt='';
  document.querySelectorAll('textarea').forEach(function(t){if(!prompt&&t.value.length>20)prompt=t.value;});
  if(!prompt)document.querySelectorAll('input[type=text]').forEach(function(i){if(!prompt&&i.value.length>20)prompt=i.value;});
  var v=document.querySelector('video');
  var vs=v?(v.currentSrc||v.src):'';
  var models=['sora','runway','veo','kling'];
  var model='other';
  var body=document.body.innerText.toLowerCase();
  models.forEach(function(m){if(body.includes(m))model=m;});
  var url='${PRODUCTION_HUB_URL}/add?'+
    'artlistUrl='+encodeURIComponent(location.href)+
    '&assetId='+encodeURIComponent(p.get('assetId')||'')+
    '&width='+encodeURIComponent(p.get('assetWidth')||'')+
    '&height='+encodeURIComponent(p.get('assetHeight')||'')+
    '&ratio='+encodeURIComponent(p.get('assetAspectRatio')||'')+
    '&model='+encodeURIComponent(model)+
    '&prompt='+encodeURIComponent(prompt.slice(0,800))+
    (vs?'&videoSrc='+encodeURIComponent(vs):'');
  window.open(url,'_blank','width=480,height=600');
})();`

export function BookmarkletButton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-border bg-secondary/20 hover:border-border/80 transition-colors">
        <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0" />
        <a
          href={bookmarkletCode}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-semibold cursor-grab active:cursor-grabbing select-none hover:bg-foreground/90 transition-colors"
          onClick={(e) => {
            e.preventDefault()
            toast.info('Drag this button to your bookmarks bar — don\'t click it here.')
          }}
          draggable
        >
          <span>🎬</span>
          Prompt Manager
        </a>
        <p className="text-xs text-muted-foreground">← Drag this to your bookmarks bar</p>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Can&apos;t drag? Right-click the button → <strong>Bookmark link</strong>
      </p>
    </div>
  )
}
