import { Tooltip } from "@chakra-ui/react";
import { TriangleDownIcon } from "@chakra-ui/icons";
import { Bank } from "../types";

export interface Props {
  bank: Bank;
}

export default function Pin({ bank }: Props) {
  return <TriangleDownIcon color={"#fff"} fontSize={"3xl"} />;
}
