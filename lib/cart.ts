import type { CartLine } from "@/types";
export function addCartLine(lines:CartLine[],productId:string,quantity:number,available:number){if(quantity<1||available<1)return lines;const current=lines.find(line=>line.productId===productId);if(!current)return[...lines,{productId,quantity:Math.min(quantity,available)}];return lines.map(line=>line.productId===productId?{...line,quantity:Math.min(line.quantity+quantity,available)}:line)}
export function cartSubtotal(lines:CartLine[],prices:Map<string,number>){return lines.reduce((total,line)=>total+(prices.get(line.productId)??0)*line.quantity,0)}
export function canReserve(stock:number,reserved:number,requested:number){return requested>0&&stock-reserved>=requested}
