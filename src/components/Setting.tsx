import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Setting({ isOpen, onClose }: Props) {
  const { t, i18n } = useTranslation();

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent color={"#fff"} bgColor={"#222"}>
        <DrawerCloseButton />
        <DrawerHeader>{t("setting.setting")}</DrawerHeader>
        <DrawerBody>
          <FormControl>
            <FormLabel>{t("setting.language.language")}</FormLabel>
            <Select
              borderRadius={"5px"}
              borderColor={"#FFD700"}
              focusBorderColor={"#FFD700"}
              bgColor={"#222"}
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              mb={"10px"}
            >
              <option value={"zh"}>{t("setting.language.option.zh")}</option>
              <option value={"zh-cn"}>
                {t("setting.language.option.zh-cn")}
              </option>
              <option value={"en"}>{t("setting.language.option.en")}</option>
            </Select>
          </FormControl>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
