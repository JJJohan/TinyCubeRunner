namespace ut {

  export class JsonUtility {

    public static loadAssetAsync(assetName: string, callback: (error?: any, jsonResponse?: any) => void): void {
      this.loadAsync(UT_ASSETS[assetName], callback);
    }

    public static loadAsync(url: string, callback: (error?: any, jsonResponse?: any) => void): void {
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "json";

      xhr.onload = () => {
        const status: number = xhr.status;
        if (status === 200) {
          callback(null, xhr.response);
        } else {
          callback(status);
        }
      };

      xhr.send();
    }
  }
}
