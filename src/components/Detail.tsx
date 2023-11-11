import { Box, IconButton, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import type { Bank } from "../types";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  bank: Bank | null;
}

export default function Detail({ isOpen, onClose, bank }: Props) {
  return (
    <Box
      h={"100vh"}
      w={isOpen ? "300px" : "0px"}
      maxW={"300px"}
      overflow={"hidden"}
      transition={"width 0.25s"}
      bgColor={"#fff"}
      position={"absolute"}
      right={"0"}
    >
      {bank && isOpen && (
        <>
          <IconButton
            right={"0"}
            top={"0"}
            m={"10px"}
            variant={"unstyled"}
            position={"absolute"}
            icon={<CloseIcon />}
            aria-label={"close-detail"}
            onClick={onClose}
          />

          <Box pt={"50px"} px={"20px"}>
            <Text fontSize={"sm"} color={"grey"}>
              銀行
            </Text>
            <Text mb={"10px"}>{bank.bank_name}</Text>
            <Text fontSize={"sm"} color={"grey"}>
              地址
            </Text>
            <Text mb={"10px"}>{bank.address}</Text>
            <Text fontSize={"sm"} color={"grey"}>
              分行
            </Text>
            <Text mb={"10px"}>{bank.branch_name}</Text>
            <Text fontSize={"sm"} color={"grey"}>
              地區
            </Text>
            <Text mb={"10px"}>{bank.district}</Text>
            <Text fontSize={"sm"} color={"grey"}>
              開放時間
            </Text>
            {/* TODO: parse service_hours html to JS object for customization */}
            <Box dangerouslySetInnerHTML={{ __html: bank.service_hours }}></Box>
          </Box>
        </>
      )}
    </Box>
  );
}
