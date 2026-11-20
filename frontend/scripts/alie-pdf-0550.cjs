const {spawn}=require('node:child_process');
const {createHash}=require('node:crypto');
const {permitted}=require('./source-drive-0550.cjs');

const endpoint='/api/local/pj2608-0550/alie-pdf';
const maxBytes=16*1024*1024;
const money=String.raw`\d[\d,]*\.\d{2}`;
const pricedRow=new RegExp(String.raw`^(?:(\d+(?:\.\d+)*)\s+)?(.+?)\s{2,}(set|pc|pcs|ea|lot|ls|m|day|year)\s+(\d+(?:\.\d+)?)\s+(${money})\s+(${money})\s+(THB|USD|EUR)$`,'i');
const subtotalRow=new RegExp(String.raw`^Total\s+(${money})\s+(THB|USD|EUR)$`,'i');
const cents=value=>BigInt(value.replace(/[,.]/g,''));
const codeError=(code,status)=>Object.assign(Error(code),{code,status});

function parseQuotedTable(text){
 const pages=text.split('\f');
 const header=pages[0].match(/^.*\bNo\.\s*:\s*([A-Z0-9][A-Z0-9.-]+)\s*$/m);
 const date=pages[0].match(/\bDate\s*:\s*(\d{1,2})[ -]([A-Za-z]{3,9})[ -](\d{4})\s*$/m);
 if(!header||!date)return null;
 const parsedDate=new Date(`${date[1]} ${date[2]} ${date[3]} UTC`);
 if(!Number.isFinite(parsedDate.getTime())||parsedDate.getUTCDate()!==Number(date[1]))return null;
 const rows=[];
 let subtotal,currency,section='',current;
 for(const [pageIndex,page] of pages.entries()){
  for(const [lineIndex,raw] of page.split('\n').entries()){
   const line=raw.trim();
   const total=line.match(subtotalRow);
   if(total){if(subtotal)return null;[ ,subtotal,currency]=total;current=null;continue;}
   const match=line.match(pricedRow);
   if(match){
    if(subtotal)return null;
    const [,item,description,unit,qty,rate,amount,ccy]=match;
    const [whole,fraction='']=qty.split('.');
    if(BigInt(whole+fraction)*cents(rate)!==cents(amount)*10n**BigInt(fraction.length))return null;
    const page=pageIndex+1,lineNumber=lineIndex+1;
    current={item:item||`P${page}-L${lineNumber}`,printedItem:item||null,description,unit,qty:Number(qty),
     unitCost:rate.replaceAll(',',''),amount:amount.replaceAll(',',''),currency:ccy.toUpperCase(),page,line:lineNumber,section,details:[]};
    rows.push(current);
   }else if(/^\s{12,}\S/.test(raw)&&/^(VHF|VH-AM|MF\/HF|NDB\b|AIS\b|METEOROLOGICAL\b)/i.test(line)){
    section=line;current=null;
   }else if(current&&line&&/^\s{4,}\S/.test(raw)&&!/\b(?:Unit Price|Customer No\.|GENERAL TERMS)\b/.test(line)){
    current.details.push(line);
   }
  }
 }
 if(!subtotal||!rows.length||rows.length>250||new Set(rows.map(r=>r.item)).size!==rows.length||
    rows.some(r=>r.currency!==currency.toUpperCase()||!Number.isFinite(r.qty)||r.qty<=0)||
    rows.reduce((sum,row)=>sum+cents(row.amount),0n)!==cents(subtotal))return null;
 return {quoteRef:header[1].toUpperCase(),date:parsedDate.toISOString().slice(0,10),currency:currency.toUpperCase(),
  subtotal:subtotal.replaceAll(',',''),rows};
}

function extractText(pdf,executable=process.env.GENESIS_0550_PDFTOTEXT||'pdftotext'){
 return new Promise((resolve,reject)=>{
  const child=spawn(executable,['-layout','-enc','UTF-8','-','-'],{windowsHide:true,stdio:['pipe','pipe','ignore']});
  const output=[];
  let length=0;
  const fail=(code,status)=>{
   child.kill();
   reject(codeError(code,status));
  };
  const timer=setTimeout(()=>fail('PDF_EXTRACTION_TIMEOUT',422),15000);
  child.once('error',e=>{clearTimeout(timer);fail(e.code==='ENOENT'?'PDFTOTEXT_UNAVAILABLE':'PDF_EXTRACTION_FAILED',503);});
  child.stdout.on('data',chunk=>{
   length+=chunk.length;
   if(length>2*1024*1024){fail('PDF_TEXT_TOO_LARGE',422);return;}
   output.push(chunk);
  });
  child.stdin.on('error',()=>{});
  child.once('close',code=>{
   clearTimeout(timer);
   if(code!==0)reject(codeError('PDF_EXTRACTION_FAILED',422));
   else resolve(Buffer.concat(output).toString('utf8'));
  });
  child.stdin.end(pdf);
 });
}

function createAliePdfMiddleware(extract=extractText){
 return async(req,res,next)=>{
  if(req.url.split('?')[0]!==endpoint)return next();
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options','nosniff');
  try{
   if(!permitted(req))throw codeError('LOCAL_ACCESS_ONLY',403);
   if(req.method!=='POST')throw codeError('METHOD_NOT_ALLOWED',405);
   if(req.headers['content-type']!=='application/pdf')throw codeError('PDF_REQUIRED',415);
   const length=Number(req.headers['content-length']);
   if(!Number.isSafeInteger(length)||length<=0||length>maxBytes)throw codeError('PDF_SIZE_INVALID',413);
   const chunks=[];
   let size=0;
   for await(const chunk of req){
    size+=chunk.length;
    if(size>maxBytes)throw codeError('PDF_SIZE_INVALID',413);
    chunks.push(chunk);
   }
   const pdf=Buffer.concat(chunks);
   if(!pdf.subarray(0,5).equals(Buffer.from('%PDF-')))throw codeError('PDF_REQUIRED',415);
   const text=await extract(pdf);
   const quote=parseQuotedTable(text);
   res.end(JSON.stringify({sha256:createHash('sha256').update(pdf).digest('hex'),
    state:quote?'RECONCILED_DRAFT':text.trim()?'LAYOUT_OPEN':'OCR_REQUIRED',quote}));
  }catch(e){
   res.statusCode=e.status||422;
   res.end(JSON.stringify({code:e.code||'PDF_EXTRACTION_FAILED'}));
  }
 };
}

module.exports={createAliePdfMiddleware,parseQuotedTable};
