import { useCallback, useEffect, useState, useMemo } from "react";
import { Container } from "@chakra-ui/react";
import Map, { Source, Layer } from "react-map-gl";
import axios from "axios";
import type { FeatureCollection } from "geojson";
import type { Bank, Response } from "./types";

function App() {
  const [banks, setBanks] = useState<Bank[]>([]);

  const fetchBanks = useCallback(async () => {
    let list: Bank[] = [];
    let offset = 0;

    while (true) {
      const response = await axios.get<Response<Bank>>(
        "https://api.hkma.gov.hk/public/bank-svf-info/banks-branch-locator",
        {
          params: {
            lang: "tc", // TODO: support multiple lang,
            pagesize: 1000,
            offset,
          },
        }
      );

      if (response.data.result.datasize <= 0) {
        break;
      }

      list = list.concat(response.data.result.records);
      offset = offset + 1000;
    }

    setBanks(list);
  }, []);

  const bankGeoJson = useMemo(() => {
    const geojson: FeatureCollection = {
      type: "FeatureCollection",
      features: banks.map((bank) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [parseFloat(bank.longitude), parseFloat(bank.latitude)],
        },
        properties: {
          ...bank,
        },
      })),
    };

    return geojson;
  }, [banks]);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  return (
    <Container maxW={"2560px"} h={"100vh"} p={"0"}>
      <Map
        mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
        initialViewState={{ longitude: 114.1694, latitude: 22.3193, zoom: 14 }}
        mapStyle={"mapbox://styles/mapbox/streets-v9"}
      >
        <Source id={"banks"} type={"geojson"} data={bankGeoJson}>
          <Layer
            id={"banks"}
            type={"circle"}
            paint={{
              "circle-radius": 10,
              "circle-color": "#007cbf",
            }}
          />
        </Source>
      </Map>
    </Container>
  );
}

export default App;
