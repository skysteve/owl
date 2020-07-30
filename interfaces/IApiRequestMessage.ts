import { IApiType, IApiMethod } from './IApiCommon';
import { IIssue } from './IIssue';

export interface IApiRequestMessage {
  type: IApiType;
  method: IApiMethod;
  list?: string;
  issue?: IIssue;
  issueId?: string;
}