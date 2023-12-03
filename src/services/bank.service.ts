import axios from "axios";
import type { Response, Bank, Parameter } from "../types";

export const getBanks = async ({ lang }: Parameter): Promise<Bank[]> => {
  let banks: Bank[] = [];
  let offset = 0;

  while (true) {
    const response = await axios.get<Response<Bank>>(
      "https://api.hkma.gov.hk/public/bank-svf-info/banks-branch-locator",
      {
        params: {
          lang,
          pagesize: 1000,
          offset,
        },
      }
    );

    if (response.data.result.datasize <= 0) {
      break;
    }

    banks = banks.concat(response.data.result.records);
    offset = offset + 1000;
  }

  return banks;
};
