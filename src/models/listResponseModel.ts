import type { ResponseModel } from "./responseModel";

export interface ListResponseModel<T> extends ResponseModel {
  data: T[];
}
