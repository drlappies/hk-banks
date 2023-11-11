import { useCallback, useEffect, useState, useMemo } from "react";
import { Container } from "@chakra-ui/react";
import Map, { Source, Layer, useMap } from "react-map-gl";
import axios from "axios";
import type { FeatureCollection } from "geojson";
import mapboxgl from "mapbox-gl";
import { BankName, type Bank, type Response } from "./types";
import Detail from "./components/Detail";

function App() {
  const { current: map } = useMap();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [focusedBank, setFocusedBank] = useState<Bank | null>(null);

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
            column: "bank_name",
            filter: BankName.HSBC,
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

  const handleMapClick = (e: mapboxgl.MapLayerMouseEvent) => {
    if (!e.features || !e.features[0]) return;
    const bank = e.features[0];
    if (!bank.properties) return;

    map?.flyTo({
      center: [
        parseFloat(bank.properties.longitude),
        parseFloat(bank.properties.latitude),
      ],
    });

    setFocusedBank({
      address: bank.properties.address,
      bank_name: bank.properties.bank_name,
      branch_name: bank.properties.branch_name,
      district: bank.properties.district,
      latitude: bank.properties.latitude,
      longitude: bank.properties.longitude,
      service_hours: bank.properties.service_hours,
    });
  };

  const handleMapMouseEnter = (e: mapboxgl.MapLayerMouseEvent) => {
    if (!e.features || !e.features[0]) return;
  };

  const handleMapMouseLeave = (e: mapboxgl.MapLayerMouseEvent) => {
    if (!e.features || !e.features[0]) return;
  };

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  return (
    <Container
      maxW={"2560px"}
      h={"100vh"}
      p={"0"}
      position={"relative"}
      overflow={"hidden"}
    >
      <Map
        style={{ position: "absolute" }}
        mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
        initialViewState={{ longitude: 114.1694, latitude: 22.3193, zoom: 14 }}
        mapStyle={"mapbox://styles/mapbox/dark-v11"}
        interactiveLayerIds={["banks-layer"]}
        onClick={handleMapClick}
        onMouseEnter={handleMapMouseEnter}
        onMouseLeave={handleMapMouseLeave}
      >
        <Source id={"banks"} type={"geojson"} data={bankGeoJson}>
          <Layer
            id={"banks-layer"}
            type={"circle"}
            paint={{
              "circle-radius": 5,
              "circle-color": "#FFD700",
            }}
          />
        </Source>
      </Map>
      <Detail
        isOpen={Boolean(focusedBank)}
        bank={focusedBank}
        onClose={() => setFocusedBank(null)}
      />
    </Container>
  );
}

export default App;
