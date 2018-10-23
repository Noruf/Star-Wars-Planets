export interface FilmsResponse {
  count?: number;
  next?: string;
  previous?: string;
  results?:Array<{episode_id:string,title:string,url:string}>;
}
