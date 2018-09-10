import { shallowMount, createLocalVue } from "@vue/test-utils";
import Line from "@/components/LineChart.vue";
import Vuex from "vuex";
import { mockData } from "./mockData.js";
import { getters, mutations, actions } from "@/store.js";
import axios from "axios"; //imports from __mock__
// import VueSocketio from "vue-socket.io"; //imports from __mock__

jest.mock("jscatalyst", () => "line-chart");

const localVue = createLocalVue();

localVue.use(Vuex);
// localVue.use(VueSocketio);

describe("Line Chart PWA", () => {
  let store;
  let state = mockData;
  let comp;

  beforeEach(() => {
    store = new Vuex.Store({ state, getters, mutations, actions });
    comp = shallowMount(Line, { store, localVue });
  });

  afterEach(() => {
    comp.destroy();
  });

  describe("LineChart.vue", () => {
    test("renders a js catalyst bar chart component", () => {
      expect(comp.vm.$children[0].$options._componentTag).toBe("line-chart");
    });

    test("formatDate() transforms date correctly", () => {
      const formatDate =
        comp.vm.$options._parentVnode.componentInstance.formatDate;
      const rawDate = "2018-02-20T06:10:29.000Z";
      expect(formatDate(rawDate)).toEqual("02-20-2018");
    });
  });

  describe("Getters", () => {
    test("data() returns data", () => {
      const result = getters.data(state);
      expect(result).toEqual(mockData.data);
    });

    test("dataDV() returns transformed dataset", () => {
      const firstResult = getters.dataDV(state)[0];
      const expected = {
        date: "2018-02-20",
        value: 3
      };
      expect(firstResult).toEqual(expected);
    });
  });

  describe("Mutations", () => {
    test("initializeData() replaces state.data with fetched data", () => {
      const newData = [
        {
          date: "2018-02-20T20:27:40.000Z",
          raisedBy: 7887,
          project: "Cotton",
          severity: 1
        }
      ];
      mutations.initializeData(state, newData);
      expect(state.data).toEqual(newData);
    });
  });

  describe("Actions", () => {
    test("initializeData() calls axios.get", () => {
      const commit = jest.fn();
      actions.initializeData({ commit });
      expect(axios.get).toBeCalled;
    });

    it("initializeData() calls commit twice", () => {
      const commit = jest.fn();
      async () => {
        actions.initializeData({ commit });
        await expect(commit.mock.calls.length).toBe(2);
      };
    });

    it("initializeData() commits addData", () => {
      const commit = jest.fn();
      async () => {
        actions.initializeData({ commit });
        await expect(commit.mock.calls[0][0]).toBe("addData");
      };
    });
  });
});
