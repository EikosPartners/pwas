import { shallowMount, createLocalVue } from "@vue/test-utils";
import Grid from "@/components/Grid.vue";
import Vuex from "vuex";
import { mockData } from "./mockData.js";
import { getters, mutations, actions } from "@/store.js";
import axios from "axios"; //imports mock axios from __mock__

const localVue = createLocalVue();

localVue.use(Vuex);

describe("Grid PWA", () => {
  let store;
  let state = mockData;

  beforeEach(() => {
    store = new Vuex.Store({
      state,
      getters,
      mutations,
      actions
    });
  });
  describe("Grid.vue", () => {
    it("renders", () => {
      const comp = shallowMount(Grid, { store, localVue });
      expect(comp.contains("div")).toBe(true);
    });

    it("renders a grid", () => {
      const comp = shallowMount(Grid, { store, localVue });
      expect(comp.vm.$children[0].$options._componentTag).toBe("ag-grid-vue");
    });

    it("parseDate() transforms date correctly", () => {
      const comp = shallowMount(Grid, { store, localVue });
      const parseDate =
        comp.vm.$options._parentVnode.componentInstance.parseDate;
      const rawDate = "2018-02-20T06:10:29.000Z";
      expect(parseDate(rawDate)).toEqual("02-20-2018 : 06 10 29");
    });

    it("prettyData() creates new data object", () => {
      const comp = shallowMount(Grid, { store, localVue });
      const prettyData = comp.vm.$options._parentVnode.componentInstance.prettyData();
      expect(prettyData).not.toEqual(state.data);
    });

    it("prettyData() transforms date correctly", () => {
      const comp = shallowMount(Grid, { store, localVue });
      const prettyData = comp.vm.$options._parentVnode.componentInstance.prettyData();
      expect(prettyData[0]["date"]).toEqual("02-20-2018 : 06 10 29");
    });
    //TODO: test AgGrid Methods?
    //TODO: test socket functions
    //TDO: test service worker?
  });
  describe("Getters", () => {
    it("data() returns data", () => {
      const result = getters.data(state);
      expect(result).toEqual(mockData.data);
    });

    it("columns() returns column object", () => {
      const result = getters.columns(state);
      expect(result).toEqual(mockData.columns);
    });
  });
  describe("Mutations", () => {
    it("addData() replaces state.data with fetched data", () => {
      const newData = [
        {
          date: "2018-02-20T20:27:40.000Z",
          raisedBy: 7887,
          project: "Cotton",
          severity: 1
        }
      ];
      mutations.addData(state, newData);
      expect(state.data).toEqual(newData);
    });

    it("generateColumns() creates column object from data", () => {
      const newData = [
        {
          date: "2018-02-20T20:27:40.000Z",
          raisedBy: 7887,
          project: "Cotton",
          severity: 1
        }
      ];
      mutations.generateColumns(state, newData);
      expect(state.columns).toEqual(mockData.columns);
    });

    it("generateColumns() handles empty array", () => {
      const newData = [];
      const emptyArray = [];
      mutations.generateColumns(state, newData);
      expect(state.columns).toEqual(emptyArray);
    });
  });
  describe("Actions", () => {
    it("fetchData() calls axios.get", () => {
      const commit = jest.fn();
      actions.fetchData({ commit });
      expect(axios.get).toBeCalled;
    });

    it("fetchData() calls commit twice", () => {
      const commit = jest.fn();
      async () => {
        actions.fetchData({ commit });
        await expect(commit.mock.calls.length).toBe(2);
      };
    });

    it("first commit in fetchData() is addData", () => {
      const commit = jest.fn();
      async () => {
        actions.fetchData({ commit });
        await expect(commit.mock.calls[0][0]).toBe("addData");
      };
    });

    it("second commitc in fetchData() is generateColumns", () => {
      const commit = jest.fn();
      async () => {
        actions.fetchData({ commit });
        await expect(commit.mock.calls[1][0]).toBe("generateColumns");
      };
    });
  });
});
