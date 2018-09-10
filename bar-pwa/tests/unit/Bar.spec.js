import { shallowMount, createLocalVue } from "@vue/test-utils";
import Bar from "@/components/BarChart.vue";
import Vuex from "vuex";
import { mockData } from "./mockData.js";
import { getters, mutations, actions } from "@/store.js";
import axios from "axios"; //imports from __mock__
import { io, serverSocket, cleanUp } from "vue-socket.io"; //imports from __mock__

jest.mock("jscatalyst", () => "bar-chart");

const localVue = createLocalVue();

localVue.use(Vuex);
// localVue.use(VueSocketio);

describe("Bar Chart PWA", () => {
  let store;
  let state = mockData;
  let comp;

  beforeEach(() => {
    store = new Vuex.Store({ state, getters, mutations, actions });
    comp = shallowMount(Bar, { store, localVue });
  });

  afterEach(() => {
    comp.destroy();
  });

  test("renders a js catalyst bar chart component", () => {
    expect(comp.vm.$children[0].$options._componentTag).toBe("bar-chart");
  });

  test("parseDate() transforms date correctly", () => {
    const parseDate = comp.vm.$options._parentVnode.componentInstance.parseDate;
    const rawDate = "2018-02-20T06:10:29.000Z";
    expect(parseDate(rawDate)).toEqual("02-20-2018");
  });

  test("sortData() correctly counts data points by date", () => {
    const sortData = comp.vm.$options._parentVnode.componentInstance.sortData;
    expect(sortData(state.data)).toEqual({
      "02-20-2018": 2,
      "02-11-2018": 1
    });
  });

  test("barData() correctly maps sorted data to X and Y keys", () => {
    const barData = comp.vm.$options._parentVnode.componentInstance.barData;
    expect(barData).toEqual([
      { x: "02-20-2018", y: 2 },
      { x: "02-11-2018", y: 1 }
    ]);
  });

  // test("filterByDate() correctly creates filter object", () => {
  //   const filterByDate =
  //     comp.vm.$options._parentVnode.componentInstance.filterByDate;
  //   const mockClickData = { date: "2018-02-13", volume: 5 };
  //   const filterObj = {
  //     source: "heatMap",
  //     dataSource: "/",
  //     data: "02-13-2018"
  //   };
  //   expect(filterByDate(mockClickData)).toEqual(filterObj);
  // });
  //TODO: test socket emit?
  //TODO: test service worker?

  describe("Getters", () => {
    test("data() returns data", () => {
      const result = getters.data(state);
      expect(result).toEqual(mockData.data);
    });
  });

  describe("Mutations", () => {
    test("addData() replaces state.data with fetched data", () => {
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

    it("fetchData() commits addData", () => {
      const commit = jest.fn();
      async () => {
        actions.fetchData({ commit });
        await expect(commit.mock.calls[0][0]).toBe("addData");
      };
    });
  });
});
