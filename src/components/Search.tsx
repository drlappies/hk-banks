import { useCallback, useEffect, useMemo } from "react";
import {
  Input,
  Box,
  List,
  ListItem,
  ListIcon,
  Text,
  Select,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { CloseIcon, Search2Icon, SearchIcon } from "@chakra-ui/icons";
import { useMap } from "react-map-gl";
import { useTranslation } from "react-i18next";
import { Bank } from "../types";

export interface Props {
  banks: Bank[];
  results: Bank[];
  address: string;
  onAddressChange: (address: string) => void;
  district: string;
  onDistrictChange: (district: string) => void;
  bankName: string;
  onBankNameChange: (bankName: string) => void;
  onSearchResultClick: (bank: Bank) => void;
}

export default function Search({
  banks,
  address,
  onAddressChange,
  district,
  bankName,
  onBankNameChange,
  onDistrictChange,
  onSearchResultClick,
  results,
}: Props) {
  const { t } = useTranslation();
  const { current: map } = useMap();

  const handleSearchResultClick = useCallback(
    (bank: Bank) => {
      if (!map) {
        return;
      }

      map.flyTo({
        center: [parseFloat(bank.longitude), parseFloat(bank.latitude)],
        zoom: 20,
      });

      onSearchResultClick(bank);
    },
    [map, onSearchResultClick]
  );

  const districtOptions = useMemo(() => {
    const set = new Set<string>();
    banks
      .filter((bank) => bank.bank_name === bankName)
      .forEach((bank) => set.add(bank.district));
    return Array.from(set);
  }, [bankName, banks]);

  const bankNameOptions = useMemo(() => {
    const set = new Set<string>();
    banks.forEach((bank) => set.add(bank.bank_name));
    return Array.from(set);
  }, [banks]);

  useEffect(() => {
    if (bankName.length <= 0) {
      onDistrictChange("");
    }

    if (address.length > 0) {
      onDistrictChange("");
      onBankNameChange("");
    }
  }, [address.length, bankName.length, onBankNameChange, onDistrictChange]);

  return (
    <Box
      position={"absolute"}
      top={"0"}
      left={"0"}
      m={"20px"}
      zIndex={"1"}
      w={"300px"}
      color={"#fff"}
    >
      <Select
        borderRadius={"5px"}
        bgColor={"#222"}
        borderColor={"#FFD700"}
        focusBorderColor={"#FFD700"}
        value={bankName}
        onChange={(e) => onBankNameChange(e.target.value)}
        mb={"10px"}
      >
        <option value={""}>{t("search.all_banks")}</option>
        {bankNameOptions.map((bankName, i) => (
          <option key={i} value={bankName}>
            {bankName}
          </option>
        ))}
      </Select>
      {bankName.length > 0 && (
        <Select
          borderRadius={"5px"}
          borderColor={"#FFD700"}
          focusBorderColor={"#FFD700"}
          bgColor={"#222"}
          value={district}
          onChange={(e) => onDistrictChange(e.target.value)}
          mb={"10px"}
        >
          <option value={""}>{t("search.all_districts")}</option>
          {districtOptions.map((district, i) => (
            <option key={i} value={district}>
              {district}
            </option>
          ))}
        </Select>
      )}
      <InputGroup>
        <InputLeftElement>
          <SearchIcon />
        </InputLeftElement>
        <Input
          borderRadius={"5px"}
          borderColor={"#FFD700"}
          focusBorderColor={"#FFD700"}
          bgColor={"#222"}
          placeholder={t("search.address")}
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
        />
        {address.length > 0 && (
          <InputRightElement>
            <IconButton
              variant={"unstyled"}
              aria-label={"reset search"}
              onClick={() => onAddressChange("")}
            >
              <CloseIcon />
            </IconButton>
          </InputRightElement>
        )}
      </InputGroup>
      {address.length > 0 && (
        <List
          maxH={"300px"}
          overflow={"scroll"}
          bgColor={"#222"}
          boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px;"}
        >
          {address.length > 0 && results.length <= 0 && (
            <Center minH={"100px"}>{t("search.no_results")}</Center>
          )}
          {results.map((result, i) => (
            <ListItem
              key={i}
              display={"flex"}
              alignItems={"center"}
              px={"10px"}
              py={"10px"}
              cursor={"pointer"}
              onClick={() => handleSearchResultClick(result)}
              _hover={{
                bgColor: "rgba(128,128,128,.2)",
              }}
            >
              <ListIcon as={Search2Icon} fontSize={"xs"} color={"grey"} />
              <Box>
                <Text fontSize={"sm"}>{result.address}</Text>
                <Text fontSize={"xs"} color={"grey"}>
                  {result.bank_name}
                </Text>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
