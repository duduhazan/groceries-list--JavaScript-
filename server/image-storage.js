import { Storage } from "@google-cloud/storage";

export class ImageStorage {
  constructor(keyPath, bucketName) {
    this.storage = new Storage({ keyFilename: keyPath });
    this.bucket = bucketName;
  }

  async upload(imgPath) {
    const [_, object] = await this.storage.bucket(this.bucket).upload(imgPath);
    return object.name;
  }

  async getUrl(imgName) {
    const [signedUrl] = await this.storage
      .bucket(this.bucket)
      .file(imgName)
      .getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 24 * 60 * 60 * 1000, // 1 day
      });
    return signedUrl;
  }
}
