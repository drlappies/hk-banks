import { useState, useMemo, useCallback } from "react";
import {
  InputGroup,
  Input,
  InputLeftElement,
  InputRightElement,
  Box,
  List,
  ListItem,
  ListIcon,
  Text,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon, Search2Icon } from "@chakra-ui/icons";
import Fuse from "fuse.js";
import { useMap } from "react-map-gl";
import { Bank } from "../types";

export interface Props {
  banks: Bank[];
  onSearchResultClick: (bank: Bank) => void;
}

export default function Search({ banks, onSearchResultClick }: Props) {
  const { current: map } = useMap();
  const [search, setSearch] = useState("");
  const fuse = useMemo(() => {
    return new Fuse(banks, {
      keys: ["address", "bank_name", "district", "branch_name"],
    });
  }, [banks]);
  const results = useMemo(() => {
    return fuse.search(search);
  }, [fuse, search]);

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

  return (
    <Box
      position={"absolute"}
      top={"0"}
      left={"0"}
      m={"20px"}
      zIndex={"1"}
      w={"300px"}
    >
      <InputGroup>
        <InputLeftElement>
          <SearchIcon />
        </InputLeftElement>
        <Input
          borderRadius={"5px"}
          borderBottomRadius={results.length > 0 ? "0px" : "5px"}
          bgColor={"#fff"}
          placeholder={"Search..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search.length > 0 && (
          <InputRightElement>
            <CloseIcon cursor={"pointer"} onClick={() => setSearch("")} />
          </InputRightElement>
        )}
      </InputGroup>
      {results.length > 0 && (
        <List
          h={"300px"}
          maxH={"300px"}
          overflow={"scroll"}
          bgColor={"#fff"}
          spacing={"5px"}
          borderBottomRadius={"5px"}
          boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px;"}
          pb={"10px"}
        >
          {results.map((result) => (
            <ListItem
              key={result.refIndex}
              display={"flex"}
              alignItems={"center"}
              px={"10px"}
              onClick={() => handleSearchResultClick(result.item)}
            >
              <ListIcon as={Search2Icon} fontSize={"xs"} color={"grey"} />
              <Box>
                <Text fontSize={"sm"}>{result.item.address}</Text>
                <Text fontSize={"xs"} color={"grey"}>
                  {result.item.bank_name}
                </Text>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
