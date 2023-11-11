import { Bank, BankName } from "../types";

interface ServiceHours {
  opened_at: string | null;
  closed_at: string | null;
}

interface ParsedBankServiceHours {
  monday?: ServiceHours;
  tuesday?: ServiceHours;
  wednesday?: ServiceHours;
  thursday?: ServiceHours;
  friday?: ServiceHours;
  saturday?: ServiceHours;
  sunday?: ServiceHours;
}

const parseHSBCServiceHours = (
  serviceHours: string
): ParsedBankServiceHours => {
  const parsedBankServiceHours: ParsedBankServiceHours = {};
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const lines = serviceHours.split("<br>");
  // TODO: handle i18n response
  const regex = /星期([一二三四五六日])\s*:\s*([^<]+)/;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(regex)) {
    }
  }

  //   lines.forEach((line) => {
  //     // TODO: handle multiple language
  //     const match = line.match(/星期([一二三四五六日])\s*:\s*([^<]+)/);

  //     if (match) {
  //       const dayIndex = daysOfWeek.indexOf(match[1].toLowerCase());

  //       if (dayIndex !== -1) {
  //         const hours = match[2].trim().split(" - ");
  //         parsedBankServiceHours[daysOfWeek[dayIndex]] = {
  //           opened_at: hours[0],
  //           closed_at: hours[1],
  //         };
  //       }
  //     }
  //   });

  return parsedBankServiceHours;
};

const parseBOCServiceHours = (serviceHours: string): ParsedBankServiceHours => {
  return {};
};

export default function parseServiceHours({
  bank_name,
  service_hours,
}: Bank): ParsedBankServiceHours {
  switch (bank_name) {
    case BankName.HSBC: {
      return parseHSBCServiceHours(service_hours);
    }

    case BankName.BOC: {
      return parseBOCServiceHours(service_hours);
    }

    default: {
      throw new Error(
        `parseServiceHours - cannot identify bank name: ${bank_name}`
      );
    }
  }
}
