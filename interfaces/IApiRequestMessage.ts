import { IApiType, IApiMethod } from './IApiCommon';

export interface IApiRequestMessage {
  type: IApiType;
  method: IApiMethod;
  list?: string;
}