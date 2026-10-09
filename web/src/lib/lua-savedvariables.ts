/** Restricted parser for WoW SavedVariables tables. Does not execute Lua. */
type LuaValue = string | number | boolean | null | LuaValue[] | Record<string,LuaValue>;
export function parseSavedVariables(source:string):Record<string,LuaValue>{
 if(source.length>4_000_000)throw new Error("File too large");
 const input=source.replace(/^\uFEFF/,"");
 const match=/\bWCC_DB\s*=/.exec(input);
 if(!match)throw new Error("WCC_DB not found");
 let i=match.index+match[0].length, tokens=0;
 const ws=()=>{while(i<input.length){if(/\s/.test(input[i]))i++;else if(input.slice(i,i+2)==="--"){while(i<input.length&&input[i]!=="\n")i++;}else break;}};
 const value=(depth:number):LuaValue=>{
  if(++tokens>100000||depth>40)throw new Error("Lua data too complex");
  ws();const ch=input[i];
  if(ch==="{"){
   i++;const obj:Record<string,LuaValue>={};let index=1;ws();
   while(input[i]!=="}"){
    if(i>=input.length)throw new Error("Unterminated table");
    ws();let key:string|undefined;
    if(input[i]==="["){i++;const k=value(depth+1);ws();if(input[i++]!=="]")throw new Error("Expected ]");ws();if(input[i++]!=="=")throw new Error("Expected =");key=String(k);}
    else{const m=/^([A-Za-z_][\w]*)\s*=/.exec(input.slice(i));if(m){key=m[1];i+=m[0].length;}}
    const v=value(depth+1);obj[key??String(index++)]=v;ws();
    if(input[i]===","||input[i]===";"){i++;ws();}else if(input[i]!=="}")throw new Error("Expected separator");
   }i++;return obj;
  }
  if(ch==='"'||ch==="'"){
   const quote=input[i++];let out="";
   while(i<input.length&&input[i]!==quote){
    if(input[i]==="\\"){i++;const esc=input[i++];out+=({n:"\n",r:"\r",t:"\t"} as Record<string,string>)[esc]??esc;}
    else out+=input[i++];
   }
   if(input[i++]!==quote)throw new Error("Unterminated string");
   return out;
  }
  const rem=input.slice(i), num=/^-?\d+(?:\.\d+)?/.exec(rem);
  if(num){i+=num[0].length;return Number(num[0]);}
  const word=/^(true|false|nil)\b/.exec(rem);
  if(word){i+=word[0].length;return word[1]==="nil"?null:word[1]==="true";}
  throw new Error("Unsupported Lua value at "+i);
 };
 const data=value(0);if(!data||Array.isArray(data)||typeof data!=="object")throw new Error("Invalid WCC_DB");
 return data as Record<string,LuaValue>;
}
