/**
 * It maps view URLs to API and vice versa.
 */
export abstract class ApiMapper {

  /**
   * Maps view path to resource URL. Can be overridden during configuration.
   * By default it maps path to API one to one.
   *
   * Counterpart to {@link #mapApiToView}.
   *
   * @param path View path, as in `$location.path()`.
   * @returns Resource url, for e.g. HTTP requests.
   */
  abstract mapViewToApi(path: string): string;

  /**
   * Maps resource URL to view path. Can be overridden during configuration.
   * By default it maps API url to view paths one to one.
   *
   * Counterpart to {@link #mapViewToApi}.
   *
   * @param url Resource url. It must be inside API namespace. If it is not, `null` is returned.
   *                     <p>If the url equals to api prefix, empty string is returned.</p>
   * @returns View path.
   */
  abstract mapApiToView(url: string): string | null;
}
