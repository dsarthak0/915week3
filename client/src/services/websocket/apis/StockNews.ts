export interface NewsItem {
  title: string;
  contentSnippet: string;
  link: string;
  publishedDate: string;
  source: string;
}

export interface NewsApiResponse {
  // Assuming the API returns an array directly based on your snippet
  news: NewsItem[]; 
}