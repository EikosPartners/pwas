import { shallowMount, createLocalVue } from "@vue/test-utils";
import Grid from "@/components/Grid.vue";
import Vuex from "vuex";
import { mockData } from "./mockData.js";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("Grid PWA", () => {
  let getters;
  let store;

  beforeEach(() => {
    getters = {
      data: () => mockData.data,
      columns: () => mockData.columns
    };
    store = new Vuex.Store({
      getters
    });
  });

  it("renders", () => {
    const wrapper = shallowMount(Grid, { store, localVue });
    expect(wrapper.contains("div")).toBe(true);
  });

  it("renders a grid", () => {
    const wrapper = shallowMount(Grid, { store, localVue });
    expect(wrapper.vm.$children[0].$options._componentTag).toBe("ag-grid-vue");
  });

  // it("data getter returns data", () => {});
});
