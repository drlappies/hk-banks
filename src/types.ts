export interface Header {
  success: boolean;
  err_code: string;
  err_msg: string;
}

export interface Result<Entity> {
  datasize: number;
  records: Entity[];
}

export interface Response<Entity> {
  header: Header;
  result: Result<Entity>;
}

export interface Parameter {
  pagesize?: number;
  offset?: number;
  fields?: string;
  column?: string;
  filter?: string;
  choose?: string;
  from?: string;
  sortby?: string;
  sortorder?: string;
  lang: string;
}

export enum BankName {
  HSBC = "香港上海滙豐銀行",
  OCBC = "華僑銀行(香港)有限公司",
  BOC = "中國銀行(香港) 有限公司",
  CHB = "創興銀行有限公司",
}

export interface Bank {
  district: string;
  bank_name: BankName;
  branch_name: string;
  address: string;
  service_hours: string;
  latitude: string;
  longitude: string;
}

export enum Language {
  ENGLISH = "en",
  TRADITIONAL_CHINESE = "tc",
  SIMPIFIED_CHINESE = "sc",
}
