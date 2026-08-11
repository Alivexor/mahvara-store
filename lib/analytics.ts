type AnalyticsEvent={name:string;properties?:Record<string,string|number|boolean>};
export function track(event:AnalyticsEvent){if(typeof window==="undefined"||!process.env.NEXT_PUBLIC_ANALYTICS_ID)return;window.dispatchEvent(new CustomEvent("mahvara:analytics",{detail:{...event,analyticsId:process.env.NEXT_PUBLIC_ANALYTICS_ID}}))}
