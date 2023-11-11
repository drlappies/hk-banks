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

export interface Bank {
  district: string;
  bank_name: string;
  branch_name: string;
  address: string;
  service_hours: string;
  latitude: string;
  longitude: string;
}
