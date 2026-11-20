export const ALIE_DRIVE_FOLDER_0550=typeof __PJ0550_ALIE_DRIVE_FOLDER__==='string'?__PJ0550_ALIE_DRIVE_FOLDER__:'';
const clientId=typeof __PJ0550_ALIE_GOOGLE_CLIENT__==='string'?__PJ0550_ALIE_GOOGLE_CLIENT__:'';
const scope='https://www.googleapis.com/auth/drive.readonly';
const driveOrigin='https://www.googleapis.com/drive/v3/files';
const gisUrl='https://accounts.google.com/gsi/client';
const pdfLimit=16*1024*1024;
export const driveFolderMime0550='application/vnd.google-apps.folder';
const fileIdPattern=/^[\w-]{10,128}$/;
let googleSdk;

export function alieFolderId0550(input){
 const value=input.trim();
 if(fileIdPattern.test(value))return value;
 try{
  const url=new URL(value),match=url.pathname.match(/^\/drive\/folders\/([\w-]+)\/?$/);
  return url.origin==='https://drive.google.com'&&fileIdPattern.test(match?.[1]||'')?match[1]:'';
 }catch{return '';}
}

export function loadAlieDrive0550(){
 if(!clientId)return Promise.reject(Error('Set GENESIS_0550_GOOGLE_CLIENT_ID to enable Drive API access.'));
 if(window.google?.accounts?.oauth2)return Promise.resolve();
 if(!googleSdk)googleSdk=new Promise((resolve,reject)=>{
  const script=document.createElement('script');
  script.src=gisUrl;
  script.async=true;
  script.onload=resolve;
  script.onerror=()=>{script.remove();reject(Error('Google sign-in could not load.'));};
  document.head.appendChild(script);
 }).catch(error=>{googleSdk=null;throw error;});
 return googleSdk;
}

export function authorizeAlieDrive0550(){
 return new Promise((resolve,reject)=>{
  const oauth=window.google.accounts.oauth2;
  const token=oauth.initTokenClient({client_id:clientId,scope,include_granted_scopes:false,
   callback:response=>{
    if(response.error||!response.access_token||!oauth.hasGrantedAllScopes(response,scope)){
     reject(Error('Drive read access was not granted.'));
     return;
    }
    resolve(response.access_token);
   },
   error_callback:()=>reject(Error('Google sign-in was interrupted.')),
  });
  token.requestAccessToken();
 });
}

async function driveFetch(token,url){
 const response=await fetch(url,{headers:{Authorization:'Bearer '+token},cache:'no-store',signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw Error(response.status===401?'Drive session expired. Connect again.':'Drive request failed (HTTP '+response.status+').');
 return response;
}

export async function listAlieDrive0550(token,folder){
 if(!fileIdPattern.test(folder))throw Error('Enter a valid Drive folder link or ID.');
 const files=[];
 let pageToken;
 do{
  const params=new URLSearchParams({
   q:`'${folder}' in parents and trashed=false`,fields:'nextPageToken,files(id,name,mimeType,size)',
   pageSize:'100',orderBy:'folder,name',supportsAllDrives:'true',includeItemsFromAllDrives:'true',
  });
  if(pageToken)params.set('pageToken',pageToken);
  const page=await (await driveFetch(token,driveOrigin+'?'+params)).json();
  files.push(...page.files);
  if(files.length>500)throw Error('Open a smaller quotation folder (maximum 500 entries).');
  pageToken=page.nextPageToken;
 }while(pageToken);
 return files;
}

export async function downloadAliePdf0550(token,file){
 if(file.mimeType!=='application/pdf'||!fileIdPattern.test(file.id))throw Error('Select a PDF file.');
 if(!Number.isFinite(Number(file.size))||Number(file.size)>pdfLimit)throw Error('The PDF exceeds 16 MiB.');
 const response=await driveFetch(token,driveOrigin+'/'+file.id+'?alt=media&supportsAllDrives=true');
 return response.blob();
}

export async function fingerprintAliePdf0550(blob){
 if(!blob.size||blob.size>pdfLimit)throw Error('Select a PDF up to 16 MiB.');
 const bytes=await blob.arrayBuffer();
 if(new TextDecoder().decode(bytes.slice(0,5))!=='%PDF-')throw Error('The selected file is not a PDF.');
 const sha=await globalThis.crypto.subtle.digest('SHA-256',bytes);
 return Array.from(new Uint8Array(sha),byte=>byte.toString(16).padStart(2,'0')).join('');
}

export async function extractAliePdf0550(blob,sha256){
 const response=await fetch('/api/local/pj2608-0550/alie-pdf',{method:'POST',cache:'no-store',
  headers:{'Content-Type':'application/pdf'},body:blob,signal:AbortSignal.timeout(25000)});
 if(!response.headers.get('content-type')?.includes('application/json'))throw Error('PDF extraction requires the local GENESIS development server.');
 const result=await response.json();
 if(!response.ok){
  if(result.code==='PDFTOTEXT_UNAVAILABLE')throw Error('Install Poppler pdftotext or configure GENESIS_0550_PDFTOTEXT for local extraction.');
  throw Error('PDF extraction failed / '+result.code);
 }
 if(result.sha256!==sha256)throw Error('PDF fingerprint differs from the extracted source.');
 return result;
}
