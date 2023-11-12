import { useCallback, useEffect, useState, useMemo } from "react";
import { Container, Box } from "@chakra-ui/react";
import { TriangleDownIcon } from "@chakra-ui/icons";
import Map, { Source, Layer, useMap, Marker, Popup } from "react-map-gl";
import axios from "axios";
import type { FeatureCollection } from "geojson";
import mapboxgl from "mapbox-gl";
import Fuse from "fuse.js";
import { Language, type Bank, type Response } from "./types";
import Detail from "./components/Detail";
import Search from "./components/Search";

function App() {
  const { current: map } = useMap();
  const [district, setDistrict] = useState("");
  const [bankName, setBankName] = useState("");
  const [address, setAddress] = useState("");
  const [banks, setBanks] = useState<Bank[]>([]);
  const [focusedBank, setFocusedBank] = useState<Bank | null>(null);
  const [hoveredBank, setHoveredBank] = useState<Bank | null>(null);

  const fuse = useMemo(() => {
    return new Fuse(banks, {
      keys: ["address", "branch_name", "district", "bank_name"],
    });
  }, [banks]);

  const results = useMemo(() => {
    if (address.length <= 0) {
      return banks
        .filter((bank) =>
          district.length > 0 ? bank.district === district : true
        )
        .filter((bank) =>
          bankName.length > 0 ? bank.bank_name === bankName : true
        );
    }

    return fuse.search(address).map((result) => result.item);
  }, [address, fuse, banks, district, bankName]);

  const fetchBanks = useCallback(async () => {
    let list: Bank[] = [];
    let offset = 0;

    while (true) {
      const response = await axios.get<Response<Bank>>(
        "https://api.hkma.gov.hk/public/bank-svf-info/banks-branch-locator",
        {
          params: {
            lang: Language.TRADITIONAL_CHINESE, // TODO: support multiple lang,
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
      features: results.map((bank) => ({
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
  }, [results]);

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
    const bank = e.features[0];
    if (!bank.properties) return;
    setHoveredBank({
      address: bank.properties.address,
      bank_name: bank.properties.bank_name,
      branch_name: bank.properties.branch_name,
      district: bank.properties.district,
      latitude: bank.properties.latitude,
      longitude: bank.properties.longitude,
      service_hours: bank.properties.service_hours,
    });
  };

  const handleMapMouseLeave = (e: mapboxgl.MapLayerMouseEvent) => {
    setHoveredBank(null);
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
        <Search
          banks={banks}
          address={address}
          onAddressChange={(address) => setAddress(address)}
          district={district}
          onDistrictChange={(district) => setDistrict(district)}
          bankName={bankName}
          onBankNameChange={(bankName) => setBankName(bankName)}
          results={results}
          onSearchResultClick={(bank) => setFocusedBank(bank)}
        />
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
        {focusedBank && (
          <Marker
            longitude={parseFloat(focusedBank.longitude)}
            latitude={parseFloat(focusedBank.latitude)}
            offset={[0, -20]}
          >
            <TriangleDownIcon color={"#FFD700"} fontSize={"3xl"} />
          </Marker>
        )}
        {hoveredBank && (
          <Popup
            longitude={parseFloat(hoveredBank.longitude)}
            latitude={parseFloat(hoveredBank.latitude)}
            maxWidth={"400px"}
          >
            <Box>{hoveredBank.bank_name}</Box>
            <Box>{hoveredBank.branch_name}</Box>
            <Box>{hoveredBank.address}</Box>
            <Box>{hoveredBank.district}</Box>
          </Popup>
        )}
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
