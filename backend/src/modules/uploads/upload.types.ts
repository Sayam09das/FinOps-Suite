export interface UploadResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
}

export interface MultiUploadResult {
  files: UploadResult[];
  count: number;
}
