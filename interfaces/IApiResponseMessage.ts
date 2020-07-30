import { IIssue } from "./IIssue";
import { IApiType, IApiMethod } from "./IApiCommon";

export interface IApiResponseMessage {
  type: IApiType;
  method: IApiMethod;
  error?: string;
  data?: {
    issues?: IIssue[];
    issue?: IIssue;
  }
}