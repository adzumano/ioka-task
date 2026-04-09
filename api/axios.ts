import { generateOffers } from "@/constants/offers";
import { generateCarriage } from "@/constants/wagon";
import { getScenario } from "@/lib/mock";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

export const $api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

const mock = new AxiosMockAdapter($api, { delayResponse: 3000 });

mock
  .onGet("/api/search/flight")
  .reply(() => {
    const scenario = getScenario();

    switch (scenario) {
      case "success":
        return [200, generateOffers({ count: 100000 })];
      case "empty":
        return [200, []];
      case "error":
        return [500, { message: "Internal Server Error", success: false }];
    }
  })
  .onGet("/api/travel")
  .reply(() => {
    const scenario = getScenario();

    switch (scenario) {
      case "success":
        return [200, generateCarriage()];
      case "empty":
      case "error":
        return [500, { message: "Internal Server Error", success: false }];
    }
  });
